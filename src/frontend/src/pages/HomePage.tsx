import { useNavigate } from '@tanstack/react-router';
import { Gift, Sparkles, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GiftPackCard from '@/components/product/GiftPackCard';
import { useGiftPacks } from '@/hooks/useGiftPacks';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: giftPacks, isLoading } = useGiftPacks();

  const featuredPacks = giftPacks?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-terracotta/10 via-cream to-sage/10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/assets/generated/confetti-background.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Thoughtful Gifts,
              <br />
              <span className="text-terracotta">Delivered with Love</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Discover beautifully curated gift packs or create your own personalized collection. Perfect for every
              occasion, delivered across India.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90" onClick={() => navigate({ to: '/catalog' })}>
                Browse Gift Packs
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/custom' })}>
                Create Custom Pack
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                <Gift className="h-8 w-8 text-terracotta" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Curated Collections</h3>
              <p className="mt-2 text-muted-foreground">
                Handpicked gift items for birthdays, anniversaries, corporate events, and festivals
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage/10">
                <Sparkles className="h-8 w-8 text-sage" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Personalize Your Gift</h3>
              <p className="mt-2 text-muted-foreground">
                Add custom messages and choose from elegant wrapping options
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark/30">
                <Truck className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold">India-Wide Delivery</h3>
              <p className="mt-2 text-muted-foreground">
                Fast and reliable delivery to every corner of India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gift Packs */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Featured Gift Packs</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our most popular collections, perfect for any celebration
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredPacks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPacks.map((pack) => (
                <GiftPackCard key={pack.id} pack={pack} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No gift packs available yet</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/catalog' })}>
              View All Gift Packs
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-terracotta/5 to-sage/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Can't Find the Perfect Gift?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Create your own custom gift pack with items you choose
          </p>
          <Button size="lg" className="mt-8 bg-sage hover:bg-sage/90" onClick={() => navigate({ to: '/custom' })}>
            Build Your Custom Pack
          </Button>
        </div>
      </section>
    </div>
  );
}
