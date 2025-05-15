import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would dispatch to your cart state
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would dispatch to your wishlist state
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
              -{product.discountPercentage}%
            </Badge>
          )}
          
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              className="rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">{product.category}</div>
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          
          <div className="mt-1 flex items-center space-x-2">
            <span className="font-semibold">
              ${product.price.toFixed(2)}
            </span>
            
            {product.discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}