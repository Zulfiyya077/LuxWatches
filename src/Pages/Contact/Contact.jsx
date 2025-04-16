import React, { useState, useEffect, useContext } from 'react';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import styles from './Contact.module.css';
import { ThemeContext } from '../../context/ThemeContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = () => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const darkMode = theme === 'dark';
  
  const [activeLocation, setActiveLocation] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  
  const storeLocations = [
    {
      id: 1,
      name: t('stores.baku.name'),
      address: t('stores.baku.address'),
      phone: "+994 12 555 55 55",
      hours: t('stores.baku.hours'),
      coordinates: [40.3777, 49.8559] 
    },
    {
      id: 2,
      name: t('stores.istanbul.name'),
      address: t('stores.istanbul.address'),
      phone: "+90 212 123 45 67",
      hours: t('stores.istanbul.hours'),
      coordinates: [41.0082, 28.9784]
    },
    {
      id: 3,
      name: t('stores.london.name'),
      address: t('stores.london.address'),
      phone: "+44 20 1234 5678",
      hours: t('stores.london.hours'),
      coordinates: [51.5074, -0.1278]
    },
    {
      id: 4,
      name: t('stores.dubai.name'),
      address: t('stores.dubai.address'),
      phone: "+971 4 123 4567",
      hours: t('stores.dubai.hours'),
      coordinates: [25.2048, 55.2708]
    }
  ];

  useEffect(() => {
    setSelectedStore(storeLocations[activeLocation]);
  }, [activeLocation]);

  useEffect(() => {
    // Update store locations when language changes
    setSelectedStore(storeLocations[activeLocation]);
  }, [i18n.language]);

  // Hide notification after 5 seconds
  useEffect(() => {
    let timer;
    if (notification.show) {
      timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    }
    
    return () => clearTimeout(timer);
  }, [notification.show]);

  const handleMarkerClick = (store) => {
    const index = storeLocations.findIndex(s => s.id === store.id);
    setActiveLocation(index);
    setSelectedStore(store);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Form validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setNotification({
        show: true,
        type: 'error',
        message: t('formValidationError')
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success notification
      setNotification({
        show: true,
        type: 'success',
        message: t('messageSentSuccess')
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      // Error notification
      setNotification({
        show: true,
        type: 'error',
        message: t('messageSentError')
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createMarkerIcon = (isActive) => {
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `<div style="
        width: ${isActive ? '40px' : '30px'};
        height: ${isActive ? '40px' : '30px'};
        background-color: ${darkMode ? '#f2d571' : '#d4af37'};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        transform: ${isActive ? 'scale(1.2)' : 'scale(1)'};
        transition: all 0.3s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      iconSize: [isActive ? 40 : 30, isActive ? 40 : 30],
      iconAnchor: [isActive ? 20 : 15, isActive ? 40 : 30]
    });
  };

  const mapStyleUrl = darkMode ? 
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png' : 
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  const mapAttribution = darkMode ?
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' :
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const getMapCenter = () => {
    if (selectedStore) {
      return selectedStore.coordinates;
    }
    return [30, 20];
  };

  return (
    <section className={`${styles.contactSection} ${styles[darkMode ? 'dark' : 'light']}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t('contactUs')}</h2>
        <p className={styles.sectionDescription}>{t('contactDescription')}</p>

        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <h3>{t('contactNumber')}</h3>
            <div className={styles.contactItemContent}>
              <Phone size={18} className={styles.contactIcon} />
              <div>
                <p>+994 12 123 45 67</p>
                <p>+994 50 123 45 67</p>
              </div>
            </div>
          </div>

          <div className={styles.contactItem}>
            <h3>{t('email')}</h3>
            <div className={styles.contactItemContent}>
              <Mail size={18} className={styles.contactIcon} />
              <div>
                <p>info@sizinbrand.az</p>
                <p>support@sizinbrand.az</p>
              </div>
            </div>
          </div>

          <div className={styles.contactItem}>
            <h3>{t('workingHours')}</h3>
            <div className={styles.contactItemContent}>
              <Clock size={18} className={styles.contactIcon} />
              <div>
                <p>{t('workingHoursWeekdays', { start: '09:00', end: '18:00' })}</p>
                <p>{t('workingHoursSaturday', { start: '10:00', end: '16:00' })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>{t('sendMessage')}</h3>
          
          {/* Form Notification */}
          {notification.show && (
            <div className={`${styles.formNotification} ${styles[notification.type]}`}>
              {notification.message}
            </div>
          )}
          
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.formInput} 
              placeholder={t('name')} 
              required 
            />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.formInput} 
              placeholder={t('emailAddress')} 
              required 
            />
            <input 
              type="text" 
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={styles.formInput} 
              placeholder={t('subject')} 
              required 
            />
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={styles.formInput} 
              placeholder={t('phoneNumber')} 
            />
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={styles.formTextarea} 
              placeholder={t('message')} 
              required
            ></textarea>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('sending') : t('send')}
            </button>
          </form>
        </div>

        <div className={styles.storeSection}>
          <h3 className={styles.storeSectionTitle}>{t('ourStores')}</h3>
          <p className={styles.storeSectionDescription}>{t('storesDescription')}</p>
          
          <div className={styles.mapContainer}>
            <MapContainer 
              center={getMapCenter()} 
              zoom={selectedStore ? 12 : 2}
              style={{ width: '100%', height: '100%', borderRadius: '15px' }}
              whenCreated={(map) => {
                setMapLoaded(true);
              }}
            >
              <TileLayer
                attribution={mapAttribution}
                url={mapStyleUrl}
              />
              
              {storeLocations.map((store, index) => (
                <Marker
                  key={store.id}
                  position={store.coordinates}
                  icon={createMarkerIcon(activeLocation === index)}
                  eventHandlers={{
                    click: () => {
                      handleMarkerClick(store);
                    },
                  }}
                >
                  <Popup>
                    <div className={styles.markerInfoWindow} style={{ 
                      padding: '10px', 
                      maxWidth: '250px',
                      borderRadius: '8px'
                    }}>
                      <h4 style={{ color: '#d4af37', marginBottom: '8px', fontSize: '16px' }}>{store.name}</h4>
                      <p style={{ fontSize: '14px', marginBottom: '5px', color: '#555' }}>{store.address}</p>
                      <p style={{ fontSize: '14px', marginBottom: '5px', color: '#555' }}>{store.phone}</p>
                      <p style={{ fontSize: '14px', color: '#555' }}>{store.hours}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className={styles.storeLocations}>
            {storeLocations.map((store, index) => (
              <div 
                key={store.id} 
                className={`${styles.storeLocation} ${activeLocation === index ? styles.activeLocation : ''}`}
                onClick={() => setActiveLocation(index)}
              >
                <div className={styles.storeLocationHeader}>
                  <h4>{store.name}</h4>
                  <MapPin size={16} className={styles.locationPin} />
                </div>
                <p className={styles.storeAddress}>{store.address}</p>
                <p className={styles.storePhone}>{store.phone}</p>
                <p className={styles.locationHours}>
                  <Clock size={14} className={styles.clockIcon} />
                  {store.hours}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;