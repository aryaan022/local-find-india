import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

interface RegisterFormProps {
  userType: 'customer' | 'business';
}

const RegisterForm: React.FC<RegisterFormProps> = ({ userType }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // For business registration, add these fields
  const [businessFormData, setBusinessFormData] = useState({
    businessName: '',
    category: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive',
      });
      return;
    }
    
    if (userType === 'business' && 
        (!businessFormData.businessName || !businessFormData.category || 
         !businessFormData.address || !businessFormData.city || 
         !businessFormData.state || !businessFormData.pincode)) {
      toast({
        title: 'Error',
        description: 'Please fill in all business details',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create metadata object based on user type
      const metadata: Record<string, any> = { 
        name: formData.name,
        phone: formData.phone,
      };
      
      if (userType === 'business') {
        metadata.businessName = businessFormData.businessName;
        metadata.businessDetails = {
          category: businessFormData.category,
          address: businessFormData.address,
          city: businessFormData.city,
          state: businessFormData.state,
          pincode: businessFormData.pincode,
          description: businessFormData.description
        };
      }

      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }

      // Set user type in local auth context
      login(userType);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully! Please check your email to verify your account.',
      });
      
      if (userType === 'customer') {
        navigate('/dashboard');
      } else {
        // For business users, we'll need to create a business entry
        const { error: businessError } = await supabase
          .from('businesses')
          .insert([
            {
              owner_id: data.user?.id,
              name: businessFormData.businessName,
              slug: businessFormData.businessName.toLowerCase().replace(/\s+/g, '-'),
              description: businessFormData.description,
              address: businessFormData.address,
              city: businessFormData.city,
              state: businessFormData.state,
              pincode: businessFormData.pincode
            }
          ]);

        if (businessError) {
          console.error('Error creating business:', businessError);
          toast({
            title: 'Business Registration Error',
            description: 'Your account was created, but there was an issue registering your business. Please contact support.',
            variant: 'destructive',
          });
        } else {
          navigate('/business-dashboard');
        }
      }
      
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was a problem creating your account.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {userType === 'customer' ? 'Create Customer Account' : 'Register Your Business'}
        </CardTitle>
        <CardDescription className="text-center">
          {userType === 'customer' 
            ? 'Sign up to discover local businesses and products' 
            : 'Reach more customers by listing your business'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{userType === 'customer' ? 'Full Name' : 'Owner Name'}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          {userType === 'business' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Your Business Name"
                  value={businessFormData.businessName}
                  onChange={handleBusinessInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Business Category</Label>
                <select
                  id="category"
                  name="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={businessFormData.category}
                  onChange={handleBusinessInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="grocery">Grocery & Essentials</option>
                  <option value="food">Food & Beverages</option>
                  <option value="clothing">Clothing & Fashion</option>
                  <option value="home">Home & Furniture</option>
                  <option value="services">Services & Repairs</option>
                  <option value="health">Health & Wellness</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="education">Education & Learning</option>
                  <option value="electronics">Electronics & Tech</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Street Address"
                  value={businessFormData.address}
                  onChange={handleBusinessInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Mumbai"
                    value={businessFormData.city}
                    onChange={handleBusinessInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Maharashtra"
                    value={businessFormData.state}
                    onChange={handleBusinessInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="text"
                  placeholder="400001"
                  value={businessFormData.pincode}
                  onChange={handleBusinessInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <textarea
                  id="description"
                  name="description"
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Describe your business..."
                  value={businessFormData.description}
                  onChange={handleBusinessInputChange}
                ></textarea>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms} 
              onCheckedChange={() => setAgreeTerms(!agreeTerms)} 
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-india-blue hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-india-blue hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-india-blue hover:bg-india-blue/90" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-india-blue font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
