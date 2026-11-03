import { Montserrat } from "next/font/google";
import Script from "next/script";  // ← new import added
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-78LKVWKSRW";

export const metadata = {
  title: "Shelley Evelyn Real Estate - Your Trusted Real Estate Partner",
  description: "Shelley Evelyn Real Estate - Find your dream home",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${montserrat.variable} antialiased`}
    >
      <body
        className="min-h-screen bg-[#0a1628] text-white font-sans antialiased"
        suppressHydrationWarning
      >
        {/* ========== GOOGLE ANALYTICS (GA4) ========== */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {/* ========== END GOOGLE ANALYTICS ========== */}

        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}