
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Store, Clock, BarChart3, Settings, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Business, BusinessStatus } from '@/types/business';

interface Product {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  is_available?: boolean;
  business_id: string;
}

const BusinessDashboard = () => {
  const { isAuthenticated, userType, user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDialog, setProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    description: '',
    price: undefined,
    image_url: '',
    is_available: true,
    business_id: ''
  });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Fetch business data when component mounts
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get business owned by current user
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id)
          .single();
        
        if (businessError) {
          console.error('Error fetching business:', businessError);
          return;
        }
        
        if (businessData) {
          setBusiness(businessData);
          
          // Fetch products for this business
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('business_id', businessData.id);
          
          if (productsError) {
            console.error('Error fetching products:', productsError);
            return;
          }
          
          setProducts(productsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessData();
  }, [user]);
  
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewProduct(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      const numValue = value ? parseFloat(value) : undefined;
      setNewProduct(prev => ({ ...prev, [name]: numValue }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) {
      toast({
        title: 'Error',
        description: 'No business found',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newProduct.name) {
      toast({
        title: 'Error',
        description: 'Product name is required',
        variant: 'destructive',
      });
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
      
      if (editingProduct) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update(productToInsert)
          .eq('id', editingProduct)
          .select()
          .single();
        
        if (error) throw error;
        
        setProducts(prevProducts =>
          prevProducts.map(product => 
            product.id === editingProduct ? data : product
          )
        );
        
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Add new product
        const { data, error } = await supabase
          .from('products')
          .insert(productToInsert)
          .select()
          .single();
        
        if (error) throw error;
        
        setProducts(prevProducts => [...prevProducts, data]);
        
        toast({
          title: 'Success',
          description: 'Product added successfully',
        });
      }
      
      setNewProduct({
        name: '',
        description: '',
        price: undefined,
        image_url: '',
        is_available: true,
        business_id: business.id
      });
      setEditingProduct(null);
      setProductDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setNewProduct({
      ...product,
    });
    setEditingProduct(product.id || null);
    setProductDialog(true);
  };
  
  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== id)
      );
      
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  // Redirect if not authenticated or not a business
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userType !== 'business') {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="py-8 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <p>Loading business data...</p>
            </div>
          ) : !business ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Business Found</h2>
              <p className="mb-6">It seems you don't have a business registered yet.</p>
              <Button asChild>
                <a href="/business-register">Register Your Business</a>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold mr-3">{business.name}</h1>
                    <Badge className={
                      business.status === 'approved' ? 'bg-green-500' :
                      business.status === 'rejected' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }>
                      {business.status === 'approved' ? 'Approved' : 
                       business.status === 'rejected' ? 'Rejected' : 
                       'Pending Approval'}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{business.description || 'No business description'}</p>
                </div>
                {business.status === 'pending' && (
                  <div className="mt-4 md:mt-0 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800">Pending Verification</h3>
                    <p className="text-sm text-yellow-700">
                      Your business is under review. You'll be notified once it's approved.
                    </p>
                  </div>
                )}
                {business.status === 'rejected' && (
                  <div className="mt-4 md:mt-0 bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-medium text-red-800">Business Rejected</h3>
                    <p className="text-sm text-red-700">
                      Your business listing was rejected. Please contact support for more information.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Products</p>
                      <h3 className="text-2xl font-bold">{products.length}</h3>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-india-blue" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Orders</p>
                      <h3 className="text-2xl font-bold">0</h3>
                    </div>
                    <Clock className="h-8 w-8 text-india-orange" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <h3 className="text-2xl font-bold">{business.average_rating?.toFixed(1) || 'N/A'}</h3>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Views</p>
                      <h3 className="text-2xl font-bold">0</h3>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="products" className="mt-6">
                <TabsList>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="settings" disabled={business.status !== 'approved'}>Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Products</h2>
                    <Dialog open={productDialog} onOpenChange={setProductDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-india-blue" onClick={() => {
                          setNewProduct({
                            name: '',
                            description: '',
                            price: undefined,
                            image_url: '',
                            is_available: true,
                            business_id: business.id
                          });
                          setEditingProduct(null);
                        }}>
                          <Plus className="h-4 w-4 mr-2" /> Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                          <DialogDescription>
                            {editingProduct ? 'Update product details' : 'Add a new product to your catalog'}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitProduct}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Product Name*</Label>
                              <Input
                                id="name"
                                name="name"
                                value={newProduct.name}
                                onChange={handleProductChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                name="description"
                                value={newProduct.description || ''}
                                onChange={handleProductChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="price">Price</Label>
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={newProduct.price || ''}
                                onChange={handleProductChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="image_url">Image URL</Label>
                              <Input
                                id="image_url"
                                name="image_url"
                                value={newProduct.image_url || ''}
                                onChange={handleProductChange}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="is_available"
                                name="is_available"
                                checked={newProduct.is_available}
                                onChange={handleProductChange}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor="is_available">Available</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">{editingProduct ? 'Update' : 'Add'}</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {products.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                      <p className="text-gray-500 mb-6">Start adding products to your catalog</p>
                      <Button onClick={() => setProductDialog(true)}>Add Your First Product</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(product => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="h-48 bg-gray-100 relative">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-200">
                                <p className="text-gray-400">No Image</p>
                              </div>
                            )}
                            {!product.is_available && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="destructive">Not Available</Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                            {product.price !== undefined && (
                              <p className="text-india-blue font-bold">₹{product.price.toFixed(2)}</p>
                            )}
                            {product.description && (
                              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
                            )}
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-300" onClick={() => handleDeleteProduct(product.id!)}>
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="orders" className="mt-6">
                  <h2 className="text-2xl font-bold mb-6">Orders</h2>
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-gray-500">Orders will appear here once customers start purchasing</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <h2 className="text-2xl font-bold mb-6">Business Settings</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>Update your business details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="business_name">Business Name</Label>
                        <Input 
                          id="business_name" 
                          value={business.name} 
                          disabled={true} // Require admin approval to change name
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business_description">Description</Label>
                        <Textarea 
                          id="business_description" 
                          value={business.description || ''} 
                          disabled={business.status !== 'approved'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business_address">Address</Label>
                        <Input 
                          id="business_address" 
                          value={business.address || ''} 
                          disabled={business.status !== 'approved'}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="business_city">City</Label>
                          <Input 
                            id="business_city" 
                            value={business.city} 
                            disabled={business.status !== 'approved'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="business_state">State</Label>
                          <Input 
                            id="business_state" 
                            value={business.state} 
                            disabled={business.status !== 'approved'}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business_pincode">PIN Code</Label>
                        <Input 
                          id="business_pincode" 
                          value={business.pincode || ''} 
                          disabled={business.status !== 'approved'}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button disabled={business.status !== 'approved'}>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
