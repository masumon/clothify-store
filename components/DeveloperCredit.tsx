"use client";

import type { ReactNode } from "react";
import { Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import styles from "./DeveloperCredit.module.css";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.brandIcon}>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.3c0-.9.2-1.5 1.5-1.5h1.4V5.1c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H9v3h2v7h2.5z" />
    </svg>
  );
}

function ContactButton({
  href,
  label,
  value,
  external = false,
  children,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={styles.contactButton}
    >
      <span className={styles.contactIcon}>{children}</span>
      <span className={styles.contactText}>
        <span className={styles.contactLabel}>{label}</span>
        <span className={styles.contactValue}>{value}</span>
      </span>
      <ArrowUpRight className={styles.contactArrow} strokeWidth={1.8} />
    </a>
  );
}

export default function DeveloperCredit() {
  return (
    <section className={styles.wrap} aria-label="Developer credit">
      <article className={styles.card}>
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.header}>
          <div className={styles.avatar}>MS</div>

          <div className={styles.identity}>
            <p className={styles.kicker}>Built with ❤️ by Mumain Ahmed</p>
            <h3 className={styles.name}>Mumain Ahmed Sumon</h3>
            <p className={styles.primaryTitle}>
              Integrated Systems &amp; AI-Assisted Technical Solutions Architect
            </p>
            <p className={styles.secondaryTitle}>Full Stack Python Developer</p>
          </div>
        </div>

        <div className={styles.actions}>
          <ContactButton
            href="mailto:m.a.sumon92@gmail.com"
            label="Email"
            value="m.a.sumon92@gmail.com"
          >
            <Mail className={styles.lucideIcon} strokeWidth={1.9} />
          </ContactButton>

          <ContactButton
            href="https://facebook.com/sumon.mumain"
            label="Facebook"
            value="facebook.com/sumon.mumain"
            external
          >
            <FacebookIcon />
          </ContactButton>

          <ContactButton
            href="https://wa.me/8801825007977"
            label="WhatsApp / Call"
            value="+8801825007977"
            external
          >
            <MessageCircle className={styles.lucideIcon} strokeWidth={1.9} />
          </ContactButton>
        </div>

        <div className={styles.creditLines}>
          <p className={styles.creditMain}>Powered by SUMONIX AI | Architected by Mumain Ahmed</p>
          <p className={styles.creditBusiness}>Solution by ABO ENTERPRISE</p>
        </div>

        <p className={styles.slogan}>SIMPLE SOLUTION</p>
      </article>
    </section>
  );
}
