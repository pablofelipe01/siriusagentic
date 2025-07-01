'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ArrowRight, Book, Bot, Briefcase, ExternalLink, MessageCircle, Users, AlertCircle, Menu, X, ChevronDown, Star, Zap, Shield } from 'lucide-react'

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

  const sections = [
    { 
      id: 'alma', 
      label: 'Alma', 
      icon: MessageCircle, 
      description: 'Asistente IA conversacional',
      color: 'from-blue-500 to-purple-600',
      features: ['Conocimiento interno', 'Procesos y políticas', 'Generación de documentos'],
      link: '/chat'
    },
    { 
      id: 'documentacion', 
      label: 'Documentación', 
      icon: Book, 
      description: 'Manual técnico y administrativo',
      color: 'from-green-500 to-teal-600',
      features: ['APIs de integración', 'Flujos n8n', 'Guías completas'],
      link: '/documentacion'
    },
    { 
      id: 'smartbots', 
      label: 'SmartBots', 
      icon: Bot, 
      description: 'Automatización inteligente',
      color: 'from-orange-500 to-red-600',
      features: ['Permisos automatizados', 'Gestión de biochar', 'Firmas digitales'],
      link: '/smartbots'
    },
    { 
      id: 'admin-apps', 
      label: 'Administrativas', 
      icon: Briefcase, 
      description: 'Herramientas de gestión',
      color: 'from-indigo-500 to-blue-600',
      features: ['Flujo de caja', 'Auditorías', 'Control de entregables'],
      link: '/admin-apps'
    },
    { 
      id: 'externos', 
      label: 'Externos', 
      icon: ExternalLink, 
      description: 'Plataformas integradas',
      color: 'from-purple-500 to-pink-600',
      features: ['Airtable', 'Cloudinary', 'WhatsApp Bots'],
      link: '/externos'
    },
    { 
      id: 'reuniones', 
      label: 'Reuniones', 
      icon: Users, 
      description: 'Gestión colaborativa',
      color: 'from-cyan-500 to-blue-600',
      features: ['Actas digitales', 'Seguimiento de tareas', 'Agendas inteligentes'],
      link: '/reuniones'
    },
    { 
      id: 'reportar', 
      label: 'Soporte', 
      icon: AlertCircle, 
      description: 'Asistencia técnica',
      color: 'from-red-500 to-pink-600',
      features: ['Reporte de incidentes', 'Soporte 24/7', 'Mejoras continuas'],
      link: '/reportar'
    }
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
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200/20 rounded-full animate-spin border-t-blue-400"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-blue-300"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Sirius</h2>
            <p className="text-blue-200 animate-pulse">Cargando experiencia...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80 z-10" />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute min-w-full min-h-full object-cover transition-all duration-2000 ${isVideoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        >
          <source src="/ai.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10" />
      </div>

      {/* Header */}
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-slate-900/95 backdrop-blur-lg border-b border-blue-500/20' 
            : 'bg-transparent'
        }`}
        style={{
          transform: `translateY(${Math.max(-100, scrollY * -0.1)}px)`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sirius</h1>
              <p className="text-xs text-blue-300">Regenerative Solutions</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeSection === id
                    ? 'bg-blue-500/20 text-blue-300 shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 bg-slate-900/95 backdrop-blur-lg border-t border-blue-500/20' : 'max-h-0'
        }`}>
          <div className="px-6 py-4 space-y-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 pt-24">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
                <Zap className="w-4 h-4" />
                <span>Plataforma Inteligente</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                  Sirius
                </span>
                <br />
                <span className="text-3xl md:text-4xl font-normal text-blue-200">
                  Regenerative Solutions
                </span>
              </h1>
              
              <p className="text-xl text-blue-200/80 max-w-3xl mx-auto leading-relaxed">
                Ecosistema tecnológico avanzado que integra inteligencia artificial, 
                automatización y gestión empresarial en una plataforma unificada.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => scrollToSection('alma')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Comenzar con Alma</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection('documentacion')}
                className="px-8 py-4 border border-blue-400/30 rounded-xl text-blue-200 font-semibold hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm"
              >
                Explorar Documentación
              </button>
            </div>

            <div className="pt-16 animate-bounce">
              <ChevronDown className="w-8 h-8 text-blue-300 mx-auto" />
            </div>
          </div>
        </section>

        {/* Sections */}
        <div className="space-y-32 px-6 pb-32">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="max-w-6xl mx-auto"
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color}`}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{section.label}</h2>
                        <p className="text-blue-300">{section.description}</p>
                      </div>
                    </div>
                    
                    <p className="text-blue-200/80 text-lg leading-relaxed">
                      {section.id === 'alma' && "Tu asistente virtual inteligente que combina IA conversacional con el conocimiento institucional de Sirius para guiarte en cada proceso."}
                      {section.id === 'documentacion' && "Acceso centralizado a toda la documentación técnica, APIs, flujos automatizados y guías de implementación del ecosistema Sirius."}
                      {section.id === 'smartbots' && "Bots inteligentes que automatizan procesos críticos como gestión de permisos, biochar, compras y firmas digitales."}
                      {section.id === 'admin-apps' && "Suite de aplicaciones administrativas diseñadas para optimizar la gestión interna y el control de recursos empresariales."}
                      {section.id === 'externos' && "Integración seamless con plataformas externas esenciales para el funcionamiento del ecosistema tecnológico."}
                      {section.id === 'reuniones' && "Sistema completo de gestión de reuniones con actas digitales, seguimiento de tareas y agendas colaborativas."}
                      {section.id === 'reportar' && "Canal directo de comunicación con el equipo técnico para reportar incidentes y solicitar mejoras en tiempo real."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span>Características principales</span>
                    </h3>
                    <div className="grid gap-3">
                      {section.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-blue-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.href = section.link}
                    className={`group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${section.color} rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      section.id === 'reportar' ? 'from-red-500 to-pink-600' : ''
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>
                      {section.id === 'alma' && 'Iniciar Chat'}
                      {section.id === 'documentacion' && 'Ver Documentación'}
                      {section.id === 'smartbots' && 'Explorar Bots'}
                      {section.id === 'admin-apps' && 'Acceder a Apps'}
                      {section.id === 'externos' && 'Ver Plataformas'}
                      {section.id === 'reuniones' && 'Gestionar Reuniones'}
                      {section.id === 'reportar' && 'Reportar Problema'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Visual Element */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className={`relative p-8 bg-gradient-to-br ${section.color} rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                    <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                    <div className="relative text-center text-white space-y-4">
                      <section.icon className="w-16 h-16 mx-auto opacity-80" />
                      <h3 className="text-2xl font-bold">{section.label}</h3>
                      <div className="flex justify-center space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-slate-900/90 backdrop-blur-lg border-t border-blue-500/20">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Sirius Regenerative Solutions</span>
          </div>
          
          <p className="text-blue-300 max-w-2xl mx-auto">
            Transformando el futuro empresarial a través de tecnología regenerativa, 
            inteligencia artificial y automatización inteligente.
          </p>
          
          <div className="pt-6 border-t border-blue-500/20">
            <p className="text-blue-400 text-sm">
              © 2025 SIRIUS REGENERATIVE SOLUTIONS S.A.S ZOMAC. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}