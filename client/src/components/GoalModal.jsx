import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GoalModal({ open, onOpenChange, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: 0
  });

  // Sync form data when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          targetAmount: initialData.targetAmount?.toString() || '',
          currentAmount: initialData.currentAmount?.toString() || '0'
        });
      } else {
        setFormData({
          title: '',
          targetAmount: '',
          currentAmount: '0'
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {initialData ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
          <DialogDescription>
            Set a goal to track your progress
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                data-testid="input-goal-title"
                placeholder="New Camera Equipment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-amount">Target Amount (₹)</Label>
              <Input
                id="target-amount"
                data-testid="input-target-amount"
                type="number"
                min="1"
                step="any"
                placeholder="50000"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                required
              />
            </div>

            {initialData && (
              <div className="space-y-2">
                <Label htmlFor="current-amount">Current Amount (₹)</Label>
                <Input
                  id="current-amount"
                  data-testid="input-current-amount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Supporter messages with amounts automatically update this
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-goal"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              data-testid="button-save-goal"
            >
              {initialData ? 'Update Goal' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
