import React, { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Register.module.css";
import supabase from "../../supabaseClient";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();


  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: styles.successToast,
      progressClassName: styles.successToastProgress,
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: styles.errorToast,
      progressClassName: styles.errorToastProgress,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      showErrorToast(t("register.allFieldsRequired") || "Bütün xanaları doldurun");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast(t("register.invalidEmail") || "E-poçt ünvanı düzgün formatda deyil");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showErrorToast(t("register.passwordMismatch") || "Şifrələr uyğun gəlmir");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      showErrorToast(t("register.passwordTooShort") || "Şifrə ən azı 8 simvol olmalıdır");
      setLoading(false);
      return;
    }

    try {
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            role: "user", 
          },
        },
        emailRedirectTo: `${window.location.origin}/login`,
        allowAutoLogin: false,
      });

      if (signUpError) throw signUpError;

      if (data && data.user) {
      
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            user_id: data.user.id,
            name: username, 
            email: email,
            role: 'user', 
          },
        ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          
        }

        showSuccessToast(t('register.successMessage') || 'Qeydiyyat uğurla tamamlandı! Zəhmət olmasa, daxil olun.');

        setTimeout(() => {
          navigate('/login', {
            state: {
              message: t('register.successMessage') || 'Qeydiyyat uğurla tamamlandı! Zəhmət olmasa, daxil olun.',
              email: email
            }
          });
        }, 1500);
      } else {
        throw new Error('İstifadəçi qeydiyyatı naməlum səbəbdən uğursuz oldu');
      }
    } catch (error) {
      let errorMessage = t("register.generalError") || "Qeydiyyat zamanı xəta baş verdi";

      if (error.message && typeof error.message === "string") {
        if (
          error.message.includes("already in use") ||
          error.message.includes("already registered")
        ) {
          errorMessage = t("register.emailInUse") || "Bu e-poçt artıq qeydiyyatdan keçib";
        } else if (error.message.includes("password")) {
          errorMessage = t("register.passwordRequirements") || "Şifrə tələbləri qarşılanmır";
        }
      }

      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.darkTheme : ''}`}>
  
      <ToastContainer />
      
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>
              {t("common.companyName.luxury")}
            </span>
            <span className={styles.logoAccent}>
              {t("common.companyName.shop")}
            </span>
          </div>

          <h1 className={styles.title}>{t("register.title")}</h1>

          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username">{t("register.fullName")}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="username"
                  type="text"
                  placeholder={t("register.fullNamePlaceholder")}
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
              <label htmlFor="email">{t("register.email")}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  placeholder={t("register.emailPlaceholder")}
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
              <label htmlFor="password">{t("register.password")}</label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("register.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                  autoComplete="new-password"
                />
                <span
                  className={styles.inputIcon}
                  onClick={() => togglePasswordVisibility("password")}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <small className={styles.passwordHint}>
                {t("register.passwordHint") ||
                  "Şifrə ən azı 8 simvol olmalıdır"}
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">
                {t("register.confirmPassword")}
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("register.confirmPasswordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className={styles.inputIcon}
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  style={{ cursor: 'pointer' }}
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
                  <span>{t("common.loading") || "Yüklənir"}</span>
                  <span className={styles.loadingDots}>...</span>
                </div>
              ) : (
                t("register.submitButton") || "Qeydiyyatdan keç"
              )}
            </button>
          </form>

          <div className={styles.loginPrompt}>
            <p>{t("register.haveAccount") || "Artıq hesabınız var?"}</p>
            <span
              onClick={() => navigate("/login")}
              className={styles.loginLink}
            >
              {t("register.loginLink") || "Daxil ol"}
            </span>
          </div>

          <div className={styles.termsInfo}>
            {t("register.termsAgreement") || 
              "Qeydiyyatdan keçməklə siz İstifadə şərtləri və Məxfilik siyasəti ilə razılaşırsınız."}
          </div>
        </div>

        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <h2>{t("register.bannerTitle") || "Lüks Dəbdə Xoş Gəlmisiniz"}</h2>
            <div className={styles.separator}></div>
            <p>
              {t("register.bannerSubtitle") ||
                "Hesabınızla bir çox üstünlüklərdən faydalanın"}
            </p>

            <ul className={styles.benefitsList}>
              <li>
                <span className={styles.benefitIcon}>💎</span>
                <span>
                  {t("register.benefits.specialOffers") ||
                    "Xüsusi təkliflər və endirimlərdən xəbərdar olun"}
                </span>
              </li>
              <li>
                <span className={styles.benefitIcon}>🏆</span>
                <span>
                  {t("register.benefits.firstOrderDiscount") ||
                    "İlk sifarişinizdə 10% endirim əldə edin"}
                </span>
              </li>
              <li>
                <span className={styles.benefitIcon}>✨</span>
                <span>
                  {t("register.benefits.freeShipping") ||
                    "Pulsuz çatdırılma imkanı"}
                </span>
              </li>
              <li>
                <span className={styles.benefitIcon}>⚜️</span>
                <span>
                  {t("register.benefits.productNotifications") ||
                    "Yeni məhsullar haqqında bildirişlər alın"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;