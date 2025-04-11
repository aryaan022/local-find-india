import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ShoppingBag, Users, Star, TrendingUp, Edit, Image, Store,
  MessageSquare, FileText, Settings, AlertCircle, ChevronDown, Plus, Trash
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Placeholder colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Type definitions
interface BusinessData {
  id: string;
  name: string;
  category_id?: string;
  category_name?: string;
  description?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  cover_url?: string;
  status: string;
  average_rating: number;
  total_reviews: number;
}

interface ProductData {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  is_available: boolean;
}

interface Inquiry {
  id: string;
  name: string;
  date: string;
  subject: string;
  status: string;
}

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, user } = useAuth();
  const [showSideNav, setShowSideNav] = useState(true);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<ProductData>>({
    name: '',
    description: '',
    price: undefined,
    is_available: true
  });
  
  // Mock data that would eventually come from analytics
  const statsData = [
    { name: 'Jan', views: 400, visits: 240, inquiries: 40 },
    { name: 'Feb', views: 500, visits: 280, inquiries: 45 },
    { name: 'Mar', views: 600, visits: 320, inquiries: 50 },
    { name: 'Apr', views: 550, visits: 300, inquiries: 48 },
    { name: 'May', views: 700, visits: 380, inquiries: 60 },
    { name: 'Jun', views: 800, visits: 450, inquiries: 70 },
  ];

  const reviewSourcesData = [
    { name: 'Website', value: 65 },
    { name: 'Google', value: 25 },
    { name: 'Facebook', value: 10 },
  ];

  // Mock inquiries data - would eventually come from a real table
  const inquiries = [
    { id: "1", name: "Rajesh Kumar", date: "2023-09-15", subject: "Product availability inquiry", status: "New" },
    { id: "2", name: "Priya Sharma", date: "2023-09-14", subject: "Price inquiry for bulk order", status: "Replied" },
    { id: "3", name: "Amit Verma", date: "2023-09-12", subject: "Opening hours inquiry", status: "Closed" },
  ];
  
  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select(`
            *,
            categories:category_id (
              name
            )
          `)
          .eq('owner_id', user.id)
          .single();
        
        if (businessError) {
          console.error('Error fetching business data:', businessError);
          return;
        }
        
        if (businessData) {
          setBusiness({
            ...businessData,
            category_name: businessData.categories?.name
          });
          
          // Fetch products for this business
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('business_id', businessData.id);
          
          if (productsError) {
            console.error('Error fetching products:', productsError);
          } else {
            setProducts(productsData || []);
          }
        } else {
          // No business found for this user
          // Could redirect to business creation page
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessData();
  }, [user]);
  
  // Add a new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) return;
    
    if (!newProduct.name) {
      toast.error("Product name is required");
      return;
    }
    
    try {
      const productToInsert = {
        business_id: business.id,
        name: newProduct.name || '',
        description: newProduct.description,
        price: newProduct.price,
        image_url: newProduct.image_url,
        is_available: newProduct.is_available ?? true
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(productToInsert)
        .select()
        .single();
      
      if (error) {
        toast.error(`Error adding product: ${error.message}`);
        return;
      }
      
      setProducts([...products, data]);
      setNewProduct({
        name: '',
        description: '',
        price: undefined,
        is_available: true
      });
      
      toast.success("Product added successfully");
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Failed to add product");
    }
  };
  
  // Delete a product
  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        toast.error(`Error deleting product: ${error.message}`);
        return;
      }
      
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
    }
  };
  
  // Toggle product availability
  const toggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !currentStatus })
        .eq('id', productId);
      
      if (error) {
        toast.error(`Error updating product: ${error.message}`);
        return;
      }
      
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, is_available: !product.is_available } 
          : product
      ));
      
      toast.success("Product availability updated");
    } catch (error) {
      console.error('Error updating product availability:', error);
      toast.error("Failed to update product");
    }
  };
  
  // Redirect if not authenticated or not a business account
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userType !== 'business') {
    return <Navigate to="/business-login" />;
  }
  
  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading business dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Show a message if no business found
  if (!business) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Business Found</h2>
            <p className="text-gray-600 mb-6">
              It looks like you haven't registered your business yet. 
              Create your business profile to get started.
            </p>
            <Button 
              onClick={() => navigate('/business-register')}
              className="bg-india-blue hover:bg-india-blue/90"
            >
              Register Your Business
            </Button>
          </div>
        </div>
      </Layout>
    );
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
                  <Link to="/business-dashboard" className="flex items-center gap-2 p-2 bg-blue-50 text-india-blue rounded-md">
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
                    {business.logo_url ? (
                      <img 
                        src={business.logo_url} 
                        alt={business.name}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-india-blue text-white">
                        <Store className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{business.name}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full border-none">
                        {business.category_name || "Uncategorized"}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{business.average_rating || 0}</span>
                        <span className="ml-1 text-gray-500">({business.total_reviews || 0} reviews)</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        business.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : business.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                      </span>
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
                        <h3 className="text-2xl font-bold">1,250</h3>
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
                        <h3 className="text-2xl font-bold">320</h3>
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
                        <h3 className="text-2xl font-bold">{products.length}</h3>
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
                        <p className="text-sm font-medium text-gray-500">Reviews</p>
                        <h3 className="text-2xl font-bold">{business.total_reviews || 0}</h3>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Star className="h-6 w-6 text-purple-600" />
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
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddProduct} className="mb-6 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-3">Add New Product</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="productName">Product Name*</Label>
                            <Input 
                              id="productName"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                              placeholder="Enter product name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="productPrice">Price (₹)</Label>
                            <Input 
                              id="productPrice"
                              type="number"
                              value={newProduct.price || ''}
                              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || undefined})}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button type="submit" className="bg-india-blue hover:bg-india-blue/90 w-full">
                              <Plus className="h-4 w-4 mr-1" /> Add Product
                            </Button>
                          </div>
                          <div className="md:col-span-3">
                            <Label htmlFor="productDescription">Description</Label>
                            <Textarea 
                              id="productDescription"
                              value={newProduct.description || ''}
                              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                              placeholder="Enter product description"
                              rows={2}
                            />
                          </div>
                        </div>
                      </form>
                      
                      {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {products.map((product) => (
                            <div key={product.id} className="border rounded-lg overflow-hidden flex">
                              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                                {product.image_url ? (
                                  <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div className="p-3 flex-1">
                                <h3 className="font-semibold">{product.name}</h3>
                                {product.description && (
                                  <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                                )}
                                <div className="flex justify-between items-center mt-2">
                                  <div>
                                    {product.price !== undefined && product.price !== null && (
                                      <p className="text-india-blue font-semibold">₹{product.price}</p>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      product.is_available 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {product.is_available ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => toggleProductAvailability(product.id, product.is_available)}
                                    >
                                      {product.is_available ? 'Mark Out of Stock' : 'Mark In Stock'}
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold mb-1">No products yet</h3>
                          <p className="text-gray-600 mb-4">Add products to showcase your offerings</p>
                        </div>
                      )}
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
                        
                        {inquiries.length === 0 && (
                          <div className="text-center py-10">
                            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-1">No inquiries yet</h3>
                            <p className="text-gray-600">When customers contact you, they'll appear here</p>
                          </div>
                        )}
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

export default BusinessDashboard;
