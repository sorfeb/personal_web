'use client';

import React from 'react';
import styles from './TypographyTab.module.css';
import ComponentShowcase from '../ComponentShowcase';

interface TypographyTabProps {
  isActive: boolean;
}

/**
 * Typography Tab - Showcases font tokens from the design system
 */
export default function TypographyTab({ isActive }: TypographyTabProps) {
  if (!isActive) return null;

  return (
    <div className={styles.container}>
      {/* Font Families */}
      <ComponentShowcase title="Font Families" description="Primary and monospace font stacks">
        <div className={styles.section}>
          <div className={styles.fontExample}>
            <div className={styles.fontLabel}>--font-primary</div>
            <div className={styles.fontPrimary}>
              Roboto - The quick brown fox jumps over the lazy dog
            </div>
            <code className={styles.fontValue}>
              'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
            </code>
          </div>

          <div className={styles.fontExample}>
            <div className={styles.fontLabel}>--font-mono</div>
            <div className={styles.fontMono}>
              Monospace - The quick brown fox jumps over the lazy dog
            </div>
            <code className={styles.fontValue}>
              'Courier New', Courier, monospace
            </code>
          </div>
        </div>
      </ComponentShowcase>

      {/* Type Scale */}
      <ComponentShowcase
        title="Type Scale"
        description="Font sizes using Major Third scale (1.25 ratio)"
      >
        <div className={styles.section}>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-xs</span>
            <span className={styles.typeScaleValue}>0.64rem (10px)</span>
            <div className={styles.typeScaleXs}>Extra Small Text</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-sm</span>
            <span className={styles.typeScaleValue}>0.8rem (13px)</span>
            <div className={styles.typeScaleSm}>Small Text</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-base</span>
            <span className={styles.typeScaleValue}>1rem (16px)</span>
            <div className={styles.typeScaleBase}>Base Text - Body Copy</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-md</span>
            <span className={styles.typeScaleValue}>1.25rem (20px)</span>
            <div className={styles.typeScaleMd}>Medium Text</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-lg</span>
            <span className={styles.typeScaleValue}>1.563rem (25px)</span>
            <div className={styles.typeScaleLg}>Large Text</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-xl</span>
            <span className={styles.typeScaleValue}>1.953rem (31px)</span>
            <div className={styles.typeScaleXl}>Extra Large</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-2xl</span>
            <span className={styles.typeScaleValue}>2rem (32px)</span>
            <div className={styles.typeScale2xl}>2XL - Menu Size</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-3xl</span>
            <span className={styles.typeScaleValue}>2.441rem (39px)</span>
            <div className={styles.typeScale3xl}>3XL Heading</div>
          </div>
          <div className={styles.typeScaleItem}>
            <span className={styles.typeScaleLabel}>--font-size-4xl</span>
            <span className={styles.typeScaleValue}>3.052rem (49px)</span>
            <div className={styles.typeScale4xl}>4XL Display</div>
          </div>
        </div>
      </ComponentShowcase>

      {/* Font Weights */}
      <ComponentShowcase title="Font Weights" description="Available font weight values">
        <div className={styles.section}>
          <div className={styles.weightExample}>
            <span className={styles.weightLabel}>--font-weight-light (300)</span>
            <div className={styles.weightLight}>Light weight text - Default body</div>
          </div>
          <div className={styles.weightExample}>
            <span className={styles.weightLabel}>--font-weight-regular (400)</span>
            <div className={styles.weightRegular}>Regular weight text</div>
          </div>
          <div className={styles.weightExample}>
            <span className={styles.weightLabel}>--font-weight-medium (500)</span>
            <div className={styles.weightMedium}>Medium weight text</div>
          </div>
          <div className={styles.weightExample}>
            <span className={styles.weightLabel}>--font-weight-semibold (600)</span>
            <div className={styles.weightSemibold}>Semibold weight text</div>
          </div>
          <div className={styles.weightExample}>
            <span className={styles.weightLabel}>--font-weight-bold (700)</span>
            <div className={styles.weightBold}>Bold weight text - Headings</div>
          </div>
        </div>
      </ComponentShowcase>

      {/* Line Heights */}
      <ComponentShowcase title="Line Heights" description="Vertical spacing between lines">
        <div className={styles.section}>
          <div className={styles.lineHeightExample}>
            <span className={styles.lineHeightLabel}>--line-height-tight (1.2)</span>
            <p className={styles.lineHeightTight}>
              Tight line height is useful for headings and titles where you want compact text.
              This makes multi-line headings feel more cohesive and less spaced out.
            </p>
          </div>
          <div className={styles.lineHeightExample}>
            <span className={styles.lineHeightLabel}>--line-height-normal (1.5)</span>
            <p className={styles.lineHeightNormal}>
              Normal line height is the default for body text. It provides good readability
              without taking up too much vertical space. Perfect for most content.
            </p>
          </div>
          <div className={styles.lineHeightExample}>
            <span className={styles.lineHeightLabel}>--line-height-relaxed (1.6)</span>
            <p className={styles.lineHeightRelaxed}>
              Relaxed line height provides extra breathing room between lines. This is great
              for longer form content where comfort and readability are prioritized.
            </p>
          </div>
          <div className={styles.lineHeightExample}>
            <span className={styles.lineHeightLabel}>--line-height-loose (2.0)</span>
            <p className={styles.lineHeightLoose}>
              Loose line height creates maximum space between lines. Use sparingly for
              special emphasis or when extra white space enhances the design.
            </p>
          </div>
        </div>
      </ComponentShowcase>

      {/* Letter Spacing */}
      <ComponentShowcase title="Letter Spacing" description="Horizontal spacing between characters">
        <div className={styles.section}>
          <div className={styles.spacingExample}>
            <span className={styles.spacingLabel}>--letter-spacing-tight (-0.02em)</span>
            <div className={styles.spacingTight}>Tight letter spacing for headings</div>
          </div>
          <div className={styles.spacingExample}>
            <span className={styles.spacingLabel}>--letter-spacing-normal (0)</span>
            <div className={styles.spacingNormal}>Normal letter spacing for body text</div>
          </div>
          <div className={styles.spacingExample}>
            <span className={styles.spacingLabel}>--letter-spacing-wide (0.02em)</span>
            <div className={styles.spacingWide}>Wide letter spacing for emphasis</div>
          </div>
          <div className={styles.spacingExample}>
            <span className={styles.spacingLabel}>--letter-spacing-wider (0.05em)</span>
            <div className={styles.spacingWider}>WIDER SPACING FOR UPPERCASE</div>
          </div>
        </div>
      </ComponentShowcase>

      {/* Usage Examples */}
      <ComponentShowcase
        title="Typography Combinations"
        description="Common text hierarchy patterns"
      >
        <div className={styles.hierarchySection}>
          <div className={styles.hierarchyExample}>
            <h1 className={styles.exampleH1}>Heading 1 - Main Title</h1>
            <h2 className={styles.exampleH2}>Heading 2 - Section Title</h2>
            <h3 className={styles.exampleH3}>Heading 3 - Subsection</h3>
            <p className={styles.exampleBody}>
              Body text uses the base font size with normal line height for optimal readability.
              This is the default text style for most content throughout the application.
            </p>
            <p className={styles.exampleCaption}>
              Caption text - smaller size for secondary information
            </p>
          </div>
        </div>
      </ComponentShowcase>
    </div>
  );
}
