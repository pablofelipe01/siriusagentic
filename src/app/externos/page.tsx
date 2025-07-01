'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  ExternalLink, 
  Mic, 
  Heart, 
  Leaf, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Star,
  Activity,
  Users,
  Cloud,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Mail,
  Calendar,
  FileText,
  Bot,
  Headphones,
  MessageCircle,
  Database,
  Play,
  Download,
  Share2
} from 'lucide-react'

export default function ExternosPage() {
  const [activeApp, setActiveApp] = useState('voice-capture')
  const [appStats, setAppStats] = useState({
    voiceCapture: {
      totalRecordings: '12,847',
      activeUsers: '2,341',
      dataProcessed: '847 GB',
      accuracy: '94.8%'
    },
    donaPepa: {
      totalConversations: '8,934',
      activeUsers: '1,567',
      satisfaction: '98.2%',
      avgResponse: '1.2s'
    },
    biogasBot: {
      totalQueries: '5,678',
      activeUsers: '892',
      projectsTracked: '234',
      efficiency: '96.7%'
    }
  })

  const externalApps = [
    {
      id: 'voice-capture',
      name: 'Voice Data Capture',
      description: 'Plataforma de captura de datos por voz con IA avanzada',
      icon: Mic,
      color: 'from-purple-500 to-indigo-600',
      status: 'active',
      category: 'Data Collection',
      targetAudience: 'Investigadores y analistas externos',
      features: [
        'Transcripción automática en tiempo real',
        'Análisis de sentimientos por voz',
        'Clasificación automática de contenido',
        'APIs de integración robustas',
        'Dashboard de métricas avanzadas'
      ],
      integrations: [
        { name: 'Whisper AI', status: 'active', usage: '98.5%' },
        { name: 'Azure Speech Services', status: 'active', usage: '96.2%' },
        { name: 'Google Cloud Speech', status: 'backup', usage: '15.3%' },
        { name: 'Analytics Engine', status: 'active', usage: '87.9%' }
      ],
      stats: appStats.voiceCapture,
      demoUrl: 'https://voice.sirius-external.com',
      apiDocs: 'https://docs.sirius-external.com/voice-api',
      publicAccess: true
    },
    {
      id: 'dona-pepa',
      name: 'Doña Pepa',
      description: 'Agente de IA personalizado que responde con calidez y amor',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      status: 'active',
      category: 'Conversational AI',
      targetAudience: 'Usuarios que buscan atención personalizada',
      features: [
        'Personalidad cálida y empática',
        'Respuestas contextuales inteligentes',
        'Memoria conversacional avanzada',
        'Integración multicanal',
        'Análisis emocional en tiempo real'
      ],
      integrations: [
        { name: 'NLP Engine', status: 'active', usage: '99.1%' },
        { name: 'Emotion Analytics', status: 'active', usage: '94.7%' },
        { name: 'WhatsApp Integration', status: 'active', usage: '89.3%' },
        { name: 'Telegram Bot', status: 'active', usage: '76.8%' }
      ],
      stats: appStats.donaPepa,
      demoUrl: 'https://donapepa.sirius-external.com',
      apiDocs: 'https://docs.sirius-external.com/donapepa-api',
      publicAccess: true
    },
    {
      id: 'biogas-bot',
      name: 'Biogas Bot',
      description: 'Asistente especializado en proyectos de biogás y energía renovable',
      icon: Leaf,
      color: 'from-green-500 to-emerald-600',
      status: 'active',
      category: 'Specialized Assistant',
      targetAudience: 'Profesionales del sector energético',
      features: [
        'Base de conocimiento especializada',
        'Calculadoras de rendimiento',
        'Seguimiento de proyectos',
        'Alertas y recordatorios',
        'Reportes automatizados'
      ],
      integrations: [
        { name: 'Project Database', status: 'active', usage: '92.4%' },
        { name: 'Calculation Engine', status: 'active', usage: '88.6%' },
        { name: 'Alert System', status: 'active', usage: '95.1%' },
        { name: 'Report Generator', status: 'active', usage: '79.3%' }
      ],
      stats: appStats.biogasBot,
      demoUrl: 'https://biogas.sirius-external.com',
      apiDocs: 'https://docs.sirius-external.com/biogas-api',
      publicAccess: false
    }
  ]

  const currentApp = externalApps.find(app => app.id === activeApp)

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-400 bg-green-500/20'
      case 'beta': return 'text-yellow-400 bg-yellow-500/20'
      case 'maintenance': return 'text-blue-400 bg-blue-500/20'
      case 'backup': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return CheckCircle
      case 'beta': return AlertCircle
      case 'maintenance': return Settings
      case 'backup': return Shield
      default: return AlertCircle
    }
  }

  const goHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goHome}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-white transition-all duration-200 flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Volver al Home</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Sirius / Aplicaciones Externas</h1>
                  <p className="text-xs text-blue-300">Soluciones para usuarios externos</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">{externalApps.length} Apps Activas</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Apps Desarrolladas</p>
                <p className="text-2xl font-bold text-white">{externalApps.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Usuarios Activos</p>
                <p className="text-2xl font-bold text-white">4.8K</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Interacciones/Mes</p>
                <p className="text-2xl font-bold text-white">27K</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Satisfacción</p>
                <p className="text-2xl font-bold text-white">96.5%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* App Selector */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                <span>Aplicaciones</span>
              </h3>
              
              <div className="space-y-2">
                {externalApps.map((app) => {
                  const StatusIcon = getStatusIcon(app.status)
                  return (
                    <button
                      key={app.id}
                      onClick={() => setActiveApp(app.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        activeApp === app.id
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'text-blue-200 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <app.icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{app.name}</p>
                        <p className="text-xs opacity-70">{app.category}</p>
                      </div>
                      <StatusIcon className={`w-4 h-4 ${getStatusColor(app.status).split(' ')[0]}`} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* App Details */}
          <div className="lg:col-span-3">
            {currentApp && (
              <div className="space-y-6">
                {/* App Header */}
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-blue-500/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${currentApp.color}`}>
                        <currentApp.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{currentApp.name}</h2>
                        <p className="text-blue-300 text-lg">{currentApp.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                            {currentApp.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            currentApp.publicAccess 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-orange-500/20 text-orange-300'
                          }`}>
                            {currentApp.publicAccess ? 'Acceso Público' : 'Acceso Restringido'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(currentApp.status)}`}>
                      {React.createElement(getStatusIcon(currentApp.status), { className: "w-4 h-4" })}
                      <span className="font-medium capitalize">{currentApp.status}</span>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>Audiencia Objetivo</span>
                    </h4>
                    <p className="text-blue-200">{currentApp.targetAudience}</p>
                  </div>

                  {/* App Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(currentApp.stats).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <p className="text-2xl font-bold text-white">{value}</p>
                        <p className="text-blue-300 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Características Principales</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {currentApp.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-blue-200">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => window.open(currentApp.demoUrl, '_blank')}
                      className={`px-6 py-3 bg-gradient-to-r ${currentApp.color} rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2`}
                    >
                      <Play className="w-4 h-4" />
                      <span>Probar Demo</span>
                    </button>
                    
                    <button 
                      onClick={() => window.open(currentApp.apiDocs, '_blank')}
                      className="px-6 py-3 border border-blue-400/30 rounded-lg text-blue-200 font-semibold hover:bg-blue-500/10 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Documentación API</span>
                    </button>

                    <button className="px-6 py-3 border border-purple-400/30 rounded-lg text-purple-200 font-semibold hover:bg-purple-500/10 transition-all duration-300 flex items-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Compartir</span>
                    </button>
                  </div>
                </div>

                {/* Technical Integrations */}
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Integraciones Técnicas</h3>
                  
                  <div className="space-y-3">
                    {currentApp.integrations.map((integration, idx) => {
                      const StatusIcon = getStatusIcon(integration.status)
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className={`w-5 h-5 ${getStatusColor(integration.status).split(' ')[0]}`} />
                            <div>
                              <p className="font-medium text-white">{integration.name}</p>
                              <p className="text-blue-300 text-sm capitalize">{integration.status}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-white font-semibold">{integration.usage}</p>
                            <p className="text-blue-300 text-sm">utilización</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}