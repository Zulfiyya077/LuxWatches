import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import styles from "./BlogDetails.module.css";
import supabase from "../../supabaseClient";
import { format } from "date-fns";

const BlogDetails = () => {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

        const { data: relatedData, error: relatedError } = await supabase
          .from("blog")
          .select("id, title, image, date")
          .eq("category", blogData.category)
          .neq("id", Number(id));

        if (relatedError) throw relatedError;

        if (isMounted) {
          setBlog({ ...blogData, formattedDate });
          setRelatedPosts(relatedData || []);
        }
      } else {
        if (isMounted) setError("Blog tapılmadı");
      }
    } catch (error) {
      console.error("Blog məlumatlarını yükləyərkən xəta:", error);
      if (isMounted) setError("Blog məlumatlarını yükləmək mümkün olmadı.");
    } finally {
      if (isMounted) setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className={`${styles.notFound} ${theme === "dark" ? styles.darkMode : ""}`}>
        <h2>Bloq yüklənir...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.notFound} ${theme === "dark" ? styles.darkMode : ""}`}>
        <h2>{error}</h2>
        <Link to="/blog" className={styles.backButton}>Bloq səhifəsinə qayıt</Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`${styles.notFound} ${theme === "dark" ? styles.darkMode : ""}`}>
        <h2>Blog tapılmadı</h2>
        <Link to="/blog" className={styles.backButton}>Bloq səhifəsinə qayıt</Link>
      </div>
    );
  }

  return (
    <div className={`${styles.blogDetailsContainer} ${theme === "dark" ? styles.darkMode : ""}`}>
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
          alt={`Hero image for ${blog.title}`}
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
            <h3 className={styles.specTitle}>Texniki Xüsusiyyətlər</h3>
            <ul className={styles.specList}>
              <li><span className={styles.specLabel}>Diametr:</span> <span className={styles.specValue}>{blog.diameter}</span></li>
              <li><span className={styles.specLabel}>Mexanizm:</span> <span className={styles.specValue}>{blog.movement}</span></li>
              <li><span className={styles.specLabel}>Material:</span> <span className={styles.specValue}>{blog.material}</span></li>
              <li><span className={styles.specLabel}>Su keçirməzlik:</span> <span className={styles.specValue}>{blog.water_resistance}</span></li>
              <li><span className={styles.specLabel}>Güc rezervi:</span> <span className={styles.specValue}>{blog.power}</span></li>
              <li><span className={styles.specLabel}>Bezel:</span> <span className={styles.specValue}>{blog.bezel}</span></li>
            </ul>
          </div>
        </div>
      </div>

      {blog.gallery && blog.gallery.trim() && (
        <div className={styles.gallerySection}>
          <h3 className={styles.galleryTitle}>Qalereya</h3>
          <div className={styles.imageGrid}>
            {blog.gallery.split(',').map((image, index) => (
              <div key={index} className={styles.galleryImageContainer}>
                <img
                  src={image.trim()}
                  alt={`${blog.title} - Şəkil ${index + 1}`}
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedPosts.length > 0 ? (
        <div className={styles.relatedPosts}>
          <h3 className={styles.relatedTitle}>Oxşar Məqalələr</h3>
          <div className={styles.relatedGrid}>
            {relatedPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.id}`} className={styles.relatedCard}>
                <img src={post.image} alt={post.title} className={styles.relatedImage} />
                <h4 className={styles.relatedPostTitle}>{post.title}</h4>
                <span className={styles.relatedDate}>{post.date}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.noRelatedPosts}>Oxşar məqalə mövcud deyil</p>
      )}

      <div className={styles.navigationSection}>
        <Link to="/blog" className={styles.backButton}>
          <span className={styles.backIcon}>←</span> Bloq Səhifəsinə Qayıt
        </Link>
      </div>
    </div>
  );
};

export default BlogDetails;
