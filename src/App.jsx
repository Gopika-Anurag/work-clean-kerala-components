// src/App.jsx
import React from "react";
import ActivitiesCarousel from "./components/ActivitiesCarousel";
import ProjectsCarousel from "./components/ProjectsCarousel";
import StepByStepCarousel from "./components/StepByStepCarosel";
import AboutUsCarousel from "./components/AboutUsCarousel";
import AboutUsSection from "./components/AboutUsSection"; // ✅ You missed this import

import {
  activitiesAtGlance,
  activitiesAtGlanceSettings,
  ourProjects,
  ourProjectsCarouselSettings,
  steps,
  stepByStepCarouselSettings,
  carouselData,
  aboutUsHomepage,
  aboutUsHomepagemore,
} from "./data/Carouseldata"; // ✅ Make sure this file exports all of these
import AboutUsSectionmore from "./components/AboutUsSectionmore";
import AboutUsCarouselBG from "./components/AboutUsCarouselBG";
import Ourprojectsdescription from "./components/Ourprojectsdescription";
import {Projectsdescription, ProjectsdescriptionSettings } from "./data/Projectdescriptiondata"
import { portfolioData } from "./data/portfolioData";
import PortfolioCardWithCarousel from "./components/PortfolioCardWithCarousel";
import StepByStepProcess from "./components/StepByStepProcess";
import stepByStepProcessDefaults from './data/stepByStepProcessData';
import CountrySlideCard from "./components/CountrySlideCard";
import useCasesByCountrySettings from './data/useCasesByCountrySettings'; 
import Testimonials from "./components/Testimonials";
import PccFeatures from "./components/PccFeatures";
import FastHelpCard from "./components/FastHelpCard";
import DeliveryOptionsCard from "./components/DeliveryOptionsCard";
import deliveryOptionsData from "./data/deliveryOptionsData";
import MicroConversionCTA from "./components/MicroConversionCTA";
import TeamSection from "./components/TeamSection";
import { teamData } from "./data/teamData";
import CircularList from "./components/CircularList";
import ProjectsSection from "./components/ProjectsSection";
import Directors from "./components/Directors";
import directorsData from "./data/directorsData";
import ServiceCarousel from "./components/ServiceCarousel";
import { services } from "./data/servicesData";
import ServiceExplainer from "./components/ServiceExplainer";
import serviceExplainerData from "./data/serviceExplainerData";
import healthServicesData from "./data/healthServicesData";
import HealthServices from "./components/healthServices";

function App() {
  
  return (
    
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full">

        <div>
          <HealthServices attributes={healthServicesData}/>
        </div>

        <div>
          <ServiceExplainer attributes={serviceExplainerData}/>
        </div>

        <div>
      <ServiceCarousel attributes={services}/>
    </div>

        <div>
      <Directors attributes={directorsData}/>
    </div>

        <div>
      <ProjectsSection/>
    </div>

        <div>
      <CircularList/>
    </div>

        <div>
      <TeamSection attributes={teamData} />
    </div>

         <div>
                <MicroConversionCTA/>

        </div>

        <div>
                <DeliveryOptionsCard data={deliveryOptionsData} />

        </div>

        <div>
      <FastHelpCard />
    </div>

        <div>
      <PccFeatures />
    </div>

        <div>
      <Testimonials />
    </div>

        <div>
            <CountrySlideCard attributes={useCasesByCountrySettings} />
        </div>

        <div>
            <StepByStepProcess attributes={stepByStepProcessDefaults} />
        </div>


        <section className="my-12 bg-white py-8">
  <PortfolioCardWithCarousel data={portfolioData} />
</section>


        <section className="my-12">
          <ActivitiesCarousel items={activitiesAtGlance} settings={activitiesAtGlanceSettings} />
        </section>

        <section className="my-12">
          <Ourprojectsdescription projects={Projectsdescription} settings={ProjectsdescriptionSettings} />
        </section>
        
        <AboutUsSection
        carouselData={carouselData}
        aboutUsHomepage={aboutUsHomepage}
      />
    <br />
      <AboutUsSectionmore
        carouselData={carouselData}
        aboutUsHomepagemore={aboutUsHomepagemore}
      />

        <div className="min-h-fit bg-gray-100">
        <AboutUsCarousel />
      </div>

      <br />

      <div className="min-h-fit bg-gray-100">
        <AboutUsCarouselBG />
      </div>

      <br />

        <section className="my-12">
          <ProjectsCarousel projects={ourProjects} settings={ourProjectsCarouselSettings} />
        </section>

        <section className="my-12">
          <StepByStepCarousel steps={steps} carouselSettings={stepByStepCarouselSettings} title="Our Process" />
        </section>

        <section className="my-12">
          <StepByStepCarousel steps={steps} carouselSettings={stepByStepCarouselSettings} title="Our Process" />
        </section>
      </div>

      
      
    </div>
  );
}

export default App;
