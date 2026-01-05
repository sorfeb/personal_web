'use client';

import React from 'react';
import styles from './PropsTable.module.css';

export interface PropDefinition {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: PropDefinition[];
  className?: string;
}

/**
 * PropsTable - Documentation table for component props/API
 * Displays prop name, type, default value, and description
 */
export default function PropsTable({ props, className = '' }: PropsTableProps) {
  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}>Prop</th>
            <th className={styles.headerCell}>Type</th>
            <th className={styles.headerCell}>Default</th>
            <th className={styles.headerCell}>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className={styles.row}>
              <td className={styles.cell}>
                <code className={styles.propName}>{prop.name}</code>
                {prop.required && <span className={styles.required}>*</span>}
              </td>
              <td className={styles.cell}>
                <code className={styles.propType}>{prop.type}</code>
              </td>
              <td className={styles.cell}>
                {prop.defaultValue ? (
                  <code className={styles.defaultValue}>{prop.defaultValue}</code>
                ) : (
                  <span className={styles.noDefault}>—</span>
                )}
              </td>
              <td className={styles.cell}>
                <span className={styles.description}>{prop.description}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
