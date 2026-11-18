import { Bricolage_Grotesque, DM_Mono, Hanken_Grotesk } from 'next/font/google';

export const fontSans = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
});

export const fontSerif = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
});

export const fontCode = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
  preload: false,
});
