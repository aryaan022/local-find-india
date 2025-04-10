
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Updated mock data with more reliable image URLs
const businesses = [
  {
    id: 1,
    name: "Sharma General Store",
    category: "Grocery & Essentials",
    rating: 4.8,
    reviews: 124,
    address: "Connaught Place, New Delhi",
    phone: "+91 98765 43210",
    image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    featured: true
  },
  {
    id: 2,
    name: "Patel Electronics",
    category: "Electronics & Tech",
    rating: 4.6,
    reviews: 89,
    address: "MG Road, Bangalore",
    phone: "+91 98765 43211",
    image: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    featured: true
  },
  {
    id: 3,
    name: "Royal Furniture House",
    category: "Home & Furniture",
    rating: 4.5,
    reviews: 76,
    address: "Linking Road, Mumbai",
    phone: "+91 98765 43212",
    image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    featured: true
  },
  {
    id: 4,
    name: "Green Farms Fresh Produce",
    category: "Grocery & Essentials",
    rating: 4.7,
    reviews: 103,
    address: "Sector 18, Noida",
    phone: "+91 98765 43213",
    image: "https://images.pexels.com/photos/2733918/pexels-photo-2733918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    featured: true
  }
];

const BusinessCard = ({ business }: { business: typeof businesses[0] }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={business.image} 
          alt={business.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
          }}
        />
        {business.featured && (
          <Badge className="absolute top-2 right-2 bg-india-orange">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700">
            {business.category}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium">{business.rating}</span>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({business.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
        
        <div className="flex items-start gap-1 mt-2">
          <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{business.address}</p>
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{business.phone}</p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => navigate(`/business/${business.id}`)}
          className="w-full bg-india-blue hover:bg-india-blue/90 dark:bg-india-orange dark:hover:bg-india-orange/90"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeaturedBusinesses = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-3 dark:text-white">Featured Businesses</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Discover top-rated local businesses in your area
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/businesses')}
            className="mt-4 md:mt-0 dark:border-gray-600 dark:text-gray-200"
          >
            View All Businesses
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
