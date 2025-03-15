
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  Compass,
  History,
  Clock,
  ThumbsUp,
  Flame,
  Music,
  Film,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
};

const Sidebar = ({ className }: { className?: string }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const mainNavItems: NavItem[] = [
    {
      title: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Explore',
      href: '/explore',
      icon: <Compass className="h-5 w-5" />,
    },
  ];
  
  const personalNavItems: NavItem[] = [
    {
      title: 'History',
      href: '/history',
      icon: <History className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      title: 'Watch Later',
      href: '/watch-later',
      icon: <Clock className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      title: 'Liked Videos',
      href: '/liked',
      icon: <ThumbsUp className="h-5 w-5" />,
      requiresAuth: true,
    },
  ];
  
  const exploreNavItems: NavItem[] = [
    {
      title: 'Trending',
      href: '/trending',
      icon: <Flame className="h-5 w-5" />,
    },
    {
      title: 'Music',
      href: '/category/music',
      icon: <Music className="h-5 w-5" />,
    },
    {
      title: 'Movies',
      href: '/category/movies',
      icon: <Film className="h-5 w-5" />,
    },
    {
      title: 'Gaming',
      href: '/category/gaming',
      icon: <Gamepad2 className="h-5 w-5" />,
    },
    {
      title: 'News',
      href: '/category/news',
      icon: <Newspaper className="h-5 w-5" />,
    },
    {
      title: 'Sports',
      href: '/category/sports',
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      title: 'Learning',
      href: '/category/learning',
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      title: 'Fashion',
      href: '/category/fashion',
      icon: <ShoppingBag className="h-5 w-5" />,
    },
  ];

  // Filter out items that require authentication if the user is not authenticated
  const filteredPersonalItems = personalNavItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <aside className={cn("pb-12 w-full md:w-[240px] flex-shrink-0", className)}>
      <ScrollArea className="h-full py-6 pr-6">
        <nav className="flex flex-col gap-4 px-2">
          <div className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "justify-start gap-3 h-10",
                  location.pathname === item.href && "bg-secondary font-medium"
                )}
              >
                <Link to={item.href}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </Button>
            ))}
          </div>

          {filteredPersonalItems.length > 0 && (
            <>
              <div className="mt-2 px-4 py-1">
                <h3 className="text-sm font-semibold text-muted-foreground">Library</h3>
              </div>
              <div className="flex flex-col gap-1">
                {filteredPersonalItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn(
                      "justify-start gap-3 h-10",
                      location.pathname === item.href && "bg-secondary font-medium"
                    )}
                  >
                    <Link to={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </>
          )}

          <div className="mt-2 px-4 py-1">
            <h3 className="text-sm font-semibold text-muted-foreground">Explore</h3>
          </div>
          <div className="flex flex-col gap-1">
            {exploreNavItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "justify-start gap-3 h-10",
                  location.pathname === item.href && "bg-secondary font-medium"
                )}
              >
                <Link to={item.href}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
