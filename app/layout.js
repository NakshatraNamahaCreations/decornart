import { Cormorant_Garamond, Allura, Poppins } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { LoginModalProvider } from "@/components/LoginModal/LoginModalContext";
import LoginModal from "@/components/LoginModal/LoginModal";
import RegisterModal from "@/components/LoginModal/RegisterModal";
import ForgotPasswordModal from "@/components/LoginModal/ForgotPasswordModal";
import PromoBar from "@/components/PromoBar/PromoBar";
import Navbar from "@/components/Navbar/Navbar";
import ServicesStrip from "@/components/ServicesStrip/ServicesStrip";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  display: "swap",
});

export const metadata = {
  title: "Decor N Art — Premium Craft Materials & Supplies",
  description:
    "Bouquet wraps, ribbons, gift cards, pipe cleaners, crochet yarns and home-decor accents — hand-picked craft supplies shipped across India.",
};

// Synchronous probe that runs before the body is parsed. If the preloader
// has already played this session, we tag <html> so CSS can hide the
// loader markup before it ever paints.
const preloaderGate = `
try {
  if (sessionStorage.getItem('Decor N Art:preloaded') === '1') {
    document.documentElement.classList.add('Decor N Art-skip-preloader');
  }
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${poppins.variable} ${allura.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: preloaderGate }} />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LoginModalProvider>
                <SmoothScrollProvider>
                  <PromoBar />
                  <Navbar />
                  {children}
                  {/* <ServicesStrip /> */}
                  <Footer />
                  <LoginModal />
                  <RegisterModal />
                  <ForgotPasswordModal />
                </SmoothScrollProvider>
              </LoginModalProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
