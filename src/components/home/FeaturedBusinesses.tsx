
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';

const BusinessCard = ({ business }: { business: Business }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={business.cover_url || "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
          alt={business.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
          }}
        />
      </div>
      
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700">
            {business.categories?.name || "Uncategorized"}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium">{business.average_rating?.toFixed(1) || "New"}</span>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({business.total_reviews || 0})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
        
        <div className="flex items-start gap-1 mt-2">
          <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
            {business.address ? `${business.address}, ` : ''}{business.city}, {business.state}
          </p>
        </div>
        
        {business.phone && (
          <div className="flex items-center gap-1 mt-1">
            <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-300">{business.phone}</p>
          </div>
        )}
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
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedBusinesses = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('businesses')
          .select(`
            *,
            categories:category_id (
              name, slug
            )
          `)
          .eq('status', 'approved')
          .order('average_rating', { ascending: false })
          .limit(4);
        
        if (error) {
          console.error('Error fetching businesses:', error);
        } else {
          // Cast the response to match our Business type
          setBusinesses(data as unknown as Business[]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedBusinesses();
  }, []);
  
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
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
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
        ) : businesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-6">
              Be the first to register your business!
            </p>
            <Button onClick={() => navigate('/business-register')}>Register Business</Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
