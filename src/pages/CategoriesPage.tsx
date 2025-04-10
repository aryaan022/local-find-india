
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Utensils, Shirt, Home, Wrench, Stethoscope, Scissors, Book, Laptop } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  slug: string;
  description: string;
  isActive: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, color, slug, description, isActive }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-india-blue shadow-lg' : 'hover:shadow-md'}`} 
      onClick={() => navigate(`/businesses?category=${slug}`)}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className={`mb-4 p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        {isActive && (
          <Badge className="mt-3 bg-india-blue">Selected</Badge>
        )}
      </CardContent>
    </Card>
  );
};

const CategoriesPage = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const navigate = useNavigate();
  
  const categories = [
    { 
      title: 'Grocery & Essentials', 
      icon: <ShoppingBag className="h-6 w-6 text-white" />, 
      color: 'bg-red-500', 
      slug: 'grocery',
      description: 'Find local grocery stores and essential item providers near you',
    },
    { 
      title: 'Food & Beverages', 
      icon: <Utensils className="h-6 w-6 text-white" />, 
      color: 'bg-orange-500', 
      slug: 'food',
      description: 'Explore restaurants, cafes, and food services in your area',
    },
    { 
      title: 'Clothing & Fashion', 
      icon: <Shirt className="h-6 w-6 text-white" />, 
      color: 'bg-yellow-500', 
      slug: 'clothing',
      description: 'Discover local clothing stores, tailors, and fashion boutiques',
    },
    { 
      title: 'Home & Furniture', 
      icon: <Home className="h-6 w-6 text-white" />, 
      color: 'bg-green-500', 
      slug: 'home',
      description: 'Find furniture stores and home decor businesses nearby',
    },
    { 
      title: 'Services & Repairs', 
      icon: <Wrench className="h-6 w-6 text-white" />, 
      color: 'bg-blue-500', 
      slug: 'services',
      description: 'Connect with local service providers and repair professionals',
    },
    { 
      title: 'Health & Wellness', 
      icon: <Stethoscope className="h-6 w-6 text-white" />, 
      color: 'bg-indigo-500', 
      slug: 'health',
      description: 'Locate healthcare providers, pharmacies, and wellness centers',
    },
    { 
      title: 'Beauty & Personal Care', 
      icon: <Scissors className="h-6 w-6 text-white" />, 
      color: 'bg-purple-500', 
      slug: 'beauty',
      description: 'Find salons, spas, and personal care services in your community',
    },
    { 
      title: 'Education & Learning', 
      icon: <Book className="h-6 w-6 text-white" />, 
      color: 'bg-pink-500', 
      slug: 'education',
      description: 'Discover schools, tutoring services, and educational resources',
    },
    { 
      title: 'Electronics & Tech', 
      icon: <Laptop className="h-6 w-6 text-white" />, 
      color: 'bg-teal-500', 
      slug: 'electronics',
      description: 'Connect with electronics stores and tech service providers',
    },
  ];

  return (
    <Layout>
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Browse Categories</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore local businesses by category and find exactly what you're looking for in your area
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Button 
              variant={!activeCategory ? "default" : "outline"} 
              onClick={() => navigate('/categories')}
            >
              All Categories
            </Button>
            {categories.slice(0, 5).map((cat) => (
              <Button
                key={cat.slug}
                variant={activeCategory === cat.slug ? "default" : "outline"}
                onClick={() => navigate(`/categories?category=${cat.slug}`)}
              >
                {cat.title}
              </Button>
            ))}
            <Button 
              variant="outline" 
              onClick={() => navigate('/businesses')}
            >
              View All Businesses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories
              .filter(cat => !activeCategory || cat.slug === activeCategory)
              .map((category) => (
                <CategoryCard
                  key={category.slug}
                  title={category.title}
                  icon={category.icon}
                  color={category.color}
                  slug={category.slug}
                  description={category.description}
                  isActive={category.slug === activeCategory}
                />
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage;
