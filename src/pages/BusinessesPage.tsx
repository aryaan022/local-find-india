
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Search, Filter } from 'lucide-react';

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
  },
  {
    id: 5,
    name: "Fashion Hub",
    category: "Clothing & Fashion",
    rating: 4.4,
    reviews: 58,
    address: "Commercial Street, Bangalore",
    phone: "+91 98765 43214",
    image: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    featured: false
  },
  {
    id: 6,
    name: "Wellness Pharmacy",
    category: "Health & Wellness",
    rating: 4.9,
    reviews: 142,
    address: "Vasant Kunj, New Delhi",
    phone: "+91 98765 43215",
    image: "https://images.pexels.com/photos/4021808/pexels-photo-4021808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    featured: false
  }
];

const BusinessesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('rating');
  
  // Filter and sort businesses based on search parameters
  const filteredBusinesses = businesses
    .filter(business => {
      // Apply search term filter
      if (searchTerm && !business.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply location filter
      if (location && !business.address.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      
      // Apply category filter
      if (selectedCategory && business.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'reviews') {
        return b.reviews - a.reviews;
      }
      return 0;
    });
  
  const categories = [
    "All Categories",
    "Grocery & Essentials",
    "Food & Beverages",
    "Clothing & Fashion",
    "Home & Furniture",
    "Services & Repairs",
    "Health & Wellness",
    "Beauty & Personal Care",
    "Education & Learning",
    "Electronics & Tech"
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.append('category', selectedCategory);
    }
    navigate({ search: params.toString() });
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Find Local Businesses</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center border rounded px-3 focus-within:ring-2 focus-within:ring-india-blue">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search businesses, products..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center border rounded px-3 focus-within:ring-2 focus-within:ring-india-blue">
                <MapPin className="h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location (City, Area)"
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="bg-india-blue hover:bg-india-blue/90 w-full">
                Search
              </Button>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Filter by:</span>
              
              {/* Category filter */}
              <select
                className="text-sm border rounded-full px-3 py-1 bg-gray-50"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category === "All Categories" ? "" : category}>
                    {category}
                  </option>
                ))}
              </select>
              
              {/* Sort filter */}
              <span className="text-sm font-medium ml-4">Sort by:</span>
              <select
                className="text-sm border rounded-full px-3 py-1 bg-gray-50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rating</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </form>
          
          {/* Results Stats */}
          <div className="mb-6">
            <p className="text-gray-600">
              Found {filteredBusinesses.length} businesses
              {searchTerm ? ` matching "${searchTerm}"` : ""}
              {selectedCategory ? ` in ${selectedCategory}` : ""}
              {location ? ` near ${location}` : ""}
            </p>
          </div>
          
          {/* Businesses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <Card key={business.id} className="overflow-hidden cursor-pointer card-hover" onClick={() => navigate(`/business/${business.id}`)}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={business.image} 
                      alt={business.name} 
                      className="w-full h-full object-cover"
                    />
                    {business.featured && (
                      <Badge className="absolute top-2 right-2 bg-india-orange">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-gray-100">
                        {business.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{business.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({business.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
                    
                    <div className="flex items-start gap-1 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-600 line-clamp-1">{business.address}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">{business.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any businesses matching your search criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setLocation('');
                    setSelectedCategory('');
                    navigate('/businesses');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessesPage;
