import { Heart } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'giftpack-store';

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">GiftPack Store</h3>
            <p className="text-sm text-muted-foreground">
              Thoughtful gifts delivered with love across India. Curated collections and custom packs for every
              occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  Home
                </a>
              </li>
              <li>
                <a href="/catalog" className="text-muted-foreground transition-colors hover:text-foreground">
                  Browse Gifts
                </a>
              </li>
              <li>
                <a href="/custom" className="text-muted-foreground transition-colors hover:text-foreground">
                  Custom Pack
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery Info */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Delivery</h3>
            <p className="text-sm text-muted-foreground">
              We deliver across India within 5-7 business days. Free shipping on orders above ₹2,000.
            </p>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="X (Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} GiftPack Store. All rights reserved.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 fill-terracotta text-terracotta" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
