import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { StyleQuiz } from "@/components/sections/quiz";
import { Feedback } from "@/components/sections/feedback";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <StyleQuiz />
        <Feedback />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
