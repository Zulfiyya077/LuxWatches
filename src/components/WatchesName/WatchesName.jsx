// WatchesMarquee.jsx
import React, { useContext, useState, useRef } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './WatchesName.module.css';

const WatchesMarquee = () => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const [hoveredModelId, setHoveredModelId] = useState(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  

  const rolexModels = [
    { 
      id: 1, 
      name: 'Rolex Submariner', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/submarine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvc3VibWFyaW5lLnBuZyIsImlhdCI6MTc0NDY5OTM4OCwiZXhwIjoxNzc2MjM1Mzg4fQ.BKNhr4LKzc4O58YhD_DSdPn9dA28RxFMaKy_UNHsHZw',
      productId: '1'
    },
    { 
      id: 2, 
      name: 'Rolex Daytona', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/rose.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvcm9zZS53ZWJwIiwiaWF0IjoxNzQ0MTk0MjkwLCJleHAiOjE3NzU3MzAyOTB9.5MZD6q3sxtrl2KqcZ7PictL1m11qkaF9ka-7MXW-6hQ',
      productId: '8'
    },
    { 
      id: 3, 
      name: 'Rolex GMT-Master II', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/gmt.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZ210LmF2aWYiLCJpYXQiOjE3NDQ3MDA4NzQsImV4cCI6MTc3NjIzNjg3NH0.EUrL7PNhfR8P_u2HBENISw9E_MoxGATFcNlfEJ434UA',
      productId: '5'
    },
    { 
      id: 4, 
      name: 'Rolex Datejust', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/datejust.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZGF0ZWp1c3QucG5nIiwiaWF0IjoxNzQ0MTQ3MDk4LCJleHAiOjE3NDY3MzkwOTh9.nFiRLrpyfsS1NJAtcOmiPn7DKz944B7NllhUXIpLn8k',
      productId: '3'
    },
    { 
      id: 5, 
      name: 'Rolex Day-Date', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/daydate.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZGF5ZGF0ZS5hdmlmIiwiaWF0IjoxNzQ0MTQ3MDgyLCJleHAiOjE3NDY3MzkwODJ9.1B-lO6rzKNSptowJqqGjudoe2A2-byhZakg4s-xFzYM',
      productId: '2'
    },
    { 
      id: 6, 
      name: 'Rolex Sea-Dweller', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/sead.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvc2VhZC5wbmciLCJpYXQiOjE3NDQxOTc5NjksImV4cCI6MTc3NTczMzk2OX0.mLkOud0qMOYsree-gq5Shh-J20UeHsDVXRlyzoquoks',
      productId: '10'
    },
    { 
      id: 7, 
      name: 'Rolex Explorer', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/submarine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvc3VibWFyaW5lLnBuZyIsImlhdCI6MTc0NDY5OTM4OCwiZXhwIjoxNzc2MjM1Mzg4fQ.BKNhr4LKzc4O58YhD_DSdPn9dA28RxFMaKy_UNHsHZw',
      productId: '7'
    },
    { 
      id: 8, 
      name: 'Rolex Yacht-Master', 
      image: 'https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/submarine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvc3VibWFyaW5lLnBuZyIsImlhdCI6MTc0NDY5OTM4OCwiZXhwIjoxNzc2MjM1Mzg4fQ.BKNhr4LKzc4O58YhD_DSdPn9dA28RxFMaKy_UNHsHZw',
      productId: '8'
    }
  ];

  const navigateToProduct = (productId) => {
    window.location.href = `/products/${productId}`;
  };

  return (
    <div 
      className={`${styles.container} ${theme === 'dark' ? styles.containerDark : ''}`}
      onMouseEnter={() => setIsMarqueePaused(true)}
      onMouseLeave={() => {
        setIsMarqueePaused(false);
        setHoveredModelId(null);
      }}
    >
      <div className={styles.marqueeContainer}>
    
        <div className={`${styles.marquee} ${isMarqueePaused ? styles.paused : ''}`}>
          <div className={styles.marqueeInner}>
          
            {rolexModels.map((model) => (
              <div 
                key={`original-${model.id}`}
                className={`${styles.watchItem} ${hoveredModelId === model.id ? styles.active : ''} ${theme === 'dark' ? styles.watchItemDark : ''}`}
                onMouseEnter={() => setHoveredModelId(model.id)}
                onClick={() => navigateToProduct(model.productId)}
              >
                <span className={styles.watchName}>{model.name}</span>
              </div>
            ))}
            {rolexModels.map((model) => (
              <div 
                key={`duplicate-${model.id}`}
                className={`${styles.watchItem} ${hoveredModelId === model.id ? styles.active : ''} ${theme === 'dark' ? styles.watchItemDark : ''}`}
                onMouseEnter={() => setHoveredModelId(model.id)}
                onClick={() => navigateToProduct(model.productId)}
              >
                <span className={styles.watchName}>{model.name}</span>
              </div>
            ))}
          </div>
        </div>
        {hoveredModelId && (
          <div className={styles.previewContainer}>
            <img 
              src={rolexModels.find(model => model.id === hoveredModelId)?.image}
              alt={rolexModels.find(model => model.id === hoveredModelId)?.name}
              className={styles.previewImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="250" height="200" viewBox="0 0 250 200"><rect width="250" height="200" fill="%23d4af37"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="white">Rolex</text></svg>';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchesMarquee;