import { MarketDataItem, NewsItem } from '@/types/market';

// Función para obtener una fecha fija en formato ISO
export const getFixedDate = (): string => {
  return new Date().toISOString();
};

// Datos simulados para índices del mercado
export const mockMarketData: MarketDataItem[] = [
  {
    symbol: "^DJI", 
    open: 39850.22, 
    close: 40123.85, 
    high: 40150.11, 
    low: 39825.64, 
    volume: 153284000,
    date: getFixedDate()
  },
  {
    symbol: "^GSPC", 
    open: 5250.75, 
    close: 5275.93, 
    high: 5280.12, 
    low: 5245.87, 
    volume: 2157490000,
    date: getFixedDate()
  },
  {
    symbol: "^IXIC", 
    open: 16600.33, 
    close: 16720.45, 
    high: 16750.67, 
    low: 16580.22, 
    volume: 3648520000,
    date: getFixedDate()
  }
];

// Datos simulados para acciones populares
export const mockStocksData: MarketDataItem[] = [
  {
    symbol: "AAPL", 
    open: 211.25, 
    close: 213.49, 
    high: 213.95, 
    low: 209.58, 
    volume: 60107582,
    date: getFixedDate()
  },
  {
    symbol: "MSFT", 
    open: 425.30, 
    close: 429.85, 
    high: 430.25, 
    low: 423.70, 
    volume: 22483100,
    date: getFixedDate()
  },
  {
    symbol: "AMZN", 
    open: 175.42, 
    close: 178.15, 
    high: 179.20, 
    low: 174.80, 
    volume: 35624800,
    date: getFixedDate()
  },
  {
    symbol: "GOOGL", 
    open: 147.62, 
    close: 149.45, 
    high: 150.20, 
    low: 147.10, 
    volume: 28743600,
    date: getFixedDate()
  },
  {
    symbol: "META", 
    open: 487.25, 
    close: 495.35, 
    high: 498.10, 
    low: 485.90, 
    volume: 18945300,
    date: getFixedDate()
  },
  {
    symbol: "TSLA", 
    open: 172.80, 
    close: 175.35, 
    high: 176.50, 
    low: 171.20, 
    volume: 42367900,
    date: getFixedDate()
  }
];

// Datos simulados para futuros
export const mockFuturesData: MarketDataItem[] = [
  {
    symbol: "ES=F", 
    open: 5255.50, 
    close: 5280.25, 
    high: 5285.00, 
    low: 5250.25, 
    volume: 145780,
    date: getFixedDate()
  },
  {
    symbol: "YM=F", 
    open: 39900.00, 
    close: 40150.00, 
    high: 40180.00, 
    low: 39880.00, 
    volume: 52480,
    date: getFixedDate()
  },
  {
    symbol: "NQ=F", 
    open: 18150.25, 
    close: 18250.75, 
    high: 18280.00, 
    low: 18125.50, 
    volume: 95640,
    date: getFixedDate()
  }
];

// Datos simulados de noticias financieras
export const mockNewsData: NewsItem[] = [
  {
    title: "Markets Rally on Fed Comments",
    summary: "Markets rallied after Fed Chair signaled a potential pause in rate hikes.",
    url: "https://example.com/news1",
    source: "Financial Times",
    timestamp: getFixedDate()
  },
  {
    title: "Tech Stocks Lead Market Gains",
    summary: "Technology sector outperformed other sectors as investors return to growth stocks.",
    url: "https://example.com/news2",
    source: "Wall Street Journal",
    timestamp: getFixedDate()
  },
  {
    title: "Retail Sales Exceed Expectations",
    summary: "February retail sales data came in stronger than expected, boosting consumer discretionary stocks.",
    url: "https://example.com/news3",
    source: "Bloomberg",
    timestamp: getFixedDate()
  },
  {
    title: "Central Banks Signal Coordinated Policy Approach",
    summary: "Global central banks are signaling a more coordinated approach to monetary policy in the face of persistent inflation.",
    url: "https://example.com/news4",
    source: "Reuters",
    timestamp: getFixedDate()
  },
  {
    title: "AI Sector Continues to Attract Investment",
    summary: "The artificial intelligence sector continues to attract significant investment despite broader market volatility.",
    url: "https://example.com/news5",
    source: "CNBC",
    timestamp: getFixedDate()
  }
];

// Ejemplo de resultados de predicción para pruebas
export const mockPredictionResults = {
  "^DJI": {
    up: 52,
    down: 38,
    neutral: 10
  },
  "^GSPC": {
    up: 48,
    down: 42,
    neutral: 10
  },
  "^IXIC": {
    up: 55,
    down: 35,
    neutral: 10
  },
  "AAPL": {
    up: 65,
    down: 25,
    neutral: 10
  },
  "MSFT": {
    up: 60,
    down: 30,
    neutral: 10
  }
};