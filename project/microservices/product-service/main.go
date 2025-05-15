package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Product represents a product in the catalog
type Product struct {
	ID                string   `json:"id"`
	Name              string   `json:"name"`
	Description       string   `json:"description"`
	Price             float64  `json:"price"`
	DiscountPercentage float64  `json:"discountPercentage"`
	Rating            float64  `json:"rating"`
	Stock             int      `json:"stock"`
	Brand             string   `json:"brand"`
	Category          string   `json:"category"`
	Thumbnail         string   `json:"thumbnail"`
	Images            []string `json:"images"`
	Featured          bool     `json:"featured"`
	Tags              []string `json:"tags,omitempty"`
	CreatedAt         string   `json:"createdAt"`
	UpdatedAt         string   `json:"updatedAt"`
}

// Category represents a product category
type Category struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Image string `json:"image"`
}

var db *sql.DB

func initDB() {
	var err error
	connStr := os.Getenv("DATABASE_URL")
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	fmt.Println("Connected to PostgreSQL database!")

	// Create tables if they don't exist
	createTables()
}

func createTables() {
	// Create products table
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS products (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		description TEXT,
		price DECIMAL(10,2) NOT NULL,
		discount_percentage DECIMAL(5,2) DEFAULT 0,
		rating DECIMAL(3,1) DEFAULT 0,
		stock INT DEFAULT 0,
		brand VARCHAR(100),
		category VARCHAR(100),
		thumbnail TEXT,
		images TEXT[],
		featured BOOLEAN DEFAULT false,
		tags TEXT[],
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
	`)
	if err != nil {
		log.Fatal("Failed to create products table:", err)
	}

	// Create categories table
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS categories (
		id SERIAL PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		slug VARCHAR(100) UNIQUE NOT NULL,
		image TEXT
	)
	`)
	if err != nil {
		log.Fatal("Failed to create categories table:", err)
	}

	// Create product_categories table for many-to-many relationship
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS product_categories (
		product_id INT REFERENCES products(id) ON DELETE CASCADE,
		category_id INT REFERENCES categories(id) ON DELETE CASCADE,
		PRIMARY KEY (product_id, category_id)
	)
	`)
	if err != nil {
		log.Fatal("Failed to create product_categories table:", err)
	}

	fmt.Println("Database tables created successfully!")
}

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: .env file not found, using environment variables")
	}

	// Initialize database
	initDB()
	defer db.Close()

	// Create Fiber app
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New())

	// Routes
	setupRoutes(app)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}
	log.Fatal(app.Listen(":" + port))
}

func setupRoutes(app *fiber.App) {
	// Health check
	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "product-service",
		})
	})

	// API routes
	api := app.Group("/api")

	// Products routes
	products := api.Group("/products")
	products.Get("/", getAllProducts)
	products.Get("/:id", getProductByID)
	products.Post("/", createProduct)
	products.Put("/:id", updateProduct)
	products.Delete("/:id", deleteProduct)
	products.Get("/featured", getFeaturedProducts)
	products.Get("/category/:slug", getProductsByCategory)
	products.Get("/search", searchProducts)

	// Categories routes
	categories := api.Group("/categories")
	categories.Get("/", getAllCategories)
	categories.Get("/:id", getCategoryByID)
	categories.Post("/", createCategory)
	categories.Put("/:id", updateCategory)
	categories.Delete("/:id", deleteCategory)
}

// Product handlers
func getAllProducts(c *fiber.Ctx) error {
	// Get query parameters for pagination
	limit := c.QueryInt("limit", 10)
	page := c.QueryInt("page", 1)
	offset := (page - 1) * limit

	// Query to get products with pagination
	rows, err := db.Query("SELECT id, name, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images, featured, tags, created_at, updated_at FROM products ORDER BY id LIMIT $1 OFFSET $2", limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get products",
			"error":   err.Error(),
		})
	}
	defer rows.Close()

	// Parse results
	products := []Product{}
	for rows.Next() {
		var p Product
		var createdAt, updatedAt sql.NullString
		
		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Price, &p.DiscountPercentage,
			&p.Rating, &p.Stock, &p.Brand, &p.Category, &p.Thumbnail,
			&p.Images, &p.Featured, &p.Tags, &createdAt, &updatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to scan products",
				"error":   err.Error(),
			})
		}

		if createdAt.Valid {
			p.CreatedAt = createdAt.String
		}
		if updatedAt.Valid {
			p.UpdatedAt = updatedAt.String
		}

		products = append(products, p)
	}

	// Get total count for pagination metadata
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM products").Scan(&count)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to count products",
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"products": products,
		"total": count,
		"page": page,
		"limit": limit,
		"pages": (count + limit - 1) / limit,
	})
}

func getProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	
	var p Product
	var createdAt, updatedAt sql.NullString
	
	err := db.QueryRow("SELECT id, name, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images, featured, tags, created_at, updated_at FROM products WHERE id = $1", id).Scan(
		&p.ID, &p.Name, &p.Description, &p.Price, &p.DiscountPercentage,
		&p.Rating, &p.Stock, &p.Brand, &p.Category, &p.Thumbnail,
		&p.Images, &p.Featured, &p.Tags, &createdAt, &updatedAt,
	)
	
	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Product not found",
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get product",
			"error":   err.Error(),
		})
	}

	if createdAt.Valid {
		p.CreatedAt = createdAt.String
	}
	if updatedAt.Valid {
		p.UpdatedAt = updatedAt.String
	}

	return c.JSON(p)
}

func createProduct(c *fiber.Ctx) error {
	var p Product
	
	if err := c.BodyParser(&p); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}
	
	var id int
	err := db.QueryRow(`
		INSERT INTO products 
		(name, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images, featured, tags)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
	`, p.Name, p.Description, p.Price, p.DiscountPercentage, p.Rating, p.Stock, p.Brand, p.Category, p.Thumbnail, p.Images, p.Featured, p.Tags).Scan(&id)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create product",
			"error":   err.Error(),
		})
	}
	
	p.ID = fmt.Sprintf("%d", id)
	
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Product created successfully",
		"product": p,
	})
}

func updateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	
	var p Product
	if err := c.BodyParser(&p); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}
	
	_, err := db.Exec(`
		UPDATE products SET
		name = $1, description = $2, price = $3, discount_percentage = $4,
		rating = $5, stock = $6, brand = $7, category = $8, thumbnail = $9,
		images = $10, featured = $11, tags = $12, updated_at = CURRENT_TIMESTAMP
		WHERE id = $13
	`, p.Name, p.Description, p.Price, p.DiscountPercentage, p.Rating, p.Stock, p.Brand, p.Category, p.Thumbnail, p.Images, p.Featured, p.Tags, id)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update product",
			"error":   err.Error(),
		})
	}
	
	p.ID = id
	
	return c.JSON(fiber.Map{
		"message": "Product updated successfully",
		"product": p,
	})
}

func deleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	
	result, err := db.Exec("DELETE FROM products WHERE id = $1", id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to delete product",
			"error":   err.Error(),
		})
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Product not found",
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "Product deleted successfully",
	})
}

func getFeaturedProducts(c *fiber.Ctx) error {
	rows, err := db.Query("SELECT id, name, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images, featured, tags, created_at, updated_at FROM products WHERE featured = true")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get featured products",
			"error":   err.Error(),
		})
	}
	defer rows.Close()
	
	products := []Product{}
	for rows.Next() {
		var p Product
		var createdAt, updatedAt sql.NullString
		
		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Price, &p.DiscountPercentage,
			&p.Rating, &p.Stock, &p.Brand, &p.Category, &p.Thumbnail,
			&p.Images, &p.Featured, &p.Tags, &createdAt, &updatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to scan products",
				"error":   err.Error(),
			})
		}

		if createdAt.Valid {
			p.CreatedAt = createdAt.String
		}
		if updatedAt.Valid {
			p.UpdatedAt = updatedAt.String
		}

		products = append(products, p)
	}
	
	return c.JSON(fiber.Map{
		"products": products,
	})
}

func getProductsByCategory(c *fiber.Ctx) error {
	slug := c.Params("slug")
	
	rows, err := db.Query(`
		SELECT p.id, p.name, p.description, p.price, p.discount_percentage, p.rating, 
		p.stock, p.brand, p.category, p.thumbnail, p.images, p.featured, p.tags, 
		p.created_at, p.updated_at 
		FROM products p
		JOIN product_categories pc ON p.id = pc.product_id
		JOIN categories c ON pc.category_id = c.id
		WHERE c.slug = $1
	`, slug)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get products by category",
			"error":   err.Error(),
		})
	}
	defer rows.Close()
	
	products := []Product{}
	for rows.Next() {
		var p Product
		var createdAt, updatedAt sql.NullString
		
		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Price, &p.DiscountPercentage,
			&p.Rating, &p.Stock, &p.Brand, &p.Category, &p.Thumbnail,
			&p.Images, &p.Featured, &p.Tags, &createdAt, &updatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to scan products",
				"error":   err.Error(),
			})
		}

		if createdAt.Valid {
			p.CreatedAt = createdAt.String
		}
		if updatedAt.Valid {
			p.UpdatedAt = updatedAt.String
		}

		products = append(products, p)
	}
	
	return c.JSON(fiber.Map{
		"products": products,
	})
}

func searchProducts(c *fiber.Ctx) error {
	query := c.Query("q")
	
	rows, err := db.Query(`
		SELECT id, name, description, price, discount_percentage, rating, stock, brand, 
		category, thumbnail, images, featured, tags, created_at, updated_at 
		FROM products
		WHERE name ILIKE $1 OR description ILIKE $1 OR brand ILIKE $1 OR category ILIKE $1
	`, "%"+query+"%")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to search products",
			"error":   err.Error(),
		})
	}
	defer rows.Close()
	
	products := []Product{}
	for rows.Next() {
		var p Product
		var createdAt, updatedAt sql.NullString
		
		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Price, &p.DiscountPercentage,
			&p.Rating, &p.Stock, &p.Brand, &p.Category, &p.Thumbnail,
			&p.Images, &p.Featured, &p.Tags, &createdAt, &updatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to scan products",
				"error":   err.Error(),
			})
		}

		if createdAt.Valid {
			p.CreatedAt = createdAt.String
		}
		if updatedAt.Valid {
			p.UpdatedAt = updatedAt.String
		}

		products = append(products, p)
	}
	
	return c.JSON(fiber.Map{
		"products": products,
	})
}

// Category handlers
func getAllCategories(c *fiber.Ctx) error {
	rows, err := db.Query("SELECT id, name, slug, image FROM categories")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get categories",
			"error":   err.Error(),
		})
	}
	defer rows.Close()
	
	categories := []Category{}
	for rows.Next() {
		var cat Category
		if err := rows.Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.Image); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to scan categories",
				"error":   err.Error(),
			})
		}
		categories = append(categories, cat)
	}
	
	return c.JSON(fiber.Map{
		"categories": categories,
	})
}

func getCategoryByID(c *fiber.Ctx) error {
	id := c.Params("id")
	
	var cat Category
	err := db.QueryRow("SELECT id, name, slug, image FROM categories WHERE id = $1", id).Scan(
		&cat.ID, &cat.Name, &cat.Slug, &cat.Image,
	)
	
	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Category not found",
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get category",
			"error":   err.Error(),
		})
	}
	
	return c.JSON(cat)
}

func createCategory(c *fiber.Ctx) error {
	var cat Category
	
	if err := c.BodyParser(&cat); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}
	
	var id int
	err := db.QueryRow(`
		INSERT INTO categories (name, slug, image)
		VALUES ($1, $2, $3)
		RETURNING id
	`, cat.Name, cat.Slug, cat.Image).Scan(&id)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create category",
			"error":   err.Error(),
		})
	}
	
	cat.ID = fmt.Sprintf("%d", id)
	
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Category created successfully",
		"category": cat,
	})
}

func updateCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	
	var cat Category
	if err := c.BodyParser(&cat); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}
	
	_, err := db.Exec(`
		UPDATE categories SET
		name = $1, slug = $2, image = $3
		WHERE id = $4
	`, cat.Name, cat.Slug, cat.Image, id)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update category",
			"error":   err.Error(),
		})
	}
	
	cat.ID = id
	
	return c.JSON(fiber.Map{
		"message": "Category updated successfully",
		"category": cat,
	})
}

func deleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	
	result, err := db.Exec("DELETE FROM categories WHERE id = $1", id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to delete category",
			"error":   err.Error(),
		})
	}
	
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Category not found",
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "Category deleted successfully",
	})
}