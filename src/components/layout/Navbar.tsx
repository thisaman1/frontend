
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Menu, 
  Bell, 
  Upload, 
  LogOut, 
  User, 
  Settings 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForms from '@/components/auth/AuthForms';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section - Logo and mobile menu button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link 
            to="/" 
            className="flex items-center gap-2 transition-all hover:opacity-80"
          >
            <span className="text-tube-red font-bold text-2xl">Tube</span>
          </Link>
        </div>

        {/* Middle section - Search */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex relative w-full max-w-md mx-4"
        >
          <Input
            type="search"
            placeholder="Search videos..."
            className="w-full rounded-full pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        {/* Right section - User menu */}
        <div className="flex items-center gap-4">
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => navigate('/search')}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link to="/upload">
                  <Upload className="h-5 w-5" />
                  <span className="sr-only">Upload</span>
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar[0]} alt={user?.userName} />
                      <AvatarFallback>{user?.userName ? getInitials(user.userName) : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/channel/${user?._id}`} className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Your channel</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full" size="sm" onClick={() => setIsDialogOpen(true)}>
                  Sign in
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <AuthForms onRegistrationSuccess={closeDialog}/>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {/* Mobile search form */}
      <div className="md:hidden px-4 pb-3">
        <form 
          onSubmit={handleSearch}
          className="relative w-full"
        >
          <Input
            type="search"
            placeholder="Search videos..."
            className="w-full rounded-full pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
