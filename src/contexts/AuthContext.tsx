
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserType = 'customer' | 'business' | null;

interface Profile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  user: User | null;
  profile: Profile | null;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  user: null,
  profile: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user ?? null);
        
        // Get user type from metadata or local storage
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          if (userMetadata && userMetadata.user_type) {
            setUserType(userMetadata.user_type as UserType);
            localStorage.setItem('userType', userMetadata.user_type);
          } else {
            // Fallback to localStorage if not in metadata
            const savedUserType = localStorage.getItem('userType') as UserType;
            setUserType(savedUserType);
          }
          fetchProfile(session.user.id);
        } else {
          setUserType(null);
          setProfile(null);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        if (userMetadata && userMetadata.user_type) {
          setUserType(userMetadata.user_type as UserType);
          localStorage.setItem('userType', userMetadata.user_type);
        } else {
          // Fallback to localStorage if not in metadata
          const savedUserType = localStorage.getItem('userType') as UserType;
          setUserType(savedUserType);
        }
        fetchProfile(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (type: UserType) => {
    // This function is now only for setting the user type
    // The actual authentication is handled in LoginForm
    setUserType(type);
    localStorage.setItem('userType', type || '');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserType(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, user, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
