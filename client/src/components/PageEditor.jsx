import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PageEditor({ initialData, onSave }) {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bio: initialData?.bio || '',
    upiId: initialData?.upiId || '',
    profilePic: initialData?.profilePic || '',
    ...initialData
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, profilePic: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(formData);
  };

  const upiLink = formData.upiId 
    ? `upi://pay?pa=${formData.upiId}&pn=${encodeURIComponent(formData.name || 'Creator')}&cu=INR`
    : '';

  const initials = formData.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-display">Edit Your Page</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={formData.profilePic} alt={formData.name} />
                  <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                </Avatar>
                {formData.profilePic && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                    onClick={handleRemovePhoto}
                    data-testid="button-remove-photo"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-photo"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {formData.profilePic ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="input-profile-photo"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended: Square image, max 5MB
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    data-testid="input-bio"
                    placeholder="Tell people about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    data-testid="input-upi-id"
                    placeholder="yourname@upi"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>QR Code Preview</Label>
                <div className="flex justify-center">
                  {upiLink ? (
                    <div className="bg-white p-4 rounded-2xl shadow-inner">
                      <QRCodeSVG 
                        value={upiLink} 
                        size={200}
                        level="H"
                      />
                    </div>
                  ) : (
                    <div className="bg-secondary rounded-2xl p-8 text-center text-muted-foreground">
                      Enter UPI ID to see QR code
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              size="lg"
              data-testid="button-save-page"
            >
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="outline"
              size="lg"
              onClick={() => window.location.reload()}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
