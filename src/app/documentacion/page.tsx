'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  Book, 
  FileText,
  Code,
  Settings, 
  CheckCircle, 
  AlertCircle,
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
  Database,
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
  ExternalLink,
  Play,
  Bookmark,
  Clock,
  GitBranch,
  Terminal,
  Layers,
  Workflow,
  Server,
  MonitorSpeaker,
  Copy,
  ChevronRight
} from 'lucide-react'

export default function DocumentacionPage() {
  const [activeCategory, setActiveCategory] = useState('apis')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)

  const docStats = {
    totalDocs: '156',
    lastUpdate: '2 horas',
    contributors: '12',
    downloads: '2.3K'
  }

  const categories = [
    {
      id: 'apis',
      label: 'APIs',
      icon: Code,
      color: 'from-blue-500 to-cyan-600',
      description: 'Documentación completa de APIs REST y GraphQL'
    },
    {
      id: 'n8n-flows',
      label: 'Flujos n8n',
      icon: Workflow,
      color: 'from-purple-500 to-indigo-600',
      description: 'Automatizaciones y flujos de trabajo'
    },
    {
      id: 'guides',
      label: 'Guías Técnicas',
      icon: Book,
      color: 'from-green-500 to-emerald-600',
      description: 'Manuales de implementación y configuración'
    },
    {
      id: 'admin',
      label: 'Administrativo',
      icon: Settings,
      color: 'from-orange-500 to-red-600',
      description: 'Documentación administrativa y de gestión'
    },
    {
      id: 'integrations',
      label: 'Integraciones',
      icon: Layers,
      color: 'from-pink-500 to-rose-600',
      description: 'Conectores y integraciones con terceros'
    },
    {
      id: 'tutorials',
      label: 'Tutoriales',
      icon: Play,
      color: 'from-indigo-500 to-blue-600',
      description: 'Videos y guías paso a paso'
    }
  ]

  // === APIS ===
  const apiDocs = [
    {
      id: 'base-datos-data-lab',
      title: 'Base Datos Data Lab',
      descripcion: 'Gestión de remisiones y proyección de ventas.',
      version: 'Airtable',
      method: 'Web',
      status: 'stable',
      lastUpdated: '2025-07-01',
      endpoints: 1,
      examples: false,
      enlace: 'https://airtable.com/appUnQeSFnwx04Axi/tblOZjtUDjXy8qkWc/viwCjTD388B0QAxLS?blocks=hide',
      usuarios: ['Equipo laboratorio', 'Equipo comercial'],
      category: 'apis'
    },
    {
      id: 'base-datos-sirius-coin',
      title: 'Base de datos Sirius Coin',
      descripcion: 'Cargar puntos de coherencia y asignar Sirius Coins. Proyecto de blockchain.',
      version: 'Airtable',
      method: 'Web',
      status: 'stable',
      lastUpdated: '2025-07-01',
      endpoints: 2,
      examples: false,
      enlaces: {
        'Cargar puntos': 'https://airtable.com/app5o1BKy3divPinG/pagGWVLIk07fYaiuo/form',
        'Asignar Coins': 'https://airtable.com/app5o1BKy3divPinG/pagVmDen2Je5KImqB/form'
      },
      usuarios: 'Todos',
      category: 'apis'
    }
  ]

  // === N8N FLOWS ===
  const n8nFlows = [
    {
      id: 'biogas-v4',
      title: 'Biogas V4.0',
      descripcion: 'Registro de los datos del proceso de Biogás.',
      nodes: 1,
      triggers: 1,
      complexity: 'Intermediate',
      status: 'active',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/BioGasManager_bot',
      usuarios: 'Guaicaramo Biogas',
      category: 'n8n-flows'
    },
    {
      id: 'piroliapp-v4',
      title: 'Piroliapp V4.0',
      descripcion: 'Registro de producción de la planta de pirolisis.',
      nodes: 1,
      triggers: 1,
      complexity: 'Intermediate',
      status: 'active',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/PiroliBot_bot',
      usuarios: 'Equipo pirolisis',
      category: 'n8n-flows'
    },
    {
      id: 'labi-data-lab-v3',
      title: 'Labi - Data Lab V3.0',
      descripcion: 'Permite hacer remisiones.',
      nodes: 1,
      triggers: 1,
      complexity: 'Basic',
      status: 'active',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/L4BI_bot',
      usuarios: 'Equipo laboratorio',
      category: 'n8n-flows'
    },
    {
      id: 'flujo-caja',
      title: 'Flujo de Caja',
      descripcion: 'Herramienta financiera para movimientos bancarios, proyecciones, facturación, ingresos y egresos.',
      nodes: 1,
      triggers: 1,
      complexity: 'Advanced',
      status: 'active',
      lastUpdated: '2025-07-01',
      enlaces: {
        'AUTOMA': 'https://t.me/AUT0MA_bot',
        'Formulario proveedores': 'https://airtable.com/appBNCVj4Njbyu1En/pagrXNjIdQxaVrx7W/form'
      },
      usuarios: ['Alejandro', 'Carolina', 'Fernanda', 'Formulario a proveedores'],
      category: 'n8n-flows'
    }
  ]

  // === GUIDES ===
  const guides = [
    {
      id: 'reuniones-sirius',
      title: 'Reuniones Sirius',
      descripcion: 'A través de un formulario, se pone un resumen, se carga audio, video o imagen.',
      readTime: '5 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://airtable.com/app841R8UXld1rS7v/pagEaaamJNfTs5ymF/form',
      usuarios: 'Todos',
      category: 'guides'
    },
    {
      id: 'monitoreo-raas',
      title: 'Monitoreo RAAS',
      descripcion: 'Seguimiento a la aplicación de Sirius tractor. Futuro registro de groline y monitoreos microbiológicos.',
      readTime: '10 min',
      difficulty: 'Intermediate',
      sections: 3,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlaces: {
        'Groline': 'https://airtable.com/app4ZNh2fba31o9NC/pagkO7cuj7sv3FYYj/form',
        'Microbiológico': 'https://airtable.com/app4ZNh2fba31o9NC/pagvmoMXn9acLV2ji/form',
        'Tractor': 'https://siriusarchivos.s3.us-east-1.amazonaws.com/Formulario_Tractor.html'
      },
      usuarios: ['Fabián', 'Análisis lab', 'Tractorista'],
      category: 'guides'
    },
    {
      id: 'sst-sirius',
      title: 'SST Sirius',
      descripcion: 'Formulario para radicar PQRSSF.',
      readTime: '3 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://airtable.com/appRsz4q9Tf5yZuhL/pagRogULHWar7VI2F/form',
      usuarios: ['SST', 'Todos'],
      category: 'guides'
    },
    {
      id: 'novedades-nomina',
      title: 'Novedades de nómina',
      descripcion: 'Reporte de novedades de nómina, solicitudes de permiso y vacaciones.',
      readTime: '3 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://novedadesnomina.s3.us-east-1.amazonaws.com/Index_Novedades_Nomina.html',
      usuarios: ['Todos', 'Luisa'],
      category: 'guides'
    },
    {
      id: 'prueba-cacao',
      title: 'Prueba de Cacao',
      descripcion: 'Registro de producción de cacao y cosecha de la plantación.',
      readTime: '2 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/CR0P_bot',
      usuarios: 'Angela Acosta',
      category: 'guides'
    },
    {
      id: 'dona-pepa',
      title: 'Doña Pepa (Agente IA WhatsApp)',
      descripcion: 'Agente de inteligencia artificial para atención y soporte vía WhatsApp en Guaicaramo. Responde consultas, guía procesos y brinda soporte automatizado a usuarios internos y externos.',
      readTime: '3 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: '',
      usuarios: 'Usuarios Guaicaramo',
      category: 'guides',
      detalles: {
        contacto: '+57 313 2552326',
        imagen: 'https://res.cloudinary.com/dvnuttrox/image/upload/v1751462936/do%C3%B1apepa_tqzvae.jpg',
        notas: 'Disponible 24/7. No requiere instalación. Acceso por WhatsApp.'
      }
    },
    {
      id: 'biogas-v4',
      title: 'Biogas V4.0',
      descripcion: 'Registro de los datos del proceso de Biogás.',
      readTime: '2 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/BioGasManager_bot',
      usuarios: 'Guaicaramo Biogas',
      category: 'guides'
    },
    {
      id: 'piroliapp-v4',
      title: 'Piroliapp V4.0',
      descripcion: 'Registro de producción de la planta de pirolisis.',
      readTime: '2 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/PiroliBot_bot',
      usuarios: 'Equipo pirolisis',
      category: 'guides'
    },
    {
      id: 'labi-data-lab-v3',
      title: 'Labi - Data Lab V3.0',
      descripcion: 'Permite hacer remisiones.',
      readTime: '2 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/L4BI_bot',
      usuarios: 'Equipo laboratorio',
      category: 'guides'
    },
    {
      id: 'automa',
      title: 'AUTOMA',
      descripcion: 'Bot financiero para gestión de flujo de caja y proveedores.',
      readTime: '2 min',
      difficulty: 'Beginner',
      sections: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://t.me/AUT0MA_bot',
      usuarios: 'Alejandro, Carolina, Fernanda',
      category: 'guides'
    }
  ]

  // === ADMIN ===
  const adminDocs = [
    {
      id: 'proveedores-sirius',
      title: 'Proveedores - Sirius Regenerative (Contratistas)',
      descripcion: 'Los contratistas suben la cuenta de cobro y su seguridad social.',
      sections: 1,
      policies: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://proveedores-gamma.vercel.app/',
      usuarios: ['Contratistas', 'Alejandro', 'Carolina', 'Fernanda'],
      category: 'admin'
    },
    {
      id: 'novedades-nomina',
      title: 'Novedades de nómina',
      descripcion: 'Reporte de novedades de nómina, solicitudes de permiso y vacaciones.',
      sections: 1,
      policies: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlace: 'https://novedadesnomina.s3.us-east-1.amazonaws.com/Index_Novedades_Nomina.html',
      usuarios: ['Todos', 'Luisa'],
      category: 'admin'
    },
    {
      id: 'flujo-caja',
      title: 'Flujo de Caja',
      descripcion: 'Herramienta financiera para movimientos bancarios, proyecciones, facturación, ingresos y egresos.',
      sections: 1,
      policies: 1,
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlaces: {
        'AUTOMA': 'https://t.me/AUT0MA_bot',
        'Formulario proveedores': 'https://airtable.com/appBNCVj4Njbyu1En/pagrXNjIdQxaVrx7W/form'
      },
      usuarios: ['Alejandro', 'Carolina', 'Fernanda', 'Formulario a proveedores'],
      category: 'admin'
    }
  ]

  // === INTEGRATIONS ===
  const integrationDocs = [
    {
      id: 'monitoreo-raas',
      title: 'Monitoreo RAAS',
      descripcion: 'Seguimiento a la aplicación de Sirius tractor. Futuro registro de groline y monitoreos microbiológicos.',
      platforms: ['Airtable', 'HTML', 'Formularios'],
      difficulty: 'Intermediate',
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlaces: {
        'Groline': 'https://airtable.com/app4ZNh2fba31o9NC/pagkO7cuj7sv3FYYj/form',
        'Microbiológico': 'https://airtable.com/app4ZNh2fba31o9NC/pagvmoMXn9acLV2ji/form',
        'Tractor': 'https://siriusarchivos.s3.us-east-1.amazonaws.com/Formulario_Tractor.html'
      },
      usuarios: ['Fabián', 'Análisis lab', 'Tractorista'],
      category: 'integrations'
    },
    {
      id: 'base-datos-sirius-coin',
      title: 'Base de datos Sirius Coin',
      descripcion: 'Cargar puntos de coherencia y asignar Sirius Coins. Proyecto de blockchain.',
      platforms: ['Airtable'],
      difficulty: 'Intermediate',
      status: 'stable',
      lastUpdated: '2025-07-01',
      enlaces: {
        'Cargar puntos': 'https://airtable.com/app5o1BKy3divPinG/pagGWVLIk07fYaiuo/form',
        'Asignar Coins': 'https://airtable.com/app5o1BKy3divPinG/pagVmDen2Je5KImqB/form'
      },
      usuarios: 'Todos',
      category: 'integrations'
    }
  ]

  // === TUTORIALS ===
  const tutorials = [
    {
      id: 'data-lab-v2',
      title: 'Data Lab V2.0',
      descripcion: 'Registro por voz de esterilización, inoculación, monitores de cuartos y bitácora.',
      duration: '3 min',
      views: 'N/A',
      rating: 5.0,
      status: 'published',
      lastUpdated: '2025-07-01',
      enlace: 'https://www.consultaia.app/',
      usuarios: 'Equipo laboratorio',
      category: 'tutorials'
    },
    {
      id: 'dao',
      title: 'DAO',
      descripcion: 'Aplicación para encuestas por voz. (Descontinuada el 21 de mayo)',
      duration: '2 min',
      views: 'N/A',
      rating: 4.0,
      status: 'deprecated',
      lastUpdated: '2025-05-21',
      enlace: 'https://cliente-dao.vercel.app/clientes',
      usuarios: 'Clientes DAO',
      category: 'tutorials'
    },
    {
      id: 'micro-app',
      title: 'Micro App',
      descripcion: 'Usada temporalmente para registrar actividad del laboratorio en diciembre de 2024.',
      duration: '1 min',
      views: 'N/A',
      rating: 3.5,
      status: 'published',
      lastUpdated: '2024-12-31',
      enlace: '',
      usuarios: 'Lab',
      category: 'tutorials'
    }
  ]

  const allDocs = {
    apis: apiDocs,
    'n8n-flows': n8nFlows,
    guides: guides,
    admin: adminDocs,
    integrations: integrationDocs,
    tutorials: tutorials
  }

  const currentDocs = allDocs[activeCategory as keyof typeof allDocs] || []

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'stable': case 'active': case 'current': case 'published': return 'text-green-400 bg-green-500/20'
      case 'beta': case 'updated': return 'text-yellow-400 bg-yellow-500/20'
      case 'deprecated': return 'text-red-400 bg-red-500/20'
      default: return 'text-blue-400 bg-blue-500/20'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': case 'Basic': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-blue-400'
    }
  }

  const goHome = () => {
    window.location.href = '/'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aquí podrías mostrar un toast de confirmación
  }

  useEffect(() => {
    // Si hay hash en la URL, activar la categoría y hacer scroll
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      // Buscar si el hash corresponde a una guía
      const guideExists = guides.some(g => g.id === hash)
      if (guideExists) {
        setActiveCategory('guides')
        // Esperar a que se renderice la sección y hacer scroll
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 300)
      }
    }
  }, [])

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
                  <h1 className="text-xl font-bold text-white">Sirius / Documentación</h1>
                  <p className="text-xs text-blue-300">Manual técnico y administrativo</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Actualizada</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Documentation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Total Documentos</p>
                <p className="text-2xl font-bold text-white">{docStats.totalDocs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Última Actualización</p>
                <p className="text-2xl font-bold text-white">{docStats.lastUpdate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Contribuidores</p>
                <p className="text-2xl font-bold text-white">{docStats.contributors}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Download className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Descargas</p>
                <p className="text-2xl font-bold text-white">{docStats.downloads}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-blue-400 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Buscar en la documentación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-blue-500/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-500/50 text-lg"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Book className="w-5 h-5 text-blue-400" />
                <span>Categorías</span>
              </h3>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                      activeCategory === category.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-blue-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <category.icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{category.label}</p>
                      <p className="text-xs opacity-70 truncate">{category.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Documentation Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Category Header */}
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const currentCategory = categories.find(cat => cat.id === activeCategory)
                    const CategoryIcon = currentCategory?.icon || Book
                    return (
                      <>
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${currentCategory?.color || 'from-blue-500 to-cyan-600'}`}>
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{currentCategory?.label}</h2>
                          <p className="text-blue-300">{currentCategory?.description}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Content Based on Category */}
              {activeCategory === 'apis' && (
                <div className="space-y-4">
                  {apiDocs.map((doc) => (
                    <div key={doc.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                            <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">
                              {doc.version}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-blue-200 mb-3">{doc.descripcion}</p>
                          <div className="flex items-center space-x-4 text-sm text-blue-300">
                            <span className="flex items-center space-x-1">
                              <Server className="w-4 h-4" />
                              <span>{doc.method}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Code className="w-4 h-4" />
                              <span>{doc.endpoints} endpoints</span>
                            </span>
                            <span>Actualizado: {doc.lastUpdated}</span>
                          </div>
                          {doc.enlace && (
                            <div className="mt-2">
                              <a href={doc.enlace} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ir a la aplicación</a>
                            </div>
                          )}
                          {doc.enlaces && (
                            <div className="mt-2 space-y-1">
                              {Object.entries(doc.enlaces).map(([label, url]) => (
                                <div key={label}>
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{label}</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeCategory === 'n8n-flows' && (
                <div className="space-y-4">
                  {n8nFlows.map((flow) => (
                    <div key={flow.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{flow.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(flow.status)}`}>
                              {flow.status}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(flow.complexity)}`}>
                              {flow.complexity}
                            </span>
                          </div>
                          <p className="text-blue-200 mb-3">{flow.descripcion}</p>
                          <div className="flex items-center space-x-4 text-sm text-blue-300">
                            <span className="flex items-center space-x-1">
                              <Workflow className="w-4 h-4" />
                              <span>{flow.nodes} nodos</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Zap className="w-4 h-4" />
                              <span>{flow.triggers} triggers</span>
                            </span>
                            <span>Actualizado: {flow.lastUpdated}</span>
                          </div>
                          {flow.enlace && (
                            <div className="mt-2">
                              <a href={flow.enlace} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ir a la aplicación</a>
                            </div>
                          )}
                          {flow.enlaces && (
                            <div className="mt-2 space-y-1">
                              {Object.entries(flow.enlaces).map(([label, url]) => (
                                <div key={label}>
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{label}</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeCategory === 'guides' && (
                <div className="space-y-4">
                  {guides.map((guide) => (
                    <div key={guide.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300" id={guide.id === 'dona-pepa' ? 'dona-pepa' : undefined}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{guide.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(guide.status)}`}>
                              {guide.status}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(guide.difficulty)}`}>
                              {guide.difficulty}
                            </span>
                          </div>
                          <p className="text-blue-200 mb-3">{guide.descripcion}</p>
                          {guide.id === 'dona-pepa' && guide.detalles && (
                            <div className="flex items-center space-x-4 mb-3">
                              <img src={guide.detalles.imagen} alt="Doña Pepa" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                              <div>
                                <div className="text-blue-300 text-sm font-semibold">Contacto WhatsApp:</div>
                                <div className="text-green-400 text-lg font-bold">{guide.detalles.contacto}</div>
                                <div className="text-blue-200 text-xs mt-1">{guide.detalles.notas}</div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-blue-300">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{guide.readTime}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Book className="w-4 h-4" />
                              <span>{guide.sections} secciones</span>
                            </span>
                            <span>Actualizado: {guide.lastUpdated}</span>
                          </div>
                          {guide.enlace && (
                            <div className="mt-2">
                              <a href={guide.enlace} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ir a la aplicación</a>
                            </div>
                          )}
                          {guide.enlaces && (
                            <div className="mt-2 space-y-1">
                              {Object.entries(guide.enlaces).map(([label, url]) => (
                                <div key={label}>
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{label}</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {/* Botón ver sección: navega al hash del id de la guía */}
                          <a href={`#${guide.id}`} className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200" title="Ver sección">
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeCategory === 'admin' && (
                <div className="space-y-4">
                  {adminDocs.map((doc) => (
                    <div key={doc.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-blue-200 mb-3">{doc.descripcion}</p>
                          <div className="flex items-center space-x-4 text-sm text-blue-300">
                            <span className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{doc.sections} secciones</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Shield className="w-4 h-4" />
                              <span>{doc.policies} políticas</span>
                            </span>
                            <span>Actualizado: {doc.lastUpdated}</span>
                          </div>
                          {doc.enlace && (
                            <div className="mt-2">
                              <a href={doc.enlace} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ir a la aplicación</a>
                            </div>
                          )}
                          {doc.enlaces && (
                            <div className="mt-2 space-y-1">
                              {Object.entries(doc.enlaces).map(([label, url]) => (
                                <div key={label}>
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{label}</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeCategory === 'integrations' && (
                <div className="space-y-4">
                  {integrationDocs.map((doc) => (
                    <div key={doc.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(doc.difficulty || '')}`}>
                              {doc.difficulty}
                            </span>
                          </div>
                          <p className="text-blue-200 mb-3">{doc.descripcion}</p>
                          <div className="flex items-center space-x-4 text-sm text-blue-300 mb-3">
                            <span>Actualizado: {doc.lastUpdated}</span>
                          </div>
                          {doc.platforms && (
                            <div className="flex items-center space-x-2">
                              {doc.platforms.map((platform: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-purple-500/20 rounded text-purple-300 text-xs">
                                  {platform}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Mostrar enlace único solo si existe y es string */}
                          {'enlace' in doc && typeof (doc as any).enlace === 'string' && (doc as any).enlace.length > 0 && (
                            <div className="mt-2">
                              <a href={(doc as any).enlace} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ir a la aplicación</a>
                            </div>
                          )}
                          {/* Mostrar enlaces múltiples solo si existen */}
                          {doc.enlaces && (
                            <div className="mt-2 space-y-1">
                              {Object.entries(doc.enlaces).map(([label, url]) => (
                                <div key={label}>
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{label}</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeCategory === 'tutorials' && (
                <div className="space-y-4">
                  {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{tutorial.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tutorial.status)}`}>
                              {tutorial.status}
                            </span>
                          </div>
                          <p className="text-blue-200 mb-3">{tutorial.descripcion}</p>
                          <div className="flex items-center space-x-4 text-sm text-blue-300">
                            <span className="flex items-center space-x-1">
                              <Play className="w-4 h-4" />
                              <span>{tutorial.duration}</span>
                            </span>
                            <span>Publicado: {tutorial.lastUpdated}</span>
                          </div>
                          {tutorial.enlace && (
                            <div className="mt-2">
                              <a href={tutorial.enlace} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ir a la aplicación</a>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200">
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}