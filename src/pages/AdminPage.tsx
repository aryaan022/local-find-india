
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Store, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Business, BusinessStatus } from '@/types/business';

// List of admin emails
const ADMIN_EMAILS = ['admin@example.com'];

const AdminPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<Business[]>([]);
  const [rejectedBusinesses, setRejectedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if current user is admin
    if (user && ADMIN_EMAILS.includes(user.email || '')) {
      setIsAdmin(true);
      fetchBusinesses();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      // Fetch pending businesses
      const { data: pendingData, error: pendingError } = await supabase
        .from('businesses')
        .select('*, categories:category_id(name)')
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      setPendingBusinesses(pendingData as unknown as Business[]);
      
      // Fetch approved businesses
      const { data: approvedData, error: approvedError } = await supabase
        .from('businesses')
        .select('*, categories:category_id(name)')
        .eq('status', 'approved');
      
      if (approvedError) throw approvedError;
      setApprovedBusinesses(approvedData as unknown as Business[]);
      
      // Fetch rejected businesses
      const { data: rejectedData, error: rejectedError } = await supabase
        .from('businesses')
        .select('*, categories:category_id(name)')
        .eq('status', 'rejected');
      
      if (rejectedError) throw rejectedError;
      setRejectedBusinesses(rejectedData as unknown as Business[]);
    } catch (error: any) {
      console.error('Error fetching businesses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load businesses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: BusinessStatus) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Business ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });
      
      // Refresh data
      fetchBusinesses();
    } catch (error: any) {
      console.error('Error updating business status:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${status} business`,
        variant: 'destructive',
      });
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Show access denied if not an admin
  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
            <Button asChild>
              <a href="/">Return to Home</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Pending</span>
                <Badge variant="secondary" className="ml-1">{pendingBusinesses.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Approved</span>
                <Badge variant="secondary" className="ml-1">{approvedBusinesses.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                <span>Rejected</span>
                <Badge variant="secondary" className="ml-1">{rejectedBusinesses.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <h2 className="text-xl font-semibold mb-4">Pending Businesses</h2>
              {loading ? (
                <p>Loading pending businesses...</p>
              ) : pendingBusinesses.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pending Businesses</h3>
                  <p className="text-gray-500">All businesses have been reviewed</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingBusinesses.map((business) => (
                    <Card key={business.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 p-4">
                          <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                            {business.cover_url ? (
                              <img 
                                src={business.cover_url} 
                                alt={business.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                }}
                              />
                            ) : (
                              <Store className="h-16 w-16 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <CardContent className="md:w-1/2 p-4">
                          <h3 className="text-xl font-bold">{business.name}</h3>
                          <div className="mt-2">
                            <Badge variant="outline">
                              {business.categories?.name || 'Uncategorized'}
                            </Badge>
                          </div>
                          <div className="flex items-start gap-1 mt-3">
                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                            <p className="text-sm text-gray-600">
                              {business.address ? `${business.address}, ` : ''}{business.city}, {business.state}
                              {business.pincode ? ` - ${business.pincode}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <p className="text-sm text-gray-600">
                              Submitted on {new Date(business.created_at || '').toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-3 text-gray-600 line-clamp-2">
                            {business.description || 'No description provided.'}
                          </p>
                        </CardContent>
                        <CardFooter className="md:w-1/4 p-4 flex flex-col md:justify-center gap-2">
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleUpdateStatus(business.id, 'approved')}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => handleUpdateStatus(business.id, 'rejected')}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approved">
              <h2 className="text-xl font-semibold mb-4">Approved Businesses</h2>
              {loading ? (
                <p>Loading approved businesses...</p>
              ) : approvedBusinesses.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Approved Businesses</h3>
                  <p className="text-gray-500">No businesses have been approved yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedBusinesses.map((business) => (
                    <Card key={business.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{business.name}</CardTitle>
                          <Badge className="bg-green-500">Approved</Badge>
                        </div>
                        <CardDescription>
                          {business.categories?.name || 'Uncategorized'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {business.city}, {business.state}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50 w-full"
                          onClick={() => handleUpdateStatus(business.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Change to Rejected
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rejected">
              <h2 className="text-xl font-semibold mb-4">Rejected Businesses</h2>
              {loading ? (
                <p>Loading rejected businesses...</p>
              ) : rejectedBusinesses.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Rejected Businesses</h3>
                  <p className="text-gray-500">No businesses have been rejected</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rejectedBusinesses.map((business) => (
                    <Card key={business.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{business.name}</CardTitle>
                          <Badge className="bg-red-500">Rejected</Badge>
                        </div>
                        <CardDescription>
                          {business.categories?.name || 'Uncategorized'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {business.city}, {business.state}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline"
                          className="text-green-600 border-green-300 hover:bg-green-50 w-full"
                          onClick={() => handleUpdateStatus(business.id, 'approved')}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Change to Approved
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
