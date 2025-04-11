
import React, { useRef } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedBusinesses from '@/components/home/FeaturedBusinesses';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Github } from 'lucide-react';

const Index = () => {
  const contributorsRef = useRef<HTMLElement>(null);

  const scrollToContributors = () => {
    contributorsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="flex justify-center py-4 sticky top-16 z-30 bg-background/80 backdrop-blur-sm border-b">
        <Button 
          onClick={scrollToContributors} 
          variant="outline"
          className="flex gap-2 hover:bg-india-blue/10 dark:hover:bg-india-orange/10 transition-all duration-300"
        >
          <Users className="h-4 w-4" />
          Meet Our Contributors
        </Button>
      </div>
      
      <HeroSection />
      <CategorySection />
      <FeaturedBusinesses />
      
      {/* How it Works Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 dark:text-white">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find local products and businesses in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="bg-india-blue/10 dark:bg-india-blue/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-india-blue dark:text-india-orange">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Search</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter what you're looking for and your location to find nearby businesses
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="bg-india-orange/10 dark:bg-india-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-india-orange">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Compare</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse business profiles, reviews, and available products
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="bg-india-green/10 dark:bg-india-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-india-green">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Contact the business directly or visit their location
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contributors Section - Replacing Founder Section */}
      <section ref={contributorsRef} id="contributors" className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 dark:text-white">Meet Our Contributors</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The talented team behind LocalFind India
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            <div className="w-full md:w-1/3 p-4 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center shadow-md animate-fade-in opacity-0" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
                <div className="mb-4 mx-auto">
                  <Avatar className="h-24 w-24 mx-auto bg-india-blue text-white">
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-bold mb-1 dark:text-white">Aryan</h3>
                <p className="text-india-blue dark:text-india-orange font-medium mb-3">Lead Developer</p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  "Passionate about creating intuitive user experiences and robust applications."
                </p>
                <a 
                  href="https://github.com/aryaan022" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center text-india-blue dark:text-india-orange hover:underline gap-1"
                >
                  <Github size={16} />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 p-4 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center shadow-md animate-fade-in opacity-0" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
                <div className="mb-4 mx-auto">
                  <Avatar className="h-24 w-24 mx-auto bg-india-orange text-white">
                    <AvatarFallback>RO</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-bold mb-1 dark:text-white">Rohit</h3>
                <p className="text-india-blue dark:text-india-orange font-medium mb-3">UI/UX Designer</p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  "Dedicated to creating beautiful, functional designs that enhance user engagement."
                </p>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center text-india-blue dark:text-india-orange hover:underline gap-1"
                >
                  <Github size={16} />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 p-4 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center shadow-md animate-fade-in opacity-0" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
                <div className="mb-4 mx-auto">
                  <Avatar className="h-24 w-24 mx-auto bg-india-green text-white">
                    <AvatarFallback>SH</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-bold mb-1 dark:text-white">Shubham</h3>
                <p className="text-india-blue dark:text-india-orange font-medium mb-3">Business Strategist</p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  "Focused on connecting businesses with customers through innovative solutions."
                </p>
                <a 
                  href="https://github.com/Shubham-uk05" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center text-india-blue dark:text-india-orange hover:underline gap-1"
                >
                  <Github size={16} />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Business Registration CTA */}
      <section className="py-16 px-4 bg-india-blue text-white dark:bg-gray-900 dark:border-t dark:border-gray-700">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Own a Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Register your business today and reach thousands of potential customers in your area
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-india-blue hover:bg-gray-100 dark:bg-india-orange dark:text-white dark:hover:bg-india-orange/90"
              onClick={() => window.location.href = '/business-register'}
            >
              Register Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20 dark:border-india-orange dark:text-india-orange dark:hover:bg-india-orange/20"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
