import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Blog.module.css";
import supabase from "../../supabaseClient";


const Blog = ({ darkMode }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);
  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('id, title, date, content, image')
        .order('date', { ascending: false });
  
      console.log("📦 bloglar:", data); // Debug üçün əlavə et
      if (error) throw error;
  
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Blogları yükləyərkən xəta:", error);
      setError("Blogları yükləmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };


  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={`${styles.blogContainer} ${darkMode ? styles.dark : styles.light}`}>
      <h2 className={styles.blogTitle}>Rolex Haqqında Bloqlar</h2>
      
      {blogPosts.length === 0 ? (
        <p className={styles.noBlog}>Hazırda blog məqalələri mövcud deyil.</p>
      ) : (
        <div className={styles.blogGrid}>
          {blogPosts.map((post, index) => (
            <div key={post.id} className={styles.blogCard} style={{"--i": index + 1}}>
              <img src={post.image} alt={post.title} className={styles.blogImage} />
              <div className={styles.blogContent}>
                <h3 className={styles.blogHeading}>{post.title}</h3>
                <p className={styles.blogDate}>{post.date}</p>
                <p className={styles.blogText}>
                  {post.content.substring(0, 120)}...
                </p>
                <Link to={`/blog/${post.id}`} className={styles.readMore}>
                  Daha Çox Oxu
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;