import { Dashboard } from "@/components/dashboard";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <Dashboard />
    </>
  );
}
