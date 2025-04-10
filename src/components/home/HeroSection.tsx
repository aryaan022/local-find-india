
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/businesses?search=${searchTerm}&location=${location}`);
  };

  return (
    <div className="relative bg-gradient-to-r from-india-blue to-blue-900 text-white py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Find Local Businesses & Products Near You
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
          Discover thousands of local businesses and products in your area. Connect with shops that have exactly what you need.
        </p>

        <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center border rounded px-3 focus-within:ring-2 focus-within:ring-india-blue">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search businesses, products, services..."
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-1 flex items-center border rounded px-3 focus-within:ring-2 focus-within:ring-india-blue">
            <MapPin className="h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Location (City, Area)"
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-transparent"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="bg-india-orange hover:bg-india-orange/90 text-white">
            Find Now
          </Button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="bg-white/20 text-white border-white hover:bg-white/30" onClick={() => navigate('/categories')}>
            Browse Categories
          </Button>
          <Button variant="outline" className="bg-white/20 text-white border-white hover:bg-white/30" onClick={() => navigate('/business-register')}>
            Register Your Business
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
