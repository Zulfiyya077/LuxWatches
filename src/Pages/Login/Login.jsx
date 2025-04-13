import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from './Login.module.css';
import supabase from '../../supabaseClient';

const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // Get email from state if available (from registration)
  const initialEmail = location.state?.email || '';
  const initialMessage = location.state?.message || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(initialMessage);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Clear message after 5 seconds
    if (initialMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [initialMessage]);

  const loadUser = async (userId) => {
    try {
      const { data: cartData } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: wishlistData } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', userId)
        .single();

      localStorage.setItem('userCart', JSON.stringify(cartData || {}));
      localStorage.setItem('userWishlist', JSON.stringify(wishlistData || {}));
    } catch (err) {
      console.error('Səbət və ya istək siyahısı yüklənmədi:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Get username from user metadata
      const username = data.user.user_metadata?.username;
      
      if (username) {
        // Store username in localStorage for use in the header
        localStorage.setItem('userName', username);
      } else {
        // Fallback to profiles table if metadata doesn't have username
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, role')
          .eq('id', data.user.id)
          .single();

        if (profileData && profileData.first_name) {
          localStorage.setItem('userName', profileData.first_name);
          localStorage.setItem('userRole', profileData.role || 'user');
        }
      }

      setSuccessMessage(t('login.successMessage') || 'Uğurla daxil oldunuz!');
      await loadUser(data.user.id);

      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error) {
      let errorMessage = t('login.generalError') || 'Giriş zamanı xəta baş verdi';
      
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('Invalid login') || error.message.includes('Invalid email')) {
          errorMessage = t('login.invalidCredentials') || 'Yanlış e-poçt və ya şifrə';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = () => {
    navigate('/forgot-password');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>{t('common.companyName.luxury') || 'Luxury'}</span>
            <span className={styles.logoAccent}>{t('common.companyName.shop') || 'Shop'}</span>
          </div>
          
          <h1 className={styles.title}>{t('login.title') || 'Daxil ol'}</h1>
          
          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">{t('login.email') || 'E-poçt'}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder') || 'E-poçt ünvanınızı daxil edin'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <span className={styles.inputIcon}>
                  <FaEnvelope />
                </span>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">{t('login.password') || 'Şifrə'}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.passwordPlaceholder') || 'Şifrənizi daxil edin'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <span 
                  className={styles.inputIcon} 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className={styles.forgotPassword}>
                <span onClick={forgotPassword}>{t('login.forgotPassword') || 'Şifrəni unutmusan?'}</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={loading}
            >
              {loading ? (
                <div className={styles.loadingIndicator}>
                  <span>{t('common.loading') || 'Yüklənir'}</span>
                  <span className={styles.loadingDots}>...</span>
                </div>
              ) : (
                t('login.submitButton') || 'Daxil ol'
              )}
            </button>
          </form>
          
          <div className={styles.registerPrompt}>
            <p>{t('login.noAccount') || 'Hesabınız yoxdur?'}</p>
            <span 
              onClick={() => navigate('/register')} 
              className={styles.registerLink}
            >
              {t('login.registerLink') || 'Qeydiyyatdan keçin'}
            </span>
          </div>
        </div>
        
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <h2>{t('login.bannerTitle') || 'Arxayın al!'}</h2>
            <div className={styles.separator}></div>
            <p>{t('login.bannerSubtitle') || 'Məhsulun dəyişdirmə və geri qaytarma müddəti 30 günə uzandı.'}</p>
            
            <ul className={styles.benefitsList}>
              <li>
                <span className={styles.benefitIcon}>🔒</span>
                <span>{t('login.benefits.secureAccount') || 'Təhlükəsiz hesab'}</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>📦</span>
                <span>{t('login.benefits.orderHistory') || 'Sifariş tarixçəsi'}</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>⚡</span>
                <span>{t('login.benefits.quickCheckout') || 'Sürətli alış-veriş'}</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>💫</span>
                <span>{t('login.benefits.exclusiveOffers') || 'Eksklüziv təkliflər'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;