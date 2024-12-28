import React from 'react';
import { Navbar } from './Navigation/Navbar';
import { HeroSection } from './Sections/HeroSection';
import { FeaturesSection } from './Sections/FeaturesSection';
import { TestimonialsSection } from './Sections/TestimonialsSection';
import { CTASection } from './Sections/CTASection';
import { Footer } from './Sections/Footer';

export function ModernLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}