import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function MessageForm({ creatorName, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    amount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Message form submitted:', formData);
    onSubmit?.(formData);
    setFormData({ name: '', message: '', amount: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-display">
          Leave a message for {creatorName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supporter-name">Your Name</Label>
            <Input
              id="supporter-name"
              data-testid="input-supporter-name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              data-testid="input-message"
              placeholder="Say something nice..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (optional)</Label>
            <Input
              id="amount"
              data-testid="input-amount"
              type="number"
              placeholder="100"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            data-testid="button-submit-message"
          >
            Submit Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
