import { LanguageProvider } from "@/i18n/LanguageContext";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Courses } from "@/components/site/Courses";
import { About } from "@/components/site/About";
import { Teacher } from "@/components/site/Teacher";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";

const Index = () => {
  return (
    <LanguageProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Courses />
        <About />
        <Teacher />
      </main>
      <Footer />
    </LanguageProvider>
  );
};

export default Index;
