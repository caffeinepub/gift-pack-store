import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MessageCardFormProps {
  message: string;
  onMessageChange: (message: string) => void;
}

export default function MessageCardForm({ message, onMessageChange }: MessageCardFormProps) {
  const remainingChars = 200 - message.length;

  return (
    <Card>
      <CardContent className="p-6">
        <div>
          <Label htmlFor="message" className="mb-2 block font-semibold">
            Your Message (Optional)
          </Label>
          <p className="mb-4 text-sm text-muted-foreground">
            Add a personal touch with a heartfelt message that will be included with your gift.
          </p>
          <Textarea
            id="message"
            placeholder="Write your message here... (e.g., 'Happy Birthday! Wishing you all the best on your special day.')"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            maxLength={200}
            rows={6}
            className="resize-none"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {remainingChars} characters remaining
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
