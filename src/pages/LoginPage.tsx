
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  return (
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Login to Your Account</h1>
          
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <LoginForm userType="customer" />
            </TabsContent>
            <TabsContent value="business">
              <LoginForm userType="business" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
