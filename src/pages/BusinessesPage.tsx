
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';

const BusinessesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, slug?: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('rating');
  
  // Fetch businesses and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, slug');
          
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }
        
        // Fetch businesses that are approved
        let query = supabase
          .from('businesses')
          .select(`
            *,
            categories:category_id (
              name, slug
            )
          `)
          .eq('status', 'approved');
        
        // Apply search filters if provided
        if (initialSearch) {
          query = query.ilike('name', `%${initialSearch}%`);
        }
        
        if (initialLocation) {
          query = query.or(`city.ilike.%${initialLocation}%,state.ilike.%${initialLocation}%,pincode.eq.${initialLocation}`);
        }
        
        if (initialCategory && initialCategory !== "All Categories") {
          // Find category id from slug
          const categoryObj = categoriesData?.find(cat => cat.slug === initialCategory.toLowerCase().replace(/\s+/g, '-'));
          if (categoryObj) {
            query = query.eq('category_id', categoryObj.id);
          }
        }
        
        const { data: businessesData, error: businessesError } = await query;
        
        if (businessesError) {
          console.error('Error fetching businesses:', businessesError);
        } else {
          // Cast the response to match our Business type
          setBusinesses(businessesData as unknown as Business[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [initialSearch, initialLocation, initialCategory]);
  
  // Filter and sort businesses based on search parameters
  const filteredBusinesses = businesses
    .filter(business => {
      // Apply search term filter if changed after initial load
      if (searchTerm !== initialSearch && !business.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply location filter if changed after initial load
      if (location !== initialLocation) {
        const locationMatch = 
          business.city?.toLowerCase().includes(location.toLowerCase()) || 
          business.state?.toLowerCase().includes(location.toLowerCase()) || 
          business.pincode === location;
        
        if (!locationMatch) return false;
      }
      
      // Apply category filter if changed after initial load
      if (selectedCategory !== initialCategory && selectedCategory && selectedCategory !== "All Categories") {
        // Find category id from slug or name
        const categoryObj = categories.find(cat => 
          (cat.slug && cat.slug === selectedCategory.toLowerCase().replace(/\s+/g, '-')) ||
          cat.name === selectedCategory
        );
        
        if (categoryObj && business.category_id !== categoryObj.id) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'rating') {
        return (b.average_rating || 0) - (a.average_rating || 0);
      } else if (sortBy === 'reviews') {
        return (b.total_reviews || 0) - (a.total_reviews || 0);
      }
      return 0;
    });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    if (selectedCategory && selectedCategory !== "All Categories") {
      const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
      params.append('category', categorySlug);
    }
    navigate({ search: params.toString() });
    
    // Reload page to trigger the useEffect
    window.location.href = `/businesses?${params.toString()}`;
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
                  placeholder="Location (City, State, PIN)"
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
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
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
            {loading ? (
              <p className="text-gray-600">Loading businesses...</p>
            ) : (
              <p className="text-gray-600">
                Found {filteredBusinesses.length} businesses
                {searchTerm ? ` matching "${searchTerm}"` : ""}
                {selectedCategory && selectedCategory !== "All Categories" ? ` in ${selectedCategory}` : ""}
                {location ? ` near ${location}` : ""}
              </p>
            )}
          </div>
          
          {/* Businesses List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse mb-4 w-1/2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="overflow-hidden cursor-pointer card-hover" onClick={() => navigate(`/business/${business.id}`)}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={business.cover_url || "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                      alt={business.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
                      }}
                    />
                  </div>
                  
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-gray-100">
                        {business.categories?.name || "Uncategorized"}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{business.average_rating?.toFixed(1) || "New"}</span>
                        <span className="ml-1 text-xs text-gray-500">({business.total_reviews || 0})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
                    
                    <div className="flex items-start gap-1 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {business.address ? `${business.address}, ` : ''}{business.city}, {business.state}
                        {business.pincode ? ` - ${business.pincode}` : ''}
                      </p>
                    </div>
                    
                    {business.phone && (
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{business.phone}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
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
    </Layout>
  );
};

export default BusinessesPage;
