'use client';

import Header from './sections/Header';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import DemoSection from './sections/DemoSection';
import Footer from './sections/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

