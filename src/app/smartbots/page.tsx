'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Bot, Search, Filter, ExternalLink, Star, Zap, Shield, MessageCircle, Phone, Mail, Settings, Users, FileText, Calendar, DollarSign, CheckCircle, AlertTriangle, Clock, Activity, Bell } from 'lucide-react'

export default function SmartBotsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBot, setSelectedBot] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const categories = [
    { id: 'all', label: 'Todos', icon: Bot, count: 12 },
    { id: 'telegram', label: 'Telegram', icon: MessageCircle, count: 7 },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, count: 3 },
    { id: 'email', label: 'Email', icon: Mail, count: 2 },
    { id: 'admin', label: 'Administrativos', icon: Settings, count: 4 }
  ]

  const bots = [
    {
      id: 'permisos-bot',
      name: 'Bot de Permisos',
      platform: 'telegram',
      category: 'admin',
      status: 'active',
      description: 'Automatiza el proceso de solicitud y aprobación de permisos laborales',
      features: ['Solicitud automática', 'Flujo de aprobación', 'Notificaciones', 'Historial'],
      commands: ['/solicitar', '/estado', '/historial', '/cancelar'],
      usage: 'Permite a los empleados solicitar permisos directamente desde Telegram',
      lastUpdate: '2024-12-15',
      uptime: '99.8%',
      interactions: 2847,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-600',
      adminContact: '@admin_permisos',
      documentation: '/docs/permisos-bot'
    },
    {
      id: 'biochar-bot',
      name: 'Bot de Biochar',
      platform: 'telegram',
      category: 'admin',
      status: 'active',
      description: 'Gestiona el inventario y distribución de biochar para proyectos regenerativos',
      features: ['Control de inventario', 'Tracking de distribución', 'Reportes automáticos', 'Alertas de stock'],
      commands: ['/inventario', '/distribuir', '/reporte', '/alerta'],
      usage: 'Monitorea y controla el flujo de biochar en tiempo real',
      lastUpdate: '2024-12-20',
      uptime: '99.5%',
      interactions: 1523,
      icon: Activity,
      color: 'from-green-500 to-emerald-600',
      adminContact: '@biochar_admin',
      documentation: '/docs/biochar-bot'
    },
    {
      id: 'compras-bot',
      name: 'Bot de Compras',
      platform: 'telegram',
      category: 'admin',
      status: 'active',
      description: 'Automatiza el proceso de requisiciones y aprobaciones de compras',
      features: ['Solicitudes de compra', 'Flujo de aprobación', 'Cotizaciones', 'Seguimiento'],
      commands: ['/comprar', '/cotizar', '/aprobar', '/seguimiento'],
      usage: 'Streamline del proceso de adquisiciones empresariales',
      lastUpdate: '2024-12-18',
      uptime: '98.9%',
      interactions: 3421,
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600',
      adminContact: '@compras_admin',
      documentation: '/docs/compras-bot'
    },
    {
      id: 'firmas-bot',
      name: 'Bot de Firmas Digitales',
      platform: 'telegram',
      category: 'admin',
      status: 'active',
      description: 'Gestiona el proceso de firmas digitales para documentos corporativos',
      features: ['Firma digital', 'Validación de documentos', 'Historial de firmas', 'Notificaciones'],
      commands: ['/firmar', '/validar', '/historial', '/pendientes'],
      usage: 'Digitalización completa del proceso de firmas documentales',
      lastUpdate: '2024-12-22',
      uptime: '99.9%',
      interactions: 1876,
      icon: FileText,
      color: 'from-indigo-500 to-blue-600',
      adminContact: '@firmas_admin',
      documentation: '/docs/firmas-bot'
    },
    {
      id: 'whatsapp-soporte',
      name: 'Agente de Soporte',
      platform: 'whatsapp',
      category: 'whatsapp',
      status: 'active',
      description: 'Agente de IA para atención al cliente 24/7 en WhatsApp Business',
      features: ['Respuestas automáticas', 'Escalamiento inteligente', 'Base de conocimiento', 'Métricas'],
      commands: ['Texto libre', 'Comandos naturales'],
      usage: 'Primera línea de atención al cliente con IA conversacional',
      lastUpdate: '2024-12-21',
      uptime: '99.7%',
      interactions: 5632,
      icon: MessageCircle,
      color: 'from-green-500 to-teal-600',
      adminContact: '+57 300 123 4567',
      documentation: '/docs/whatsapp-soporte'
    },
    {
      id: 'whatsapp-ventas',
      name: 'Agente de Ventas',
      platform: 'whatsapp',
      category: 'whatsapp',
      status: 'beta',
      description: 'Bot especializado en calificación de leads y proceso de ventas',
      features: ['Calificación de leads', 'Cotizaciones automáticas', 'Seguimiento', 'CRM integrado'],
      commands: ['Conversación natural', 'Intents automáticos'],
      usage: 'Automatización del funnel de ventas desde WhatsApp',
      lastUpdate: '2024-12-19',
      uptime: '97.2%',
      interactions: 2341,
      icon: DollarSign,
      color: 'from-orange-500 to-red-600',
      adminContact: '+57 300 123 4568',
      documentation: '/docs/whatsapp-ventas'
    },
    {
      id: 'email-reports',
      name: 'Bot de Reportes',
      platform: 'email',
      category: 'email',
      status: 'active',
      description: 'Genera y envía reportes automáticos por email',
      features: ['Reportes programados', 'Dashboards', 'Alertas', 'Personalización'],
      commands: ['Configuración por interfaz web'],
      usage: 'Automatización de reportes periódicos a stakeholders',
      lastUpdate: '2024-12-17',
      uptime: '99.1%',
      interactions: 892,
      icon: Mail,
      color: 'from-cyan-500 to-blue-600',
      adminContact: 'reportes@sirius.com',
      documentation: '/docs/email-reports'
    },
    {
      id: 'telegram-notifs',
      name: 'Bot de Notificaciones',
      platform: 'telegram',
      category: 'telegram',
      status: 'active',
      description: 'Sistema centralizado de notificaciones para equipos',
      features: ['Notificaciones personalizadas', 'Canales temáticos', 'Programación', 'Prioridades'],
      commands: ['/suscribir', '/configurar', '/silenciar', '/prioridad'],
      usage: 'Hub central de comunicaciones internas automáticas',
      lastUpdate: '2024-12-23',
      uptime: '99.6%',
      interactions: 4521,
      icon: Bell,
      color: 'from-yellow-500 to-orange-600',
      adminContact: '@notif_admin',
      documentation: '/docs/telegram-notifs'
    }
  ]

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || bot.platform === selectedCategory || bot.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20'
      case 'beta': return 'text-yellow-400 bg-yellow-500/20'
      case 'maintenance': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'beta': return Clock
      case 'maintenance': return AlertTriangle
      default: return Bot
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-200/20 rounded-full animate-spin border-t-orange-400"></div>
            <Bot className="absolute inset-0 m-auto w-10 h-10 text-orange-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">SmartBots</h2>
            <p className="text-orange-200 animate-pulse">Cargando wiki de automatización...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-lg border-b border-orange-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SmartBots</h1>
                  <p className="text-xs text-orange-300">Wiki de Automatización</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-orange-300">
              <Activity className="w-4 h-4" />
              <span>{filteredBots.length} bots activos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar bots por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 backdrop-blur-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-slate-800/50 text-blue-300 border border-blue-500/20 hover:bg-slate-700/50'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{category.label}</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bots Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBots.map((bot) => {
            const StatusIcon = getStatusIcon(bot.status)
            const BotIcon = bot.icon
            
            return (
              <div
                key={bot.id}
                className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-blue-500/20 p-6 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedBot(bot)}
              >
                {/* Bot Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${bot.color}`}>
                      <BotIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                        {bot.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-300 capitalize">
                          {bot.platform}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(bot.status)}`}>
                          <StatusIcon size={12} />
                          <span className="capitalize">{bot.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-blue-200/80 text-sm mb-4 line-clamp-2">
                  {bot.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{bot.uptime}</div>
                    <div className="text-xs text-blue-300">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{bot.interactions.toLocaleString()}</div>
                    <div className="text-xs text-blue-300">Interacciones</div>
                  </div>
                </div>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {bot.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                    >
                      {feature}
                    </span>
                  ))}
                  {bot.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full">
                      +{bot.features.length - 3} más
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
                  <span className="text-xs text-blue-400">
                    Actualizado: {new Date(bot.lastUpdate).toLocaleDateString()}
                  </span>
                  <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-orange-400 transition-colors" />
                </div>
              </div>
            )
          })}
        </div>

        {filteredBots.length === 0 && (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron bots</h3>
            <p className="text-blue-300">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </div>

      {/* Bot Detail Modal */}
      {selectedBot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-800 rounded-2xl border border-blue-500/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedBot.color}`}>
                    <selectedBot.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedBot.name}</h2>
                    <p className="text-blue-300">{selectedBot.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBot(null)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{selectedBot.uptime}</div>
                  <div className="text-sm text-blue-300">Uptime</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{selectedBot.interactions.toLocaleString()}</div>
                  <div className="text-sm text-blue-300">Interacciones</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 capitalize">{selectedBot.platform}</div>
                  <div className="text-sm text-blue-300">Plataforma</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold capitalize ${selectedBot.status === 'active' ? 'text-green-400' : selectedBot.status === 'beta' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {selectedBot.status}
                  </div>
                  <div className="text-sm text-blue-300">Estado</div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Características</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedBot.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-blue-200">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commands */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <span>Comandos</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedBot.commands.map((command, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-lg p-2">
                        <code className="text-green-400 font-mono text-sm">{command}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Usage and Contact */}
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Uso Principal</h3>
                  <p className="text-blue-200 bg-slate-700/30 rounded-lg p-4">{selectedBot.usage}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Contacto Admin</h4>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-blue-400">{selectedBot.adminContact}</code>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Documentación</h4>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-3 flex items-center justify-center space-x-2 hover:shadow-lg transition-all">
                      <ExternalLink className="w-4 h-4" />
                      <span>Ver Docs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}