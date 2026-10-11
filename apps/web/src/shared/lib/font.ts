import { Geist, Geist_Mono, Schibsted_Grotesk } from 'next/font/google';

export const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const fontHeading = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
});

export const fontSerif = Geist({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
});

export const fontCode = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: false,
});
