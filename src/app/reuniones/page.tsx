'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  Users, 
  Mic, 
  Play,
  Pause,
  Square,
  FileText, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Star,
  Activity,
  Calendar,
  Clock,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Download,
  Share2,
  Bot,
  Headphones,
  MessageCircle,
  Database,
  Volume2,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  Video,
  MicOff,
  VideoOff
} from 'lucide-react'

export default function ReunionesPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  // Simular contador de grabación
  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const meetingStats = {
    totalMeetings: '1,247',
    totalHours: '3,847',
    transcriptionAccuracy: '96.8%',
    avgDuration: '42 min'
  }

  const recentMeetings = [
    {
      id: 1,
      title: 'Revisión Proyecto Biochar Q1',
      date: '2025-07-01',
      time: '14:30',
      duration: '1h 23m',
      participants: 8,
      status: 'completed',
      hasTranscription: true,
      hasRecording: true,
      tags: ['biochar', 'quarterly', 'review']
    },
    {
      id: 2,
      title: 'Daily Standup - Desarrollo',
      date: '2025-07-01',
      time: '09:00',
      duration: '23m',
      participants: 5,
      status: 'completed',
      hasTranscription: true,
      hasRecording: false,
      tags: ['daily', 'development', 'standup']
    },
    {
      id: 3,
      title: 'Reunión Cliente - Propuesta Energía Renovable',
      date: '2025-06-30',
      time: '16:00',
      duration: '2h 15m',
      participants: 12,
      status: 'completed',
      hasTranscription: true,
      hasRecording: true,
      tags: ['client', 'proposal', 'renewable']
    },
    {
      id: 4,
      title: 'Capacitación IA - Nuevas Funcionalidades',
      date: '2025-06-30',
      time: '10:30',
      duration: '1h 45m',
      participants: 15,
      status: 'processing',
      hasTranscription: false,
      hasRecording: true,
      tags: ['training', 'ai', 'features']
    }
  ]

  const features = [
    {
      icon: Mic,
      title: 'Transcripción en Tiempo Real',
      description: 'Conversión automática de voz a texto con precisión superior al 96%',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Bot,
      title: 'Análisis con IA',
      description: 'Identificación automática de temas, decisiones y tareas pendientes',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Identificación de Hablantes',
      description: 'Reconocimiento automático de participantes y asignación de diálogos',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: FileText,
      title: 'Actas Automáticas',
      description: 'Generación instantánea de resúmenes y minutas estructuradas',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Search,
      title: 'Búsqueda Semántica',
      description: 'Encuentra información específica en todas tus reuniones pasadas',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Shield,
      title: 'Seguridad Empresarial',
      description: 'Encriptación end-to-end y cumplimiento de normativas de privacidad',
      color: 'from-indigo-500 to-blue-600'
    }
  ]

  const goHome = () => {
    window.location.href = '/'
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-500/20'
      case 'processing': return 'text-yellow-400 bg-yellow-500/20'
      case 'scheduled': return 'text-blue-400 bg-blue-500/20'
      case 'cancelled': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
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
                  <h1 className="text-xl font-bold text-white">Sirius / Plataforma de Reuniones</h1>
                  <p className="text-xs text-blue-300">Transcripción inteligente con IA</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva Reunión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'live', label: 'Grabación en Vivo', icon: Mic },
            { id: 'meetings', label: 'Reuniones', icon: Users },
            { id: 'features', label: 'Características', icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-blue-500/20">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium">
                      <Bot className="w-4 h-4" />
                      <span>Potenciado por IA</span>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-white">
                      Reuniones Inteligentes
                    </h2>
                    
                    <p className="text-xl text-blue-200 leading-relaxed">
                      Transforma tus reuniones con transcripción automática, análisis por IA y generación de actas inteligentes.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setActiveTab('live')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                    >
                      <Mic className="w-5 h-5" />
                      <span>Iniciar Grabación</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('features')}
                      className="px-6 py-3 border border-blue-400/30 rounded-lg text-blue-200 font-semibold hover:bg-blue-500/10 transition-all duration-300"
                    >
                      Ver Características
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">Transcribiendo en tiempo real...</span>
                      </div>
                      
                      <div className="space-y-2 text-blue-200 text-sm">
                        <p><strong>Juan:</strong> "El proyecto de biochar está avanzando según cronograma..."</p>
                        <p><strong>María:</strong> "Necesitamos revisar los indicadores de sostenibilidad..."</p>
                        <p><strong>Carlos:</strong> "La implementación de IA ha mejorado la eficiencia en un 30%..."</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Precisión: 96.8% • 3 hablantes identificados</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm">Total Reuniones</p>
                    <p className="text-2xl font-bold text-white">{meetingStats.totalMeetings}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm">Horas Transcritas</p>
                    <p className="text-2xl font-bold text-white">{meetingStats.totalHours}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Mic className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm">Precisión IA</p>
                    <p className="text-2xl font-bold text-white">{meetingStats.transcriptionAccuracy}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm">Duración Promedio</p>
                    <p className="text-2xl font-bold text-white">{meetingStats.avgDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Recording Tab */}
        {activeTab === 'live' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Mic className="w-6 h-6 text-blue-400" />
                <span>Grabación en Vivo</span>
              </h2>

              {/* Recording Controls */}
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500/20 border-4 border-red-500 animate-pulse' 
                      : 'bg-blue-500/20 border-4 border-blue-500 hover:bg-blue-500/30'
                  }`}>
                    <button
                      onClick={toggleRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </button>
                  </div>
                  
                  {isRecording && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">
                    {isRecording ? formatTime(recordingTime) : '00:00'}
                  </p>
                  <p className="text-blue-300">
                    {isRecording ? 'Grabando...' : 'Listo para grabar'}
                  </p>
                </div>

                {isRecording && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full">
                        <Volume2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Audio detectado</span>
                      </div>
                      <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">IA transcribiendo</span>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4 max-w-2xl mx-auto">
                      <h4 className="text-white font-semibold mb-2">Transcripción en tiempo real:</h4>
                      <div className="text-blue-200 text-sm space-y-1">
                        <p>"Bienvenidos a la reunión de seguimiento del proyecto..."</p>
                        <p className="animate-pulse">"Vamos a revisar el progreso de esta semana..."</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <button className="px-6 py-3 border border-blue-400/30 rounded-lg text-blue-200 font-semibold hover:bg-blue-500/10 transition-all duration-300 flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </button>
                  <button className="px-6 py-3 border border-green-400/30 rounded-lg text-green-200 font-semibold hover:bg-green-500/10 transition-all duration-300 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Participantes</span>
                  </button>
                  <button className="px-6 py-3 border border-purple-400/30 rounded-lg text-purple-200 font-semibold hover:bg-purple-500/10 transition-all duration-300 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-white">Reuniones Recientes</h2>
              
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar reuniones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700/50 border border-blue-500/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <button className="px-4 py-2 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-500/10 transition-all duration-300 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filtrar</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {meeting.status === 'completed' ? 'Completada' : 
                           meeting.status === 'processing' ? 'Procesando' : 
                           meeting.status === 'scheduled' ? 'Programada' : 'Cancelada'}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-blue-300 text-sm mb-3">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{meeting.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{meeting.time}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{meeting.participants} participantes</span>
                        </span>
                        <span>Duración: {meeting.duration}</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        {meeting.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4">
                        {meeting.hasTranscription && (
                          <span className="flex items-center space-x-1 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Transcripción disponible</span>
                          </span>
                        )}
                        {meeting.hasRecording && (
                          <span className="flex items-center space-x-1 text-blue-400 text-sm">
                            <Video className="w-4 h-4" />
                            <span>Grabación disponible</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all duration-200">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Características Avanzadas</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Tecnología de vanguardia que transforma la manera en que conduces y documentas tus reuniones
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-200 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-blue-500/20">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Precisión Empresarial</h3>
                  <p className="text-blue-200 leading-relaxed">
                    Nuestra tecnología de IA está específicamente entrenada para el contexto empresarial, 
                    reconociendo terminología técnica, jerga corporativa y múltiples idiomas con una 
                    precisión superior al 96.8%.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300">Precisión General</span>
                      <span className="text-white font-semibold">96.8%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '96.8%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4">Idiomas Soportados</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-blue-200">Español</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-blue-200">Inglés</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-blue-200">Portugués</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-blue-200">Francés</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}