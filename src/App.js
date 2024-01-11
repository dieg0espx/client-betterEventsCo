import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/contact';
import Inflatable from './pages/Inflatable';
import Inflatables from './pages/Inflatables';

function App() {
  return (
    <HashRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inflatable" element={<Inflatable />} />
          <Route path="/inflatables" element={<Inflatables />} />
        </Routes>
   </HashRouter>
  );
}

export default App;
