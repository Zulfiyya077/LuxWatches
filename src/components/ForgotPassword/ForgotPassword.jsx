import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import supabase from '../../supabaseClient';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error(t('auth.validation.emailRequired') || "E-poçt ünvanı tələb olunur");
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success(t('auth.passwordReset.success') || "Şifrə sıfırlama təlimatları e-poçt ünvanınıza göndərildi");
      setEmail(''); 
    } catch (error) {
      toast.error(t('auth.passwordReset.error', { message: error.message }) || `Şifrə sıfırlama e-poçtunu göndərmək alınmadı: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.logoSection}>
            <img 
              src="/videos/Screenshot Capture - 2025-04-14 - 02-25-33-Photoroom.png" 
              alt={t('auth.logo.alt') || "Şirkət Loqosu"} 
              className={styles.logo} 
            />
          </div>

          <h2 className={styles.title}>{t('auth.passwordReset.title') || "Şifrəni Sıfırla"}</h2>
          <p className={styles.subtitle}>{t('auth.passwordReset.subtitle') || "E-poçt ünvanınızı daxil edin və biz sizə şifrənizi sıfırlamaq üçün təlimatlar göndərəcəyik"}</p>

          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>{t('auth.email.label') || "E-poçt Ünvanı"}</label>
              <div className={styles.inputWrapper}>
                <i className={`fas fa-envelope ${styles.inputIcon}`}></i>
                <input
                  type="email"
                  placeholder={t('auth.email.placeholder') || "E-poçt ünvanınızı daxil edin"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.resetButton} 
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loadingSpinner}>
                  <i className="fas fa-spinner fa-spin"></i> {t('auth.buttons.loading') || "Yüklənir..."}
                </span>
              ) : (
                t('auth.buttons.resetPassword') || "Şifrəni Sıfırla"
              )}
            </button>
          </form>

          <div className={styles.authLinks}>
            <p className={styles.loginPrompt}>
              {t('auth.passwordReset.loginPrompt') || "Şifrənizi xatırlayırsınız?"}{' '}
              <button 
                onClick={goToLogin} 
                className={styles.loginLink}
              >
                {t('auth.buttons.login') || "Daxil ol"}
              </button>
            </p>
            <p className={styles.registerPrompt}>
              {t('auth.passwordReset.registerPrompt') || "Hələ hesabınız yoxdur?"}{' '}
              <button 
                onClick={goToRegister} 
                className={styles.registerLink}
              >
                {t('auth.buttons.register') || "Qeydiyyatdan keç"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;