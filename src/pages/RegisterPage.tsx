
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123"; // Simple password for admin

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const registerAdminAccount = async () => {
    try {
      // Check if admin account already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', ADMIN_EMAIL);
      
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Admin Already Exists",
          description: "Admin account already exists. You can log in with admin@example.com and password 'admin123'",
        });
        navigate('/login');
        return;
      }

      // Register admin account
      const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
          data: {
            name: 'Admin User',
            phone: '1234567890',
            user_type: 'customer',
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Admin Account Created",
        description: "Admin account has been created successfully! Email: admin@example.com, Password: admin123",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Error creating admin account:', error);
      toast({
        title: "Registration Failed",
        description: error.message || 'Failed to create admin account',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
          
          <div className="mb-6 text-center">
            <Button 
              variant="outline"
              onClick={registerAdminAccount}
              className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
            >
              Create Admin Account (admin@example.com / admin123)
            </Button>
          </div>
          
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <RegisterForm userType="customer" />
            </TabsContent>
            <TabsContent value="business">
              <RegisterForm userType="business" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
