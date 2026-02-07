'use client'
import { useEffect, useState } from 'react'
import { useProcess } from '@/context/ProcessContext';
import { useAuth } from '@/context/AuthContext';
import { Webdata } from '@/data/data';
import About from './About';
import Projects from './Projects';
import Hero from './Hero';
import Contact from './Contact';
import Services from './Services';
import Testimonials from './Testimonials';
import Footer from './Footer';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

function HomePage({ initialUserDetails }: { initialUserDetails?: any }) {
  const { selectedProcess } = useProcess();
  const { user } = useAuth();
  const activeData = selectedProcess || Webdata.processes.visionPlus;
  const [questions, setQuestions] = useState<any[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Smooth scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  console.log("selected proces", selectedProcess)

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user || !activeData?.name) return;
      const key = Object.keys(Webdata.processes).find(
        (k) => (Webdata.processes as any)[k].name === activeData.name
      );
      if (!key) return;
      const res = await fetch(`/api/process/${key}?userId=${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    };
    fetchQuestions();
  }, [user, activeData]);

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-[9999] shadow-lg"
        style={{ scaleX }}
      />

      <main className='min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden'>
        {/* Subtle background pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${activeData?.style?.primary_color || '#0f172a'} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Hero Section with enhanced spacing */}
        <section id="home" className="relative z-10">
          <Hero webData={activeData} initialUserDetails={initialUserDetails} />
        </section>

        {/* About Section with fade-in animation */}
        <motion.section 
          id="about"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <About webData={activeData} />
        </motion.section>

        {/* Services Section with slide-in animation */}
        {'services' in activeData && activeData.services && (
          <motion.section 
            id="services"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Services webData={activeData} />
          </motion.section>
        )}

        {/* Projects Section with stagger animation */}
        {activeData?.projects && (
          <motion.section 
            id="projects"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Projects webData={activeData} />
          </motion.section>
        )}

        {/* Testimonials Section with scale animation */}
        {'testimonials' in activeData && activeData.testimonials && (
          <motion.section 
            id="testimonials"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Testimonials webData={activeData} />
          </motion.section>
        )}

        {/* Contact Section with fade-in animation */}
        <motion.section 
          id="contact"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Contact webData={activeData} />
        </motion.section>

        {/* Footer */}
        <div className="relative z-10">
          <Footer webData={activeData} />
        </div>
      </main>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[9998] p-4 rounded-full shadow-2xl backdrop-blur-xl border border-white/20 transition-all duration-300 group"
            style={{ 
              backgroundColor: activeData?.style?.primary_color || '#0f172a',
              color: activeData?.style?.accent_color || '#ffffff'
            }}
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default HomePage
