import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Users, MessageSquare, Target, Trash2 } from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';
import StatsCard from '@/components/StatsCard';
import GoalCard from '@/components/GoalCard';
import MessageCard from '@/components/MessageCard';
import PageEditor from '@/components/PageEditor';
import ShareSection from '@/components/ShareSection';
import GoalModal from '@/components/GoalModal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoalId, setDeletingGoalId] = useState(null);

  // Call hooks unconditionally - they must be called in the same order every render
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: async () => {
      return await apiRequest('/api/dashboard');
    },
    enabled: isAuthenticated && !authLoading,
    refetchInterval: 5000
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      return await apiRequest('/api/creator', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: 'Success!',
        description: 'Your profile has been updated',
      });
      setActiveTab('overview');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive'
      });
    }
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData) => {
      return await apiRequest('/api/goals', {
        method: 'POST',
        body: JSON.stringify(goalData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: 'Goal created!',
        description: 'Your new goal has been added',
      });
      setShowGoalModal(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create goal',
        variant: 'destructive'
      });
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ goalId, ...goalData }) => {
      return await apiRequest(`/api/goals/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify(goalData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: 'Goal updated!',
        description: 'Your goal has been updated',
      });
      setShowGoalModal(false);
      setEditingGoal(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update goal',
        variant: 'destructive'
      });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId) => {
      return await apiRequest(`/api/goals/${goalId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: 'Goal deleted',
        description: 'Your goal has been removed',
      });
      setDeletingGoalId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete goal',
        variant: 'destructive'
      });
    }
  });

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">☕</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (after loading is complete)
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const handleSavePage = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setShowGoalModal(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleGoalSubmit = (goalData) => {
    if (editingGoal) {
      updateGoalMutation.mutate({ goalId: editingGoal._id, ...goalData });
    } else {
      createGoalMutation.mutate(goalData);
    }
  };

  const handleDeleteGoal = (goalId) => {
    deleteGoalMutation.mutate(goalId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav 
          userName={user?.name}
          userEmail={user?.email}
          profilePic={null}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav 
          userName={user?.name}
          userEmail={user?.email}
          profilePic={null}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-destructive">
            <p className="text-xl font-semibold mb-2">Failed to load dashboard</p>
            <p className="text-sm">{error.message}</p>
            <Button 
              className="mt-4"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] })}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { creator, goals = [], messages = [], stats = {} } = dashboardData || {};

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        userName={creator?.name || user?.name}
        userEmail={creator?.email || user?.email}
        profilePic={creator?.profilePic}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-display mb-2">
            Hi {creator?.name?.split(' ')[0] || user?.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's your page overview
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList data-testid="tabs-dashboard">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            <TabsTrigger value="share" data-testid="tab-share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard 
                title="Total Supporters" 
                value={stats.totalSupporters || 0} 
                icon={<Users className="h-4 w-4" />}
                description="Unique supporters"
              />
              <StatsCard 
                title="Messages" 
                value={stats.totalMessages || 0} 
                icon={<MessageSquare className="h-4 w-4" />}
                description="All time"
              />
              <StatsCard 
                title="Total Amount" 
                value={`₹${(stats.totalAmount || 0).toLocaleString()}`} 
                icon={<Target className="h-4 w-4" />}
                description="From supporters"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold font-display">Your Goals</h3>
                <Button 
                  variant="outline" 
                  data-testid="button-add-goal"
                  onClick={handleCreateGoal}
                >
                  Add Goal
                </Button>
              </div>
              <div className="grid gap-4">
                {goals.length > 0 ? (
                  goals.map((goal) => (
                    <div key={goal._id} className="relative">
                      <GoalCard 
                        title={goal.title}
                        currentAmount={goal.currentAmount}
                        targetAmount={goal.targetAmount}
                        onEdit={() => handleEditGoal(goal)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-14"
                        onClick={() => setDeletingGoalId(goal._id)}
                        data-testid={`button-delete-goal-${goal._id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No goals yet. Create one to start tracking your progress!
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold font-display mb-4">Recent Messages</h3>
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <MessageCard 
                      key={message._id}
                      supporterName={message.supporterName}
                      message={message.message}
                      amount={message.amount}
                      timestamp={message.createdAt}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet. Share your page to start receiving support!
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <PageEditor 
              initialData={creator}
              onSave={handleSavePage}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-display">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Account Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{creator?.email || user?.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Username</span>
                        <span className="font-medium">@{creator?.username || user?.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-lg font-semibold mb-2">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive" disabled data-testid="button-delete-account">
                      Delete Account (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share">
            <div className="max-w-2xl">
              <ShareSection username={creator?.username || user?.username} />
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation(`/page/${creator?.username || user?.username}`)}
                  data-testid="button-preview-page"
                >
                  Preview Your Page
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <GoalModal 
        open={showGoalModal}
        onOpenChange={(open) => {
          setShowGoalModal(open);
          if (!open) setEditingGoal(null);
        }}
        onSubmit={handleGoalSubmit}
        initialData={editingGoal}
      />

      <AlertDialog open={!!deletingGoalId} onOpenChange={() => setDeletingGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteGoal(deletingGoalId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
