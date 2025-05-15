"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { featuredProducts } from '@/lib/sample-data';

// In a real app, this would come from your cart state
const initialCartItems = [
  { productId: "1", quantity: 1 },
  { productId: "3", quantity: 2 }
];

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  
  // Get product details from the product IDs in the cart
  const cartProducts = cartItems.map(item => {
    const product = featuredProducts.find(p => p.id === item.productId);
    return {
      ...product,
      quantity: item.quantity,
    };
  }).filter(Boolean);
  
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const applyPromoCode = () => {
    if (promoCode.trim().toLowerCase() === 'discount10') {
      setIsPromoApplied(true);
      toast({
        title: "Promo code applied",
        description: "Your discount has been applied to the order.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
      });
    }
  };
  
  // Calculate totals
  const subtotal = cartProducts.reduce((sum, item: any) => 
    sum + item.price * item.quantity, 0
  );
  
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + shipping;

  return (
    <div className="container px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartProducts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-4">Product</th>
                      <th className="text-center p-4">Quantity</th>
                      <th className="text-right p-4">Price</th>
                      <th className="text-right p-4">Subtotal</th>
                      <th className="text-center p-4 w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((item: any) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded overflow-hidden bg-muted">
                              <Image
                                src={item.thumbnail}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4 text-right">${item.price.toFixed(2)}</td>
                        <td className="p-4 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {isPromoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="pt-4">
                  <div className="flex space-x-2 mb-4">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={applyPromoCode} disabled={isPromoApplied}>
                      Apply
                    </Button>
                  </div>
                  
                  <Button className="w-full mb-2">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-card border rounded-lg">
          <div className="max-w-md mx-auto space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}