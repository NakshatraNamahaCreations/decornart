"use client";

import { useEffect, useRef } from "react";
import styles from "./FilterSidebar.module.css";

function FilterSection({ title, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function CheckboxRow({ id, label, checked, onChange }) {
  return (
    <label className={styles.row} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
      />
      <span className={styles.rowLabel}>{label}</span>
    </label>
  );
}

function RadioRow({ name, id, label, checked, onChange }) {
  return (
    <label className={styles.row} htmlFor={id}>
      <input
        type="radio"
        name={name}
        id={id}
        checked={checked}
        onChange={onChange}
        className={styles.radio}
      />
      <span className={styles.rowLabel}>{label}</span>
    </label>
  );
}

export default function FilterSidebar({
  categoryOptions,
  occasionOptions,
  priceRanges,
  searchValue,
  filters,
  activeFilterCount,
  onSearchChange,
  onToggleCategory,
  onToggleOccasion,
  onSetPriceRange,
  onClear,
  isDrawerOpen,
  onCloseDrawer,
}) {
  const closeBtnRef = useRef(null);

  // When the mobile drawer opens, focus its close button and dismiss on Esc.
  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCloseDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, onCloseDrawer]);

  const categorySelected = new Set(filters.categories);
  const occasionSelected = new Set(filters.occasions);

  return (
    <>
      <aside
        className={`${styles.sidebar} ${isDrawerOpen ? styles.open : ""}`}
        aria-label="Filters"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Filters</span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onCloseDrawer}
            className={styles.drawerClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>Refine</span>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                className={styles.clear}
                onClick={onClear}
              >
                Clear ({activeFilterCount})
              </button>
            ) : null}
          </div>

          <FilterSection title="Search">
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search bouquets"
              aria-label="Search bouquets"
              className={styles.search}
            />
          </FilterSection>

          <FilterSection title="Category">
            {categoryOptions.map((opt) => (
              <CheckboxRow
                key={opt.id}
                id={`cat-${opt.id}`}
                label={opt.label}
                checked={categorySelected.has(opt.id)}
                onChange={() => onToggleCategory(opt.id)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Occasion">
            {occasionOptions.map((opt) => (
              <CheckboxRow
                key={opt.id}
                id={`occ-${opt.id}`}
                label={opt.label}
                checked={occasionSelected.has(opt.id)}
                onChange={() => onToggleOccasion(opt.id)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Price">
            {priceRanges.map((opt) => (
              <RadioRow
                key={opt.id}
                name="price-range"
                id={`price-${opt.id}`}
                label={opt.label}
                checked={filters.priceRangeId === opt.id}
                onChange={() => onSetPriceRange(opt.id)}
              />
            ))}
          </FilterSection>
        </div>

        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.apply}
            onClick={onCloseDrawer}
          >
            Show results
          </button>
        </div>
      </aside>

      {isDrawerOpen ? (
        <button
          type="button"
          aria-label="Close filters"
          className={styles.scrim}
          onClick={onCloseDrawer}
          tabIndex={-1}
        />
      ) : null}
    </>
  );
}
