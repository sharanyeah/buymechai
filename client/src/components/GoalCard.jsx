import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pencil } from 'lucide-react';

export default function GoalCard({ title, currentAmount, targetAmount, onEdit }) {
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {onEdit && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onEdit}
            data-testid="button-edit-goal"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-semibold" data-testid="text-current-amount">
            ₹{currentAmount.toLocaleString()}
          </span>
          <span className="text-muted-foreground" data-testid="text-target-amount">
            of ₹{targetAmount.toLocaleString()}
          </span>
        </div>
        <Progress value={percentage} className="h-3" />
        <p className="text-xs text-muted-foreground text-center">
          {percentage.toFixed(0)}% complete
        </p>
      </CardContent>
    </Card>
  );
}
