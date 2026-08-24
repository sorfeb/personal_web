'use client';

import React, { forwardRef, memo } from 'react';
import { useAudioManager, type SoundType } from '../../../hooks/useAudioManager';
import styles from './Button.module.css';

/** Xbox controller face-button badge colors */
const BADGE_LABELS = ['A', 'B', 'X', 'Y'] as const;
type BadgeLabel = (typeof BADGE_LABELS)[number];

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * Visual system:
   * - `chrome`   transparent controller-chrome row (GamerCard/ProfileModal footers)
   * - `metallic` beveled dark gradient (WMP-style chrome)
   * - `glass`    outline on transparent
   * - `ghost`    borderless text/icon
   * - `solid`    filled brand accent
   * - `danger`   filled error red
   */
  variant?: 'chrome' | 'metallic' | 'glass' | 'ghost' | 'solid' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rect' | 'pill' | 'circle';
  /** Xbox controller chip rendered before the label (A=green, B=red, X=blue, Y=yellow) */
  badge?: BadgeLabel;
  /** Icon element rendered before/after the label */
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  /** Icon-only button — pass aria-label for accessibility */
  iconOnly?: boolean;
  /** Shows a spinner and disables interaction */
  loading?: boolean;
  /** Pressed/selected state, announced via aria-pressed */
  active?: boolean;
  /** Pulsing brand glow animation */
  glow?: boolean;
  fullWidth?: boolean;
  /** Sound on pointer enter; null silences. Chrome variant defaults to 'owawa'. */
  hoverSound?: SoundType | null;
  /** Sound on activation (click or keyboard); null silences */
  clickSound?: SoundType | null;
}

/**
 * Button
 *
 * Shared interactive primitive for the Xbox 360 dashboard. Audio feedback,
 * focus-visible styling, and disabled handling are built in so feature
 * components cannot forget them.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant = 'solid',
    size = 'md',
    shape = 'rect',
    badge,
    icon,
    iconPosition = 'start',
    iconOnly = false,
    loading = false,
    active = false,
    glow = false,
    fullWidth = false,
    hoverSound,
    clickSound = 'click',
    className,
    children,
    disabled,
    onClick,
    onMouseEnter,
    type = 'button',
    ...rest
  } = props;

  const { playSound } = useAudioManager();
  const resolvedHoverSound =
    hoverSound === undefined ? (variant === 'chrome' ? 'owawa' : 'hover') : hoverSound;
  const isDisabled = disabled || loading;

  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && resolvedHoverSound) playSound(resolvedHoverSound);
    onMouseEnter?.(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (clickSound) playSound(clickSound);
    onClick?.(event);
  };

  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    styles[shape],
    iconOnly && styles.iconOnly,
    active && styles.active,
    glow && styles.glow,
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classNames}
      disabled={isDisabled}
      aria-pressed={active || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden />}
      {badge && (
        <span className={`${styles.badge} ${styles[`badge${badge}`]}`} aria-hidden>
          <span className={styles.badgeLetter}>{badge}</span>
        </span>
      )}
      {icon && iconPosition === 'start' && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      {!iconOnly && children && <span className={styles.label}>{children}</span>}
      {iconOnly && children}
      {icon && iconPosition === 'end' && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default memo(Button);
