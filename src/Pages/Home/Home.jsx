import React from "react";
import Hero from "../../components/Hero/Hero";
import FeaturedModels from "../../components/FeaturedModels/FeaturedModels";
import CustomerTestimonials from "../../components/Customer/TestimonialSlider";
import NewWatches from "../../components/NewWatches/NewWatches";
import RolexMarquee from "../../components/WatchesName/WatchesName";

const Home = ({ darkMode, setDarkMode }) => {
  return (
    <div>
      <Hero />
      <FeaturedModels darkMode={darkMode} setDarkMode={setDarkMode} />
      <NewWatches />
      <CustomerTestimonials darkMode={darkMode} />
      <RolexMarquee />
    </div>
  );
};

export default Home;
