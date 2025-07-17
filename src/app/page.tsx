'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Book, Bot, Briefcase, ExternalLink, MessageCircle, Users, AlertCircle, Menu, X, ChevronDown, Star, Zap, Shield, Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react'

// Tipos para las apps y secciones
interface AdminApp {
  text: string;
  route: string;
}

interface Section {
  id: string;
  label: string;
  image: string;
  title: string;
  content: string;
  buttonText?: string;
  route?: string;
  apps?: AdminApp[];
}

export default function HomePage() {
  const router = useRouter()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({})
  const [currentSection, setCurrentSection] = useState(0)
  const [navigatedSection, setNavigatedSection] = useState<string | null>(null) // Nueva state para tracking de navegación
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  // Ref para el audio de fondo
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ajustar el volumen del audio a un nivel muy bajo (0.2)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  }, []);

  useEffect(() => {
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
      const scrollTop = window.pageYOffset
      setScrollY(scrollTop)
      // Calcular progreso de cada sección
      const newProgress: Record<string, number> = {}
      const windowHeight = window.innerHeight
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect()
          const sectionTop = rect.top + scrollTop
          const sectionHeight = rect.height
          // Calcular progreso de la sección (0 a 1)
          const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop + windowHeight) / (sectionHeight + windowHeight)))
          newProgress[`section-${index}`] = progress
          // Determinar sección actual
          if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
            setCurrentSection(index)
            setActiveSection(customSections[index]?.id || '')
          }
        }
      })
      setSectionProgress(newProgress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Llamar inmediatamente
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Función para manejar navegación interna
  const handleNavigation = (sectionId: string) => {
    switch(sectionId) {
      case 'alma':
        router.push('/chat')
        break
      case 'aplicaciones':
        router.push('/aplicaciones')
        break
      case 'smartbots':
        router.push('/smartbots')
        break
      case 'about':
        router.push('/about')
        break
      default:
        // Para otras secciones, hacer scroll normal
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Función mejorada para navegación con mejor visibilidad del contenido
  const handleSectionNavigation = (sectionId: string) => {
    const sectionIndex = customSections.findIndex(s => s.id === sectionId)
    if (sectionIndex !== -1) {
      setNavigatedSection(sectionId)
      const el = document.getElementById(sectionId)
      if (el) {
        // Scroll hasta el final de la sección (parte inferior de la sección alineada con parte inferior de la ventana)
        const sectionHeight = el.offsetHeight
        const windowHeight = window.innerHeight
        const targetScroll = el.offsetTop + sectionHeight - windowHeight
        window.scrollTo({ 
          top: targetScroll, 
          behavior: 'smooth' 
        })
      }
    }
    setIsMenuOpen(false)
  }

  const customSections: Section[] = [
    {
      id: 'about',
      label: 'About',
      image: '/DSC_2889.jpg',
      title: 'Sobre Sirius Agentics',
      content: `En Sirius Agentics fusionamos tecnología y conciencia para crear soluciones digitales que automatizan procesos, optimizan flujos y potencian la evolución colectiva. Nuestro propósito es liberar el potencial humano a través de la innovación.`,
      buttonText: 'Conocer Más',
      route: '/about'
    },
    {
      id: 'aplicaciones',
      label: 'Aplicaciones administrativas',
      image: '/DSC_3285.jpg',
      title: 'Aplicaciones administrativas',
      content: `Desarrollamos herramientas internas y plataformas a medida que conectan datos, personas y procesos. Desde gestión documental hasta automatización de flujos, nuestras apps están diseñadas para la eficiencia y la transparencia.`,
      apps: [
        { text: 'Novedades de nómina', route: 'https://novedadesnomina.s3.us-east-1.amazonaws.com/Index_Novedades_Nomina.html' },
        { text: 'AUTOMA (Financiero)', route: 'https://t.me/AUT0MA_bot' },
        { text: 'Solicitudes de compras', route: 'https://siriusadministrativo.s3.us-east-1.amazonaws.com/Formato+Solicitud+Compra+Adquisiciones.html' },
        { text: 'Proveedores', route: 'https://proveedores-gamma.vercel.app/' },
        { text: 'Sirius Coins', route: 'https://airtable.com/app5o1BKy3divPinG/pagGWVLIk07fYaiuo/form' },
        { text: 'Herramienta Financiera', route: 'https://airtable.com/appBNCVj4Njbyu1En/pagCTUfOvuQ4eOlxB' }
      ]
    },
    {
      id: 'aplicaciones-tecnicas',
      label: 'Aplicaciones técnicas',
      image: '/DSC_3466.jpg',
      title: 'Aplicaciones técnicas',
      content: `Soluciones tecnológicas avanzadas para la operación, automatización y análisis de datos en Sirius.`,
      apps: [
        { text: 'DAO', route: 'https://cliente-dao.vercel.app/' },
        { text: 'DataLab', route: 'https://www.consultaia.app/' },
        { text: 'LABI', route: 'https://t.me/L4BI_bot' },
        { text: 'Biogasbot', route: 'https://t.me/BioGasManager_bot' },
        { text: 'Pirolibot', route: 'https://t.me/PiroliBot_bot' }
      ]
    },
    {
      id: 'guaicaramo',
      label: 'Guaicaramo',
      image: '/DJI_0545.JPG',
      title: 'Guaicaramo',
      content: `Accede a nuestros servicios de inteligencia artificial y gestión de pedidos.`,
      apps: [
        { text: 'Doña Pepa', route: 'https://wa.me/573132552326?text=Hola%20Doña%20Pepa!' },
        { text: 'Pedidos', route: 'https://pedidossirius.vercel.app/' }
      ]
    },
    {
      id: 'reuniones',
      label: 'Reuniones',
      image: '/DSC_3239.jpg',
      title: 'Reuniones',
      content: `Accede a la gestión y programación de reuniones institucionales de Sirius.`,
    },
    {
      id: 'alma',
      label: 'Alma',
      image: '/DSC_3197.jpg',
      title: 'Alma: Asistente IA',
      content: `Alma es nuestro asistente conversacional institucional, capaz de responder preguntas, guiar procesos y facilitar el acceso al conocimiento interno de Sirius.`,
      buttonText: 'Usar Alma IA',
      route: '/chat'
    },
    {
      id: 'sirius-agentic',
      label: 'Sirius Agentic',
      image: '/DJI_0909.jpg',
      title: 'Sirius Agentic',
      content: 'Sirius Agentic es nuestro agente de inteligencia artificial disponible en WhatsApp para ayudarte con tus consultas y necesidades empresariales.',
      apps: [
        { text: 'Chatear con Sirius Agentic', route: 'https://wa.me/573132121019?text=Hola%20Sirius%20Agentic!' }
      ]
    }
  ]

  const navSections = [
    // Eliminado 'main-hero', ahora solo las secciones dinámicas
    ...customSections.filter(s => s.id !== 'about').map(s => ({ id: s.id, label: s.label }))
  ]

  const navbarOpacity = Math.min(scrollY / 100, 0.95)

  return (
    <div className="relative overflow-x-hidden">
      {/* Audio de fondo sutil */}
      <audio ref={audioRef} autoPlay loop preload="auto" style={{ position: 'fixed', zIndex: 0, pointerEvents: 'none' }}>
        <source src="https://res.cloudinary.com/dvnuttrox/video/upload/v1751577273/WhatsApp_Audio_2025-07-03_at_4.14.09_PM_er0ren.mp3" type="audio/mpeg" />
        Tu navegador no soporta el audio HTML5.
      </audio>

      {/* Header */}
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
              style={{ minWidth: 60 }} 
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
                onClick={() => handleSectionNavigation(id)}
                className={`text-white hover:text-[#00A3FF] px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base lg:text-lg font-bold transition-all duration-300 tracking-tight transform hover:scale-105 relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/60 shadow-black/30 bg-black/60` + (activeSection === id ? ' text-[#00A3FF]' : '')}
                style={{
                  fontFamily: 'Utile, Arial, sans-serif', 
                  letterSpacing: '-0.5px',
                  textShadow: activeSection === id ? '0 0 10px rgba(0, 163, 255, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.3)',
                  background: 'rgba(0,0,0,0.6)', // fondo oscuro translúcido
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.35)',
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

      {/* Main Content */}
      <main className="relative z-10">
        {/* Secciones dinámicas */}
        {customSections.map((section, idx) => {
          const progress = sectionProgress[`section-${idx}`] || 0
          const isNavigated = navigatedSection === section.id
          const isImageFixed = progress > 0.15 && progress < 0.85
          const showContent = progress > 0.3 || isNavigated // Mostrar contenido si fue navegado
          const contentFullyVisible = progress > 0.5 && progress < 0.8 || isNavigated // Contenido completamente visible si fue navegado
          const imageScale = Math.min(1.1, 1 + progress * 0.1)
          // Mejorar la opacidad del contenido
          const contentOpacity = isNavigated ? 1 : progress < 0.3 ? 0 : progress > 0.7 ? 1 : Math.max(0, Math.min(1, (progress - 0.3) * 2.5))
          const contentTransform = isNavigated ? 0 : progress < 0.3 ? 50 : progress > 0.6 ? 0 : Math.max(0, (0.6 - progress) * 125)

          return (
            <section
              key={section.id}
              id={section.id}
              ref={el => { sectionsRef.current[idx] = el }}
              className="relative overflow-hidden"
              style={{ height: '300vh' }}
            >
              {/* Contenedor de imagen fija */}
              <div 
                className={`${isImageFixed ? 'fixed' : 'absolute'} inset-0 w-full h-screen overflow-hidden`}
                style={{
                  zIndex: isImageFixed ? 10 : 1,
                }}
              >
                <img 
                  src={section.image} 
                  alt={section.label} 
                  className="w-full h-full object-cover object-center transition-transform duration-700" 
                  style={{ 
                    opacity: 0.9,
                    transform: `scale(${imageScale})`
                  }} 
                />
                
                {/* Overlay dinámico */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 transition-opacity duration-500"
                  style={{
                    opacity: contentFullyVisible ? 0.7 : showContent ? 0.5 : 0.2
                  }}
                />
              </div>
              
              {/* Contenido que aparece con scroll */}
              <div 
                className={`${isImageFixed ? 'fixed' : 'absolute'} inset-0 flex items-center justify-center transition-all duration-700`}
                style={{
                  zIndex: isImageFixed ? 20 : 5,
                  opacity: contentOpacity,
                  transform: `translateY(${contentTransform}px)`
                }}
              >
                <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-16 py-24 lg:py-40 text-center lg:text-left">
                  {/* Título */}
                  <div className="relative overflow-hidden mb-8">
                    <h2 
                      className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4"
                      style={{
                        fontFamily: 'Utile, Arial, sans-serif',
                        // Sombra circular centrada y difusa
                        textShadow: '0 0 80px 40px rgba(0,0,0,0.7), 0 0 160px 80px rgba(0,0,0,0.4)',
                        letterSpacing: '-1px',
                        transform: showContent ? 'translateY(0)' : 'translateY(50px)',
                        transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                        opacity: isNavigated ? 1 : undefined // Asegurar opacidad completa al navegar
                      }}
                    >
                      {section.title}
                    </h2>
                  </div>
                  
                  {/* Descripción */}
                  <p 
                    className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-4xl leading-relaxed mb-10"
                    style={{
                      fontFamily: 'Utile, Arial, sans-serif',
                      textShadow: '0 4px 25px rgba(0, 0, 0, 0.9), 0 2px 15px rgba(0, 0, 0, 0.7)',
                      transform: showContent ? 'translateY(0)' : 'translateY(90px)',
                      transition: 'transform 0.8s ease-out 0.2s',
                      opacity: isNavigated ? 1 : undefined // Asegurar opacidad completa al navegar
                    }}
                  >
                    {section.content}
                  </p>
                  
                  {/* Botón o mensaje especial solo para la primera sección */}
                  {idx === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-8">
                      <span className="text-white text-lg sm:text-xl font-semibold animate-fade-in-up" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>Conocer más</span>
                      <ChevronDown size={40} style={{marginTop: 8, color: '#00A3FF'}} className="animate-bounce" />
                    </div>
                  ) : section.apps ? (
                    <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                      {section.apps.map(app => (
                        <button
                          key={app.text}
                          onClick={() => { window.location.href = app.route; }}
                          className="group relative bg-gradient-to-r from-[#00A3FF] to-[#0154AC] hover:from-[#0154AC] hover:to-[#00A3FF] text-white px-6 py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden min-w-[180px] flex items-center justify-center"
                          style={{
                            opacity: isNavigated ? 1 : undefined // Asegurar opacidad completa al navegar
                          }}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {app.text}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                          <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col sm:flex-row gap-4"
                      style={{
                        transform: showContent ? 'translateY(0)' : 'translateY(100px)',
                        transition: 'transform 0.8s ease-out 0.4s',
                        opacity: isNavigated ? 1 : undefined // Asegurar opacidad completa al navegar
                      }}
                    >
                      {section.route && section.buttonText && (
                        <button 
                          onClick={() => router.push(section.route!)}
                          className="group relative bg-gradient-to-r from-[#00A3FF] to-[#0154AC] hover:from-[#0154AC] hover:to-[#00A3FF] text-white px-8 py-4 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {section.buttonText}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                          <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Espaciador invisible para scroll */}
              <div style={{ height: '100vh' }} />
            </section>
          )
        })}
      </main>

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
        
        @media (max-width: 640px) {
          .container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  )
}