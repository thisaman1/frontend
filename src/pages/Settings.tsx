import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Upload, User, Bell, Shield, LogOut } from 'lucide-react';
import { toast } from "sonner";

const profileFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  bio: z.string().max(160, 'Bio must not be longer than 160 characters.').optional(),
  avatar: z.any().optional(),
  coverImage: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  newSubscriber: z.boolean().default(true),
  newComment: z.boolean().default(true),
  videoLiked: z.boolean().default(true),
  mentionedYou: z.boolean().default(true),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const Settings = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('profile');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('You need to be logged in to access settings');
    }
  }, [isAuthenticated, navigate]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.userName || '',
      email: user?.email || '',
      bio: '',
    },
  });

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      newSubscriber: true,
      newComment: true,
      videoLiked: true,
      mentionedYou: true,
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    toast.success('Profile updated successfully');
    // Implement profile update API call
  };

  const onNotificationSubmit = (data: NotificationFormValues) => {
    toast.success('Notification preferences updated');
    // Implement notification settings update API call
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information visible to other users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar?.[0]} />
                        <AvatarFallback className="text-xl">
                          {user?.userName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <Button variant="outline" size="sm" className="gap-2 mb-2">
                          <Upload className="h-4 w-4" />
                          Change Avatar
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPEG, PNG or WebP, max 2MB
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Cover Image</h3>
                      <div 
                        className="h-32 w-full rounded-lg bg-cover bg-center bg-muted flex items-center justify-center"
                        style={{ 
                          backgroundImage: `url(${user?.coverImage?.[0] || ''})`,
                          backgroundColor: user?.coverImage?.[0] ? undefined : 'hsl(var(--muted))'
                        }}
                      >
                        {!user?.coverImage?.[0] && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Cover Image
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your email address is not shared publicly
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about yourself"
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description for your profile. Max 160 characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div className="space-y-0.5">
                              <FormLabel>Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div className="space-y-0.5">
                              <FormLabel>Push Notifications</FormLabel>
                              <FormDescription>
                                Receive push notifications in browser
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <h3 className="text-sm font-medium">Notify me about</h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="newSubscriber"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div className="space-y-0.5">
                              <FormLabel>New Subscribers</FormLabel>
                              <FormDescription>
                                When someone subscribes to your channel
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="newComment"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div className="space-y-0.5">
                              <FormLabel>Comments</FormLabel>
                              <FormDescription>
                                When someone comments on your video
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="videoLiked"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div className="space-y-0.5">
                              <FormLabel>Video Likes</FormLabel>
                              <FormDescription>
                                When someone likes your video
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="mentionedYou"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div className="space-y-0.5">
                              <FormLabel>Mentions</FormLabel>
                              <FormDescription>
                                When someone mentions you in a comment
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Preferences</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="text-sm font-medium">Account Information</h3>
                      <p className="text-sm text-muted-foreground">
                        View and update your account details
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Manage
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="text-sm font-medium">Notification Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure how you receive notifications
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => setActiveTab('notifications')}
                    >
                      Configure
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="text-sm font-medium">Password & Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password and secure your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Update
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-4">
                    <LogOut className="h-5 w-5 text-destructive" />
                    <div>
                      <h3 className="text-sm font-medium">Log Out</h3>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="ml-auto"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;