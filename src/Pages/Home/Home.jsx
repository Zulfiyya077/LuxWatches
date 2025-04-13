import React from 'react'
import Hero from '../../components/Hero/Hero'
import FeaturedModels from '../../components/FeaturedModels/FeaturedModels'
import CustomerTestimonials from '../../components/Customer/TestimonialSlider'
import NameWatch from '../../components/Brands/NameWatch'
import NewWatches from '../../components/NewWatches/NewWatches'




const Home = ({ darkMode, setDarkMode }) => {
  return (
    <div>
     <Hero />
     < FeaturedModels darkMode={darkMode} setDarkMode={setDarkMode}  />
     {/* <NameWatch /> */}
     <NewWatches />
     <CustomerTestimonials darkMode={darkMode} />
    </div>
  )
}

export default Home