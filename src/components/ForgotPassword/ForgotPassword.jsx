import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
      toast.error(t('auth.validation.emailRequired'));
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success(t('auth.passwordReset.success'));
      setEmail(''); 
    } catch (error) {
      toast.error(t('auth.passwordReset.error', { message: error.message }));
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${styles.container} ${styles[theme]}`}
    >
      <div className={styles.backgroundWave}></div>
      <div className={styles.formWrapper}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          className={styles.formContainer}
        >
          <div className={styles.logoSection}>
            <img 
              src="public/videos/Screenshot Capture - 2025-04-14 - 02-25-33-Photoroom.png" 
              alt={t('auth.logo.alt')} 
              className={styles.logo} 
            />
          </div>

          <h2 className={styles.title}>{t('auth.passwordReset.title')}</h2>
          <p className={styles.subtitle}>{t('auth.passwordReset.subtitle')}</p>

          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>{t('auth.email.label')}</label>
              <div className={styles.inputWrapper}>
                <i className={`fas fa-envelope ${styles.inputIcon}`}></i>
                <input
                  type="email"
                  placeholder={t('auth.email.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit" 
              className={styles.resetButton} 
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loadingSpinner}>
                  <i className="fas fa-spinner fa-spin"></i> {t('auth.buttons.loading')}
                </span>
              ) : (
                t('auth.buttons.resetPassword')
              )}
            </motion.button>
          </form>

          <div className={styles.authLinks}>
            <motion.p whileHover={{ scale: 1.05 }} className={styles.loginPrompt}>
              {t('auth.passwordReset.loginPrompt')}{' '}
              <button 
                onClick={goToLogin} 
                className={styles.loginLink}
              >
                {t('auth.buttons.login')}
              </button>
            </motion.p>
            <motion.p whileHover={{ scale: 1.05 }} className={styles.registerPrompt}>
              {t('auth.passwordReset.registerPrompt')}{' '}
              <button 
                onClick={goToRegister} 
                className={styles.registerLink}
              >
                {t('auth.buttons.register')}
              </button>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;