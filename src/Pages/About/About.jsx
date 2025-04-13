import React, { useState } from "react";
import AboutSection from "../../components/About/AboutSection";
import OurTeam from "../../components/OurTeam/OurTeam";


const AboutPage = ({ darkMode }) => {
  return (
    <div>
      <AboutSection darkMode={darkMode} />
      <OurTeam darkMode={darkMode} />
   
    </div>
  );
};

export default AboutPage;
