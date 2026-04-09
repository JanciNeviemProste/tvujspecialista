import '@/styles/globals.css';
import {
  Plus_Jakarta_Sans,
  Instrument_Serif,
  Geist,
  Geist_Mono,
  Fraunces,
  Inter_Tight,
  Space_Grotesk,
  Space_Mono,
  Inter,
} from 'next/font/google';
import { Metadata } from 'next';

// V1 — Trusted Authority
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// V2 — Modern Tech (Geist)
const geistSans = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-v2-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-v2-mono',
  display: 'swap',
});

// V3 — Quiet Luxury & V5 — Print Editorial (Fraunces)
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-serif',
  axes: ['opsz', 'SOFT'],
  display: 'swap',
});

// V3 — Quiet Luxury (Inter Tight body)
const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-v3-sans',
  display: 'swap',
});

// V4 — Bold Fintech (Space Grotesk)
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-v4-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-v4-mono',
  weight: ['400', '700'],
  display: 'swap',
});

// V5 — Print Editorial body (Inter)
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-v5-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tvujspecialista.cz'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${interTight.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||((!t)&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();` }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
