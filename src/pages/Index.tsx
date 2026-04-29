import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Courses } from "@/components/site/Courses";
import { About } from "@/components/site/About";
import { Teacher } from "@/components/site/Teacher";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { PlanetsBackground } from "@/components/site/PlanetsBackground";

const Index = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PlanetsBackground />
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
    </ThemeProvider>
  );
};

export default Index;
