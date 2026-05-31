import { Hero } from "@/themes/default/components/site/Hero";
import { Stage } from "@/themes/default/components/site/Stage";
import { Future } from "@/themes/default/components/site/Future";
import { Courses } from "@/themes/default/components/site/Courses";
import { Books } from "@/themes/default/components/site/Books";
import { About } from "@/themes/default/components/site/About";
import { CenterHours } from "@/themes/default/components/site/CenterHours";


const TeacherHome = () => (
  <>
    <Hero />
    <Stage />
    {/* <Future /> */}
    <Courses limit={4} />
    <CenterHours  />

    <Books />
    <About />
  </>
);

export default TeacherHome;
