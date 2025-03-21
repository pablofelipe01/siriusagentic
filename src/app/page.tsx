'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageCircle } from 'lucide-react'

export default function HomePage() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = 0.8 // Reduce la velocidad de reproducción para un efecto más suave
      const handleCanPlay = () => {
        setIsVideoLoaded(true)
      }
      video.addEventListener('canplay', handleCanPlay)
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Video de fondo */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay oscuro */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute min-w-full min-h-full object-cover w-auto h-auto ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000`}
        >
          <source src="/ai.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Cabecera */}
        <header className="p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Sirius Logo"
              width={180}
              height={50}
              className="h-10 w-auto md:h-12"
              priority
            />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-blue-200 hover:text-white transition">
              Sobre Nosotros
            </Link>
            <Link href="/services" className="text-blue-200 hover:text-white transition">
              Servicios
            </Link>
            <Link href="/providers" className="text-blue-200 hover:text-white transition">
              Proveedores
            </Link>
            <Link href="/contact" className="text-blue-200 hover:text-white transition">
              Contacto
            </Link>
          </nav>
          <Link 
            href="/chat"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            <MessageCircle size={18} />
            <span>Chatear con Alma</span>
          </Link>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
            SIRIUS REGENERATIVE
          </h1>
          
          <div className="glow-container relative mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-75 blur-xl"></div>
            <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Alma: La Guía Espiritual y Tecnológica de Sirius
              </h2>
              <p className="text-lg text-blue-100 mb-6 max-w-2xl">
                Combinando sabiduría ancestral con modernidad y frescura, Alma es una adita guardiana 
                encargada de custodiar la esencia y espíritu de Sirius. Su propósito es generar bienestar,
                beneficiando a la naturaleza, los sirianos, y las comunidades de clientes y aliados.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/20">
                  <h3 className="text-xl font-medium text-blue-300 mb-2">Sirius Regenerative</h3>
                  <p className="text-white mb-3">
                    Plataforma de soluciones que impulsa la transición hacia una agricultura regenerativa.
                  </p>
                  <ul className="text-white space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                      <span>Insumos y bioinsumos para regenerar el suelo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                      <span>Tecnología avanzada y análisis de datos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                      <span>Biochar con 84% de carbono fijo por +1000 años</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/20">
                  <h3 className="text-xl font-medium text-blue-300 mb-2">¡Hola, soy Rafaela!</h3>
                  <p className="text-white mb-3">
                    Planta de pirólisis de tercera generación, diseñada y construida por Sirius.
                  </p>
                  <ul className="text-white space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                      <span>Capacidad de producción: 325 toneladas de biochar al año</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                      <span>999 toneladas de CO₂ removidas anualmente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                      <span>87% de carbono fijo con tecnología de pirólisis interna</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/chat"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30 text-lg font-medium"
            >
              Interactúa con Alma
              <ArrowRight size={20} />
            </Link>
                          <a
              href="https://proveedores-gamma.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
            >
              Portal de Proveedores
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center p-6 text-blue-200 border-t border-blue-500/20 backdrop-blur-sm">
          <p>© 2025 SIRIUS REGENERATIVE. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}