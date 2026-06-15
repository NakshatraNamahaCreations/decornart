import { Plus_Jakarta_Sans } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import PromoBar from "@/components/PromoBar/PromoBar";
import Navbar from "@/components/Navbar/Navbar";
import ServicesStrip from "@/components/ServicesStrip/ServicesStrip";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Decornart — Premium Bouquet Delivery",
  description:
    "Hand-tied seasonal bouquets, composed like still life and delivered the same day.",
};

// Synchronous probe that runs before the body is parsed. If the preloader
// has already played this session, we tag <html> so CSS can hide the
// loader markup before it ever paints.
const preloaderGate = `
try {
  if (sessionStorage.getItem('decornart:preloaded') === '1') {
    document.documentElement.classList.add('decornart-skip-preloader');
  }
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: preloaderGate }} />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SmoothScrollProvider>
                <PromoBar />
                <Navbar />
                {children}
                <ServicesStrip />
                <Footer />
              </SmoothScrollProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
