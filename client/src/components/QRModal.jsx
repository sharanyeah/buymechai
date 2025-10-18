import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QRModal({ open, onOpenChange, upiId, creatorName }) {
  const { toast } = useToast();
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(creatorName)}&cu=INR`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: 'Copied!',
      description: 'UPI ID copied to clipboard',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiLink);
    toast({
      title: 'Copied!',
      description: 'UPI link copied to clipboard',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center">
            Buy {creatorName} a Chai ☕
          </DialogTitle>
          <DialogDescription className="text-center">
            Scan the QR code or copy the UPI ID to make a payment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-inner">
              <QRCodeSVG 
                value={upiLink} 
                size={256}
                level="H"
                data-testid="qr-code"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-secondary rounded-xl px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
                <p className="font-mono text-sm" data-testid="text-upi-id">{upiId}</p>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopyUPI}
                data-testid="button-copy-upi"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCopyLink}
                data-testid="button-copy-link"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy UPI Link
              </Button>
              <Button 
                variant="default"
                className="flex-1"
                onClick={() => window.open(upiLink, '_blank')}
                data-testid="button-open-upi"
              >
                Open UPI App
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Suggested amounts: ₹50 · ₹100 · ₹200
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
