import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MessageCard({ supporterName, message, amount, timestamp }) {
  const initials = supporterName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Date(timestamp).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold" data-testid="text-supporter-name">
                {supporterName}
              </p>
              {amount && (
                <span className="text-sm font-semibold text-primary" data-testid="text-amount">
                  ₹{amount}
                </span>
              )}
            </div>
            {message && (
              <p className="text-sm text-foreground" data-testid="text-message">
                {message}
              </p>
            )}
            <p className="text-xs text-muted-foreground" data-testid="text-timestamp">
              {formattedDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
