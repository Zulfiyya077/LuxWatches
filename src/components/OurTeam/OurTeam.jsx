import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import styles from "./OurTeam.module.css";
import { ThemeContext } from "../../context/ThemeContext";

const OurTeam = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext); 

  const teamMembers = [
    {
      name: "John Doe",
      role: t("positions.ceo"),
      bio: t("teamBios.johnDoe"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/man1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvbWFuMS5qcGciLCJpYXQiOjE3NDQyNzIyMzYsImV4cCI6MTc3NTgwODIzNn0.Ukb4ztX0g7dte21L5cAsy3ifUt51BLKnk-UVBWdTXcM",
      socialLinks: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        email: "john@company.com"
      }
    },
    {
      name: "Jane Smith",
      role: t("positions.cto"),
      bio: t("teamBios.janeSmith"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/employe1.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZW1wbG95ZTEuYXZpZiIsImlhdCI6MTc0NDI3MjE1OSwiZXhwIjoxNzc1ODA4MTU5fQ.lR3oNfER6OE8eJlmfdwpa65udgkaqrlyB-1KDj3q-ME",
      socialLinks: {
        linkedin: "https://linkedin.com/in/janesmith",
        twitter: "https://twitter.com/janesmith",
        email: "jane@company.com"
      }
    },
    {
      name: "Sam Green",
      role: t("positions.marketingManager"),
      bio: t("teamBios.samGreen"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/MAN2.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvTUFOMi53ZWJwIiwiaWF0IjoxNzQ0Mjk2NTc5LCJleHAiOjE3NzU4MzI1Nzl9.4gFsGsFFAlyPmLxpAazvOXydJqBohpQXn7TwJSA5xrM",
      socialLinks: {
        linkedin: "https://linkedin.com/in/samgreen",
        twitter: "https://twitter.com/samgreen",
        email: "sam@company.com"
      }
    },
    {
      name: "Maria Rodriguez",
      role: t("positions.designDirector"),
      bio: t("teamBios.mariaRodriguez"),
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/WOMAN1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvV09NQU4xLmpwZyIsImlhdCI6MTc0NDI3MjM3MywiZXhwIjoxNzc1ODA4MzczfQ.b3pWwA1YLP6GDQQYPyOKdNgU1RBXCFIQVDnONffmrV4",
      socialLinks: {
        linkedin: "https://linkedin.com/in/mariarodriguez",
        twitter: "https://twitter.com/mariarodriguez",
        email: "maria@company.com"
      }
    }
  ];

  return (
    <section className={`${styles.teamSection} ${theme === 'dark' ? styles.dark : styles.light}`}> 
      <div className={styles.teamHeader}>
        <h2 className={styles.sectionTitle}>{t("ourTeam.title")}</h2>
        <p className={styles.sectionDescription}>{t("ourTeam.description")}</p>
      </div>

      <div className={styles.teamContainer}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={styles.teamCard}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.teamImageContainer}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className={styles.teamImage}
                loading="lazy"
              />
              <div className={styles.socialLinks}>
                <a
                  href={member.socialLinks.linkedin}
                  aria-label="LinkedIn"
                  className={styles.socialIcon}
                >
                  <FaLinkedin />
                </a>
                <a
                  href={member.socialLinks.twitter}
                  aria-label="Twitter"
                  className={styles.socialIcon}
                >
                  <FaTwitter />
                </a>
                <a
                  href={`mailto:${member.socialLinks.email}`}
                  aria-label="Email"
                  className={styles.socialIcon}
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>
            <div className={styles.memberInfo}>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
              <p className={styles.memberBio}>{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurTeam;
