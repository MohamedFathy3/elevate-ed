import { Hero } from "@/components/site/Hero";
import { Stage } from "@/components/site/Stage";
import { Future } from "@/components/site/Future";
import { Courses } from "@/components/site/Courses";
import { Books } from "@/components/site/Books";
import { About } from "@/components/site/About";

const TeacherHome = () => (
  <>
    <Hero />
    <Stage />
    <Future />
    <Courses limit={4} />
    <Books />
    <About />
  </>
);

export default TeacherHome;
