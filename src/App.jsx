import Navbar from './components/Navbar'
import BootScreen from './components/BootScreen'
import CursorGlow from './components/CursorGlow'
import Hero from './sections/Hero'
import About from './sections/About'
import Arsenal from './sections/Arsenal'
import Labs from './sections/Labs'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  return (
    <>
      <BootScreen />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Arsenal />
        <Labs />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
