
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Search, Menu, User, ShoppingBag, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-india-blue dark:text-india-orange" />
            <span className="text-xl font-bold text-india-blue dark:text-white">LocalFind</span>
            <span className="text-india-orange font-bold">India</span>
          </Link>
        </div>
        
        <nav className={`absolute md:static top-16 left-0 w-full md:w-auto bg-background md:bg-transparent border-b md:border-0 shadow-md md:shadow-none transition-all ${isMenuOpen ? "block" : "hidden md:block"}`}>
          <ul className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-0">
            <li>
              <Link to="/businesses" className="text-foreground hover:text-india-blue dark:hover:text-india-orange font-medium">
                Businesses
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-foreground hover:text-india-blue dark:hover:text-india-orange font-medium">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-foreground hover:text-india-blue dark:hover:text-india-orange font-medium">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-foreground hover:text-india-blue dark:hover:text-india-orange font-medium">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userType === 'customer' && (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    My Dashboard
                  </DropdownMenuItem>
                )}
                {userType === 'business' && (
                  <DropdownMenuItem onClick={() => navigate('/business-dashboard')}>
                    Business Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button className="bg-india-blue text-white hover:bg-india-blue/90" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
