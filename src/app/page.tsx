'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ArrowRight, Book, Bot, Briefcase, ExternalLink, MessageCircle, Users, AlertCircle, Menu, X, ChevronDown, Star, Zap, Shield, Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react'

export default function HomePage() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Loading animation
    const timer = setTimeout(() => setIsLoading(false), 1500)
    
    const video = videoRef.current
    if (video) {
      video.playbackRate = 0.7
      const handleCanPlay = () => setIsVideoLoaded(true)
      video.addEventListener('canplay', handleCanPlay)
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        clearTimeout(timer)
      }
    }
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      // Update active section
      const sections = ['main-hero', 'about', 'aplicaciones', 'smartbots', 'alma']
      const current = sections.find(section => {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          return rect.top <= 200 && rect.bottom >= 200
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Intersection Observer para animaciones de scroll
    const sectionIds = ['main-hero', ...customSections.map(s => s.id), 'footer']
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => prev.includes(entry.target.id) ? prev : [...prev, entry.target.id])
          }
        })
      },
      { threshold: 0.2 }
    )
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Nueva estructura de secciones
  const customSections = [
    {
      id: 'about',
      label: 'About',
      image: '/DJI_0909.jpg',
      animation: 'fade-in-up',
      title: 'Sobre Sirius Agentics',
      content: `En Sirius Agentics fusionamos tecnología y conciencia para crear soluciones digitales que automatizan procesos, optimizan flujos y potencian la evolución colectiva. Nuestro propósito es liberar el potencial humano a través de la innovación.`
    },
    {
      id: 'aplicaciones',
      label: 'Aplicaciones',
      image: '/DSC_3285.jpg',
      animation: 'slide-in-left',
      title: 'Aplicaciones Sirius',
      content: `Desarrollamos herramientas internas y plataformas a medida que conectan datos, personas y procesos. Desde gestión documental hasta automatización de flujos, nuestras apps están diseñadas para la eficiencia y la transparencia.`
    },
    {
      id: 'smartbots',
      label: 'SmartBots',
      image: '/DJI_0543.JPG',
      animation: 'slide-in-right',
      title: 'SmartBots',
      content: `Nuestros bots inteligentes automatizan tareas repetitivas, integran IA en la operación diaria y permiten a los equipos enfocarse en lo que realmente importa. Telegram, WhatsApp y más, conectados al corazón de Sirius.`
    },
    {
      id: 'alma',
      label: 'Alma',
      image: '/DSC_3197.jpg',
      animation: 'pop-in',
      title: 'Alma: Asistente IA',
      content: `Alma es nuestro asistente conversacional institucional, capaz de responder preguntas, guiar procesos y facilitar el acceso al conocimiento interno de Sirius.`
    }
  ]

  // Navbar solo con las nuevas secciones
  const navSections = [
    { id: 'main-hero', label: 'Inicio' },
    ...customSections.map(s => ({ id: s.id, label: s.label }))
  ]

  // Calculamos la opacidad del navbar basado en el scroll
  const navbarOpacity = Math.min(scrollY / 100, 0.95)

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Header completamente transparente y estático */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          fontFamily: 'Utile, Arial, sans-serif',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6 gap-4 lg:gap-0">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <img 
              src="/logo.png" 
              alt="Sirius Logo" 
              className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto object-contain transition-transform duration-300 hover:scale-105" 
              style={{
                minWidth: 60,
              }} 
            />
            <button 
              className="lg:hidden text-[#BCD7EA] hover:text-[#00A3FF] transition-colors p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center gap-2 lg:gap-4 xl:gap-6 w-full lg:w-auto transition-all duration-300`}>
            {navSections.map(({ id, label }, index) => (
              <button
                key={id}
                onClick={() => {
                  const el = document.getElementById(id)
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setIsMenuOpen(false)
                }}
                className={`text-[#BCD7EA] hover:text-[#00A3FF] px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base lg:text-lg font-bold transition-all duration-300 tracking-tight transform hover:scale-105 relative overflow-hidden ${
                  activeSection === id ? 'text-[#00A3FF]' : ''
                }`}
                style={{
                  fontFamily: 'Utile, Arial, sans-serif', 
                  letterSpacing: '-0.5px',
                  textShadow: activeSection === id ? '0 0 10px rgba(0, 163, 255, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.3)',
                  background: 'transparent'
                }}
              >
                <span className="relative z-10">{label}</span>
                {activeSection === id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 animate-pulse" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Video de fondo opcional */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            filter: 'blur(3px) brightness(0.3)',
            transform: `scale(${1 + scrollY * 0.0002})`
          }}
        >
          <source src="/sirius-bg-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Content */}
      <main className="relative z-10 overflow-y-auto snap-y snap-mandatory scroll-smooth">
        {/* HERO PRINCIPAL */}
        <section id="main-hero" className="snap-start min-h-screen flex items-center justify-center relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.001)
            }}
          />
          <img 
            src="/DJI_0909.jpg" 
            alt="Sirius principal" 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000" 
            style={{
              zIndex: 1, 
              opacity: 0.85,
              transform: `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.3}px)`
            }} 
          />
          <div 
            className="relative z-10 flex flex-col items-center lg:items-start justify-center w-full max-w-6xl px-4 sm:px-6 lg:px-16 py-24 lg:py-40 gap-6 lg:gap-10 text-center lg:text-left"
            style={{
              minHeight: '70vh',
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.002)
            }}
          >
            <h1 
              className="text-[#BCD7EA] text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-2 leading-tight animate-fade-in-up"
              style={{
                fontFamily: 'Utile, Arial, sans-serif', 
                letterSpacing: '-2px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
              }}
            >
              Sirius Agentics
            </h1>
            <p 
              className="text-[#BCD7EA] text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 font-medium max-w-4xl animate-fade-in-up"
              style={{
                fontFamily: 'Utile, Arial, sans-serif',
                animationDelay: '0.3s',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              Regenerative Solutions
            </p>
          </div>
        </section>

        {/* Secciones personalizadas con animaciones profesionales */}
        {customSections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className="snap-start min-h-screen flex items-center justify-center relative overflow-hidden group"
          >
            {/* Imagen de fondo con efecto hover */}
            <div className="absolute inset-0 transform transition-transform duration-700 group-hover:scale-105">
              <img 
                src={section.image} 
                alt={section.label} 
                className="w-full h-full object-cover object-center" 
                style={{ opacity: 0.9 }} 
              />
            </div>
            
            {/* Overlay con gradiente dinámico */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30 transition-opacity duration-500 group-hover:opacity-70" />
            
            {/* Partículas flotantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-[#00A3FF]/30 rounded-full animate-float"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${4 + i}s`
                  }}
                />
              ))}
            </div>
            
            {/* Contenido principal */}
            <div 
              className={`relative z-10 flex flex-col items-center lg:items-start justify-center w-full max-w-6xl px-4 sm:px-6 lg:px-16 py-24 lg:py-40 gap-6 lg:gap-10 text-center lg:text-left transform transition-all duration-1000 ease-out ${
                visibleSections.includes(section.id) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95'
              }`}
              style={{ minHeight: '70vh' }}
            >
              {/* Título con efecto typewriter */}
              <div className="relative overflow-hidden">
                <h2 
                  className={`text-[#BCD7EA] text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 transform transition-all duration-1200 ease-out ${
                    visibleSections.includes(section.id) 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-full'
                  }`}
                  style={{
                    fontFamily: 'Utile, Arial, sans-serif',
                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.7)',
                    letterSpacing: '-1px',
                    transitionDelay: '0.2s'
                  }}
                >
                  {section.title}
                </h2>
                {/* Línea decorativa animada */}
                <div 
                  className={`h-1 bg-gradient-to-r from-[#00A3FF] to-transparent transition-all duration-1000 ${
                    visibleSections.includes(section.id) ? 'w-24' : 'w-0'
                  }`}
                  style={{ transitionDelay: '0.8s' }}
                />
              </div>
              
              {/* Descripción con entrada escalonada */}
              <p 
                className={`text-[#BCD7EA] text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-4xl leading-relaxed transform transition-all duration-1000 ease-out ${
                  visibleSections.includes(section.id) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  fontFamily: 'Utile, Arial, sans-serif',
                  textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)',
                  transitionDelay: '0.4s'
                }}
              >
                {section.content}
              </p>
              
              {/* Botones con animaciones avanzadas */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 mt-8 transform transition-all duration-1000 ease-out ${
                  visibleSections.includes(section.id) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.6s' }}
              >
                <button 
                  onClick={() => {
                    if (section.id === 'alma') {
                      // Aquí va la URL que me proporciones
                      window.open('URL_DE_ALMA_AQUI', '_blank')
                    }
                  }}
                  className="group relative bg-gradient-to-r from-[#00A3FF] to-[#0154AC] hover:from-[#0154AC] hover:to-[#00A3FF] text-white px-8 py-4 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {section.id === 'alma' ? 'Usar Alma IA' : 'Descubrir Más'}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                </button>
                
                <button className="group border-2 border-[#BCD7EA] text-[#BCD7EA] hover:bg-[#BCD7EA] hover:text-[#0154AC] px-8 py-4 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                  <span className="relative z-10">Conocer Más</span>
                  <div className="absolute inset-0 bg-[#BCD7EA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              </div>
              
              {/* Indicadores de progreso */}
              <div className="flex space-x-2 mt-8">
                {customSections.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === idx 
                        ? 'w-8 bg-[#00A3FF]' 
                        : 'w-1 bg-[#BCD7EA]/50'
                    }`}
                    style={{ transitionDelay: `${0.8 + i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#00A3FF]/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-[#BCD7EA]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER MINIMALISTA */}
      <footer id="footer" className="relative z-10 bg-gradient-to-r from-[#0154AC] to-[#00A3FF] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="Sirius Logo" 
                className="w-24 h-auto object-contain" 
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium" style={{fontFamily: 'Utile, Arial, sans-serif'}}>
                  Regenerative Solutions para el futuro empresarial
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-[#BCD7EA] transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#BCD7EA] transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#BCD7EA] transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
              <div className="text-xs text-center md:text-right" style={{fontFamily: 'Utile, Arial, sans-serif'}}>
                © 2025 SIRIUS REGENERATIVE SOLUTIONS S.A.S ZOMAC
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Utile', Arial, sans-serif;
          background: linear-gradient(135deg, #0154AC 0%, #00A3FF 100%);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(188, 215, 234, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #0154AC, #00A3FF);
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #00A3FF, #0154AC);
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 163, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 163, 255, 0.6);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        /* Responsive breakpoints */
        @media (max-width: 640px) {
          .container {
            padding: 0 1rem;
          }
        }
        
        @media (max-width: 768px) {
          .snap-y {
            scroll-snap-type: none;
          }
          
          .snap-start {
            scroll-snap-align: none;
          }
        }
      `}</style>
    </div>
  )
}