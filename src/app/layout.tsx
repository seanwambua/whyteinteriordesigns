import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Whyte Interior Designs',
  description: 'Transforming Spaces, Elevating Lifestyles: Whyte Interior Designs - Your Partner in Creating Beautiful and Functional Interiors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
