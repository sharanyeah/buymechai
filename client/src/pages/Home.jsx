import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Coffee, Heart, Target, Share2 } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">☕</span>
            <h1 className="text-2xl font-bold font-display">Buy Me a Chai</h1>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setLocation('/login')}
              data-testid="button-login"
            >
              Login
            </Button>
            <Button 
              onClick={() => setLocation('/login')}
              data-testid="button-signup"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold font-display leading-tight">
              Accept support for your creative work
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let your supporters buy you a chai. Simple, friendly, and powered by UPI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              className="text-lg px-8 rounded-full shadow-lg"
              onClick={() => setLocation('/login')}
              data-testid="button-get-started"
            >
              Start Your Page
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8 rounded-full"
              onClick={() => setLocation('/demo')}
              data-testid="button-view-demo"
            >
              View Demo
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-4 p-6 rounded-2xl bg-card border">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coffee className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-display">Easy Setup</h3>
              <p className="text-muted-foreground">
                Create your page in minutes. Just add your UPI ID and you're ready to receive support.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-card border">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-display">Track Goals</h3>
              <p className="text-muted-foreground">
                Set goals and let your supporters see your progress. Celebrate milestones together.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-card border">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-display">Get Messages</h3>
              <p className="text-muted-foreground">
                Receive heartfelt messages from your supporters. Build a community around your work.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Made with ☕ and ❤️</p>
        </div>
      </footer>
    </div>
  );
}
