import React, { useEffect } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';

export const AppContent: React.FC = () => {
  useEffect(() => {
    // Scroll reveal observer matching original implementation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 80);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="portfolio-app">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <AdminPortal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
};

export default App;
