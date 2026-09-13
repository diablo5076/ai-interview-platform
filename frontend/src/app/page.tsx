import Navbar from "@/lib/components/landing/Navbar";
import Hero from "@/lib/components/landing/Hero";
import TrustedBy from "@/lib/components/landing/TrustedBy";
import Features from "@/lib/components/landing/Features";
import HowItWorks from "@/lib/components/landing/HowItWorks";
import DashboardPreview from "@/lib/components/landing/DashboardPreview";
import Testimonials from "@/lib/components/landing/Testimonials";
import FAQ from "@/lib/components/landing/FAQ";
import Footer from "@/lib/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}