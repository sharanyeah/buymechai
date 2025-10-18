import { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import CreatorProfile from '@/components/CreatorProfile';
import GoalCard from '@/components/GoalCard';
import MessageForm from '@/components/MessageForm';
import QRModal from '@/components/QRModal';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

export default function CreatorPage() {
  const [, params] = useRoute('/page/:username');
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();
  const username = params?.username;

  const { data: creator, isLoading } = useQuery({
    queryKey: ['/api/creator', username],
    queryFn: async () => {
      return await apiRequest(`/api/creator/${username}`, { skipAuth: true });
    },
    enabled: !!username
  });

  const submitMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      return await apiRequest('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          ...messageData,
          creatorUsername: username
        }),
        skipAuth: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/creator', username] });
      toast({
        title: `You bought ${creator?.name?.split(' ')[0]} a chai! ☕`,
        description: 'Thank you for your support!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit message',
        variant: 'destructive'
      });
    }
  });

  const handleBuyClick = () => {
    if (!creator?.upiId) {
      toast({
        title: 'UPI ID not set',
        description: 'This creator hasn\'t set up their UPI ID yet',
        variant: 'destructive'
      });
      return;
    }
    setShowQR(true);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Support ${creator?.name} on Buy Me a Chai`,
        text: `Support me on Buy Me a Chai! ☕`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Page link copied to clipboard',
      });
    }
  };

  const handleMessageSubmit = (data) => {
    submitMessageMutation.mutate({
      supporterName: data.name,
      message: data.message,
      amount: data.amount ? parseFloat(data.amount) : 0
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">☕</div>
          <p>Loading creator page...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Creator not found</h1>
          <p className="text-muted-foreground mb-4">This creator page doesn't exist</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <CreatorProfile 
          name={creator.name}
          bio={creator.bio}
          profilePic={creator.profilePic}
          onBuyClick={handleBuyClick}
          onShareClick={handleShare}
        />

        <div className="mt-12 space-y-8">
          {creator.goals && creator.goals.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold font-display mb-6">Current Goals</h2>
              <div className="grid gap-4">
                {creator.goals.map((goal) => (
                  <GoalCard 
                    key={goal._id}
                    title={goal.title}
                    currentAmount={goal.currentAmount}
                    targetAmount={goal.targetAmount}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <MessageForm 
              creatorName={creator?.name?.split(' ')[0] || 'Creator'}
              onSubmit={handleMessageSubmit}
            />
          </div>
        </div>

        {creator.upiId && (
          <QRModal 
            open={showQR}
            onOpenChange={setShowQR}
            upiId={creator.upiId}
            creatorName={creator.name}
          />
        )}
      </div>
    </div>
  );
}
