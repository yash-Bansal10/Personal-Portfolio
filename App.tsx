
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AuroraBackground from './components/AuroraBackground';
import ExplainerModal from './components/ExplainerModal';
import CalculatorExplainerModal from './components/CalculatorExplainerModal';
import Meals4AllExplainerModal from './components/Meals4AllExplainerModal';

/**
 * The main component for the entire application.
 * It orchestrates the layout, state management for navigation and modals,
 * and renders all the major sections of the portfolio.
 */
const App: React.FC = () => {
  // State to track the currently visible section for highlighting the active nav link.
  const [activeSection, setActiveSection] = useState<string>('home');
  // State to manage which project explainer modal is currently open.
  const [activeModal, setActiveModal] = useState<'ecosystem' | 'calculator' | 'meals' | null>(null);

  // Effect to handle the exit animation for the pre-loader.
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      // Add a slight delay to ensure content is ready before fading out.
      setTimeout(() => {
        loader.classList.add('loaded');
        // Remove the loader from the DOM after the animation completes.
        setTimeout(() => {
          loader.remove();
        }, 500); // This duration should match the CSS transition duration.
      }, 500);
    }
  }, []);

  // Refs for each major section to be observed by the Intersection Observer.
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Effect to set up an Intersection Observer for "scroll-spying".
  // This detects which section is currently in the viewport and updates the activeSection state.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // The rootMargin is configured to trigger the intersection when a section
      // is in the middle 40% of the viewport height.
      { rootMargin: '-30% 0px -70% 0px' }
    );

    // Observe each section ref.
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Cleanup function to unobserve all elements when the component unmounts.
    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  // Handlers for opening and closing the project modals.
  const handleOpenModal = (modalType: 'ecosystem' | 'calculator' | 'meals') => setActiveModal(modalType);
  const handleCloseModal = () => setActiveModal(null);

  // Effect to prevent body scroll when a modal is open.
  useEffect(() => {
    if(activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeModal]);


  return (
    <div className="bg-[#0a0a0a] text-gray-100 min-h-screen font-sans antialiased relative">
      {/* The animated gradient background component */}
      <AuroraBackground />

      {/* Render project explainer modals. They are only visible when their corresponding state is active. */}
      <ExplainerModal isOpen={activeModal === 'ecosystem'} onClose={handleCloseModal} />
      <CalculatorExplainerModal isOpen={activeModal === 'calculator'} onClose={handleCloseModal} />
      <Meals4AllExplainerModal isOpen={activeModal === 'meals'} onClose={handleCloseModal} />
      
      {/* The main content is layered on top of the background with a relative z-index. */}
      <div className="relative z-10">
        <Header activeSection={activeSection} />
        <main className="container mx-auto px-6 md:px-12">
          {/* Each section is wrapped in a div with an ID and a ref for the Intersection Observer. */}
          <div id="home" ref={sectionRefs.home}>
            <Hero />
          </div>
          <div id="about" ref={sectionRefs.about} className="pt-24">
            <About />
          </div>
          <div id="projects" ref={sectionRefs.projects} className="pt-24">
            <Projects onOpenModal={handleOpenModal} />
          </div>
          <div id="contact" ref={sectionRefs.contact} className="pt-24 pb-24">
            <Contact />
          </div>
        </main>
        <footer className="text-center py-8 border-t border-white/10">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Yash Bansal. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;