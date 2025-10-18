import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export default function CreatorProfile({ 
  name, 
  bio, 
  profilePic, 
  onBuyClick, 
  onShareClick 
}) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          {profilePic ? (
            <AvatarImage src={profilePic} alt={name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold font-display">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <div>
        <h1 className="text-4xl font-bold font-display mb-2" data-testid="text-creator-name">
          {name}
        </h1>
        {bio && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-creator-bio">
            {bio}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <Button 
          size="lg" 
          className="text-lg px-8 rounded-full shadow-lg"
          onClick={onBuyClick}
          data-testid="button-buy-chai"
        >
          ☕ Buy me a Chai
        </Button>
        {onShareClick && (
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full"
            onClick={onShareClick}
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
