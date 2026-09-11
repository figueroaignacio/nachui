import { Geist, Geist_Mono } from 'next/font/google';

export const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const fontHeading = Geist({
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
