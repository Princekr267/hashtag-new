import React from 'react';
import Hero from '../components/Hero/Hero';
import StatsBanner from '../components/StatsBanner';
import About from '../components/About/About';
import Events from '../components/Events/Events';
import Team from '../components/Team/Team';
import Blogs from '../components/Blogs/Blogs';
import Alumni from '../components/Alumni/Alumni';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <StatsBanner />
      <About />
      <Events />
      <Team />
      <Blogs />
      <Alumni />
    </main>
  );
};

export default HomePage;
