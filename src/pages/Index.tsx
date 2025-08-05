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
    <div className="min-h-screen bg-background">
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
