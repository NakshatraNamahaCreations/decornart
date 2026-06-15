import ContactHero from "@/components/ContactHero/ContactHero";
import ContactForm from "@/components/ContactForm/ContactForm";

export const metadata = {
  title: "Contact — Decornart Atelier",
  description:
    "Write to the Decornart atelier — bespoke bouquets, press enquiries, wholesale, or simply a visit. We reply within a day, by hand.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactForm />
    </main>
  );
}
