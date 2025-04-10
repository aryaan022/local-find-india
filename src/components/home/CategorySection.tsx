
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Utensils, Shirt, Home, Wrench, Stethoscope, Scissors, Book, Laptop } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  darkColor: string;
  slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, color, darkColor, slug }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
      onClick={() => navigate(`/categories?category=${slug}`)}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className={`mb-4 p-3 rounded-full ${color} dark:${darkColor}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
      </CardContent>
    </Card>
  );
};

const CategorySection = () => {
  const categories = [
    { title: 'Grocery & Essentials', icon: <ShoppingBag className="h-6 w-6 text-white" />, color: 'bg-red-500', darkColor: 'bg-red-600', slug: 'grocery' },
    { title: 'Food & Beverages', icon: <Utensils className="h-6 w-6 text-white" />, color: 'bg-orange-500', darkColor: 'bg-orange-600', slug: 'food' },
    { title: 'Clothing & Fashion', icon: <Shirt className="h-6 w-6 text-white" />, color: 'bg-yellow-500', darkColor: 'bg-yellow-600', slug: 'clothing' },
    { title: 'Home & Furniture', icon: <Home className="h-6 w-6 text-white" />, color: 'bg-green-500', darkColor: 'bg-green-600', slug: 'home' },
    { title: 'Services & Repairs', icon: <Wrench className="h-6 w-6 text-white" />, color: 'bg-blue-500', darkColor: 'bg-blue-600', slug: 'services' },
    { title: 'Health & Wellness', icon: <Stethoscope className="h-6 w-6 text-white" />, color: 'bg-indigo-500', darkColor: 'bg-indigo-600', slug: 'health' },
    { title: 'Beauty & Personal Care', icon: <Scissors className="h-6 w-6 text-white" />, color: 'bg-purple-500', darkColor: 'bg-purple-600', slug: 'beauty' },
    { title: 'Education & Learning', icon: <Book className="h-6 w-6 text-white" />, color: 'bg-pink-500', darkColor: 'bg-pink-600', slug: 'education' },
    { title: 'Electronics & Tech', icon: <Laptop className="h-6 w-6 text-white" />, color: 'bg-teal-500', darkColor: 'bg-teal-600', slug: 'electronics' },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 dark:text-white">Popular Categories</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore businesses by category to find exactly what you're looking for in your area
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              icon={category.icon}
              color={category.color}
              darkColor={category.darkColor}
              slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
