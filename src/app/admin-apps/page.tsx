'use client'

import React, { useEffect, useState, useRef } from 'react'
import { 
  ArrowRight, 
  Briefcase, 
  DollarSign, 
  FileCheck, 
  BarChart3, 
  Calendar, 
  Users, 
  Settings, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Home,
  Star,
  Menu,
  X,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function AdminAppsPage() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeApp, setActiveApp] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

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
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const adminApps = [
    {
      id: 'flujo-caja',
      name: 'Flujo de Caja',
      description: 'Control financiero y proyecciones en tiempo real',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      status: 'active',
      users: 12,
      lastUpdate: '2 horas',
      features: ['Proyecciones automáticas', 'Alertas de flujo', 'Reportes ejecutivos'],
      stats: { value: '$2.3M', label: 'Balance actual', trend: '+12%' }
    },
    {
      id: 'auditorias',
      name: 'Sistema de Auditorías',
      description: 'Gestión integral de procesos de auditoría',
      icon: FileCheck,
      color: 'from-blue-500 to-cyan-600',
      status: 'active',
      users: 8,
      lastUpdate: '1 hora',
      features: ['Auditorías programadas', 'Seguimiento de hallazgos', 'Informes automáticos'],
      stats: { value: '15', label: 'Auditorías activas', trend: '+3' }
    },
    {
      id: 'entregables',
      name: 'Control de Entregables',
      description: 'Seguimiento y gestión de deliverables de proyectos',
      icon: CheckCircle,
      color: 'from-purple-500 to-violet-600',
      status: 'active',
      users: 25,
      lastUpdate: '30 min',
      features: ['Timeline de proyectos', 'Alertas de vencimiento', 'Aprobaciones digitales'],
      stats: { value: '89%', label: 'Completados a tiempo', trend: '+5%' }
    },
    {
      id: 'analytics',
      name: 'Analytics Empresarial',
      description: 'Inteligencia de negocios y métricas clave',
      icon: BarChart3,
      color: 'from-indigo-500 to-blue-600',
      status: 'active',
      users: 18,
      lastUpdate: '15 min',
      features: ['Dashboards interactivos', 'KPIs en tiempo real', 'Análisis predictivo'],
      stats: { value: '94.2%', label: 'Eficiencia operativa', trend: '+2.1%' }
    },
    {
      id: 'recursos-humanos',
      name: 'Gestión de RRHH',
      description: 'Administración integral del talento humano',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      status: 'beta',
      users: 6,
      lastUpdate: '3 horas',
      features: ['Gestión de nómina', 'Evaluaciones de desempeño', 'Capacitaciones'],
      stats: { value: '156', label: 'Empleados activos', trend: '+8' }
    },
    {
      id: 'planificacion',
      name: 'Planificación Estratégica',
      description: 'Gestión de objetivos y planes estratégicos',
      icon: Calendar,
      color: 'from-teal-500 to-green-600',
      status: 'development',
      users: 0,
      lastUpdate: 'En desarrollo',
      features: ['Roadmaps visuales', 'OKRs tracking', 'Revisiones periódicas'],
      stats: { value: '12', label: 'Iniciativas activas', trend: '+4' }
    }
  ]

  const recentActivities = [
    { type: 'audit', message: 'Nueva auditoría iniciada: Procesos Q4 2024', time: '2 min', icon: FileCheck },
    { type: 'payment', message: 'Flujo de caja actualizado: +$45K entrada', time: '15 min', icon: DollarSign },
    { type: 'deliverable', message: 'Entregable completado: Informe de sostenibilidad', time: '1 hora', icon: CheckCircle },
    { type: 'alert', message: 'Alerta: Vencimiento de contrato próximo', time: '2 horas', icon: AlertTriangle }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'beta': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'development': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'beta': return 'Beta'
      case 'development': return 'En Desarrollo'
      default: return 'Inactivo'
    }
  }

  const filteredApps = adminApps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200/20 rounded-full animate-spin border-t-blue-400"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-blue-300"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Sirius Admin</h2>
            <p className="text-blue-200 animate-pulse">Cargando aplicaciones...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-indigo-900/85 z-10" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-slate-900/95 backdrop-blur-lg border-b border-blue-500/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Aplicaciones Administrativas</h1>
              <p className="text-xs text-blue-300">Herramientas de gestión empresarial</p>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium backdrop-blur-sm mb-6">
              <Shield className="w-4 h-4" />
              <span>Suite Administrativa</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                Herramientas de Gestión
              </span>
            </h1>
            
            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
              Suite completa de aplicaciones administrativas diseñadas para optimizar 
              la gestión interna y el control de recursos empresariales.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Buscar aplicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-blue-200 hover:bg-blue-500/10 transition-colors backdrop-blur-sm flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
              <button className="px-4 py-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nueva App</span>
              </button>
            </div>
          </div>

          {/* Apps Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="group relative bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105"
                onMouseEnter={() => setActiveApp(app.id)}
                onMouseLeave={() => setActiveApp('')}
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </div>

                {/* App Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <app.icon className="w-8 h-8 text-white" />
                </div>

                {/* App Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                    <p className="text-blue-200/70 text-sm">{app.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-white">{app.stats.value}</span>
                      <span className="text-green-400 text-sm font-medium">{app.stats.trend}</span>
                    </div>
                    <p className="text-blue-300 text-sm">{app.stats.label}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {app.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-blue-200">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-blue-300 pt-4 border-t border-blue-500/20">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{app.users} usuarios</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{app.lastUpdate}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button 
                      className={`flex-1 px-4 py-2 bg-gradient-to-r ${app.color} rounded-lg text-white text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                        app.status === 'development' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={app.status === 'development'}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Abrir</span>
                    </button>
                    <button className="p-2 bg-slate-700/50 rounded-lg text-blue-300 hover:bg-slate-600/50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">6</div>
              <div className="text-blue-300 text-sm">Apps Activas</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />3
              </div>
              <div className="text-2xl font-bold text-white mb-1">69</div>
              <div className="text-blue-300 text-sm">Usuarios Totales</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">94.2%</div>
              <div className="text-blue-300 text-sm">Uptime</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">1,247</div>
              <div className="text-blue-300 text-sm">Tareas Completadas</div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Ver todo</button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <activity.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-blue-300 text-xs mt-1">hace {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-slate-900/90 backdrop-blur-lg border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Sirius Admin Suite</span>
          </div>
          <p className="text-blue-400 text-sm">
            © 2025 SIRIUS REGENERATIVE SOLUTIONS S.A.S ZOMAC. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}