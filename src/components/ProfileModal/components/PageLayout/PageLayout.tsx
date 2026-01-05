'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../../hooks/useAudioManager';
import Tooltip from '../../../ui/Tooltip/Tooltip';
import type { BladePageHeader, BladePageFooter } from '../../types';
import styles from './PageLayout.module.css';

export interface PageLayoutProps {
  header?: BladePageHeader;
  footer?: BladePageFooter;
  children: React.ReactNode;
}

const PageLayout = memo<PageLayoutProps>(({ header, footer, children }) => {
  const { playSound } = useAudioManager();

  return (
    <div className={styles.pageLayout}>
      {header && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {header.icon && (
              <Image
                src={header.icon}
                alt=""
                width={24}
                height={24}
                className={styles.headerIcon}
              />
            )}
            <div className={styles.headerText}>
              <h2 className={styles.headerTitle}>{header.title}</h2>
              {header.subtitle && (
                <p className={styles.headerSubtitle}>{header.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>{children}</div>

      {footer && footer.actions.length > 0 && (
        <div className={styles.footer}>
          {footer.actions.map((action) => (
            <Tooltip
              key={action.key}
              content={action.tooltip || action.label}
              position="top"
              disabled={!action.tooltip}
            >
              <motion.button
                className={styles.footerButton}
                onClick={action.onClick}
                disabled={action.disabled}
                onMouseEnter={() => playSound('owawa')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.buttonIcon}>{action.buttonIcon}</span>
                <span className={styles.buttonLabel}>{action.label}</span>
              </motion.button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
});

PageLayout.displayName = 'PageLayout';

export default PageLayout;
