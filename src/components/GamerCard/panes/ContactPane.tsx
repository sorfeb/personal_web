'use client';

import React, { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Clapperboard, Copy, Github, Globe, Linkedin, Mail } from 'lucide-react';
import { useAudioManager } from '../../../hooks/useAudioManager';
import { useToast, createSystemToast } from '../../ToastNotification';
import { contacts, email } from '../../../data/card';
import styles from './panes.module.css';

const CONTACT_ICONS: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
  Website: Globe,
  Letterboxd: Clapperboard,
};

const ContactPane = memo(() => {
  const { playSound } = useAudioManager();
  const { showToast } = useToast();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      playSound('ting');
      showToast(createSystemToast('Email copied to clipboard', 'success'));
    } catch {
      showToast(createSystemToast('Could not copy — long-press the address instead', 'error'));
    }
  };

  return (
    <div className={styles.pane}>
      <div className={styles.paneHeader}>
        <Mail className={styles.paneHeaderIcon} size={20} strokeWidth={1.5} />
        <h2 className={styles.paneTitle}>Contact</h2>
      </div>

      <ul className={styles.contactList}>
        {contacts.map((contact) => {
          const Icon = CONTACT_ICONS[contact.label] ?? Globe;
          const isMail = contact.href.startsWith('mailto:');
          return (
            <li
              key={contact.label}
              className={contact.secondary ? styles.contactRowSecondary : styles.contactRow}
            >
              <a
                className={styles.contactLink}
                href={contact.href}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noopener noreferrer'}
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover')}
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                <span className={styles.contactLabel}>{contact.label}</span>
                <span className={styles.contactDisplay}>{contact.display}</span>
              </a>
              {contact.label === 'Email' && (
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={handleCopyEmail}
                  onMouseEnter={() => playSound('hover')}
                  aria-label="Copy email address"
                >
                  <Copy size={16} strokeWidth={1.5} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

ContactPane.displayName = 'ContactPane';

export default ContactPane;
