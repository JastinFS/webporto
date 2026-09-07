import { useCallback, useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Atmosphere from './components/Atmosphere';
import ScrollProgress from './components/ScrollProgress';
import IntroLoader from './components/IntroLoader';
import CustomCursor from './components/CustomCursor';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import CursorTrail from './components/CursorTrail';
import Hero from './components/Hero';
import About from './components/About';
import { Divider } from './components/Ornaments';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import WallOfFame from './components/WallOfFame';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [mystic, setMystic] = useState(false);
  const enter = useCallback(() => setMystic(true), []);
  const leave = useCallback(() => setMystic(false), []);

  return (
    <SmoothScroll>
      <IntroLoader />
      <CustomCursor />
      <ScrollProgress />
      <div className="page">
        <Atmosphere />
        <CursorTrail active={mystic} />
        <Navbar />
        <main>
          <Hero onMysticEnter={enter} onMysticLeave={leave} />
          <About onMysticEnter={enter} onMysticLeave={leave} />
          <Divider />
          <Skills />
          <ErrorBoundary><Certifications /></ErrorBoundary>
          <Projects />
          <Contact />
          <ErrorBoundary><WallOfFame /></ErrorBoundary>
          <Footer />
        </main>
        <BackToTop />
      </div>
    </SmoothScroll>
  );
}
