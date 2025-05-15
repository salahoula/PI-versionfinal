import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDetailsComponent } from './components/orders/order-details/order-details.component';
import { UsersComponent } from './components/users/users.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'products', 
    component: ProductsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'products/new', 
    component: ProductFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'products/edit/:id', 
    component: ProductFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders', 
    component: OrdersComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders/:id', 
    component: OrderDetailsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'users', 
    component: UsersComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'categories', 
    component: CategoriesComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'categories/new', 
    component: CategoryFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'categories/edit/:id', 
    component: CategoryFormComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }