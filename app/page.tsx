'use client';

import dynamic from 'next/dynamic';
import Header from "./components/Header";

// Lazy load heavy components for better performance
const Carousel = dynamic(() => import("./components/Carousel"), {
  loading: () => <div className="px-4 py-3 bg-background/50"><div className="glass-card rounded-lg h-48 md:h-64 lg:h-80 animate-pulse" /></div>,
  ssr: true
});
const Marketplace = dynamic(() => import("./marketplace"), {
  loading: () => <div className="p-4"><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="glass-card rounded-lg h-64 animate-pulse" />)}</div></div>,
  ssr: true
});
const Footer = dynamic(() => import("./components/Footer"), {
  ssr: true
});

export default function Home() {

  return (
    <>
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <Carousel />
        <Marketplace />
        <Footer />
      </main>
    </>
  );
}
