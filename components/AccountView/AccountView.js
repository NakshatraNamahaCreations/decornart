"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/components/providers/AuthProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { listOrders } from "@/lib/api/orders";
import styles from "./AccountView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "wishlist", label: "Wishlist" },
  { id: "profile", label: "Profile" },
];

const statusClassFor = (status) => {
  if (status === "delivered" || status === "Delivered") return styles.statusGood;
  if (status === "confirmed" || status === "shipped" || status === "In transit") return styles.statusBusy;
  if (status === "cancelled" || status === "Cancelled") return styles.statusBad;
  return "";
};

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AccountView() {
  const root = useRef(null);
  const router = useRouter();
  const { user, isAuthed, isLoading, logout, addAddress } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [savedNote, setSavedNote] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [addrForm, setAddrForm] = useState({
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });
  const [showAddrForm, setShowAddrForm] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthed) router.replace("/login");
  }, [isLoading, isAuthed, router]);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;
    setOrdersLoading(true);
    listOrders({ limit: 20 })
      .then((data) => {
        if (cancelled) return;
        setOrders(data || []);
      })
      .catch(() => {})
      .finally(() => !cancelled && setOrdersLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  const handleLogout = async () => {
    setConfirmLogout(false);
    await logout();
    router.push("/login");
  };

  const onProfileChange = (key) => (e) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }));

  const saveProfile = (e) => {
    e.preventDefault();
    // No "PATCH /auth/me" endpoint yet; visible UX only.
    setSavedNote("Profile saved locally — server profile edit is coming soon.");
    setTimeout(() => setSavedNote(""), 2400);
  };

  const onAddrChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setAddrForm((p) => ({ ...p, [key]: value }));
  };

  const submitAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(addrForm);
      setAddrForm({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        isDefault: false,
      });
      setShowAddrForm(false);
    } catch {
      /* surface a toast later */
    }
  };

  useGSAP(
    () => {
      gsap.from(
        `.${styles.crumbs}, .${styles.eyebrow}, .${styles.heading}, .${styles.rule}, .${styles.lead}`,
        { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      );
      gsap.from(`.${styles.panel}`, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { scope: root, dependencies: [tab] }
  );

  if (isLoading || !user) {
    return (
      <section className={styles.section}>
        <div className="container" style={{ padding: "6rem 0", opacity: 0.6 }}>
          Loading…
        </div>
      </section>
    );
  }

  const addresses = user.addresses || [];
  const defaultAddr = addresses.find((a) => a.isDefault);

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>Account</span>
        </nav>

        <header className={styles.head}>
          <span className={styles.eyebrow}>— Welcome back</span>
          <h1 className={styles.heading}>
            Hello, <em>{(user.name || "").split(" ")[0] || "friend"}</em>.
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            Your private dashboard — orders, saved addresses, wishlist, and
            profile, all in one quiet place.
          </p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.identity}>
              <span className={styles.avatar} aria-hidden="true">
                {(user.name || "?").charAt(0)}
              </span>
              <div>
                <span className={styles.idName}>{user.name}</span>
                <span className={styles.idMeta}>{user.email}</span>
              </div>
            </div>

            <nav className={styles.nav} aria-label="Account sections">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`${styles.navBtn} ${
                    tab === t.id ? styles.navBtnActive : ""
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              className={styles.signOut}
              onClick={() => setConfirmLogout(true)}
            >
              Sign out
            </button>
          </aside>

          <div className={styles.panel}>
            {tab === "overview" && (
              <div className={styles.overview}>
                <div className={styles.cards}>
                  <article className={styles.statCard}>
                    <span className={styles.statLabel}>Orders</span>
                    <span className={styles.statValue}>
                      {String(orders.length).padStart(2, "0")}
                    </span>
                  </article>
                  <article className={styles.statCard}>
                    <span className={styles.statLabel}>Saved addresses</span>
                    <span className={styles.statValue}>
                      {String(addresses.length).padStart(2, "0")}
                    </span>
                  </article>
                  <article className={styles.statCard}>
                    <span className={styles.statLabel}>Wishlist</span>
                    <span className={styles.statValue}>
                      {String(wishlistItems.length).padStart(2, "0")}
                    </span>
                  </article>
                </div>

                <div className={styles.section2}>
                  <div className={styles.section2Head}>
                    <h2 className={styles.section2Heading}>Recent orders</h2>
                    <button
                      type="button"
                      onClick={() => setTab("orders")}
                      className={styles.linkBtn}
                    >
                      See all <span aria-hidden="true">→</span>
                    </button>
                  </div>
                  <ul className={styles.orderList}>
                    {orders.slice(0, 3).map((o) => (
                      <li key={o.id} className={styles.orderRow}>
                        <div className={styles.orderMain}>
                          <span className={styles.orderId}>#{o.orderNumber}</span>
                          <span className={styles.orderPrimary}>
                            {o.items?.[0]?.name || "Order"}
                            {o.items && o.items.length > 1 && (
                              <span className={styles.orderExtra}>
                                {" "} · +{o.items.length - 1} more
                              </span>
                            )}
                          </span>
                          <span className={styles.orderDate}>{formatDate(o.createdAt)}</span>
                        </div>
                        <span className={styles.orderTotal}>
                          {inr.format(o.summary?.total || 0)}
                        </span>
                        <span
                          className={`${styles.statusPill} ${statusClassFor(o.status)}`}
                        >
                          {o.status}
                        </span>
                      </li>
                    ))}
                    {!orders.length && !ordersLoading && (
                      <li style={{ opacity: 0.6 }}>No orders yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div>
                <h2 className={styles.panelHeading}>Order history</h2>
                <p className={styles.panelLead}>
                  Every bouquet you've sent or received through Decornart.
                </p>
                <ul className={styles.orderList}>
                  {ordersLoading && <li style={{ opacity: 0.6 }}>Loading…</li>}
                  {orders.map((o) => (
                    <li key={o.id} className={styles.orderRow}>
                      <div className={styles.orderMain}>
                        <span className={styles.orderId}>#{o.orderNumber}</span>
                        <span className={styles.orderPrimary}>
                          {o.items?.[0]?.name || "Order"}
                          {o.items && o.items.length > 1 && (
                            <span className={styles.orderExtra}>
                              {" "} · +{o.items.length - 1} more
                            </span>
                          )}
                        </span>
                        <span className={styles.orderDate}>{formatDate(o.createdAt)}</span>
                      </div>
                      <span className={styles.orderTotal}>
                        {inr.format(o.summary?.total || 0)}
                      </span>
                      <span
                        className={`${styles.statusPill} ${statusClassFor(o.status)}`}
                      >
                        {o.status}
                      </span>
                    </li>
                  ))}
                  {!orders.length && !ordersLoading && (
                    <li style={{ opacity: 0.6 }}>No orders yet.</li>
                  )}
                </ul>
              </div>
            )}

            {tab === "addresses" && (
              <div>
                <div className={styles.section2Head}>
                  <h2 className={styles.panelHeading}>Saved addresses</h2>
                  <button
                    type="button"
                    className={styles.cta}
                    onClick={() => setShowAddrForm((v) => !v)}
                  >
                    {showAddrForm ? "Cancel" : "+ Add new"}
                  </button>
                </div>

                {showAddrForm && (
                  <form className={styles.addrForm} onSubmit={submitAddress}>
                    <header className={styles.addrFormHead}>
                      <h3 className={styles.addrFormTitle}>New address</h3>
                      <span className={styles.addrFormHint}>
                        — Where the bouquet should arrive
                      </span>
                    </header>

                    <div className={styles.addrFormGrid}>
                      <label className={`${styles.field} ${styles.fieldFull}`}>
                        <span className={styles.fieldLabel}>Label</span>
                        <input
                          type="text"
                          placeholder="Home, Office...."
                          value={addrForm.label}
                          onChange={onAddrChange("label")}
                          className={styles.input}
                        />
                      </label>

                      <label className={`${styles.field} ${styles.fieldFull}`}>
                        <span className={styles.fieldLabel}>Address line 1</span>
                        <input
                          type="text"
                          required
                          placeholder="Flat / house no, building"
                          value={addrForm.line1}
                          onChange={onAddrChange("line1")}
                          className={styles.input}
                        />
                      </label>

                      <label className={`${styles.field} ${styles.fieldFull}`}>
                        <span className={styles.fieldLabel}>Address line 2 (optional)</span>
                        <input
                          type="text"
                          placeholder="Street, area, landmark"
                          value={addrForm.line2}
                          onChange={onAddrChange("line2")}
                          className={styles.input}
                        />
                      </label>

                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>City</span>
                        <input
                          type="text"
                          required
                          value={addrForm.city}
                          onChange={onAddrChange("city")}
                          autoComplete="address-level2"
                          className={styles.input}
                        />
                      </label>

                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>State</span>
                        <input
                          type="text"
                          required
                          value={addrForm.state}
                          onChange={onAddrChange("state")}
                          autoComplete="address-level1"
                          className={styles.input}
                        />
                      </label>

                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Pincode</span>
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                          placeholder="6 digits"
                          value={addrForm.pincode}
                          onChange={onAddrChange("pincode")}
                          autoComplete="postal-code"
                          className={styles.input}
                        />
                      </label>

                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Phone</span>
                        <input
                          type="tel"
                          required
                          placeholder="+91"
                          value={addrForm.phone}
                          onChange={onAddrChange("phone")}
                          autoComplete="tel"
                          className={styles.input}
                        />
                      </label>

                      <label className={`${styles.checkbox} ${styles.fieldFull}`}>
                        <input
                          type="checkbox"
                          checked={addrForm.isDefault}
                          onChange={onAddrChange("isDefault")}
                        />
                        <span>Set this as my default delivery address</span>
                      </label>
                    </div>

                    <div className={styles.addrFormFoot}>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() => setShowAddrForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className={styles.cta}>
                        Save address <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className={styles.addresses}>
                  {addresses.map((a, i) => (
                    <article key={a._id || i} className={styles.addrCard}>
                      <header className={styles.addrHead}>
                        <span className={styles.addrLabel}>{a.label || `Address ${i + 1}`}</span>
                        {a.isDefault && (
                          <span className={styles.addrDefault}>Default</span>
                        )}
                      </header>
                      <p className={styles.addrBody}>
                        {a.line1}
                        {a.line2 && <><br />{a.line2}</>}
                        <br />
                        {a.city}, {a.state} {a.pincode}
                        <br />
                        {a.phone}
                      </p>
                    </article>
                  ))}
                  {!addresses.length && !showAddrForm && (
                    <p style={{ opacity: 0.6 }}>No addresses saved yet.</p>
                  )}
                </div>
              </div>
            )}

            {tab === "wishlist" && (
              <div>
                <div className={styles.section2Head}>
                  <h2 className={styles.panelHeading}>Saved pieces</h2>
                  <a href="/wishlist" className={styles.linkBtn}>
                    Open full wishlist <span aria-hidden="true">→</span>
                  </a>
                </div>
                <ul className={styles.wishList}>
                  {wishlistItems.map((w) => (
                    <li key={w.productId || w.id} className={styles.wishRow}>
                      <div>
                        <span className={styles.wishName}>{w.name}</span>
                        <span className={styles.wishOcc}>{w.category}</span>
                      </div>
                      <span className={styles.wishPrice}>
                        {inr.format(w.price)}
                      </span>
                    </li>
                  ))}
                  {!wishlistItems.length && (
                    <li style={{ opacity: 0.6 }}>Nothing saved yet.</li>
                  )}
                </ul>
              </div>
            )}

            {tab === "profile" && (
              <form onSubmit={saveProfile}>
                <h2 className={styles.panelHeading}>Your profile</h2>
                <p className={styles.panelLead}>
                  Personal details we use only for your orders.
                </p>

                <div className={styles.row2}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Name</span>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={onProfileChange("name")}
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email</span>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={onProfileChange("email")}
                      className={styles.input}
                      readOnly
                    />
                  </label>
                </div>

                <div className={styles.row2}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Phone</span>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={onProfileChange("phone")}
                      className={styles.input}
                    />
                  </label>
                </div>

                <div className={styles.submitRow}>
                  <button type="submit" className={styles.cta}>
                    Save changes <span aria-hidden="true">→</span>
                  </button>
                  {savedNote && (
                    <span className={styles.savedNote}>{savedNote}</span>
                  )}
                </div>
              </form>
            )}

          </div>
        </div>
      </div>

      {confirmLogout && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-heading"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="logout-heading" className={styles.modalHeading}>
              Are you sure you want to <em>log out</em>?
            </h2>
            <p className={styles.modalCopy}>
              You'll be signed out of the atelier and returned to the sign-in
              page.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancel}
                onClick={() => setConfirmLogout(false)}
              >
                Stay signed in
              </button>
              <button
                type="button"
                className={styles.modalConfirm}
                onClick={handleLogout}
              >
                Yes, sign out <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
