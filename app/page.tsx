'use client';

import Header from "./components/Header";
import Carousel from "./components/Carousel";
import Marketplace from "./marketplace";
import Footer from "./components/Footer";

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
