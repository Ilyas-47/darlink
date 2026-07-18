import React from 'react';
import Hero from '../../components/shared/Hero';
import Destinations from '../../components/shared/Destinations';
import FeaturedColivings from '../../components/shared/FeaturedColivings';
import CompareSection from '../../components/shared/CompareSection';
import HowItWorks from '../../components/shared/HowItWorks';
import Stats from '../../components/shared/Stats';
import CommunityTypes from '../../components/shared/CommunityTypes';
import Testimonials from '../../components/shared/Testimonials';
import TrustSection from '../../components/shared/TrustSection';
import InteractiveShowcase from '../../components/shared/InteractiveShowcase';

const Home: React.FC = () => {
  return (
    <div className="home-page" style={{ position: 'relative' }}>
      {/* Awwwards Grain Noise Overlay */}
      <div className="noise-overlay" />

      <Hero />
      <Stats />
      <Destinations />
      <InteractiveShowcase />
      <FeaturedColivings />
      <CommunityTypes />
      <Testimonials />
      <CompareSection />
      <TrustSection />
      <HowItWorks />
    </div>
  );
};

export default Home;
