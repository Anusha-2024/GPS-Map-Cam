import React, { useState } from 'react';
import { Camera, MapPin, Info, Mail } from 'lucide-react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

type Page = 'home' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigation = [
    { id: 'home' as Page, label: 'Home', icon: Camera },
    { id: 'about' as Page, label: 'About', icon: Info },
    { id: 'contact' as Page, label: 'Contact', icon: Mail },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        navigation={navigation}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="pt-20">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;