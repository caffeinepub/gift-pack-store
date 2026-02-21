import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { validatePhone } from '@/utils/validation';
import { useContactForm } from '@/hooks/useContactForm';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const { mutate: submitContact, isPending, isSuccess, isError, error } = useContactForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    submitContact(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have a question or need assistance? We'd love to hear from you.
          </p>
        </div>

        {isSuccess && (
          <Alert className="mb-6 border-sage bg-sage/10">
            <CheckCircle2 className="h-4 w-4 text-sage" />
            <AlertTitle>Message Sent Successfully!</AlertTitle>
            <AlertDescription>
              Thank you for contacting us. We'll get back to you as soon as possible.
            </AlertDescription>
          </Alert>
        )}

        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to send message. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll respond within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter your full name"
                  disabled={isPending}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="your.email@example.com"
                  disabled={isPending}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone', {
                    validate: (value) =>
                      !value || validatePhone(value) || 'Invalid phone number (10 digits required)',
                  })}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  disabled={isPending}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message *
                </Label>
                <Textarea
                  id="message"
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                  placeholder="Tell us how we can help you..."
                  rows={6}
                  disabled={isPending}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="mt-8 rounded-lg border bg-muted/30 p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold">Other Ways to Reach Us</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Email:</strong> support@giftpackstore.com
            </p>
            <p>
              <strong className="text-foreground">Phone:</strong> +91 1800-123-4567 (Mon-Sat, 9 AM - 6 PM)
            </p>
            <p>
              <strong className="text-foreground">Address:</strong> GiftPack Store, 123 Gift Street, New Delhi, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
