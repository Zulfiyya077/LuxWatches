import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "./FAQ.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { Send, ChevronUp, ChevronDown } from "lucide-react";

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  
  const [customerQuestion, setCustomerQuestion] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerQuestion.trim() || !customerEmail.trim()) {
      setFormError(t("pleaseCompleteAllFields"));
      return;
    }
    
    if (!isValidEmail(customerEmail)) {
      setFormError(t("invalidEmailFormat"));
      return;
    }
    
    setIsSubmitting(true);
    setFormError("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomerQuestion("");
      setCustomerEmail("");
      setFormSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting question:", error);
      setFormError(t("errorSubmittingQuestion"));
      setIsSubmitting(false);
    }
  };
  
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const questions = [
    { id: 0, title: "question1Title", content: "question1Content" },
    { id: 1, title: "question2Title", content: "question2Content" },
    { id: 2, title: "question3Title", content: "question3Content" },
    { id: 3, title: "question4Title", content: "question4Content" },
    { id: 4, title: "question5Title", content: "question5Content" },
    { id: 5, title: "question6Title", content: "question6Content" },
    { id: 6, title: "question7Title", content: "question7Content" },
    { id: 7, title: "question8Title", content: "question8Content" },
    { id: 8, title: "question9Title", content: "question9Content" },
    { id: 9, title: "question10Title", content: "question10Content" },
    { id: 10, title: "question11Title", content: "question11Content" },
    { id: 11, title: "question12Title", content: "question12Content" },
    { id: 12, title: "question13Title", content: "question13Content" },
    { id: 13, title: "question14Title", content: "question14Content" },
    { id: 14, title: "question15Title", content: "question15Content" }
  ];

  return (
    <div className={`${styles.faqContainer} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.animatedBackground}>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
      </div>
      
      <div className={styles.faqContent}>
        <h1 className={styles.faqTitle}>{t("faqTitle")}</h1>
        
        <div className={styles.questionsContainer}>
          {questions.map((question) => (
            <div 
              key={question.id} 
              className={`${styles.questionSection} ${activeQuestion === question.id ? styles.active : ''}`}
            >
              <div 
                className={styles.questionTitle} 
                onClick={() => toggleQuestion(question.id)}
              >
                <h3>{t(question.title)}</h3>
                <span className={styles.arrow}>
                  {activeQuestion === question.id ? 
                    <ChevronUp size={20} strokeWidth={2.5} /> : 
                    <ChevronDown size={20} strokeWidth={2.5} />
                  }
                </span>
              </div>
              <div 
                className={`${styles.questionContent} ${activeQuestion === question.id ? styles.expanded : ''}`}
              >
                <p>{t(question.content)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles.customQuestionSection} ${theme === 'dark' ? styles.darkForm : styles.lightForm}`}>
          <h2 className={styles.formTitle}>{t("askYourQuestion")}</h2>
          <p className={styles.formDescription}>{t("didntFindAnswer")}</p>
          
          {formSubmitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h3>{t("thankYouMessage")}</h3>
              <p>{t("questionSubmittedSuccess")}</p>
              <p>{t("willRespondSoon")}</p>
            </div>
          ) : (
            <form onSubmit={handleQuestionSubmit} className={styles.questionForm}>
              <div className={styles.formGroup}>
                <label htmlFor="customerEmail" className={styles.formLabel}>
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={styles.formInput}
                  placeholder={t("enterYourEmail")}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="customerQuestion" className={styles.formLabel}>
                  {t("yourQuestion")}
                </label>
                <textarea
                  id="customerQuestion"
                  value={customerQuestion}
                  onChange={(e) => setCustomerQuestion(e.target.value)}
                  className={styles.formTextarea}
                  placeholder={t("typeYourQuestion")}
                  rows={4}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              {formError && <p className={styles.errorMessage}>{formError}</p>}
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={styles.sendingState}>
                    <span className={styles.loadingDot}></span>
                    <span className={styles.loadingDot}></span>
                    <span className={styles.loadingDot}></span>
                  </span>
                ) : (
                  <>
                    {t("sendQuestion")} <Send size={16} className={styles.sendIcon} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;