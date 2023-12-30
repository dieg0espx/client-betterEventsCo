import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/contact';
import Inflatable from './pages/Inflatable';

function App() {
  return (
    <HashRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inflatable" element={<Inflatable />} />
        </Routes>
   </HashRouter>
  );
}

export default App;
