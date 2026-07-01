import RegisterForm from "@/components/RegisterForm/RegisterForm";

export const metadata = {
  title: "Create an account — Decor N Art",
  description:
    "Join Decor N Art — restock alerts on craft materials, free delivery over ₹999, and a tidy home for every project you make.",
};

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
