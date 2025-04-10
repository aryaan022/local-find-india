
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ShoppingBag, Users, Star, TrendingUp, Edit, Image, Store,
  MessageSquare, FileText, Settings, AlertCircle, ChevronDown
} from 'lucide-react';

// Mock data for business
const businessData = {
  name: "Sharma General Store",
  category: "Grocery & Essentials",
  address: "Block C, Connaught Place, New Delhi, Delhi 110001",
  phone: "+91 98765 43210",
  email: "contact@sharmageneralstore.com",
  rating: 4.8,
  reviews: 124,
  views: 1250,
  visits: 320,
  inquiries: 75,
  products: 42,
};

// Mock stats data
const statsData = [
  { name: 'Jan', views: 400, visits: 240, inquiries: 40 },
  { name: 'Feb', views: 500, visits: 280, inquiries: 45 },
  { name: 'Mar', views: 600, visits: 320, inquiries: 50 },
  { name: 'Apr', views: 550, visits: 300, inquiries: 48 },
  { name: 'May', views: 700, visits: 380, inquiries: 60 },
  { name: 'Jun', views: 800, visits: 450, inquiries: 70 },
];

// Mock products data
const products = [
  { id: 1, name: "Organic Rice", price: 120, stock: "In Stock", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmljZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "Fresh Vegetables Pack", price: 150, stock: "In Stock", image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dmVnZXRhYmxlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" },
  { id: 3, name: "Whole Wheat Flour", price: 60, stock: "Low Stock", image: "https://images.unsplash.com/photo-1574323347407-f5e1c0cf4b7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxvdXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
  { id: 4, name: "Dairy Products Set", price: 220, stock: "In Stock", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGFpcnklMjBwcm9kdWN0c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" },
];

// Mock inquiries data
const inquiries = [
  { id: 1, name: "Rajesh Kumar", date: "2023-09-15", subject: "Product availability inquiry", status: "New" },
  { id: 2, name: "Priya Sharma", date: "2023-09-14", subject: "Price inquiry for bulk order", status: "Replied" },
  { id: 3, name: "Amit Verma", date: "2023-09-12", subject: "Opening hours inquiry", status: "Closed" },
];

// Mock review sources data
const reviewSourcesData = [
  { name: 'Website', value: 65 },
  { name: 'Google', value: 25 },
  { name: 'Facebook', value: 10 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const BusinessDashboard = () => {
  const { isAuthenticated, userType } = useAuth();
  const [showSideNav, setShowSideNav] = useState(true);
  
  // Redirect if not authenticated or not a business account
  if (!isAuthenticated || userType !== 'business') {
    return <Navigate to="/business-login" />;
  }
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Side Navigation - Collapsible on Mobile */}
            <div className={`w-full md:w-64 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out ${showSideNav ? 'max-h-[1000px]' : 'max-h-16'}`}>
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Business Menu</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setShowSideNav(!showSideNav)}
                >
                  <ChevronDown className={`h-5 w-5 transition-transform ${showSideNav ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              <div className="p-4">
                <nav className="space-y-2">
                  <Link to="#" className="flex items-center gap-2 p-2 bg-blue-50 text-india-blue rounded-md">
                    <TrendingUp className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <Store className="h-5 w-5" />
                    <span>Business Profile</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Products</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <Star className="h-5 w-5" />
                    <span>Reviews</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <FileText className="h-5 w-5" />
                    <span>Analytics</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <Image className="h-5 w-5" />
                    <span>Photos</span>
                  </Link>
                  <Link to="#" className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Business Dashboard</h1>
                  <p className="text-gray-600">Welcome back! Manage your business profile and track performance.</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                  <Button variant="outline">
                    <AlertCircle className="mr-2 h-4 w-4" /> Help
                  </Button>
                  <Button className="bg-india-blue hover:bg-india-blue/90">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </div>

              {/* Business Overview */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1604719312566-8912e9667d94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JvY2VyeSUyMHN0b3JlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=100&q=60" 
                      alt={businessData.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{businessData.name}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge className="bg-gray-100 text-gray-800 border-none">{businessData.category}</Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{businessData.rating}</span>
                        <span className="ml-1 text-gray-500">({businessData.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Views</p>
                        <h3 className="text-2xl font-bold">{businessData.views}</h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Visits</p>
                        <h3 className="text-2xl font-bold">{businessData.visits}</h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                        <h3 className="text-2xl font-bold">{businessData.products}</h3>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Inquiries</p>
                        <h3 className="text-2xl font-bold">{businessData.inquiries}</h3>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="analytics">
                <TabsList className="mb-6">
                  <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="inquiries">Customer Inquiries</TabsTrigger>
                </TabsList>

                {/* Analytics Tab Content */}
                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader className="pb-0">
                        <CardTitle>Monthly Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statsData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip 
                                formatter={(value: number, name: string) => [
                                  value, 
                                  name.charAt(0).toUpperCase() + name.slice(1)
                                ]}
                              />
                              <Legend />
                              <Bar dataKey="views" fill="#0088FE" name="Views" />
                              <Bar dataKey="visits" fill="#00C49F" name="Visits" />
                              <Bar dataKey="inquiries" fill="#FFBB28" name="Inquiries" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-0">
                        <CardTitle>Review Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={reviewSourcesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {reviewSourcesData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Products Tab Content */}
                <TabsContent value="products">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Products</CardTitle>
                      <Button className="bg-india-blue hover:bg-india-blue/90">Add Product</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((product) => (
                          <div key={product.id} className="border rounded-lg overflow-hidden flex">
                            <div className="w-24 h-24">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3 flex-1">
                              <h3 className="font-semibold">{product.name}</h3>
                              <div className="flex justify-between items-center mt-2">
                                <div>
                                  <p className="text-india-blue font-semibold rupee">{product.price}</p>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    product.stock === 'In Stock' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {product.stock}
                                  </span>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center mt-6">
                        <Button variant="outline">View All Products</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Inquiries Tab Content */}
                <TabsContent value="inquiries">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Customer Inquiries</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Export</Button>
                        <div className="relative">
                          <Input placeholder="Search inquiries..." className="max-w-xs" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.map((inquiry) => (
                              <tr key={inquiry.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inquiry.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    inquiry.status === 'New' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : inquiry.status === 'Replied'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {inquiry.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button variant="ghost" size="sm" className="text-india-blue hover:text-india-blue/70">
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Create Badge component inline since it's used once
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${className}`}>{children}</span>
  );
};

export default BusinessDashboard;
