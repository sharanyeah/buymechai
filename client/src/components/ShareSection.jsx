import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2 } from 'lucide-react';
import { SiWhatsapp, SiTelegram, SiX } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';

export default function ShareSection({ username }) {
  const { toast } = useToast();
  const pageUrl = `${window.location.origin}/page/${username}`;
  const shareText = `Support me on Buy Me a Chai! ☕`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast({
      title: 'Copied!',
      description: 'Page link copied to clipboard',
    });
  };

  const handleShareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + pageUrl)}`,
      '_blank'
    );
  };

  const handleShareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
      '_blank'
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Your Page
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={pageUrl} 
            readOnly 
            data-testid="input-page-url"
            className="font-mono text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopyLink}
            data-testid="button-copy-link"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleShareWhatsApp}
            data-testid="button-share-whatsapp"
          >
            <SiWhatsapp className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShareTelegram}
            data-testid="button-share-telegram"
          >
            <SiTelegram className="h-4 w-4 mr-2" />
            Telegram
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShareTwitter}
            data-testid="button-share-twitter"
          >
            <SiX className="h-4 w-4 mr-2" />
            Twitter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
