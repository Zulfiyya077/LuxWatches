import React, { useContext, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./TestimonialSlider.module.css";
import { ThemeContext } from "../../context/ThemeContext";

const TestimonialSlider = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext); 
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const timeoutRef = useRef(null);

  const testimonials = [
    {
      name: t("customer2Name"),
      position: t("customerPosition"),
      feedback: t("customer1Feedback"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/woman.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvd29tYW4uanBnIiwiaWF0IjoxNzQ2OTQ2MzQyLCJleHAiOjE3Nzg0ODIzNDJ9.ZIqUvOSNT8SDWFygsTRgxKriMw-FqoQlP967H_Yjefw",
      rating: 5,
    },
    {
      name: t("customer1Name"),
      position: t("customer2Position"),
      feedback: t("customer2Feedback"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/man1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvbWFuMS5qcGciLCJpYXQiOjE3NDY5NDY2MDksImV4cCI6MTc0NzU1MTQwOX0.9Jx-owcWJTPLpkPL-0lPJFjOR0GNIf47NFBpkJyPsDU",
      rating: 5,
    },
    {
      name: t("customer3Name"),
      position: t("customer3Position"),
      feedback: t("customer3Feedback"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/MAN2.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvTUFOMi53ZWJwIiwiaWF0IjoxNzQ2OTQ2NjQ2LCJleHAiOjE3Nzg0ODI2NDZ9.N5d4SgbQL4tESnGCqExTFGuniGXmofRLCB8AGhWghK4",
      rating: 4,
    },
    {
      name: t("customer4Name"),
      position: t("customer4Position"),
      feedback: t("customer4Feedback"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/women.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvd29tZW4ud2VicCIsImlhdCI6MTc0Njk0NjQ2MywiZXhwIjoxNzc4NDgyNDYzfQ.Gojmi5_I2LvtQHVvQ8TidMRFkvsQJIt5K59AifI3dSk",
     
      rating: 5,
    },
  ];

  
  const rolexVideo = {
    src: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/videos/testimonialvideo.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvdGVzdGltb25pYWx2aWRlby5tcDQiLCJpYXQiOjE3NDYzMDA5NDYsImV4cCI6MTc3NzgzNjk0Nn0.-n5qYCxfohttAQFaKmYMhC4mnWpULoqFF8TulDY87kI",
  
  };

  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 2000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [isAutoplay, testimonials.length]);

  const pauseAutoplay = () => {
    setIsAutoplay(false);
    clearTimeout(timeoutRef.current);
  };

  const resumeAutoplay = () => {
    timeoutRef.current = setTimeout(() => setIsAutoplay(true), 10000);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
    pauseAutoplay();
    resumeAutoplay();
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    pauseAutoplay();
    resumeAutoplay();
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    pauseAutoplay();
    resumeAutoplay();
  };

  return (
    <section
      className={`${styles.sectionContainer} ${theme === 'dark' ? styles.dark : styles.light}`}
    >
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t("customerTestimonials")}</h2>
        
        <div className={styles.testimonialLayout}>
         
          <div className={styles.videoContainer}>
            <video 
              className={styles.video} 
              src="https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/videos/testimonialvideo.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvdGVzdGltb25pYWx2aWRlby5tcDQiLCJpYXQiOjE3NDYzMTAyODQsImV4cCI6MTc3Nzg0NjI4NH0.cUixj-PvQFXEFKsAY0uPRCoOT3JMdjtT0urCG6eG7DI"
              autoPlay 
              muted 
              loop 
              playsInline
            ></video>
            <div className={styles.videoOverlay}>
              <h3 className={styles.videoTitle}>{rolexVideo.title}</h3>
              <p className={styles.videoSubtitle}>{rolexVideo.subtitle}</p>
            </div>
          </div>
          
         
          <div 
            className={styles.sliderContainer}
            onMouseEnter={pauseAutoplay}
            onMouseLeave={resumeAutoplay}
          >
            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className={styles.slide}>
                  <div className={`${styles.testimonialCard} ${theme === 'dark' ? styles.darkCard : styles.lightCard}`}> 
                    <p className={styles.customerFeedback}>{testimonial.feedback}</p>
                    <div className={styles.customerInfo}>
                      <img src={testimonial.imgSrc} alt={testimonial.name} className={styles.customerImage} />
                      <div>
                        <h3 className={styles.customerName}>{testimonial.name}</h3>
                        <p className={styles.customerPosition}>{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.navButton} onClick={goToPrev}>◀</button>
            <button className={styles.navButton} onClick={goToNext}>▶</button>
          </div>
        </div>
        
        <div className={styles.indicators}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === activeIndex ? styles.activeIndicator : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;