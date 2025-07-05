// src/App.jsx
import React from "react";
import ActivitiesCarousel from "./components/ActivitiesCarousel";
import ProjectsCarousel from "./components/ProjectsCarousel";
import StepByStepCarousel from "./components/StepByStepCarosel";

import {
  activitiesAtGlance,
  activitiesAtGlanceSettings,
  ourProjects,
  ourProjectsCarouselSettings,
  steps,
  stepByStepCarouselSettings,
} from "./data/Carouseldata"; // Ensure this path is correct based on your project structure

function App() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full">
        {/* The ActivitiesCarousel component now directly imports commonCarouselStyles internally,
            so no need to pass it here. */}

        <section className="my-12">
          <ActivitiesCarousel items={activitiesAtGlance} settings={activitiesAtGlanceSettings} />
        </section>

   

        <section className="my-12">
          {/* Assuming ProjectsCarousel expects 'projects' and 'settings' props */}
          <ProjectsCarousel projects={ourProjects} settings={ourProjectsCarouselSettings} />
        </section>

     
        

        <section className="my-12">
          {/* Assuming StepByStepCarousel expects 'steps', 'carouselSettings', and 'title' props */}
          <StepByStepCarousel steps={steps} carouselSettings={stepByStepCarouselSettings} title="Our Process" />
        </section>

    

        <section className="my-12">
          {/* Another instance of StepByStepCarousel */}
          <StepByStepCarousel steps={steps} carouselSettings={stepByStepCarouselSettings} title="Our Process" />
        </section>

        {/* Add more sections or components as needed */}
      </div>
    </div>
  );
}

export default App;