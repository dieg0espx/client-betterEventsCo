import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/contact';
import Inflatable from './pages/Inflatable';
import Extra from './pages/Extra';
import Inflatables from './pages/Inflatables';
import Invoice from './pages/Invoice';
import Contract from './pages/Contract';

function App() {
  return (
    <HashRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inflatable/:id" element={<Inflatable />} />
          <Route path="/extra/:id" element={<Extra />} />
          <Route path="/inflatables" element={<Inflatables />} />
          <Route path="/inflatables/:category" element={<Inflatables />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/contract" element={<Contract />} />
        </Routes>
   </HashRouter>
  );
}

export default App;
