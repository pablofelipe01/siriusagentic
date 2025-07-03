'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function SmartBotsPage() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const smartBots = [
    {
      id: 'sirius-agentic',
      name: 'Sirius Agentic',
      description: 'Agente de inteligencia artificial vía WhatsApp.',
      image: '/DJI_0909.jpg',
      link: 'https://wa.me/573132121019'
    },
    {
      id: 'pirolibot',
      name: 'PiroliBot',
      description: 'Bot de Telegram para control de producción de pirólisis.',
      image: '/DSC_4016.jpg',
      link: 'https://t.me/PiroliBot_bot'
    },
    {
      id: 'biogasbot',
      name: 'BiogasBot',
      description: 'Registro y monitoreo para plantas de biogás.',
      image: '/DSC_3466.jpg',
      link: 'https://t.me/BioGasManager_bot'
    },
    {
      id: 'labibot',
      name: 'LabiBot',
      description: 'Gestión de remisiones y producción en laboratorio.',
      image: '/DSC_3285.jpg',
      link: 'https://t.me/L4BI_bot'
    },
    {
      id: 'dona-pepa',
      name: 'Doña Pepa',
      description: 'Agente IA personalizado para procesos locales.',
      image: '/DSC_3239.jpg',
      link: 'https://wa.me/573132552326'
    }
  ];

  // Smooth scroll on wheel
  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const currentScroll = window.scrollY;
      const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
      const currentIndex = sections.findIndex(sec => sec.offsetTop > currentScroll + 10) - (direction === -1 ? 1 : 0);
      let targetIndex = currentIndex;
      if (direction === 1 && currentIndex < sections.length - 1) targetIndex = currentIndex + 1;
      if (direction === -1 && currentIndex > 0) targetIndex = currentIndex - 1;
      sections[targetIndex]?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="fixed top-0 w-full bg-gray-800 bg-opacity-70 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white">
            <ArrowLeft /> Volver
          </button>
          <span className="text-white font-semibold">SmartBots de Sirius</span>
        </div>
      </header>

      <main className="pt-24">
        {smartBots.map((bot, index) => (
          <section
            key={bot.id}
            id={bot.id}
            ref={el => (sectionsRef.current[index] = el)}
            className="relative h-screen flex items-center justify-center text-white"
          >
            <img
              src={bot.image}
              alt={bot.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-8 text-center">
              <h2 className="text-4xl font-bold mb-4">{bot.name}</h2>
              <p className="text-lg mb-8">{bot.description}</p>
              <button
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
                onClick={() => window.open(bot.link, '_blank')}
              >
                Hacer Demo <ArrowRight />
              </button>
            </div>
          </section>
        ))}
      </main>

      <footer className="py-6 text-center bg-gray-800 text-white">
        © 2025 SIRIUS REGENERATIVE SOLUTIONS S.A.S ZOMAC
      </footer>
    </div>
  );
}
