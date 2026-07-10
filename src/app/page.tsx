'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Book, Bot, Briefcase, ExternalLink, MessageCircle, Users, User, AlertCircle, Menu, X, ChevronDown, Star, Zap, Shield, Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react'
import NavHeader from '@/components/ui/nav-header'

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ cedula: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginStep, setLoginStep] = useState<'cedula' | 'password' | 'new-password'>('cedula')
  const [loginNombre, setLoginNombre] = useState('')
  const [loginNewPass, setLoginNewPass] = useState('')
  const [loginConfirmPass, setLoginConfirmPass] = useState('')
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
        { text: 'Solicitudes de compras', route: 'https://sirius-financiero.vercel.app/' },
        { text: 'Proveedores contratistas', route: 'https://proveedores-gamma.vercel.app/' },
        { text: 'Proveedores de venta de insumos', route: 'https://airtable.com/appBNCVj4Njbyu1En/pagrXNjIdQxaVrx7W/edit' },
        { text: 'Sirius Coins', route: 'https://airtable.com/app5o1BKy3divPinG/pagGWVLIk07fYaiuo/form' },
        { text: 'Herramienta Financiera', route: 'https://sirius-financiero.vercel.app/' },
        { text: 'Sirius Laborales', route: 'https://sirius-laborales.vercel.app/' }
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
        { text: 'DataLab', route: 'https://sirius-laboratorio.vercel.app/' },
        { text: 'LABI', route: 'https://t.me/L4BI_bot' },
        { text: 'Biogasbot', route: 'https://t.me/BioGasManager_bot' },
        { text: 'PiroliApp', route: 'https://sirius-pirolisis.vercel.app/' }
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
      id: 'sirius-media',
      label: 'Sirius Media',
      image: '/DSC_3239.jpg',
      title: 'Sirius Media',
      content: `Gestiona el archivo multimedia institucional de Sirius. Sube, organiza y consulta fotos y videos por área (pirolisis, laboratorio, SG-SST y más) con asistencia de inteligencia artificial.`,
    },
    {
      id: 'alma',
      label: 'Alma',
      image: '/DSC_3197.jpg',
      title: 'Alma: Asistente IA',
      content: `Alma es nuestro asistente conversacional institucional, capaz de responder preguntas, guiar procesos y facilitar el acceso al conocimiento interno de Sirius.`,
      apps: [
        { text: 'Usar Alma IA', route: '/chat' },
        { text: 'Alma 2', route: 'https://fedepalma-bot.vercel.app/' }
      ]
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

  // Usar hook para determinar el ancho de la pantalla
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navSections = customSections
    .filter(s => s.id !== 'about')
    .map(s => ({
      id: s.id,
      label: isMobile
        ? (s.id === 'aplicaciones' ? 'Apps Admin'
          : s.id === 'aplicaciones-tecnicas' ? 'Apps Técnicas'
          : s.id === 'guaicaramo' ? 'Guaicaramo'
          : s.id === 'sirius-media' ? 'Sirius Media'
          : s.id === 'alma' ? 'Alma'
          : s.id === 'sirius-agentic' ? 'Sirius Agentic'
          : s.label)
        : s.label
    }))

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
        <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 xl:px-10 py-3 sm:py-4 xl:py-6 gap-3 lg:gap-0">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <img
              src="/logo.png"
              alt="Sirius Logo"
              className="w-36 sm:w-40 md:w-44 lg:w-48 xl:w-56 h-auto object-contain transition-transform duration-300 hover:scale-105"
              style={{ minWidth: 120 }}
            />
            <button
              className="lg:hidden text-[#BCD7EA] hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Nav para móvil (desplegable) y desktop (siempre visible) */}
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex items-center w-full lg:w-auto justify-center`}>
            <NavHeader
              sections={navSections}
              activeSection={activeSection}
              onNavigate={(id) => { handleSectionNavigation(id); setIsMenuOpen(false); }}
            />
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
                <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-16 py-16 sm:py-24 lg:py-40 text-center lg:text-left">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 justify-items-center lg:justify-items-start">
                      {section.apps.map(app => (
                        <div key={app.text} className="flex flex-col items-center gap-2">
                          {app.text === 'Doña Pepa' && (
                            <img
                              src="/doñapepa_whatsapp_qr.png"
                              alt="QR Code Doña Pepa WhatsApp"
                              className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg shadow-lg"
                            />
                          )}
                          <button
                            onClick={() => { window.location.href = app.route; }}
                            className="group relative bg-gradient-to-r from-[#00A3FF] to-[#0154AC] hover:from-[#0154AC] hover:to-[#00A3FF] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden w-full max-w-[180px] sm:min-w-[160px] flex items-center justify-center text-sm sm:text-base"
                            style={{
                              opacity: isNavigated ? 1 : undefined // Asegurar opacidad completa al navegar
                            }}
                          >
                            <span className="relative z-10 flex items-center gap-1 sm:gap-2 text-center">
                              {app.text}
                              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : section.id === 'sirius-media' ? (
                    <div
                      style={{
                        transform: showContent ? 'translateY(0)' : 'translateY(100px)',
                        transition: 'transform 0.8s ease-out 0.4s',
                        opacity: isNavigated ? 1 : undefined
                      }}
                    >
                      <button
                        onClick={() => router.push('/media')}
                        className="group relative bg-gradient-to-r from-[#00A3FF] to-[#0154AC] hover:from-[#0154AC] hover:to-[#00A3FF] text-white px-8 py-4 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Acceder
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                      </button>
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

      {/* Modal de inicio de sesión - Sirius Media */}
      {/* LOGIN MODAL — desactivado temporalmente. El botón "Acceder" redirige directo a /media. */}
      {false && isLoginModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,8,20,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setIsLoginModalOpen(false); setLoginError(''); setLoginStep('cedula'); setLoginNombre(''); setLoginForm({ cedula: '', password: '' }); setLoginNewPass(''); setLoginConfirmPass('') } }}
        >
          <div
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up"
            style={{
              background: 'linear-gradient(145deg, rgba(10,18,36,0.98) 0%, rgba(1,29,61,0.98) 100%)',
              border: '1px solid rgba(0,163,255,0.2)',
              boxShadow: '0 0 60px rgba(0,163,255,0.08), 0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Franja de acento superior */}
            <div className="h-1 w-full bg-gradient-to-r from-[#00A3FF] via-[#0154AC] to-[#00A3FF]" />

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-5">
              <div className="flex items-center gap-3">
                {/* Icono */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A3FF]/20 to-[#0154AC]/20 border border-[#00A3FF]/25 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-white text-xl font-black leading-none" style={{ fontFamily: 'Utile, Arial, sans-serif', letterSpacing: '-0.5px' }}>
                    Sirius Media
                  </h2>
                  <p className="text-[#4A7FA5] text-xs mt-0.5" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Archivo multimedia institucional</p>
                </div>
              </div>
              <button
                onClick={() => { setIsLoginModalOpen(false); setLoginError(''); setLoginStep('cedula'); setLoginNombre(''); setLoginForm({ cedula: '', password: '' }); setLoginNewPass(''); setLoginConfirmPass('') }}
                className="text-[#4A7FA5] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Divisor */}
            <div className="mx-8 h-px bg-gradient-to-r from-transparent via-[#00A3FF]/25 to-transparent" />

            {/* Formulario multi-paso */}
            <form
              className="px-8 pt-6 pb-8 flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault()
                setLoginError('')
                setLoginLoading(true)
                try {
                  // ── Paso 1: verificar cédula ─────────────────────────────
                  if (loginStep === 'cedula') {
                    const cedulaDigits = loginForm.cedula.replace(/\D/g, '')
                    if (cedulaDigits.length < 6) {
                      setLoginError('La cédula debe tener al menos 6 dígitos.')
                      setLoginLoading(false)
                      return
                    }
                    if (cedulaDigits.length > 10) {
                      setLoginError('La cédula no puede tener más de 10 dígitos.')
                      setLoginLoading(false)
                      return
                    }
                    const res = await fetch('/api/mediaAuth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ cedula: loginForm.cedula }),
                    })
                    const data = await res.json()
                    if (!data.found) {
                      setLoginError('No se encontró ningún empleado con ese número de documento.')
                    } else if (!data.active) {
                      setLoginError('Tu cuenta está inactiva. Contacta al área de Recursos Humanos.')
                    } else {
                      setLoginNombre(data.nombre)
                      setLoginStep(data.hasPassword ? 'password' : 'new-password')
                    }

                  // ── Paso 2a: autenticar con contraseña ───────────────────
                  } else if (loginStep === 'password') {
                    if (loginForm.password.length < 8) {
                      setLoginError('La contraseña debe tener al menos 8 caracteres.')
                      setLoginLoading(false)
                      return
                    }
                    const res = await fetch('/api/mediaAuth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ cedula: loginForm.cedula, password: loginForm.password }),
                    })
                    const data = await res.json()
                    if (data.success) {
                      setIsLoginModalOpen(false)
                      setLoginStep('cedula'); setLoginNombre('')
                      setLoginForm({ cedula: '', password: '' })
                      router.push('/media')
                    } else {
                      setLoginError(data.error || 'Credenciales incorrectas')
                    }

                  // ── Paso 2b: crear nueva contraseña ──────────────────────
                  } else {
                    if (loginNewPass.length < 8) {
                      setLoginError('La contraseña debe tener al menos 8 caracteres.')
                      return
                    }
                    if (loginNewPass !== loginConfirmPass) {
                      setLoginError('Las contraseñas no coinciden.')
                      return
                    }
                    const res = await fetch('/api/mediaSetPassword', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ cedula: loginForm.cedula, newPassword: loginNewPass }),
                    })
                    const data = await res.json()
                    if (data.success) {
                      setIsLoginModalOpen(false)
                      setLoginStep('cedula'); setLoginNombre('')
                      setLoginForm({ cedula: '', password: '' })
                      setLoginNewPass(''); setLoginConfirmPass('')
                      router.push('/media')
                    } else {
                      setLoginError(data.error || 'Error al crear la contraseña.')
                    }
                  }
                } catch {
                  setLoginError('Error de conexión. Intenta de nuevo.')
                } finally {
                  setLoginLoading(false)
                }
              }}
            >
              {/* ── STEP cedula ─────────────────────────────────────────── */}
              {loginStep === 'cedula' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7AAECB] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                    Número de cédula
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej: 1234567890"
                    value={loginForm.cedula}
                    onChange={(e) => setLoginForm(f => ({ ...f, cedula: e.target.value }))}
                    autoFocus
                    className="w-full rounded-xl px-4 py-3 text-white placeholder-[#2A4A65] text-sm font-medium outline-none transition-all duration-200"
                    style={{ background: 'rgba(0,163,255,0.05)', border: '1.5px solid rgba(0,163,255,0.15)', fontFamily: 'Utile, Arial, sans-serif' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,163,255,0.6)'; e.currentTarget.style.background = 'rgba(0,163,255,0.08)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,163,255,0.15)'; e.currentTarget.style.background = 'rgba(0,163,255,0.05)' }}
                  />
                </div>
              )}

              {/* ── STEP password ───────────────────────────────────────── */}
              {loginStep === 'password' && (
                <>
                  {/* Tarjeta de usuario */}
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(0,163,255,0.06)', border: '1px solid rgba(0,163,255,0.12)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00A3FF, #0154AC)' }}>
                      <User size={15} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>{loginNombre}</p>
                      <p className="text-[#4A7FA5] text-[10px]">Cédula: {loginForm.cedula}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setLoginStep('cedula'); setLoginError(''); setLoginForm(f => ({ ...f, password: '' })) }}
                      className="text-[#4A7FA5] hover:text-white text-[10px] transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
                      style={{ fontFamily: 'Utile, Arial, sans-serif' }}
                    >
                      Cambiar
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#7AAECB] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      autoFocus
                      className="w-full rounded-xl px-4 py-3 text-white placeholder-[#2A4A65] text-sm font-medium outline-none transition-all duration-200"
                      style={{ background: 'rgba(0,163,255,0.05)', border: '1.5px solid rgba(0,163,255,0.15)', fontFamily: 'Utile, Arial, sans-serif' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,163,255,0.6)'; e.currentTarget.style.background = 'rgba(0,163,255,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,163,255,0.15)'; e.currentTarget.style.background = 'rgba(0,163,255,0.05)' }}
                    />
                  </div>
                </>
              )}

              {/* ── STEP new-password ────────────────────────────────────── */}
              {loginStep === 'new-password' && (
                <>
                  {/* Aviso informativo */}
                  <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(0,163,255,0.06)', border: '1px solid rgba(0,163,255,0.15)' }}>
                    <p className="text-white text-xs font-semibold mb-0.5" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                      Hola {loginNombre}, crea tu contraseña de acceso
                    </p>
                    <p className="text-[#4A7FA5] text-[10px]" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                      Es tu primer acceso o tu contraseña fue reiniciada por un administrador.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#7AAECB] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Nueva contraseña</label>
                    <input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={loginNewPass}
                      onChange={(e) => setLoginNewPass(e.target.value)}
                      autoFocus
                      className="w-full rounded-xl px-4 py-3 text-white placeholder-[#2A4A65] text-sm font-medium outline-none transition-all duration-200"
                      style={{ background: 'rgba(0,163,255,0.05)', border: '1.5px solid rgba(0,163,255,0.15)', fontFamily: 'Utile, Arial, sans-serif' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,163,255,0.6)'; e.currentTarget.style.background = 'rgba(0,163,255,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,163,255,0.15)'; e.currentTarget.style.background = 'rgba(0,163,255,0.05)' }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#7AAECB] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>Confirmar contraseña</label>
                    <input
                      type="password"
                      placeholder="Repite la contraseña"
                      value={loginConfirmPass}
                      onChange={(e) => setLoginConfirmPass(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-white placeholder-[#2A4A65] text-sm font-medium outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(0,163,255,0.05)',
                        border: loginConfirmPass
                          ? loginNewPass !== loginConfirmPass
                            ? '1.5px solid rgba(239,68,68,0.5)'
                            : '1.5px solid rgba(34,197,94,0.5)'
                          : '1.5px solid rgba(0,163,255,0.15)',
                        fontFamily: 'Utile, Arial, sans-serif',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,163,255,0.6)'; e.currentTarget.style.background = 'rgba(0,163,255,0.08)' }}
                      onBlur={e => { e.currentTarget.style.background = 'rgba(0,163,255,0.05)'; e.currentTarget.style.borderColor = loginConfirmPass ? loginNewPass !== loginConfirmPass ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.5)' : 'rgba(0,163,255,0.15)' }}
                    />
                  </div>

                  {/* Indicador de fortaleza */}
                  {loginNewPass.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i < Math.min(Math.floor(loginNewPass.length / 3), 4) ? loginNewPass.length >= 12 ? '#22C55E' : loginNewPass.length >= 8 ? '#00A3FF' : '#F59E0B' : 'rgba(255,255,255,0.1)' }}
                        />
                      ))}
                      <span className="text-[10px] ml-1" style={{ color: loginNewPass.length >= 12 ? '#22C55E' : loginNewPass.length >= 8 ? '#00A3FF' : '#F59E0B', fontFamily: 'Utile, Arial, sans-serif' }}>
                        {loginNewPass.length >= 12 ? 'Fuerte' : loginNewPass.length >= 8 ? 'Aceptable' : 'Débil'}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Error */}
              {loginError && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-xs font-medium" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>{loginError}</p>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={loginLoading}
                className="group relative mt-1 w-full text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: 'linear-gradient(135deg, #00A3FF 0%, #0154AC 100%)', fontFamily: 'Utile, Arial, sans-serif', boxShadow: '0 4px 24px rgba(0,163,255,0.3)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loginLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {loginStep === 'new-password' ? 'Guardando...' : 'Verificando...'}
                    </>
                  ) : (
                    <>
                      {loginStep === 'cedula' ? 'Continuar' : loginStep === 'password' ? 'Ingresar a Sirius Media' : 'Crear contraseña'}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </button>

              {/* Footer */}
              <p className="text-center text-[#2A4A65] text-xs mt-1" style={{ fontFamily: 'Utile, Arial, sans-serif' }}>
                Acceso exclusivo para personal autorizado de Sirius
              </p>
            </form>
          </div>
        </div>
      )}

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

        /* Scrollbar principal de la página */
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

        /* Ocultar scrollbar del navbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
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