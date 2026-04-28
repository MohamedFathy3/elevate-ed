import { LanguageProvider } from "@/i18n/LanguageContext";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { Courses } from "@/components/site/Courses";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";

const Index = () => {
  return (
    <LanguageProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Courses />
      </main>
      <Footer />
    </LanguageProvider>
  );
};

export default Index;
