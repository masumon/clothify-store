"use client";

import type { ReactNode } from "react";
import { Mail, MessageCircle, Phone, ChevronDown } from "lucide-react";
import { useState } from "react";
import styles from "./DeveloperCredit.module.css";

function ActionIconButton({
  href,
  external = false,
  label,
  children,
}: {
  href: string;
  external?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={styles.iconButton}
      aria-label={label}
      title={label}
    >
      {children}
    </a>
  );
}

export default function DeveloperCredit() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.wrap} aria-label="Developer credit">
      <article className={styles.card}>
        <div className={styles.glow} aria-hidden="true" />

        <button
          type="button"
          className={styles.summaryButton}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <div className={styles.header}>
            <div className={styles.avatar}>MS</div>

            <div className={styles.identity}>
              <h3 className={styles.name}>Mumain Ahmed Sumon</h3>
              <p className={styles.primaryTitle}>
                Integrated Systems &amp; AI-Assisted Technical Solutions Architect
              </p>
            </div>

            <ChevronDown
              className={`${styles.summaryChevronInline} ${expanded ? styles.summaryChevronOpen : ""}`}
              strokeWidth={1.9}
            />
          </div>
        </button>

        <div className={styles.quickActions} aria-label="Developer quick contact">
          <ActionIconButton href="tel:+8801825007977" label="Call Mumain Ahmed">
            <Phone className={styles.lucideIcon} strokeWidth={1.9} />
          </ActionIconButton>

          <ActionIconButton href="mailto:m.a.sumon92@gmail.com" label="Email Mumain Ahmed">
            <Mail className={styles.lucideIcon} strokeWidth={1.9} />
          </ActionIconButton>

          <ActionIconButton
            href="https://wa.me/8801825007977"
            label="Chat on WhatsApp"
            external
          >
            <MessageCircle className={styles.lucideIcon} strokeWidth={1.9} />
          </ActionIconButton>
        </div>

        <div className={`${styles.panel} ${expanded ? styles.panelOpen : ""}`}>
          <div className={styles.panelInner}>
            <p className={styles.kicker}>Built with ❤️ by Mumain Ahmed</p>
            <p className={styles.secondaryTitle}>Full Stack Python Developer</p>

            <div className={styles.creditLines}>
              <p className={styles.creditMain}>Powered by SUMONIX AI | Architected by Mumain Ahmed</p>
              <p className={styles.creditBusiness}>Solution by ABO ENTERPRISE</p>
            </div>

            <p className={styles.slogan}>SIMPLE SOLUTION</p>
          </div>
        </div>
      </article>
    </section>
  );
}
