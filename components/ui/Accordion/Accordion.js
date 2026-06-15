"use client";

import { useId, useState } from "react";
import styles from "./Accordion.module.css";

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = "",
}) {
  const baseId = useId();
  const [open, setOpen] = useState(() => new Set(defaultOpen));

  const toggle = (idx) =>
    setOpen((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set();
      if (prev.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });

  return (
    <div className={`${styles.root} ${className}`}>
      {items.map((item, idx) => {
        const isOpen = open.has(idx);
        const panelId = `${baseId}-panel-${idx}`;
        const buttonId = `${baseId}-btn-${idx}`;
        return (
          <div
            key={item.q || idx}
            className={`${styles.item} ${isOpen ? styles.open : ""}`}
          >
            <h3 className={styles.heading}>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(idx)}
                className={styles.trigger}
              >
                <span className={styles.question}>{item.q}</span>
                <span aria-hidden="true" className={styles.icon}>
                  <span className={styles.iconBar} />
                  <span
                    className={`${styles.iconBar} ${styles.iconBarV}`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={styles.panel}
            >
              <div className={styles.panelInner}>{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
