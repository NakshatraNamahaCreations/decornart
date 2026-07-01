import LoginForm from "@/components/LoginForm/LoginForm";

export const metadata = {
  title: "Sign in — Decor N Art",
  description:
    "Sign in to your Decor N Art account — track an order, restock a favourite material, or open your saved project wishlist.",
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
