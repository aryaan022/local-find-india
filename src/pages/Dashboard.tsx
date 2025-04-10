import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Heart, Clock, Bell, MessageSquare } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ChatBot from '@/components/chatbot/ChatBot';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Business } from '@/types/business';

interface SavedBusiness {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  image: string;
}

interface ActivityItem {
  id: string;
  type: 'visit' | 'review' | 'save';
  business: string;
  date: string;
  rating?: number;
}

interface Notification {
  id: string;
  title: string;
  time: string;
}

const savedBusinessesMock = [
  {
    id: "1",
    name: "Sharma General Store",
    category: "Grocery & Essentials",
    rating: 4.8,
    reviews: 124,
    address: "Connaught Place, New Delhi",
    image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "2",
    name: "Patel Electronics",
    category: "Electronics & Tech",
    rating: 4.6,
    reviews: 89,
    address: "MG Road, Bangalore",
    image: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const recentActivityMock: ActivityItem[] = [
  { id: "1", type: "visit", business: "Sharma General Store", date: "2023-09-15" },
  { id: "2", type: "review", business: "Fashion Hub", date: "2023-09-10", rating: 4 },
  { id: "3", type: "save", business: "Patel Electronics", date: "2023-09-05" },
];

const notificationsMock = [
  { id: "1", title: "New products at Sharma General Store", time: "2 hours ago" },
  { id: "2", title: "Weekend sale at Fashion Hub", time: "1 day ago" },
  { id: "3", title: "Your review was liked", time: "3 days ago" },
];

const Dashboard = () => {
  const { isAuthenticated, userType, profile, user } = useAuth();
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(recentActivityMock);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsMock);
  const [loading, setLoading] = useState(true);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([]);
  
  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || "Customer";
  
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    }
    return "C";
  };

  useEffect(() => {
    const fetchNearbyBusinesses = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select(`
            *,
            categories:category_id (
              name, slug
            )
          `)
          .eq('status', 'approved')
          .limit(3);
        
        if (error) throw error;
        setNearbyBusinesses(data as unknown as Business[]);
      } catch (error) {
        console.error('Error fetching nearby businesses:', error);
      }
    };
    
    fetchNearbyBusinesses();
  }, []);

  useEffect(() => {
    const fetchSavedBusinesses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        setSavedBusinesses(savedBusinessesMock);
      } catch (error) {
        console.error('Error fetching saved businesses:', error);
        toast.error('Failed to load saved businesses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedBusinesses();
  }, [user]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userType !== 'customer') {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8 px-4 min-h-screen">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{displayName}'s Dashboard</h1>
              <p className="text-gray-600">Welcome back! Discover local businesses and manage your activity.</p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-india-blue hover:bg-india-blue/90"
              onClick={() => window.location.href = '/businesses'}
            >
              Search Businesses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-16 h-16">
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={displayName} />
                      ) : (
                        <AvatarFallback className="bg-india-blue text-white text-2xl font-bold">
                          {getInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{displayName}</h3>
                      <p className="text-gray-600">{profile?.first_name ? "Member" : "Customer"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-india-blue">{savedBusinesses.length}</div>
                      <div className="text-gray-600 text-sm">Saved Businesses</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-india-green">2</div>
                      <div className="text-gray-600 text-sm">Reviews</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-india-orange">8</div>
                      <div className="text-gray-600 text-sm">Total Visits</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">3</div>
                      <div className="text-gray-600 text-sm">Interactions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="pb-4">
                  <CardTitle>Nearby Businesses</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {nearbyBusinesses.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">No nearby businesses found</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {nearbyBusinesses.map(business => (
                        <div key={business.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{business.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1 text-xs font-medium">{business.average_rating?.toFixed(1) || "New"}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{business.categories?.name}</p>
                          <Button 
                            variant="link" 
                            className="text-india-blue p-0 h-auto mt-1 text-sm"
                            onClick={() => navigate(`/business/${business.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="saved">
                <TabsList>
                  <TabsTrigger value="saved" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" /> Saved
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Activity
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-1">
                    <Bell className="h-4 w-4" /> Notifications
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="saved" className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Saved Businesses</h2>
                  {loading ? (
                    <div className="text-center py-8">
                      <p>Loading saved businesses...</p>
                    </div>
                  ) : savedBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedBusinesses.map(business => (
                        <Card key={business.id} className="overflow-hidden card-hover">
                          <div className="flex">
                            <div className="w-1/3">
                              <img 
                                src={business.image} 
                                alt={business.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
                                }}
                              />
                            </div>
                            <div className="w-2/3 p-4">
                              <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
                              <div className="flex items-center mt-1 mb-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="ml-1 text-sm font-medium">{business.rating}</span>
                                <span className="ml-1 text-xs text-gray-500">({business.reviews})</span>
                              </div>
                              <div className="flex items-start gap-1">
                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                <p className="text-sm text-gray-600 line-clamp-1">{business.address}</p>
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="bg-india-blue hover:bg-india-blue/90"
                                  onClick={() => window.location.href = `/business/${business.id}`}
                                >
                                  Visit
                                </Button>
                                <Button size="sm" variant="outline">
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No saved businesses yet</h3>
                      <p className="text-gray-600 mb-4">When you find businesses you like, save them here for quick access.</p>
                      <Button onClick={() => window.location.href = '/businesses'}>Explore Businesses</Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="activity" className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <Card>
                    <CardContent className="p-0">
                      {recentActivity.map((activity, index) => (
                        <div 
                          key={activity.id} 
                          className={`p-4 flex items-center justify-between ${
                            index < recentActivity.length - 1 ? 'border-b' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {activity.type === 'visit' && (
                              <div className="bg-blue-100 p-2 rounded-full">
                                <MapPin className="h-5 w-5 text-india-blue" />
                              </div>
                            )}
                            {activity.type === 'review' && (
                              <div className="bg-green-100 p-2 rounded-full">
                                <Star className="h-5 w-5 text-india-green" />
                              </div>
                            )}
                            {activity.type === 'save' && (
                              <div className="bg-red-100 p-2 rounded-full">
                                <Heart className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">
                                {activity.type === 'visit' && `Visited ${activity.business}`}
                                {activity.type === 'review' && `Reviewed ${activity.business}`}
                                {activity.type === 'save' && `Saved ${activity.business}`}
                              </p>
                              <p className="text-sm text-gray-500">{activity.date}</p>
                            </div>
                          </div>
                          {activity.type === 'review' && activity.rating !== undefined && (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < activity.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <Button variant="outline" size="sm">Mark All as Read</Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      {notifications.map((notification, index) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 ${
                            index < notifications.length - 1 ? 'border-b' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-gray-500">{notification.time}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-india-blue hover:bg-india-blue/90 shadow-lg flex items-center justify-center"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {showChatbot && <ChatBot onClose={() => setShowChatbot(false)} />}
    </Layout>
  );
};

export default Dashboard;
