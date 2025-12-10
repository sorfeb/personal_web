'use client';

import React, { useState } from 'react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

/**
 * CodeBlock - Simple code display with copy functionality
 * No syntax highlighting, just monospace display with Xbox-themed styling
 */
export default function CodeBlock({ code, language = 'tsx', className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          type="button"
          title="Copy code"
        >
          {copied ? (
            <>
              <span className={styles.copyIcon}>✓</span>
              <span className={styles.copyText}>Copied!</span>
            </>
          ) : (
            <>
              <span className={styles.copyIcon}>📋</span>
              <span className={styles.copyText}>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className={styles.pre}>
        <code className={styles.code}>{code}</code>
      </pre>
    </div>
  );
}
