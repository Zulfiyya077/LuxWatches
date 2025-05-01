import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.css';
import supabase from '../../supabaseClient';
import { ThemeContext } from '../../context/ThemeContext';

const ADMIN_EMAIL = "mammadli.zulfiyya77@gmail.com";

const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const initialEmail = location.state?.email || '';
  const initialMessage = location.state?.message || '';
  
  const from = location.state?.from?.pathname || "/";
  
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userAlreadyLoggedIn, setUserAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setUserAlreadyLoggedIn(true);
        showInfoToast(t('login.alreadyLoggedIn') || 'Artıq bir istifadəçi daxil olub. Zəhmət olmasa əvvəlcə çıxış edin.');
      }
    };
    
    checkLoggedInStatus();
  }, [t]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const showSuccessToast = (message) => {
    toast.dismiss();
    toast.success(message, {
      position: "bottom-right",
      autoClose: 2000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: styles.successToast,
      progressClassName: styles.successToastProgress,
      closeButton: true,
    });
  };

  const showErrorToast = (message) => {
    toast.dismiss(); 
    toast.error(message, {
      position: "bottom-right",
      autoClose: 2000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: styles.errorToast,
      progressClassName: styles.errorToastProgress,
      closeButton: true, 
    });
  };

  const showInfoToast = (message) => {
    toast.dismiss();
    toast.info(message, {
      position: "bottom-right",
      autoClose: 2000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: styles.infoToast,
      progressClassName: styles.infoToastProgress,
      closeButton: true, 
    });
  };

  useEffect(() => {
    if (initialMessage) {
      const timer = setTimeout(() => {
        showSuccessToast(initialMessage);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [initialMessage]);

  const handleLogout = () => {
    navigate('/');
  };

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
    if (userAlreadyLoggedIn) {
      showErrorToast(t('login.mustLogoutFirst') || 'Başqa hesaba daxil olmaq üçün əvvəlcə çıxış etməlisiniz');
      return;
    }
    
    setLoading(true);

    if (!email || !password) {
      showErrorToast(t('login.emptyFields') || 'E-poçt və şifrə daxil edin');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      const username = data.user.user_metadata?.username;
      
      if (username) {
        localStorage.setItem('userName', username);
      } else {
       
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

      showSuccessToast(t('login.successMessage') || 'Uğurla daxil oldunuz!');
      await loadUser(data.user.id);

      setEmail('');
      setPassword('');

      setTimeout(() => {
        if (data.user.email === ADMIN_EMAIL) {
         
          navigate('/admin');
        } else if (from !== '/') {
      
          navigate(from);
        } else {
         
          navigate('/home');
        }
      }, 1500);
    } catch (error) {
      let errorMessage = t('login.generalError') || 'Giriş zamanı xəta baş verdi';
      
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('Invalid login') || error.message.includes('Invalid email')) {
          errorMessage = t('login.invalidCredentials') || 'Yanlış e-poçt və ya şifrə';
        }
      }
      
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = () => {
    showInfoToast(t('login.redirectingToForgotPassword') || 'Şifrə yeniləmə səhifəsinə yönləndirilirsiniz...');
    setTimeout(() => {
      navigate('/forgot-password');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container} data-theme={isDarkMode ? 'dark' : 'light'}>
    
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1} 
      />
      
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>{t('common.companyName.luxury') || 'Luxury'}</span>
          </div>
          
          <h1 className={styles.title}>{t('login.title') || 'Daxil ol'}</h1>
          
          {userAlreadyLoggedIn ? (
            <div className={styles.alreadyLoggedIn}>
              <p>{t('login.anotherAccountActive') || 'Hazırda başqa bir hesab aktiv vəziyyətdədir.'}</p>
              <button 
                onClick={handleLogout} 
                className={styles.logoutButton}
              >
                {t('login.logoutFirst') || 'Çıxış et'}
              </button>
            </div>
          ) : (
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
                disabled={loading || userAlreadyLoggedIn}
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
          )}
          
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