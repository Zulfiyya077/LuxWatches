
import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import styles from "./BlogDetails.module.css";
import supabase from "../../supabaseClient";
import { format } from "date-fns";

const BlogDetails = () => {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if theme is dark mode
  const isDarkMode = theme === "dark";

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);

    const fetchData = async () => {
      await fetchBlogData(isMounted);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const fetchBlogData = async (isMounted) => {
    try {
      const { data: blogData, error: blogError } = await supabase
        .from("blog")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (blogError) throw blogError;

      if (blogData) {
        const formattedDate =
          blogData.date && !isNaN(new Date(blogData.date))
            ? format(new Date(blogData.date), "dd MMM yyyy")
            : "";

        // Get related posts with the same category
        const { data: relatedData, error: relatedError } = await supabase
          .from("blog")
          .select("id, title, image, date, category")
          .eq("category", blogData.category)
          .neq("id", Number(id))
          .limit(4); // Limit to 4 related posts

        if (relatedError) throw relatedError;

        // Format dates for related posts
        const formattedRelatedPosts = relatedData?.map(post => ({
          ...post,
          formattedDate: post.date && !isNaN(new Date(post.date))
            ? format(new Date(post.date), "dd MMM yyyy")
            : post.date
        })) || [];

        if (isMounted) {
          setBlog({ ...blogData, formattedDate });
          setRelatedPosts(formattedRelatedPosts);
        }
      } else {
        if (isMounted) setError(t("blog1.notFound"));
      }
    } catch (error) {
      console.error(t("blog1.loadError"), error);
      if (isMounted) setError(t("blog1.loadFailed"));
    } finally {
      if (isMounted) setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className={`${styles.notFound} ${isDarkMode ? styles.darkMode : ""}`}>
        <h2>{t("blog1.loading")}</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.notFound} ${isDarkMode ? styles.darkMode : ""}`}>
        <h2>{error}</h2>
        <Link to="/blog" className={styles.backButton}>
          <button className={styles.backIcon}>←</button> 
          {t("blog1.returnToBlog")}
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`${styles.notFound} ${isDarkMode ? styles.darkMode : ""}`}>
        <h2>{t("blog1.notFound")}</h2>
        <Link to="/blog" className={styles.backButton}>
          <button className={styles.backIcon}>←</button> 
          {t("blog1.returnToBlog")}
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.blogDetailsContainer} ${isDarkMode ? styles.darkMode : ""}`}>
      <div className={styles.blogHeader}>
        <h1 className={styles.blogTitle}>{blog.title}</h1>
        <div className={styles.metaInfo}>
          <span className={styles.date}>{blog.formattedDate}</span>
          <span className={styles.divider}>•</span>
          <span className={styles.author}>{blog.author}</span>
          <span className={styles.divider}>•</span>
          <span className={styles.category}>{blog.category}</span>
          <span className={styles.divider}>•</span>
          <span className={styles.readTime}>{blog.read_time}</span>
        </div>
      </div>

      <div className={styles.heroImageContainer}>
        <img
          src={blog.image}
          alt={t("blog1.heroImageAlt", { title: blog.title })}
          className={styles.heroImage}
        />
      </div>

      <div className={styles.contentSection}>
        <div className={styles.mainContent}>
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph.trim()}
            </p>
          ))}
        </div>

        <div className={styles.sideInfo}>
          <div className={styles.specBox}>
            <h3 className={styles.specTitle}>{t("blog1.techSpecs")}</h3>
            <ul className={styles.specList}>
              <li><span className={styles.specLabel}>{t("blog1.specs.diameter")}:</span> <span className={styles.specValue}>{blog.diameter}</span></li>
              <li><span className={styles.specLabel}>{t("blog1.specs.movement")}:</span> <span className={styles.specValue}>{blog.movement}</span></li>
              <li><span className={styles.specLabel}>{t("blog1.specs.material")}:</span> <span className={styles.specValue}>{blog.material}</span></li>
              <li><span className={styles.specLabel}>{t("blog1.specs.waterResistance")}:</span> <span className={styles.specValue}>{blog.water_resistance}</span></li>
              <li><span className={styles.specLabel}>{t("blog1.specs.powerReserve")}:</span> <span className={styles.specValue}>{blog.power}</span></li>
              <li><span className={styles.specLabel}>{t("blog1.specs.bezel")}:</span> <span className={styles.specValue}>{blog.bezel}</span></li>
            </ul>
          </div>
        </div>
      </div>

      {blog.gallery && blog.gallery.trim() && (
        <div className={styles.gallerySection}>
          <h3 className={styles.galleryTitle}>{t("blog1.gallery")}</h3>
          <div className={styles.imageGrid}>
            {blog.gallery.split(',').map((image, index) => (
              <div key={index} className={styles.galleryImageContainer}>
                <img
                  src={image.trim()}
                  alt={t("blog1.galleryImageAlt", { title: blog.title, number: index + 1 })}
                  className={styles.galleryImage}
                />
                
              </div>
            ))}

            
          </div>
        </div>
      )}

      {relatedPosts.length > 0 ? (
        <div className={styles.relatedPosts}>
          <h3 className={styles.relatedTitle}>{t("blog1.relatedPosts")}</h3>
          <div className={styles.relatedGrid}>
            {relatedPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.id}`} className={styles.relatedCard}>
                <div className={styles.relatedImageWrapper}>
                  <img src={post.image} alt={post.title} className={styles.relatedImage} />
                </div>
                <div className={styles.relatedContent}>
                  <h4 className={styles.relatedPostTitle}>{post.title}</h4>
                  <div className={styles.relatedMeta}>
                    <span className={styles.relatedDate}>{post.formattedDate}</span>
                    {post.category && (
                      <>
                        
                        <span className={styles.relatedCategory}>{post.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.noRelatedPosts}>{t("blog1.noRelatedPosts")}</p>
      )}

      <div className={styles.navigationSection}>
        <Link to="/blog" className={styles.backButton}>
          <button className={styles.backIcon}>←</button> {t("blog1.returnToBlog")}
        </Link>
      </div>
    </div>
  );
};

export default BlogDetails;