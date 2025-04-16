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
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/woman.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvd29tYW4uanBnIiwiaWF0IjoxNzQ0MTkxMDU2LCJleHAiOjE3NDY3ODMwNTZ9.Wo9Icqhf43ZU8YWLZTc8L-GfclyB5E3ryn7pX4WBi3E",
      rating: 5,
    },
    {
      name: t("customer1Name"),
      position: t("customer2Position"),
      feedback: t("customer2Feedback"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/man1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvbWFuMS5qcGciLCJpYXQiOjE3NDQxOTEwOTYsImV4cCI6MTc0Njc4MzA5Nn0.kxjHV_i-NU3SEN8itv9GqkexurN2cpvQeDLZ91XyowY",
      rating: 5,
    },
    {
      name: t("customer3Name"),
      position: t("customer3Position"),
      feedback: t("customer3Feedback"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/man.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvbWFuLmpwZyIsImlhdCI6MTc0NDE5MTIyMSwiZXhwIjoxNzQ2NzgzMjIxfQ.wjvEn_2QEqzMNjfDtzTmI9szhrhgBNK2v9Y0WL_YOFA",
      rating: 4,
    },
    {
      name: t("customer4Name"),
      position: t("customer4Position"),
      feedback: t("customer4Feedback"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/women.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvd29tZW4ud2VicCIsImlhdCI6MTc0NDE5MTI3NywiZXhwIjoxNzQ2NzgzMjc3fQ.8iKFISJ3H1ZU1ePV7DHd1WVwfRrCKKmKPviLkDHzF9o",
      rating: 5,
    },
  ];

  
  const rolexVideo = {
    src: "/videos/Rolex new watches 2025 – Once upon a first time (1).mp4",
  
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
              src={rolexVideo.src} 
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