import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { RhythmProvider } from './hooks/useRhythmEngine';
import { CustomCursor } from './components/CustomCursor';
import { Nav } from './components/Nav';
import { InkCharacter } from './components/InkCharacter';
import { BeatFlash } from './components/BeatFlash';
import { NowPlaying } from './components/NowPlaying';

import { Home }        from './pages/Home';
import { AboutMe }     from './pages/AboutMe';
import { MyGames }     from './pages/MyGames';
import { Projects }    from './pages/Projects';
import { HealthCheck } from './pages/HealthCheck';
import './index.css';

function AppContent() {
  const location  = useLocation();
  const isSpecial = location.pathname === '/health' || location.pathname === '/ping';

  if (isSpecial) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/ping"   element={<HealthCheck />} />
      </Routes>
    );
  }

  return (
    <>
      <CustomCursor />
      <BeatFlash />
      <NowPlaying />
      <InkCharacter />
      <Nav />

      <main
        style={{
          minHeight:   '100dvh',
          display:     'flex',
          flexDirection: 'column',
          paddingTop:  '64px',
          paddingBottom: '2rem',
          position:    'relative',
          zIndex:      20,
          overflowX:   'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={<Home />}     />
            <Route path="/about-me"  element={<AboutMe />}  />
            <Route path="/my-games"  element={<MyGames />}  />
            <Route path="/projects"  element={<Projects />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}

function DisableSelect() {
  useEffect(() => {
    const no = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', no);
    document.addEventListener('selectstart', no);
    document.addEventListener('dragstart',   no);
    return () => {
      document.removeEventListener('contextmenu', no);
      document.removeEventListener('selectstart', no);
      document.removeEventListener('dragstart',   no);
    };
  }, []);
  return null;
}

function App() {
  return (
    <Router>
      <RhythmProvider>
        <DisableSelect />
        <AppContent />
      </RhythmProvider>
    </Router>
  );
}

export default App;
