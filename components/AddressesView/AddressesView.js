"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import {
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiGift,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRotateCcw,
} from "react-icons/fi";
import heroImg from "@/assets/banner.png";
import styles from "./AddressesView.module.css";

const ICONS = {
  home: <FiHome />,
  office: <FiBriefcase />,
  gift: <FiGift />,
  pin: <FiMapPin />,
};

const SEED_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    icon: "home",
    isDefault: true,
    line1: "12, 3rd Cross, 7th Main Layout",
    line2: "Sector 2, Bengaluru, Karnataka – 560102",
    phone: "+91 9986988786",
  },
  {
    id: "office",
    label: "Office",
    icon: "office",
    line1: "DecorNArt Studio, 15th Main",
    line2: "Koramangala, Bengaluru, Karnataka – 560034",
    phone: "+91 9986988786",
  },
];

const TRUST = [
  { id: "secure", title: "Secure Delivery", copy: "Verified addresses only", icon: <FiShield /> },
  { id: "fast", title: "Pan-India Shipping", copy: "Fast & reliable", icon: <FiTruck /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
];

const emptyDraft = {
  label: "",
  icon: "home",
  line1: "",
  line2: "",
  phone: "",
  isDefault: false,
};

export default function AddressesView() {
  const root = useRef(null);
  const [addresses, setAddresses] = useState(SEED_ADDRESSES);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setDraft({
      label: a.label || "",
      icon: a.icon || "home",
      line1: a.line1 || "",
      line2: a.line2 || "",
      phone: a.phone || "",
      isDefault: !!a.isDefault,
    });
    setFormOpen(true);
  };

  const cancelForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const saveAddress = (e) => {
    e.preventDefault();
    const { label, line1 } = draft;
    if (!label.trim() || !line1.trim()) return;
    const cleaned = { ...draft, label: label.trim(), line1: line1.trim() };
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, ...cleaned } : cleaned.isDefault ? { ...a, isDefault: false } : a
        )
      );
    } else {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => {
        const next = cleaned.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [...next, { id, ...cleaned }];
      });
    }
    cancelForm();
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) cancelForm();
  };

  const makeDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="My addresses">
        <div className={styles.heroDeco} aria-hidden="true">
          <Image
            src={heroImg}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <nav aria-label="Breadcrumb" className={styles.crumb}>
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/account">Account</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Addresses</span>
            </nav>
            <h1 className={styles.heroTitle}>
              My Addresses{" "}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>
              Keep your delivery details ready — set a default, add gift-recipient
              addresses, or clean up ones you don&rsquo;t use anymore.
            </p>
            <button
              type="button"
              onClick={openAdd}
              className={styles.heroBtn}
            >
              <FiPlus /> Add New Address
            </button>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Addresses grid ─────────── */}
        <section className={styles.grid} aria-label="Saved addresses">
          {addresses.length === 0 && (
            <div className={styles.empty}>
              <FiMapPin size={28} />
              <strong>No addresses saved yet</strong>
              <span>Add your first address to speed up checkout.</span>
              <button
                type="button"
                onClick={openAdd}
                className={styles.emptyBtn}
              >
                Add an address <FiArrowRight />
              </button>
            </div>
          )}

          {addresses.map((a) => (
            <article key={a.id} className={styles.card}>
              <header className={styles.cardHead}>
                <span className={styles.cardIcon} aria-hidden="true">
                  {ICONS[a.icon] || <FiMapPin />}
                </span>
                <div className={styles.cardTitleRow}>
                  <strong className={styles.cardLabel}>{a.label}</strong>
                  {a.isDefault && (
                    <span className={styles.defaultChip}>Default</span>
                  )}
                </div>
              </header>
              <div className={styles.cardBody}>
                <span>{a.line1}</span>
                {a.line2 && <span>{a.line2}</span>}
                {a.phone && (
                  <span className={styles.cardPhone}>{a.phone}</span>
                )}
              </div>
              <div className={styles.cardActions}>
                {!a.isDefault && (
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => makeDefault(a.id)}
                  >
                    Set as default
                  </button>
                )}
                <div className={styles.iconActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    aria-label={`Edit ${a.label}`}
                    onClick={() => openEdit(a)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    aria-label={`Delete ${a.label}`}
                    onClick={() => deleteAddress(a.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {/* Add-address tile */}
          {!formOpen && addresses.length > 0 && (
            <button
              type="button"
              className={styles.addTile}
              onClick={openAdd}
            >
              <span className={styles.addTileIcon} aria-hidden="true">
                <FiPlus />
              </span>
              <strong>Add New Address</strong>
              <span>Save a new home, office or gift address</span>
            </button>
          )}
        </section>

        {/* ─────────── 3. Address form ─────────── */}
        {formOpen && (
          <section className={styles.formCard} aria-label="Address form">
            <header className={styles.formHead}>
              <h2 className={styles.formTitle}>
                {editingId ? "Edit address" : "Add a new address"}
              </h2>
              <p className={styles.formLead}>
                Give it a memorable label and the courier will find you.
              </p>
            </header>
            <form className={styles.form} onSubmit={saveAddress}>
              <div className={styles.formRow}>
                <label className={styles.field}>
                  <span>Label</span>
                  <input
                    type="text"
                    placeholder="Home, Office, Mom's place…"
                    value={draft.label}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, label: e.target.value }))
                    }
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>Type</span>
                  <select
                    value={draft.icon}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, icon: e.target.value }))
                    }
                  >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="gift">Gift</option>
                    <option value="pin">Other</option>
                  </select>
                </label>
              </div>
              <label className={styles.field}>
                <span>Address line 1</span>
                <input
                  type="text"
                  placeholder="Flat / House no, Street"
                  value={draft.line1}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, line1: e.target.value }))
                  }
                  required
                />
              </label>
              <label className={styles.field}>
                <span>Address line 2</span>
                <input
                  type="text"
                  placeholder="Area, City, State – PIN"
                  value={draft.line2}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, line2: e.target.value }))
                  }
                />
              </label>
              <label className={styles.field}>
                <span>Phone</span>
                <input
                  type="tel"
                  placeholder="+91 9986988786"
                  value={draft.phone}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, phone: e.target.value }))
                  }
                />
              </label>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={draft.isDefault}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, isDefault: e.target.checked }))
                  }
                />
                <span>Set as default address</span>
              </label>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={cancelForm}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  <FiCheck />{" "}
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ─────────── 4. Trust strip ─────────── */}
        <section className={styles.trustStrip}>
          <ul className={styles.trustList}>
            {TRUST.map((t) => (
              <li key={t.id} className={styles.trustRow}>
                <span className={styles.trustIcon} aria-hidden="true">
                  {t.icon}
                </span>
                <span className={styles.trustText}>
                  <strong>{t.title}</strong>
                  <span>{t.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
