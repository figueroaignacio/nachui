import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Mono, Hanken_Grotesk } from 'next/font/google';

const fontSans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});
const fontMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: { default: 'NachUI Studio', template: '%s · NachUI Studio' },
  description: 'Describe a screen and get it built with NachUI components you can install.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfbf9' },
    { media: '(prefers-color-scheme: dark)', color: '#030303' },
  ],
};

const THEME_SCRIPT = `(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');var a=function(){document.documentElement.classList.toggle('dark',m.matches)};a();m.addEventListener('change',a)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} bg-background text-foreground font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
