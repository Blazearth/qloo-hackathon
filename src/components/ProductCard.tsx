import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, ShoppingCart, Eye, Loader2, Zap } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: string;
  currency?: string;
  url: string;
  image_url: string;
  description: string;
  brand: string;
  category: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  rating?: number;
  reviews_count?: number;
  isNew?: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'limited':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'out_of_stock':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'In Stock';
      case 'limited':
        return 'Limited Stock';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return 'Check Availability';
    }
  };

  const formatPrice = (price: string, currency: string = 'INR') => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.availability === 'out_of_stock') return;
    
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false);
      // Add to cart logic here
    }, 1000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleCardClick = () => {
    window.open(product.url, '_blank');
  };

  return (
    <Card 
      className="w-full max-w-sm mx-auto overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
      onClick={handleCardClick}
    >
      <div className="relative group">
        {/* Image container with loading state */}
        <div className="relative overflow-hidden bg-gray-50">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-gray-300 animate-spin" />
            </div>
          )}
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-56 object-cover transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x300/f8fafc/e2e8f0?text=${encodeURIComponent(
                product.name.split(' ').slice(0, 2).join('+')
              )}`;
              setIsImageLoading(false);
            }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-pink-500 rounded-full shadow-sm">
              New
            </span>
          )}
          {product.discount && (
            <span className="block px-2 py-1 text-xs font-semibold text-white bg-amber-500 rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-xs">Quick View</span>
          </Button>
        </div>

        {/* Availability badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(
          product.availability
        )} backdrop-blur-sm`}>
          {getAvailabilityText(product.availability)}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {product.rating !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center bg-amber-50 px-2 py-1 rounded">
              <Star className="h-4 w-4 text-amber-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-amber-700">
                {product.rating.toFixed(1)}
              </span>
            </div>
            {product.reviews_count && (
              <span className="text-xs text-gray-500">
                ({product.reviews_count} review{product.reviews_count !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </div>
            {product.discount && (
              <div className="flex items-center">
                <span className="text-sm text-gray-500 line-through mr-2">
                  {formatPrice((parseFloat(product.price) * 100 / (100 - product.discount)).toFixed(0), product.currency)}
                </span>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  Save {product.discount}%
                </span>
              </div>
            )}
          </div>
          <div className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full border">
            {product.category}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-200 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.url, '_blank');
            }}
            disabled={product.availability === 'out_of_stock'}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            size="sm"
            className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white ${
              isAddingToCart ? 'opacity-75' : ''
            }`}
            onClick={handleAddToCart}
            disabled={product.availability === 'out_of_stock' || isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
