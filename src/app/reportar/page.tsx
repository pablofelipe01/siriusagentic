'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  CheckCircle,
  Clock,
  FileText, 
  Settings, 
  Star,
  Activity,
  Calendar,
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
  Send,
  Phone,
  Mail,
  HelpCircle,
  Bug,
  Lightbulb,
  AlertTriangle,
  Users,
  Upload,
  Paperclip,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'

export default function SoportePage() {
  const [activeTab, setActiveTab] = useState('create-ticket')
  const [ticketForm, setTicketForm] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    attachments: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const supportStats = {
    openTickets: '23',
    avgResponseTime: '2.4h',
    resolvedToday: '12',
    satisfaction: '96.8%'
  }

  const ticketCategories = [
    { value: 'bug', label: 'Reporte de Error', icon: Bug, color: 'text-red-400' },
    { value: 'feature', label: 'Solicitud de Mejora', icon: Lightbulb, color: 'text-yellow-400' },
    { value: 'support', label: 'Soporte Técnico', icon: Headphones, color: 'text-blue-400' },
    { value: 'account', label: 'Cuenta y Acceso', icon: Users, color: 'text-green-400' },
    { value: 'integration', label: 'Integración', icon: Settings, color: 'text-purple-400' },
    { value: 'other', label: 'Otro', icon: HelpCircle, color: 'text-gray-400' }
  ]

  const priorityLevels = [
    { value: 'low', label: 'Baja', color: 'bg-green-500/20 text-green-400' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-500/20 text-yellow-400' },
    { value: 'high', label: 'Alta', color: 'bg-orange-500/20 text-orange-400' },
    { value: 'critical', label: 'Crítica', color: 'bg-red-500/20 text-red-400' }
  ]

  const recentTickets = [
    {
      id: 'SIRIUS-001',
      title: 'Error en transcripción de reuniones',
      category: 'bug',
      priority: 'high',
      status: 'open',
      created: '2025-07-01T10:30:00',
      updated: '2025-07-01T14:20:00',
      assignee: 'Carlos Méndez',
      description: 'La transcripción se detiene después de 30 minutos'
    },
    {
      id: 'SIRIUS-002',
      title: 'Integración con nueva API de Airtable',
      category: 'feature',
      priority: 'medium',
      status: 'in-progress',
      created: '2025-06-30T16:45:00',
      updated: '2025-07-01T09:15:00',
      assignee: 'Ana García',
      description: 'Solicitud para integrar la nueva versión de la API'
    },
    {
      id: 'SIRIUS-003',
      title: 'Problemas de acceso al dashboard',
      category: 'account',
      priority: 'medium',
      status: 'resolved',
      created: '2025-06-30T08:20:00',
      updated: '2025-06-30T11:45:00',
      assignee: 'Luis Rodríguez',
      description: 'Usuario no puede acceder al panel principal'
    },
    {
      id: 'SIRIUS-004',
      title: 'Mejorar velocidad de búsqueda semántica',
      category: 'feature',
      priority: 'low',
      status: 'open',
      created: '2025-06-29T14:10:00',
      updated: '2025-06-29T14:10:00',
      assignee: 'María López',
      description: 'Optimizar algoritmos de búsqueda para mejorar rendimiento'
    }
  ]

  const faqItems = [
    {
      id: 1,
      question: '¿Cómo inicio una nueva transcripción de reunión?',
      answer: 'Para iniciar una transcripción, ve a la sección "Reuniones", haz clic en "Nueva Reunión" y selecciona "Iniciar Grabación". La IA comenzará a transcribir automáticamente en tiempo real.',
      category: 'Reuniones'
    },
    {
      id: 2,
      question: '¿Qué idiomas soporta la transcripción?',
      answer: 'Actualmente soportamos Español, Inglés, Portugués y Francés con una precisión superior al 96%. Estamos trabajando para agregar más idiomas próximamente.',
      category: 'Transcripción'
    },
    {
      id: 3,
      question: '¿Cómo configuro las integraciones con plataformas externas?',
      answer: 'Ve a la sección "Externos", selecciona la plataforma que deseas integrar y sigue el asistente de configuración. Necesitarás las credenciales de API correspondientes.',
      category: 'Integraciones'
    },
    {
      id: 4,
      question: '¿Mis datos están seguros en Sirius?',
      answer: 'Sí, utilizamos encriptación end-to-end, cumplimos con normativas GDPR y SOC 2. Todos los datos se almacenan en servidores seguros con respaldo automático.',
      category: 'Seguridad'
    },
    {
      id: 5,
      question: '¿Cómo puedo exportar las transcripciones?',
      answer: 'En cada reunión completada, encontrarás opciones de exportación en formatos PDF, DOCX y TXT. También puedes usar nuestra API para integrar con tus sistemas.',
      category: 'Exportación'
    }
  ]

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Chat en Vivo',
      description: 'Respuesta inmediata 24/7',
      action: 'Iniciar Chat',
      color: 'from-blue-500 to-cyan-600',
      available: true
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'soporte@sirius.com',
      action: 'Enviar Email',
      color: 'from-green-500 to-emerald-600',
      available: true
    },
    {
      icon: Phone,
      title: 'Teléfono',
      description: '+57 (1) 234-5678',
      action: 'Llamar Ahora',
      color: 'from-purple-500 to-indigo-600',
      available: true
    },
    {
      icon: Video,
      title: 'Video Llamada',
      description: 'Sesión personalizada',
      action: 'Agendar',
      color: 'from-orange-500 to-red-600',
      available: false
    }
  ]

  const goHome = () => {
    window.location.href = '/'
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'text-blue-400 bg-blue-500/20'
      case 'in-progress': return 'text-yellow-400 bg-yellow-500/20'
      case 'resolved': return 'text-green-400 bg-green-500/20'
      case 'closed': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getPriorityColor = (priority) => {
    const level = priorityLevels.find(p => p.value === priority)
    return level ? level.color : 'bg-gray-500/20 text-gray-400'
  }

  const getCategoryIcon = (category) => {
    const cat = ticketCategories.find(c => c.value === category)
    return cat ? cat.icon : HelpCircle
  }

  const getCategoryColor = (category) => {
    const cat = ticketCategories.find(c => c.value === category)
    return cat ? cat.color : 'text-gray-400'
  }

  const handleFormChange = (field, value) => {
    setTicketForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitTicket = () => {
    // Simular envío del ticket
    alert('Ticket enviado exitosamente. ID: SIRIUS-005')
    setTicketForm({
      title: '',
      category: '',
      priority: 'medium',
      description: '',
      attachments: []
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
                  <h1 className="text-xl font-bold text-white">Sirius / Soporte y Reportes</h1>
                  <p className="text-xs text-blue-300">Centro de ayuda y asistencia técnica</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Tickets Abiertos</p>
                <p className="text-2xl font-bold text-white">{supportStats.openTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Tiempo de Respuesta</p>
                <p className="text-2xl font-bold text-white">{supportStats.avgResponseTime}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Resueltos Hoy</p>
                <p className="text-2xl font-bold text-white">{supportStats.resolvedToday}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Star className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Satisfacción</p>
                <p className="text-2xl font-bold text-white">{supportStats.satisfaction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 p-1 rounded-xl">
          {[
            { id: 'create-ticket', label: 'Crear Ticket', icon: PlusCircle },
            { id: 'my-tickets', label: 'Mis Tickets', icon: FileText },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'contact', label: 'Contacto', icon: MessageCircle }
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

        {/* Create Ticket Tab */}
        {activeTab === 'create-ticket' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <PlusCircle className="w-6 h-6 text-blue-400" />
                <span>Crear Nuevo Ticket</span>
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-semibold mb-2">Título del Problema</label>
                  <input
                    type="text"
                    value={ticketForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="Describe brevemente el problema..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Categoría</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="">Selecciona una categoría</option>
                      {ticketCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Prioridad</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => handleFormChange('priority', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-2">Descripción Detallada</label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Describe el problema en detalle, incluyendo pasos para reproducirlo..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-white font-semibold mb-2">Archivos Adjuntos</label>
                  <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-300 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                    <p className="text-blue-400 text-sm">Máximo 10MB por archivo • PNG, JPG, PDF, DOC</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmitTicket}
                    disabled={!ticketForm.title || !ticketForm.category || !ticketForm.description}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    <span>Enviar Ticket</span>
                  </button>
                  
                  <button className="px-8 py-3 border border-blue-400/30 rounded-lg text-blue-200 font-semibold hover:bg-blue-500/10 transition-all duration-300">
                    Borrador
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'my-tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-white">Mis Tickets</h2>
              
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar tickets..."
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
              {recentTickets.map((ticket) => {
                const CategoryIcon = getCategoryIcon(ticket.category)
                return (
                  <div key={ticket.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-slate-700/50 rounded-lg ${getCategoryColor(ticket.category)}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
                          <p className="text-blue-300 text-sm">ID: {ticket.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'open' ? 'Abierto' : 
                           ticket.status === 'in-progress' ? 'En Proceso' : 
                           ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {priorityLevels.find(p => p.value === ticket.priority)?.label}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-blue-200 mb-4">{ticket.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-blue-300">
                      <div className="flex items-center space-x-4">
                        <span>Creado: {formatDate(ticket.created)}</span>
                        <span>Actualizado: {formatDate(ticket.updated)}</span>
                        <span>Asignado a: {ticket.assignee}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all duration-200">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Preguntas Frecuentes</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Encuentra respuestas rápidas a las preguntas más comunes sobre Sirius
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((faq) => (
                <div key={faq.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-blue-500/20">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs">
                        {faq.category}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-blue-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-blue-400" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-blue-200 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Contáctanos</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Nuestro equipo de soporte está disponible 24/7 para ayudarte
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, idx) => (
                <div key={idx} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-blue-200 mb-4">{method.description}</p>
                  
                  <button 
                    disabled={!method.available}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      method.available 
                        ? `bg-gradient-to-r ${method.color} text-white hover:shadow-lg transform hover:scale-105`
                        : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {method.available ? method.action : 'Próximamente'}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Horarios de Atención</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Soporte Técnico</h4>
                  <div className="space-y-2 text-blue-200">
                    <p className="flex justify-between">
                      <span>Lunes - Viernes:</span>
                      <span>8:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sábados:</span>
                      <span>9:00 AM - 2:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Domingos:</span>
                      <span>Solo emergencias</span>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Chat en Vivo</h4>
                  <div className="space-y-2 text-blue-200">
                    <p className="flex justify-between">
                      <span>Disponible:</span>
                      <span>24/7</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Respuesta promedio:</span>
                      <span>2-3 minutos</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Idiomas:</span>
                      <span>ES, EN, PT</span>
                    </p>
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