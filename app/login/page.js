import LoginForm from "@/components/LoginForm/LoginForm";

export const metadata = {
  title: "Sign in — Decornart Atelier",
  description:
    "Sign in to your Decornart account — continue an order, revisit a saved bouquet, or check on a delivery.",
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
