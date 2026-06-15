"use client";

import { useId } from "react";
import styles from "./SortBar.module.css";

export default function SortBar({
  count,
  sort,
  sortOptions,
  activeFilterCount,
  onSortChange,
  onOpenFilters,
}) {
  const selectId = useId();

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <button
          type="button"
          onClick={onOpenFilters}
          className={styles.filtersBtn}
          aria-label="Open filters"
        >
          Filters
          {activeFilterCount > 0 ? (
            <span className={styles.badge}>{activeFilterCount}</span>
          ) : null}
        </button>
        <span className={styles.count}>
          {count} {count === 1 ? "bouquet" : "bouquets"}
        </span>
      </div>

      <div className={styles.right}>
        <label htmlFor={selectId} className={styles.sortLabel}>
          Sort
        </label>
        <div className={styles.selectWrap}>
          <select
            id={selectId}
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className={styles.select}
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className={styles.caret}>
            ⌄
          </span>
        </div>
      </div>
    </div>
  );
}
