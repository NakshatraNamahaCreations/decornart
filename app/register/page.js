import RegisterForm from "@/components/RegisterForm/RegisterForm";

export const metadata = {
  title: "Create an account — Decornart Atelier",
  description:
    "Join the Decornart atelier — same-day delivery, the weekly handmade drop, and a quiet place to keep the bouquets you love.",
};

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
