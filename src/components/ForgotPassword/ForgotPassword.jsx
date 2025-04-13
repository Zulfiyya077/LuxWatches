import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import supabase from '../../supabaseClient';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const { t } = useTranslation('auth');
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage(t('passwordReset.success'));
    } catch (error) {
      setError(t('passwordReset.error', { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${styles.container} ${styles[theme]}`}
    >
      <div className={styles.background}></div>
      <div className={styles.formWrapper}>
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={styles.formContainer}
        >
          <div className={styles.logoSection}>
            <img 
              src="/logo.png" 
              alt={t('logo.alt')} 
              className={styles.logo} 
            />
          </div>

          <h2 className={styles.title}>{t('passwordReset.title')}</h2>

          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <i className={`fas fa-envelope ${styles.inputIcon}`}></i>
                <input
                  type="email"
                  placeholder={t('email.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={styles.errorMessage}
              >
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ x: 10 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={styles.successMessage}
              >
                {message}
              </motion.div>
            )}

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className={styles.resetButton} 
              disabled={loading}
            >
              {loading ? t('buttons.loading') : t('buttons.resetPassword')}
            </motion.button>
          </form>

          <div className={styles.loginPrompt}>
            <p>
              {t('passwordReset.loginPrompt')}
              <button 
                onClick={goToLogin} 
                className={styles.loginLink}
              >
                {t('buttons.login')}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;