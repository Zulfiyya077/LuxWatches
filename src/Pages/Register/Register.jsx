import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Register.module.css';
import supabase from '../../supabaseClient';

const Register = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
   
    if (!username || !email || !password || !confirmPassword) {
      setError(t('register.allFieldsRequired') || 'Bütün xanaları doldurun');
      setLoading(false);
      return;
    }
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('register.invalidEmail') || 'E-poçt ünvanı düzgün formatda deyil');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch') || 'Şifrələr uyğun gəlmir');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError(t('register.passwordTooShort') || 'Şifrə ən azı 8 simvol olmalıdır');
      setLoading(false);
      return;
    }
    
    try {
      // İstifadəçi yaratma
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            username: username,
            role: 'user' 
          }
        },
      });
      
      if (signUpError) throw signUpError;
      
      if (data && data.user) {
     
        const { error: cartError } = await supabase
          .from('carts')
          .insert([
            { user_id: data.user.id, items: [] }
          ]);
          
        const { error: wishlistError } = await supabase
          .from('wishlists')
          .insert([
            { user_id: data.user.id, items: [] }
          ]);
          
        if (cartError) console.error('Səbət yaradılma xətası:', cartError);
        if (wishlistError) console.error('İstək siyahısı yaradılma xətası:', wishlistError);
        
    
        localStorage.removeItem('anonymousCart');
        localStorage.removeItem('anonymousWishlist');
        
      
        setSuccessMessage(t('register.successMessage') || 'Qeydiyyat uğurla tamamlandı! Zəhmət olmasa, daxil olun.');

       
        setTimeout(() => {
       
          navigate('/login', { 
            state: { 
              message: t('register.successMessage') || 'Qeydiyyat uğurla tamamlandı! Zəhmət olmasa, daxil olun.',
              email: email
            }
          });
        }, 500);
      } else {
        throw new Error('İstifadəçi qeydiyyatı naməlum səbəbdən uğursuz oldu');
      }
    } catch (error) {
      let errorMessage = t('register.generalError') || 'Qeydiyyat zamanı xəta baş verdi';
      
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('already in use') || error.message.includes('already registered')) {
          errorMessage = t('register.emailInUse') || 'Bu e-poçt artıq qeydiyyatdan keçib';
        } else if (error.message.includes('password')) {
          errorMessage = t('register.passwordRequirements') || 'Şifrə tələbləri qarşılanmır';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>{t('common.companyName.luxury')}</span>
            <span className={styles.logoAccent}>{t('common.companyName.shop')}</span>
          </div>
          
          <h1 className={styles.title}>{t('register.title')}</h1>
          
          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}
          
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username">{t('register.fullName')}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="username"
                  type="text"
                  placeholder={t('register.fullNamePlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <span className={styles.inputIcon}>
                  <FaUser />
                </span>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">{t('register.email')}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  placeholder={t('register.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className={styles.inputIcon}>
                  <FaEnvelope />
                </span>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">{t('register.password')}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('register.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                  autoComplete="new-password"
                />
                <span 
                  className={styles.inputIcon} 
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <small className={styles.passwordHint}>{t('register.passwordHint') || 'Şifrə ən azı 8 simvol olmalıdır'}</small>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span 
                  className={styles.inputIcon} 
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
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
                t('register.submitButton') || 'Qeydiyyatdan keç'
              )}
            </button>
          </form>
          
          <div className={styles.loginPrompt}>
            <p>{t('register.haveAccount') || 'Artıq hesabınız var?'}</p>
            <span 
              onClick={() => navigate('/login')} 
              className={styles.loginLink}
            >
              {t('register.loginLink') || 'Daxil ol'}
            </span>
          </div>
          
          <div className={styles.termsInfo}>
            {t('register.termsAgreement', {
              terms: <a href="/terms">{t('register.termsAndConditions') || 'İstifadə şərtləri'}</a>,
              privacy: <a href="/privacy">{t('register.privacyPolicy') || 'Məxfilik siyasəti'}</a>
            }) || 'Qeydiyyatdan keçməklə siz İstifadə şərtləri və Məxfilik siyasəti ilə razılaşırsınız.'}
          </div>
        </div>
        
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <h2>{t('register.bannerTitle') || 'Lüks Dəbdə Xoş Gəlmisiniz'}</h2>
            <div className={styles.separator}></div>
            <p>{t('register.bannerSubtitle') || 'Hesabınızla bir çox üstünlüklərdən faydalanın'}</p>
            
            <ul className={styles.benefitsList}>
              <li>
                <span className={styles.benefitIcon}>💎</span>
                <span>{t('register.benefits.specialOffers') || 'Xüsusi təkliflər və endirimlərdən xəbərdar olun'}</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>🏆</span>
                <span>{t('register.benefits.firstOrderDiscount') || 'İlk sifarişinizdə 10% endirim əldə edin'}</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>✨</span>
                <span>{t('register.benefits.freeShipping') || 'Pulsuz çatdırılma imkanı'}</span>
              </li>
              <li>
                <span className={styles.benefitIcon}>⚜️</span>
                <span>{t('register.benefits.productNotifications') || 'Yeni məhsullar haqqında bildirişlər alın'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;