import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Blog.module.css";
import supabase from "../../supabaseClient";
import { ThemeContext } from "../../context/ThemeContext";

const Blog = () => {
  const { t } = useTranslation();
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  
  // Check if theme is dark mode
  const isDarkMode = theme === "dark";
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  useEffect(() => {
    fetchBlogs();
  }, []);
  
  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('id, title, date, content, image')
        .order('date', { ascending: false });
      
      console.log("📦 bloglar:", data);
      if (error) throw error;
      
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Blogları yükləyərkən xəta:", error);
      setError(t('blogs.error'));
    } finally {
      setLoading(false);
    }
  };
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  return (
    <div className={`${styles.blogContainer} ${isDarkMode ? styles.dark : styles.light}`}>
      <h2 className={styles.blogTitle}>{t("blogs1.title")}</h2>
      
      {blogPosts.length === 0 && !loading ? (
        <p className={styles.noBlog}>{t("blogs1.noPosts")}</p>
      ) : (
        <div className={styles.blogList}>
          {blogPosts.map((post, index) => {
            const isEven = (index + 1) % 2 === 0;
            return (
              <div 
                key={post.id} 
                className={`
                  ${styles.blogItem} 
                  ${isDarkMode ? styles.darkCard : styles.lightCard}
                  ${isEven ? styles.evenPost : styles.oddPost}
                `} 
                style={{ "--i": index + 1 }}
              >
                <div className={styles.blogImageContainer}>
                  <img src={post.image} alt={post.title} className={styles.blogImage} />
                </div>
                <div className={styles.blogContent}>
                  <h3 className={styles.blogHeading}>{post.title}</h3>
                  <p className={styles.blogDate}>{post.date}</p>
                  <p className={styles.blogText}>
                    {post.content.substring(0, 120)}...
                  </p>
                  <Link to={`/blog/${post.id}`} className={styles.readMore}>
                    {t("blogs1.readMore")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Blog;