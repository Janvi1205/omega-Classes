import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Batches from '@/components/Batches';
import RegisterModal from '@/components/RegisterModal';
import YouTube from '@/components/YouTube';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleRegisterClick = (batchType: string) => {
    setSelectedBatch(batchType);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Floating animated shapes */}
      <div className="floating-shape" style={{top: '8%', left: '10%', width: '180px', height: '180px', background: 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)', animationDelay: '0s'}}></div>
      <div className="floating-shape" style={{top: '65%', left: '80%', width: '120px', height: '120px', background: 'linear-gradient(135deg, #f472b6 0%, #a5b4fc 100%)', animationDelay: '4s'}}></div>
      <div className="floating-shape" style={{top: '85%', left: '25%', width: '100px', height: '100px', background: 'linear-gradient(135deg, #38bdf8 0%, #a5b4fc 100%)', animationDelay: '8s'}}></div>
      <Navbar />
      <Hero />
      <Batches onRegisterClick={handleRegisterClick} />
      <YouTube />
      <Contact />
      <Footer />
      
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBatch={selectedBatch}
      />
    </div>
  );
};

export default Index;
