
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Phone, Clock, Globe, Mail, ShoppingBag, Share2, Heart } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const businessData = {
  id: 1,
  name: "Sharma General Store",
  category: "Grocery & Essentials",
  rating: 4.8,
  reviews: 124,
  description: "A family-owned general store offering a wide range of grocery items, daily essentials, and household products at competitive prices. We pride ourselves on quality service and fresh products.",
  address: "Block C, Connaught Place, New Delhi, Delhi 110001",
  phone: "+91 98765 43210",
  email: "contact@sharmageneralstore.com",
  website: "www.sharmageneralstore.com",
  hours: [
    { day: "Monday", hours: "9:00 AM - 8:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 8:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 8:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 8:00 PM" },
    { day: "Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  images: [
    "https://images.unsplash.com/photo-1604719312566-8912e9667d94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JvY2VyeSUyMHN0b3JlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Z3JvY2VyeSUyMHN0b3JlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1601600576337-c1d8a1b85faf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGdyb2NlcnklMjBzdG9yZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
  ],
  products: [
    { id: 1, name: "Organic Rice", price: 120, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmljZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Fresh Vegetables Pack", price: 150, image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dmVnZXRhYmxlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Whole Wheat Flour", price: 60, image: "https://images.unsplash.com/photo-1574323347407-f5e1c0cf4b7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxvdXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Dairy Products Set", price: 220, image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGFpcnklMjBwcm9kdWN0c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Spices Collection", price: 180, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3BpY2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Cold Drinks Pack", price: 250, image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sZCUyMGRyaW5rc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" },
  ],
  reviewsList: [
    { id: 1, user: "Rajesh Kumar", rating: 5, date: "2023-08-15", text: "Great selection of products and very helpful staff!" },
    { id: 2, user: "Priya Sharma", rating: 4, date: "2023-07-22", text: "Good quality products but a bit pricey compared to other stores." },
    { id: 3, user: "Amit Verma", rating: 5, date: "2023-06-11", text: "Best grocery store in the area. Always find everything I need here." },
  ]
};

const BusinessPage = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, fetch business data based on ID
  const business = businessData;

  return (
    <Layout>
      {/* Hero Section with Business Images */}
      <div className="relative h-64 md:h-96 bg-gray-200 overflow-hidden">
        <img 
          src={business.images[0]} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
          <div className="container mx-auto">
            <Badge className="mb-2 bg-india-orange">{business.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{business.name}</h1>
            <div className="flex items-center text-white">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-medium">{business.rating}</span>
                <span className="ml-1 text-sm">({business.reviews} reviews)</span>
              </div>
              <span className="mx-3">•</span>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-white" />
                <span className="ml-1">{business.address.split(',')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> Call
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Directions
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Heart className="h-4 w-4" /> Save
          </Button>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Business Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="w-full">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">About {business.name}</h2>
                    <p className="text-gray-700">{business.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                    <div className="space-y-2">
                      {business.hours.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{item.day}</span>
                          <span className="text-gray-600">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="mt-6">
                <h2 className="text-xl font-semibold mb-6">Available Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {business.products.map((product) => (
                    <Card key={product.id} className="overflow-hidden card-hover">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-india-blue font-semibold rupee">{product.price}</span>
                          <Button size="sm" className="bg-india-blue text-white hover:bg-india-blue/90">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            Enquire
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <Button className="bg-india-blue text-white hover:bg-india-blue/90">Write a Review</Button>
                </div>
                
                <div className="space-y-6">
                  {business.reviewsList.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{review.user}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="photos" className="mt-6">
                <h2 className="text-xl font-semibold mb-6">Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {business.images.map((image, index) => (
                    <div key={index} className="h-64 overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`${business.name} - Photo ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Contact Info */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-india-blue mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-gray-600">{business.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-india-blue mt-0.5" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <a href={`tel:${business.phone}`} className="text-india-blue hover:underline">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-india-blue mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a href={`mailto:${business.email}`} className="text-india-blue hover:underline">
                        {business.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-india-blue mt-0.5" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-india-blue hover:underline">
                        {business.website}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-india-blue mt-0.5" />
                    <div>
                      <div className="font-medium">Hours</div>
                      <div className="text-gray-600">
                        Open Today: {new Date().getDay() === 0 ? 'Closed' : '9:00 AM - 8:00 PM'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map Integration Goes Here</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Similar Businesses</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <Link to={`/business/${item + 1}`} key={item} className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${1600000000000 + item * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80`} 
                        alt="Business" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Similar Business {item}</h4>
                      <div className="flex items-center text-sm">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1">4.{7 - item}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessPage;
