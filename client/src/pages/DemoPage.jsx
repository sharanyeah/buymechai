import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import CreatorProfile from '@/components/CreatorProfile';
import GoalCard from '@/components/GoalCard';
import MessageCard from '@/components/MessageCard';

export default function DemoPage() {
  const [, setLocation] = useLocation();

  const demoMessages = [
    {
      _id: '1',
      supporterName: 'Rahul Kumar',
      message: 'Love your content! Keep it up! 🎉',
      amount: 100,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: '2',
      supporterName: 'Priya Singh',
      message: 'Your work inspires me every day',
      amount: 50,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: '3',
      supporterName: 'Amit Patel',
      message: 'Thanks for all the amazing tutorials!',
      amount: 200,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const demoCreator = {
    name: 'Demo Creator',
    username: 'democreator',
    bio: 'Content creator, developer, and educator. Creating tutorials and sharing knowledge with the community. Your support helps me create more free content!',
    upiId: '9876543210@paytm',
    profilePic: ''
  };

  const demoGoals = [
    {
      _id: '1',
      title: 'New Camera Equipment',
      currentAmount: 3500,
      targetAmount: 10000
    },
    {
      _id: '2',
      title: 'Online Course Production',
      currentAmount: 8000,
      targetAmount: 8000
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <h1 className="text-xl font-bold font-display">Buy Me a Chai</h1>
          </div>
          <Button 
            variant="default"
            onClick={() => setLocation('/login')}
            data-testid="button-create-yours"
          >
            Create Your Page
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
          <p className="text-sm">
            🎬 <strong>Demo Mode:</strong> This is a preview of what your creator page could look like. Sign up to create your own!
          </p>
        </div>

        <div className="space-y-8">
          <CreatorProfile
            name={demoCreator.name}
            username={demoCreator.username}
            bio={demoCreator.bio}
            upiId={demoCreator.upiId}
          />

          <div>
            <h3 className="text-2xl font-bold font-display mb-4">Goals</h3>
            <div className="space-y-4">
              {demoGoals.map((goal) => (
                <GoalCard
                  key={goal._id}
                  title={goal.title}
                  currentAmount={goal.currentAmount}
                  targetAmount={goal.targetAmount}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold font-display mb-4">Recent Messages</h3>
            <div className="space-y-4">
              {demoMessages.map((message) => (
                <MessageCard
                  key={message._id}
                  supporterName={message.supporterName}
                  message={message.message}
                  amount={message.amount}
                  timestamp={message.createdAt}
                />
              ))}
            </div>
          </div>

          <div className="text-center p-8 bg-card border rounded-lg">
            <h3 className="text-2xl font-bold font-display mb-2">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6">
              Create your own page and start receiving support from your community
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation('/login')}
              className="px-8"
              data-testid="button-get-started-demo"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
