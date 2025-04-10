
import React from 'react';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RegisterPage = () => {
  return (
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
          
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
