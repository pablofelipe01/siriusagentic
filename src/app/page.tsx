'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ArrowRight, Book, Bot, Briefcase, ExternalLink, MessageCircle, Users, AlertCircle, Menu, X, ChevronDown, Star, Zap, Shield } from 'lucide-react'
import './globals.css'

export default function HomePage() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
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
      const sections = ['alma', 'documentacion', 'smartbots', 'admin-apps', 'externos', 'reuniones', 'reportar']
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

  // === SECCIONES REALES SIRIUS ===
  const sections = [
    {
      id: 'alma',
      label: 'Alma',
      icon: MessageCircle,
      description: 'Asistente IA conversacional institucional',
      color: 'from-blue-500 to-purple-600',
      features: [
        'Responde preguntas sobre procesos y políticas',
        'Guía en el uso de las aplicaciones Sirius',
        'Generación de documentos y reportes',
        'Acceso a conocimiento interno actualizado'
      ],
      link: '/chat'
    },
    {
      id: 'documentacion',
      label: 'Documentación',
      icon: Book,
      description: 'Manual técnico y administrativo de Sirius',
      color: 'from-green-500 to-teal-600',
      features: [
        'APIs de integración',
        'Flujos n8n',
        'Guías técnicas',
        'Tutoriales y videos',
        'Integraciones y conectores',
        'Documentación administrativa'
      ],
      link: '/documentacion'
    },
    {
      id: 'smartbots',
      label: 'SmartBots',
      icon: Bot,
      description: 'Automatización de procesos críticos con bots inteligentes',
      color: 'from-orange-500 to-red-600',
      features: [
        'Permisos laborales (Telegram)',
        'Gestión de biochar (Telegram)',
        'Registro de producción (Telegram)',
        'Flujos automatizados de caja y proveedores',
        'Bots para laboratorio y pirolisis',
        'Alertas y notificaciones automáticas'
      ],
      link: '/smartbots'
    },
    {
      id: 'admin-apps',
      label: 'Administrativas',
      icon: Briefcase,
      description: 'Herramientas administrativas y de gestión interna',
      color: 'from-indigo-500 to-blue-600',
      features: [
        'Flujo de caja',
        'Gestión de proveedores',
        'Novedades de nómina',
        'Control de entregables',
        'Auditorías y reportes',
        'Gestión de contratistas'
      ],
      link: '/admin-apps'
    },
    {
      id: 'externos',
      label: 'Integraciones Externas',
      icon: ExternalLink,
      description: 'Plataformas y servicios integrados al ecosistema Sirius',
      color: 'from-purple-500 to-pink-600',
      features: [
        'Airtable (bases de datos y formularios)',
        'Cloudinary (gestión multimedia)',
        'WhatsApp y Telegram Bots',
        'Integración con sistemas de monitoreo',
        'Conectores para blockchain y Sirius Coin'
      ],
      link: '/externos'
    },
    {
      id: 'reuniones',
      label: 'Reuniones',
      icon: Users,
      description: 'Gestión colaborativa de reuniones y actas digitales',
      color: 'from-cyan-500 to-blue-600',
      features: [
        'Actas digitales con audio, video e imagen',
        'Seguimiento de tareas',
        'Agendas inteligentes',
        'Resúmenes automáticos',
        'Registro de asistencia',
        'Formularios de reunión integrados'
      ],
      link: '/reuniones'
    },
    {
      id: 'reportar',
      label: 'Soporte y Reportes',
      icon: AlertCircle,
      description: 'Canal de soporte técnico y reporte de incidentes',
      color: 'from-red-500 to-pink-600',
      features: [
        'Reporte de incidentes',
        'Soporte técnico a usuarios',
        'Seguimiento de tickets',
        'Mejoras continuas',
        'Canal directo con el equipo Sirius'
      ],
      link: '/reportar'
    }
  ]

  const sectionImages = [
    '/DJI_0026.JPG', // Para la sección 'alma'
    '/DSC_3239.jpg',
    '/DSC_3285.jpg',
    '/DSC_3466.jpg',
    '/DSC_3197.jpg',
    '/DJI_0543.JPG',
    '/DJI_0909.jpg'
  ]

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMenuOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <img src="/logo.png" alt="Sirius Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
          <h2 className="text-2xl font-bold text-white">Sirius</h2>
          <p className="text-blue-200 animate-pulse">Cargando experiencia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Header minimalista */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0154AC]/95 backdrop-blur-md border-b border-[#00B602]/10 flex items-center justify-between px-10 py-2" style={{fontFamily: 'Utile, Arial, sans-serif'}}>
        <img src="/logo.png" alt="Sirius Logo" className="w-[200px] h-auto object-contain" style={{minWidth: 85}} />
        <nav className="flex space-x-6">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`text-[#BCD7EA] hover:text-[#00A3FF] px-4 py-2 rounded-lg text-lg font-bold transition-colors tracking-tight ${activeSection === id ? 'bg-[#00B602]/20 text-[#00B602]' : ''}`}
              style={{fontFamily: 'Utile, Arial, sans-serif', letterSpacing: '-1px'}}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content con scroll snap y gradiente sutil */}
      <main className="pt-24 h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-gradient-to-br from-[#CFE4BF] via-[#BCD7EA] to-[#0154AC]">
        {/* Imagen principal */}
        <section className="snap-start min-h-screen flex items-center justify-center relative">
          <img src="/DSC_2889.jpg" alt="Sirius principal" className="absolute inset-0 w-full h-full object-cover object-center max-h-screen max-w-full" style={{height: '100vh', width: '100vw'}} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-full px-4 md:px-8 gap-8">
            <div className="flex flex-col items-start md:justify-center md:w-1/2 w-full mb-10 md:mb-0">
              <h1 className="text-[#0154AC] text-[8vw] md:text-[60px] font-bold mb-2 leading-tight" style={{fontFamily: 'Utile, Arial, sans-serif', letterSpacing: '-2px'}}>Sirius Agentics</h1>
              <p className="text-[#00B602] text-xl md:text-2xl mb-4 font-medium" style={{fontFamily: 'Utile, Arial, sans-serif'}}>Regenerative Solutions</p>
            </div>
            <div className="flex-1 flex items-center justify-center w-full">
              <p className="text-[#1A1A33] text-3xl md:text-5xl lg:text-6xl font-bold text-center" style={{fontFamily: 'IvyPresto, serif', fontStyle: 'italic'}}>
                Tecnología + Naturaleza = Innovación
              </p>
            </div>
          </div>
        </section>
        {/* Secciones con scroll snap, foto diferente y animación al entrar */}
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="snap-start min-h-screen flex items-center justify-center relative group"
          >
            <img
              src={sectionImages[index % sectionImages.length]}
              alt={section.label}
              className="absolute inset-0 w-full h-full object-cover object-center max-h-screen max-w-full" style={{height: '100vh', width: '100vw'}}
            />
            <div className="relative z-10 max-w-2xl w-full mx-auto text-center p-4 md:p-10 section-fade-in" style={{fontFamily: 'Utile, Arial, sans-serif'}}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0154AC] mb-2" style={{fontFamily: 'Utile, Arial, sans-serif'}}>{section.label}</h2>
              <p className="text-[#0154AC] mb-4 text-base md:text-lg">{section.description}</p>
              <ul className="text-[#00B602] text-left list-disc list-inside space-y-2 mb-4 text-sm md:text-base">
                {section.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button
                onClick={() => window.location.href = section.link}
                className="mt-4 px-6 md:px-8 py-3 md:py-4 bg-[#00A3FF] hover:bg-[#00B602] rounded-lg text-white font-black shadow-lg transition-all duration-300 text-base md:text-lg"
                style={{fontFamily: 'Utile, Arial, sans-serif', fontSize: 'clamp(16px,2vw,24px)', boxShadow: '0 2px 24px #BCD7EA88'}}
              >
                Ir a {section.label}
              </button>
            </div>
          </section>
        ))}
      </main>
      <footer className="relative z-20 bg-[#1A1A33] text-center text-[#BCD7EA] py-6 border-t border-[#00B602]/20" style={{fontFamily: 'Utile, Arial, sans-serif', fontSize: 18}}>
        © 2025 SIRIUS REGENERATIVE SOLUTIONS S.A.S ZOMAC. Todos los derechos reservados.
      </footer>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Utile:wght@400;700;900&family=Ivy+Presto:ital,wght@1,400&display=swap');
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .section-fade-in {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        section:target .section-fade-in,
        section:focus-within .section-fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        section:first-of-type .section-fade-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}