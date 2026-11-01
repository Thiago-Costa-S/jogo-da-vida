import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calculator, Undo2, Plus, Minus, Building2, Wallet, 
  Check, X, ArrowUpRight, ArrowDownRight, Edit3, Trash2,
  RotateCcw, Volume2, VolumeX, Search, Filter, ArrowUpDown,
  CheckCircle2, ChevronLeft, ChevronRight, UserCheck, Sparkles,
  ArrowRight, Settings
} from 'lucide-react';

// Configuração de Peões e Temas
interface PlayerTheme {
  id: string;
  defaultName: string;
  bg: string;
  accent: string;
  text: string;
  border: string;
  chipBg: string;
  shadowColor: string;
  gradientText: string;
}

const PLAYERS_CONFIG: PlayerTheme[] = [
  { 
    id: 'amarelo', 
    defaultName: 'Amarelo', 
    bg: 'from-amber-950/60 via-amber-950 to-neutral-950', 
    accent: 'bg-amber-500', 
    text: 'text-amber-400', 
    border: 'border-amber-500/30', 
    chipBg: 'bg-amber-500',
    shadowColor: 'shadow-amber-500/30',
    gradientText: 'from-amber-300 to-amber-500'
  },
  { 
    id: 'verde', 
    defaultName: 'Verde', 
    bg: 'from-emerald-950/60 via-emerald-950 to-neutral-950', 
    accent: 'bg-emerald-500', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/30', 
    chipBg: 'bg-emerald-500',
    shadowColor: 'shadow-emerald-500/30',
    gradientText: 'from-emerald-300 to-emerald-500'
  },
  { 
    id: 'vermelho', 
    defaultName: 'Vermelho', 
    bg: 'from-red-950/60 via-red-950 to-neutral-950', 
    accent: 'bg-red-500', 
    text: 'text-red-400', 
    border: 'border-red-500/30', 
    chipBg: 'bg-red-500',
    shadowColor: 'shadow-red-500/30',
    gradientText: 'from-red-300 to-red-500'
  },
  { 
    id: 'roxo', 
    defaultName: 'Roxo', 
    bg: 'from-purple-950/60 via-purple-950 to-neutral-950', 
    accent: 'bg-purple-500', 
    text: 'text-purple-400', 
    border: 'border-purple-500/30', 
    chipBg: 'bg-purple-500',
    shadowColor: 'shadow-purple-500/30',
    gradientText: 'from-purple-300 to-purple-500'
  },
  { 
    id: 'laranja', 
    defaultName: 'Laranja', 
    bg: 'from-orange-950/60 via-orange-950 to-neutral-950', 
    accent: 'bg-orange-500', 
    text: 'text-orange-400', 
    border: 'border-orange-500/30', 
    chipBg: 'bg-orange-500',
    shadowColor: 'shadow-orange-500/30',
    gradientText: 'from-orange-300 to-orange-500'
  },
  { 
    id: 'azul', 
    defaultName: 'Azul', 
    bg: 'from-blue-950/60 via-blue-950 to-neutral-950', 
    accent: 'bg-blue-500', 
    text: 'text-blue-400', 
    border: 'border-blue-500/30', 
    chipBg: 'bg-blue-500',
    shadowColor: 'shadow-blue-500/30',
    gradientText: 'from-blue-300 to-blue-500'
  }
];

interface PropertyItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

// 24 Imóveis Oficiais do Investimento Imobiliário GGB
const INITIAL_PROPERTIES: PropertyItem[] = [
  { id: 'sorveteria', name: 'Sorveteria', price: 500, category: 'Serviços' },
  { id: 'cafeteria', name: 'Cafeteria', price: 800, category: 'Serviços' },
  { id: 'livraria', name: 'Livraria / Papelaria', price: 1000, category: 'Serviços' },
  { id: 'pizzaria', name: 'Pizzaria', price: 1000, category: 'Comércio' },
  { id: 'petshop', name: 'Pet Shop', price: 1200, category: 'Comércio' },
  { id: 'academia', name: 'Academia', price: 1500, category: 'Serviços' },
  { id: 'restaurante', name: 'Restaurante', price: 1500, category: 'Serviços' },
  { id: 'cinema', name: 'Cinema', price: 1500, category: 'Lazer' },
  { id: 'zoologico', name: 'Zoológico', price: 1700, category: 'Lazer' },
  { id: 'museu', name: 'Museu', price: 1700, category: 'Lazer' },
  { id: 'banco', name: 'Banco', price: 2000, category: 'Finanças' },
  { id: 'comercio', name: 'Comércio', price: 2000, category: 'Comércio' },
  { id: 'hospital', name: 'Hospital', price: 2000, category: 'Saúde' },
  { id: 'brinquedos', name: 'Loja de Brinquedos', price: 2000, category: 'Comércio' },
  { id: 'roupas', name: 'Loja de Roupas', price: 2000, category: 'Comércio' },
  { id: 'saneamento', name: 'Saneamento', price: 2000, category: 'Serviços' },
  { id: 'escola', name: 'Escola', price: 2200, category: 'Educação' },
  { id: 'usina', name: 'Usina de Energia', price: 2500, category: 'Serviços' },
  { id: 'agronegocio', name: 'Agronegócio', price: 2500, category: 'Negócios' },
  { id: 'supermercado', name: 'Supermercado', price: 2500, category: 'Comércio' },
  { id: 'farmacia', name: 'Farmácia', price: 2700, category: 'Saúde' },
  { id: 'universidade', name: 'Universidade', price: 3000, category: 'Educação' },
  { id: 'industria', name: 'Indústria', price: 3200, category: 'Negócios' },
  { id: 'aeroporto', name: 'Aeroporto', price: 3500, category: 'Transporte' },
];

const CATEGORIES = [
  'Todos',
  'Serviços',
  'Comércio',
  'Lazer',
  'Finanças',
  'Saúde',
  'Educação',
  'Negócios',
  'Transporte'
];

const BANKNOTES = [50, 100, 200, 500, 1000, 2000];

interface HistoryItem {
  id: number;
  amount: number;
  type: 'gain' | 'loss';
  description: string;
  timestamp: string;
}

interface PropertyOwnership {
  bought: boolean;
  paidPrice: number;
  level: number;
}

interface PlayerAccount {
  balance: number;
  history: HistoryItem[];
  properties: Record<string, PropertyOwnership>;
}

type PlayersState = Record<string, PlayerAccount>;

interface ToastInfo {
  id: number;
  message: string;
  type: 'gain' | 'loss' | 'neutral';
}

// Síntese de Áudio nativa com Web Audio API
class SoundPlayer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playCoin() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.setValueAtTime(0.25, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio fallback silencioso
    }
  }

  public playLoss() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // Audio fallback silencioso
    }
  }
}

const audioFX = new SoundPlayer();

// Avaliador de expressões matemáticas seguro
function safeCalculate(expr: string): string {
  const clean = expr.replace(/[^0-9+\-*/.]/g, '');
  if (!clean) return '0';
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${clean});`)();
    if (typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) {
      return Number.isInteger(result) ? result.toString() : result.toFixed(2);
    }
    return 'Erro';
  } catch {
    return 'Erro';
  }
}

export default function App() {
  // Saldo inicial configurável da banca
  const [initialBalanceConfig, setInitialBalanceConfig] = useState<number>(() => {
    const saved = localStorage.getItem('life_app_initial_balance');
    return saved !== null ? Number(saved) : 2500;
  });

  // Nomes personalizados para cada um dos 6 peões
  const [playerNames, setPlayerNames] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('life_app_player_names');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    const initial: Record<string, string> = {};
    PLAYERS_CONFIG.forEach(p => {
      initial[p.id] = p.defaultName;
    });
    return initial;
  });

  // Estado da Tela Inicial de Seleção de Peão
  const [isPawnSelected, setIsPawnSelected] = useState<boolean>(() => {
    return localStorage.getItem('life_app_joined') === 'true';
  });

  // Índice no carrossel de seleção (0 a 5)
  const [carouselIndex, setCarouselIndex] = useState<number>(() => {
    const savedColor = localStorage.getItem('life_app_color') || 'verde';
    const idx = PLAYERS_CONFIG.findIndex(p => p.id === savedColor);
    return idx >= 0 ? idx : 1;
  });

  // Peão ativo selecionado
  const [selectedColor, setSelectedColor] = useState<string>(() => localStorage.getItem('life_app_color') || 'verde');

  // Estado financeiro e de imóveis individual para CADA jogador
  const [playersData, setPlayersData] = useState<PlayersState>(() => {
    const saved = localStorage.getItem('life_app_players_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }

    const defaultStartBalance = Number(localStorage.getItem('life_app_initial_balance')) || 2500;
    const initial: PlayersState = {};
    
    // Migração de estado anterior
    const legacyBalance = localStorage.getItem('life_app_balance');
    const legacyHistory = localStorage.getItem('life_app_history');
    const legacyProps = localStorage.getItem('life_app_properties');
    const legacyColor = localStorage.getItem('life_app_color') || 'verde';

    PLAYERS_CONFIG.forEach(p => {
      if (p.id === legacyColor && legacyBalance !== null) {
        initial[p.id] = {
          balance: Number(legacyBalance),
          history: legacyHistory ? JSON.parse(legacyHistory) : [],
          properties: legacyProps ? JSON.parse(legacyProps) : {}
        };
      } else {
        initial[p.id] = {
          balance: defaultStartBalance,
          history: [],
          properties: {}
        };
      }
    });

    return initial;
  });

  // Preço customizado temporário digitado no centro de cada imóvel
  const [propCustomPrices, setPropCustomPrices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    INITIAL_PROPERTIES.forEach(p => {
      initial[p.id] = p.price.toString();
    });
    return initial;
  });

  // Filtros unificados da aba de Imóveis
  const [onlyMineFilter, setOnlyMineFilter] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'default' | 'price-desc' | 'price-asc' | 'name-asc' | 'name-desc'>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'banco' | 'imoveis'>('banco');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [showCalc, setShowCalc] = useState<boolean>(false);
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [isMuted, setIsMuted] = useState<boolean>(() => localStorage.getItem('life_app_muted') === 'true');

  // Modais
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [tempPawnName, setTempPawnName] = useState<string>('');
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);
  const [newGameStartBalance, setNewGameStartBalance] = useState<string>('2500');

  // Gestos de arrastar no Carrossel (touch & mouse swipe)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sincronização de Áudio
  useEffect(() => {
    audioFX.setMuted(isMuted);
    localStorage.setItem('life_app_muted', isMuted ? 'true' : 'false');
  }, [isMuted]);

  // Persistência no LocalStorage
  useEffect(() => {
    localStorage.setItem('life_app_color', selectedColor);
    localStorage.setItem('life_app_player_names', JSON.stringify(playerNames));
    localStorage.setItem('life_app_initial_balance', initialBalanceConfig.toString());
    localStorage.setItem('life_app_players_state', JSON.stringify(playersData));
    localStorage.setItem('life_app_joined', isPawnSelected ? 'true' : 'false');
  }, [selectedColor, playerNames, initialBalanceConfig, playersData, isPawnSelected]);

  // Obter dados do jogador ativo
  const activeTheme = PLAYERS_CONFIG.find(p => p.id === selectedColor) || PLAYERS_CONFIG[1];
  const activePawnName = playerNames[selectedColor] || activeTheme.defaultName;

  const currentAccount: PlayerAccount = playersData[selectedColor] || {
    balance: initialBalanceConfig,
    history: [],
    properties: {}
  };

  const showNotification = (message: string, type: 'gain' | 'loss' | 'neutral') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 1800);
  };

  // Movimentação bancária do jogador ativo
  const handleTransaction = (amount: number, type: 'gain' | 'loss', customDesc?: string) => {
    const val = type === 'gain' ? amount : -amount;
    const newBalance = currentAccount.balance + val;

    if (type === 'gain') {
      audioFX.playCoin();
    } else {
      audioFX.playLoss();
    }

    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      amount,
      type,
      description: customDesc || (type === 'gain' ? `Recebeu $${amount}` : `Pagou $${amount}`),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPlayersData(prev => ({
      ...prev,
      [selectedColor]: {
        ...currentAccount,
        balance: newBalance,
        history: [newHistoryItem, ...currentAccount.history]
      }
    }));

    showNotification(`${type === 'gain' ? '+' : '-'}$${amount}`, type);
  };

  // Desfazer última transação do jogador ativo
  const handleUndo = () => {
    if (currentAccount.history.length === 0) return;
    const lastItem = currentAccount.history[0];
    const restoredBalance = lastItem.type === 'gain' 
      ? currentAccount.balance - lastItem.amount 
      : currentAccount.balance + lastItem.amount;

    setPlayersData(prev => ({
      ...prev,
      [selectedColor]: {
        ...currentAccount,
        balance: restoredBalance,
        history: currentAccount.history.slice(1)
      }
    }));

    showNotification(`Desfeito: ${lastItem.description}`, 'neutral');
  };

  // Renomear peão ativo
  const handleOpenRename = (colorId?: string) => {
    const targetColor = colorId || selectedColor;
    const theme = PLAYERS_CONFIG.find(p => p.id === targetColor) || activeTheme;
    setTempPawnName(playerNames[targetColor] || theme.defaultName);
    setShowRenameModal(true);
  };

  const handleSavePawnName = () => {
    const trimmed = tempPawnName.trim();
    if (trimmed) {
      setPlayerNames(prev => ({
        ...prev,
        [selectedColor]: trimmed
      }));
      showNotification(`Peão renomeado para "${trimmed}"`, 'neutral');
    }
    setShowRenameModal(false);
  };

  // Novo Jogo / Reset do jogo
  const handleOpenNewGame = () => {
    setNewGameStartBalance(initialBalanceConfig.toString());
    setShowNewGameModal(true);
  };

  const handleConfirmNewGame = () => {
    const startVal = Number(newGameStartBalance) || 2500;
    setInitialBalanceConfig(startVal);

    // Reseta todas as contas dos jogadores
    const resetAll: PlayersState = {};
    PLAYERS_CONFIG.forEach(p => {
      resetAll[p.id] = {
        balance: startVal,
        history: [],
        properties: {}
      };
    });
    setPlayersData(resetAll);
    showNotification(`Novo Jogo: Saldo de $${startVal}`, 'gain');

    setShowNewGameModal(false);
    audioFX.playCoin();
  };

  // Carrossel: Navegar
  const handlePrevPawn = () => {
    setCarouselIndex(prev => (prev === 0 ? PLAYERS_CONFIG.length - 1 : prev - 1));
  };

  const handleNextPawn = () => {
    setCarouselIndex(prev => (prev === PLAYERS_CONFIG.length - 1 ? 0 : prev + 1));
  };

  // Confirmar escolha do peão na tela inicial
  const handleSelectPawnAndEnter = (pawnId: string) => {
    setSelectedColor(pawnId);
    setIsPawnSelected(true);
    audioFX.playCoin();
  };

  // Voltar para a tela de seleção de peão
  const handleSwitchPawn = () => {
    const currentIdx = PLAYERS_CONFIG.findIndex(p => p.id === selectedColor);
    setCarouselIndex(currentIdx >= 0 ? currentIdx : 0);
    setIsPawnSelected(false);
  };

  // Touch Swipe handlers para o carrossel
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNextPawn();
    } else if (distance < -50) {
      handlePrevPawn();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Imóveis: Botão Mais (+)
  const handlePropertyPlus = (prop: PropertyItem) => {
    const current = currentAccount.properties[prop.id];
    const rawVal = propCustomPrices[prop.id];
    const priceToPay = rawVal && !isNaN(Number(rawVal)) && Number(rawVal) > 0 ? Number(rawVal) : prop.price;

    if (!current) {
      const updatedProps = {
        ...currentAccount.properties,
        [prop.id]: {
          bought: true,
          paidPrice: priceToPay,
          level: 0
        }
      };

      setPlayersData(prev => ({
        ...prev,
        [selectedColor]: {
          ...currentAccount,
          balance: currentAccount.balance - priceToPay,
          properties: updatedProps,
          history: [{
            id: Date.now(),
            amount: priceToPay,
            type: 'loss',
            description: `Comprou ${prop.name} ($${priceToPay})`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }, ...currentAccount.history]
        }
      }));

      audioFX.playLoss();
      showNotification(`Comprou ${prop.name} por $${priceToPay}`, 'loss');
    } else {
      const upgradeCost = Math.round(current.paidPrice * 0.5) || Math.round(prop.price * 0.5);
      const updatedProps = {
        ...currentAccount.properties,
        [prop.id]: {
          ...current,
          level: (current.level || 0) + 1
        }
      };

      setPlayersData(prev => ({
        ...prev,
        [selectedColor]: {
          ...currentAccount,
          balance: currentAccount.balance - upgradeCost,
          properties: updatedProps,
          history: [{
            id: Date.now(),
            amount: upgradeCost,
            type: 'loss',
            description: `Upgrade ${prop.name} ($${upgradeCost})`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }, ...currentAccount.history]
        }
      }));

      audioFX.playLoss();
      showNotification(`Upgrade em ${prop.name} (-$${upgradeCost})`, 'loss');
    }
  };

  // Imóveis: Botão Menos (-)
  const handlePropertyMinus = (prop: PropertyItem) => {
    const current = currentAccount.properties[prop.id];
    if (!current) return;

    if (current.level > 0) {
      const updatedProps = {
        ...currentAccount.properties,
        [prop.id]: {
          ...current,
          level: current.level - 1
        }
      };
      setPlayersData(prev => ({
        ...prev,
        [selectedColor]: {
          ...currentAccount,
          properties: updatedProps
        }
      }));
      showNotification(`Evolução de ${prop.name} reduzida`, 'neutral');
    } else {
      const copy = { ...currentAccount.properties };
      delete copy[prop.id];

      setPlayersData(prev => ({
        ...prev,
        [selectedColor]: {
          ...currentAccount,
          properties: copy
        }
      }));
      showNotification(`${prop.name} removido da carteira`, 'neutral');
    }
  };

  const handleCustomPriceChange = (propId: string, val: string) => {
    setPropCustomPrices(prev => ({
      ...prev,
      [propId]: val
    }));
  };

  // Calculadora
  const handleCalcBtn = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      setCalcDisplay(safeCalculate(calcDisplay));
    } else {
      setCalcDisplay(prev => prev === '0' || prev === 'Erro' ? val : prev + val);
    }
  };

  const handleUseCalcResult = (type: 'gain' | 'loss') => {
    const numericVal = parseFloat(calcDisplay);
    if (!Number.isNaN(numericVal) && numericVal > 0) {
      handleTransaction(Math.round(numericVal), type);
      setShowCalc(false);
    }
  };

  // Filtragem e Ordenação da Lista de Imóveis
  const filteredAndSortedProperties = useMemo(() => {
    return INITIAL_PROPERTIES.filter(prop => {
      const isMine = Boolean(currentAccount.properties[prop.id]);

      // Filtro de Meus Imóveis
      if (onlyMineFilter && !isMine) return false;

      // Filtro de Categoria/Segmento
      if (categoryFilter !== 'Todos' && prop.category !== categoryFilter) return false;

      // Filtro de Busca por texto
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = prop.name.toLowerCase().includes(query);
        const matchesCat = prop.category.toLowerCase().includes(query);
        if (!matchesName && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'pt-BR');
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name, 'pt-BR');
      return 0;
    });
  }, [onlyMineFilter, categoryFilter, sortBy, searchQuery, currentAccount.properties]);

  const totalMyPropertiesCount = Object.keys(currentAccount.properties).length;

  // =========================================================================
  // TELA 1: TELA INICIAL DE SELEÇÃO DINÂMICA DE PEÃO (CARROSSEL ARRASTÁVEL)
  // =========================================================================
  if (!isPawnSelected) {
    const currentCarouselPawn = PLAYERS_CONFIG[carouselIndex];
    const currentPawnCustomName = playerNames[currentCarouselPawn.id] || currentCarouselPawn.defaultName;
    const currentPawnData = playersData[currentCarouselPawn.id] || { balance: initialBalanceConfig, properties: {} };

    return (
      <div className={`h-screen w-screen overflow-hidden bg-gradient-to-b ${currentCarouselPawn.bg} text-white flex justify-center selection:bg-none font-sans`}>
        <div className="w-full max-w-md h-full flex flex-col justify-between relative overflow-hidden bg-black/40 backdrop-blur-md border-x border-white/5 p-4">
          
          {/* TOPO DA TELA INICIAL */}
          <div className="text-center pt-2 pb-1 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-widest uppercase text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Banco Imobiliário GGB
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Escolha seu Peão
            </h1>
            <p className="text-xs text-zinc-400">
              Arraste para os lados para selecionar sua cor
            </p>
          </div>

          {/* ÁREA CENTRAL: CARROSSEL ARRASTÁVEL COM GESTOS */}
          <div 
            className="flex-1 flex flex-col items-center justify-center my-auto relative select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Botão Anterior */}
            <button
              onClick={handlePrevPawn}
              aria-label="Peão anterior"
              className="absolute left-0 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 flex items-center justify-center text-white transition active:scale-90 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* CARD DO PEÃO ATIVO NO CARROSSEL */}
            <div className="w-full max-w-[280px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border-2 border-white/15 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative transition-all duration-300 transform">
              
              {/* Brilho de fundo */}
              <div className={`absolute -top-10 w-32 h-32 rounded-full ${currentCarouselPawn.chipBg} opacity-20 blur-2xl pointer-events-none`} />

              {/* Ícone 3D estilizado do Peão */}
              <div className="relative mb-4">
                <div className={`w-24 h-24 rounded-full ${currentCarouselPawn.chipBg} flex items-center justify-center shadow-xl ${currentCarouselPawn.shadowColor} border-4 border-white/30 transform hover:scale-105 transition`}>
                  {/* Formato icônico de Peão de tabuleiro */}
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-white/90 shadow-md mb-0.5" />
                    <div className="w-10 h-8 rounded-t-xl bg-white/80 shadow" />
                    <div className="w-14 h-3 rounded-full bg-white/90 shadow" />
                  </div>
                </div>
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/80 text-white border border-white/20 shadow`}>
                  {currentCarouselPawn.defaultName}
                </div>
              </div>

              {/* Nome do Jogador */}
              <div className="space-y-1 mb-4 w-full">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  Jogador
                </span>
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-xl font-black capitalize tracking-wide text-white truncate max-w-[190px]">
                    {currentPawnCustomName}
                  </h2>
                  <button 
                    onClick={() => {
                      setSelectedColor(currentCarouselPawn.id);
                      handleOpenRename(currentCarouselPawn.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-amber-400 transition cursor-pointer"
                    title="Editar nome"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Saldo Atual deste Peão */}
              <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 mb-2 shadow-inner">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">
                  Saldo em Caixa
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  ${currentPawnData.balance.toLocaleString()}
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 font-medium">
                {Object.keys(currentPawnData.properties || {}).length} imóveis sob controle
              </div>

            </div>

            {/* Botão Próximo */}
            <button
              onClick={handleNextPawn}
              aria-label="Próximo peão"
              className="absolute right-0 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 flex items-center justify-center text-white transition active:scale-90 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* INDICADORES DE PONTOS (PAGINAÇÃO 1 a 6) */}
          <div className="flex justify-center items-center gap-2 py-2">
            {PLAYERS_CONFIG.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Selecionar peão ${p.defaultName}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  carouselIndex === idx 
                    ? `w-7 h-2.5 ${p.chipBg} shadow-md` 
                    : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* BOTÃO PRINCIPAL DE ENTRAR NO JOGO COM ESTE PEÃO */}
          <div className="pb-2 space-y-2">
            <button
              onClick={() => handleSelectPawnAndEnter(currentCarouselPawn.id)}
              className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xl cursor-pointer ${currentCarouselPawn.chipBg} text-black font-extrabold shadow-${currentCarouselPawn.id}-500/30`}
            >
              <span>Jogar com Peão {currentPawnCustomName}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="flex justify-between items-center px-2 text-[11px] text-zinc-400">
              <button
                onClick={handleOpenNewGame}
                className="hover:text-amber-400 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resetar Banca / Novo Jogo
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                {isMuted ? 'Mudo' : 'Som ligado'}
              </button>
            </div>
          </div>

          {/* MODAL: RENOMEAR PEÃO (Na tela inicial) */}
          {showRenameModal && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-white/20 rounded-2xl p-4 w-full max-w-xs space-y-3 shadow-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-sm flex items-center gap-1.5 text-white">
                    <Edit3 className="w-4 h-4 text-amber-400" /> Renomear Peão
                  </h3>
                  <button onClick={() => setShowRenameModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Nome do jogador
                  </label>
                  <input 
                    type="text"
                    maxLength={20}
                    value={tempPawnName}
                    onChange={(e) => setTempPawnName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSavePawnName()}
                    autoFocus
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                    placeholder="Ex: Thiago"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowRenameModal(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 rounded-xl text-xs cursor-pointer transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSavePawnName}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-2 rounded-xl text-xs cursor-pointer shadow transition"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: NOVO JOGO / CONFIGURAR BANCA */}
          {showNewGameModal && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-white/20 rounded-2xl p-4 w-full max-w-xs space-y-3 shadow-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-sm flex items-center gap-1.5 text-white">
                    <RotateCcw className="w-4 h-4 text-amber-400" /> Iniciar Novo Jogo
                  </h3>
                  <button onClick={() => setShowNewGameModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Isso resetará o saldo de todos os jogadores para o valor inicial e zerará todos os imóveis.
                </p>

                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                    Valor Inicial da Banca ($)
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-400 font-bold">$</span>
                    <input 
                      type="number"
                      value={newGameStartBalance}
                      onChange={(e) => setNewGameStartBalance(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-black text-sm focus:outline-none focus:border-emerald-400"
                      placeholder="2500"
                    />
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {[1500, 2000, 2500, 3000].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewGameStartBalance(preset.toString())}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] font-bold py-1 rounded border border-white/5 text-zinc-300 cursor-pointer"
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowNewGameModal(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 rounded-xl text-xs cursor-pointer transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmNewGame}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-2 rounded-xl text-xs cursor-pointer shadow transition"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // =========================================================================
  // TELA 2: TELA PERSONALIZADA DO PEÃO DO JOGADOR (SEM MENUS REDUNDANTES)
  // =========================================================================
  return (
    <div className={`h-screen w-screen overflow-hidden bg-gradient-to-b ${activeTheme.bg} text-white flex justify-center selection:bg-none font-sans`}>
      <div className="w-full max-w-md h-full flex flex-col justify-between relative overflow-hidden bg-black/35 backdrop-blur-md border-x border-white/5">
        
        {/* TOAST FLUTUANTE */}
        {toast && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
            <div className={`px-4 py-1.5 rounded-full font-black text-xs shadow-2xl flex items-center gap-1.5 border tracking-wider ${
              toast.type === 'gain' ? 'bg-emerald-500 text-black border-emerald-300 shadow-emerald-500/30' :
              toast.type === 'loss' ? 'bg-red-500 text-white border-red-300 shadow-red-500/30' :
              'bg-zinc-800 text-white border-zinc-600'
            }`}>
              {toast.type === 'gain' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {toast.type === 'loss' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {toast.message}
            </div>
          </div>
        )}

        {/* CABEÇALHO LIMPO E PERSONALIZADO (Apenas o jogador ativo, sem menus redundantes) */}
        <header className="px-3 pt-2 pb-2 bg-zinc-900/95 backdrop-blur-md border-b border-white/10 shrink-0 space-y-2">
          
          {/* BARRA SUPERIOR: PEÃO DO JOGADOR + RENOMEAR + TROCAR PEÃO + AÇÕES */}
          <div className="flex justify-between items-center">
            
            {/* Peão do Jogador com botão para renomear e trocar */}
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${activeTheme.chipBg} shadow-[0_0_10px_rgba(255,255,255,0.7)]`} />
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleOpenRename()}
                  className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition group cursor-pointer"
                  title="Renomear jogador"
                >
                  <span className="font-black text-sm tracking-wide capitalize max-w-[120px] truncate">
                    {activePawnName}
                  </span>
                  <Edit3 className="w-3 h-3 text-zinc-400 group-hover:text-amber-400 transition" />
                </button>

                <button
                  onClick={handleSwitchPawn}
                  className="text-[10px] bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white px-2 py-0.5 rounded-md border border-white/5 transition cursor-pointer font-bold"
                  title="Trocar de Peão"
                >
                  Trocar
                </button>
              </div>
            </div>

            {/* AÇÕES ESSENCIAIS DE CABEÇALHO */}
            <div className="flex items-center gap-1">
              {/* Botão de Som */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg border border-white/5 transition active:scale-95 cursor-pointer ${
                  isMuted ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
                title={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Botão Novo Jogo */}
              <button 
                onClick={handleOpenNewGame}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition active:scale-95 border border-white/5 cursor-pointer"
                title="Novo Jogo / Redefinir Banca"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
              </button>

              {/* Botão Desfazer */}
              <button 
                onClick={handleUndo}
                disabled={currentAccount.history.length === 0}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition active:scale-95 border border-white/5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                title="Desfazer última transação"
              >
                <Undo2 className="w-4 h-4" />
              </button>

              {/* Botão Calculadora */}
              <button 
                onClick={() => setShowCalc(!showCalc)}
                className={`p-1.5 rounded-lg transition active:scale-95 border border-white/5 cursor-pointer ${
                  showCalc ? 'bg-amber-500 text-black font-bold shadow' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
                title="Calculadora Rápida"
              >
                <Calculator className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DISPLAY DE SALDO CENTRALIZADO */}
          <div className="bg-black/45 border border-white/10 rounded-xl py-2 px-3 text-center flex items-center justify-between shadow-inner">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">
                Saldo Disponível
              </span>
              <div className="text-[11px] text-zinc-400 font-medium">
                {totalMyPropertiesCount} {totalMyPropertiesCount === 1 ? 'imóvel adquirido' : 'imóveis adquiridos'}
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className={`text-2xl font-black tracking-tight leading-none ${currentAccount.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                ${currentAccount.balance.toLocaleString()}
              </div>
              {currentAccount.balance < 0 && (
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest bg-red-950/90 px-1.5 py-0.2 rounded border border-red-800/60 mt-0.5">
                  Em Débito
                </span>
              )}
            </div>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 overflow-hidden p-2.5 flex flex-col min-h-0">

          {/* ===================== ABA BANCO (TELA ÚNICA SEM ROLAGEM) ===================== */}
          {activeTab === 'banco' && (
            <div className="h-full flex flex-col justify-between gap-2">
              
              {/* GANHO (+) - GRID COMPACTO */}
              <div className="bg-emerald-950/35 border border-emerald-500/30 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs uppercase tracking-wider">
                    <Plus className="w-3.5 h-3.5" /> GANHAR (+)
                  </div>
                  <span className="text-[10px] text-emerald-300/70 font-semibold">Toque para somar</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {BANKNOTES.map(val => (
                    <button
                      key={`gain-${val}`}
                      onClick={() => handleTransaction(val, 'gain')}
                      className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black py-2.5 px-1 rounded-lg shadow-sm border border-emerald-400/30 active:scale-95 transition text-center cursor-pointer text-sm"
                    >
                      +${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* PERDA (-) - GRID COMPACTO */}
              <div className="bg-red-950/35 border border-red-500/30 rounded-xl p-2.5 shadow-sm flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <div className="flex items-center gap-1.5 text-red-400 font-black text-xs uppercase tracking-wider">
                    <Minus className="w-3.5 h-3.5" /> PAGAR (-)
                  </div>
                  <span className="text-[10px] text-red-300/70 font-semibold">Toque para subtrair</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {BANKNOTES.map(val => (
                    <button
                      key={`loss-${val}`}
                      onClick={() => handleTransaction(val, 'loss')}
                      className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-2.5 px-1 rounded-lg shadow-sm border border-red-400/30 active:scale-95 transition text-center cursor-pointer text-sm"
                    >
                      -${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* ÚLTIMAS TRANSAÇÕES COMPACTAS */}
              <div className="bg-black/35 border border-white/5 rounded-xl p-2 flex-1 min-h-[65px] max-h-[110px] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 px-1">
                  <span>Últimas Movimentações</span>
                  <span className="text-[9px] lowercase text-zinc-500">{currentAccount.history.length} operações</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 text-xs">
                  {currentAccount.history.length === 0 ? (
                    <div className="text-[11px] text-zinc-500 text-center py-2 italic">
                      Nenhuma transação efetuada ainda
                    </div>
                  ) : (
                    currentAccount.history.slice(0, 8).map(item => (
                      <div key={item.id} className="flex justify-between items-center text-[11px] bg-white/5 px-2 py-1 rounded">
                        <span className="text-zinc-400 font-mono text-[10px]">{item.timestamp}</span>
                        <span className={`font-bold ${item.type === 'gain' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {item.description}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ===================== ABA IMÓVEIS (FILTROS UNIFICADOS & BOTÃO MEUS IMÓVEIS) ===================== */}
          {activeTab === 'imoveis' && (
            <div className="h-full flex flex-col min-h-0 space-y-2">
              
              {/* BARRA DE FILTROS UNIFICADA */}
              <div className="bg-black/50 border border-white/10 rounded-xl p-2 space-y-2 shrink-0">
                
                {/* 1. Botão de Acesso Direto aos "Meus Imóveis" */}
                <div className="flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setOnlyMineFilter(!onlyMineFilter)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      onlyMineFilter
                        ? `${activeTheme.chipBg} text-black border-white/40 shadow-lg`
                        : 'bg-white/10 text-white border-white/10 hover:bg-white/15'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{onlyMineFilter ? 'Mostrando Meus Imóveis' : 'Ver Meus Imóveis'}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      onlyMineFilter ? 'bg-black/30 text-black' : 'bg-white/20 text-white'
                    }`}>
                      {totalMyPropertiesCount}
                    </span>
                  </button>

                  {onlyMineFilter && (
                    <button
                      onClick={() => setOnlyMineFilter(false)}
                      className="py-1.5 px-2.5 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 cursor-pointer whitespace-nowrap"
                    >
                      Ver Todos (24)
                    </button>
                  )}
                </div>

                {/* 2. Filtros Unificados Juntos: Busca, Segmento e Ordenação */}
                <div className="grid grid-cols-12 gap-1.5 items-center">
                  
                  {/* Busca por Nome */}
                  <div className="col-span-6 relative">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full bg-black/60 border border-white/10 rounded-lg pl-7 pr-2 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Filtro de Segmento */}
                  <div className="col-span-3">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      aria-label="Filtrar por segmento"
                      className="w-full bg-zinc-800 text-zinc-200 text-[10px] font-bold border border-white/10 rounded-lg px-1.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer truncate"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === 'Todos' ? 'Segmentos' : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ordenação por Valor e Nome */}
                  <div className="col-span-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      aria-label="Ordenar imóveis"
                      className="w-full bg-zinc-800 text-zinc-200 text-[10px] font-bold border border-white/10 rounded-lg px-1.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer truncate"
                    >
                      <option value="default">Ordem Tabuleiro</option>
                      <option value="price-desc">Maior Valor ($ ↓)</option>
                      <option value="price-asc">Menor Valor ($ ↑)</option>
                      <option value="name-asc">Nome (A - Z)</option>
                      <option value="name-desc">Nome (Z - A)</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* LISTA DE CARDS DE IMÓVEIS (Nome Centralizado no Topo, Classificação e Info embaixo) */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                {filteredAndSortedProperties.length === 0 ? (
                  <div className="text-center py-10 text-zinc-400 text-xs space-y-2">
                    <Building2 className="w-8 h-8 mx-auto text-zinc-600" />
                    <div>
                      {onlyMineFilter 
                        ? 'Você ainda não comprou nenhum imóvel.' 
                        : 'Nenhum imóvel encontrado para os filtros aplicados.'}
                    </div>
                    {onlyMineFilter && (
                      <button
                        onClick={() => setOnlyMineFilter(false)}
                        className="text-amber-400 text-xs font-bold underline cursor-pointer"
                      >
                        Explorar catálogo completo
                      </button>
                    )}
                  </div>
                ) : (
                  filteredAndSortedProperties.map(prop => {
                    const isMine = Boolean(currentAccount.properties[prop.id]);
                    const myProp = currentAccount.properties[prop.id];
                    const currentCustomPrice = propCustomPrices[prop.id] !== undefined ? propCustomPrices[prop.id] : prop.price.toString();

                    return (
                      <div 
                        key={prop.id}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isMine 
                            ? 'bg-emerald-950/45 border-emerald-500/50 shadow-md shadow-emerald-950/30' 
                            : 'bg-black/40 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* PARTE SUPERIOR: NOME DO IMÓVEL CENTRALIZADO */}
                        <div className={`py-1.5 px-3 text-center border-b ${
                          isMine 
                            ? 'bg-emerald-900/40 border-emerald-500/30 text-emerald-200' 
                            : 'bg-white/5 border-white/5 text-white'
                        }`}>
                          <h3 className="font-black text-sm uppercase tracking-wider">
                            {prop.name}
                          </h3>
                        </div>

                        {/* MEIO: CLASSIFICAÇÃO, VALOR OFICIAL E STATUS DE AQUISIÇÃO */}
                        <div className="p-2.5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            
                            {/* Classificação / Segmento */}
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-300 font-bold border border-white/5">
                              {prop.category}
                            </span>

                            {/* Valor Oficial de Tabela */}
                            <div className="text-[11px] text-zinc-400">
                              Tabela: <span className="font-extrabold text-white">${prop.price}</span>
                            </div>

                            {/* Status de Aquisição */}
                            <div>
                              {isMine ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/40">
                                  <CheckCircle2 className="w-3 h-3" /> Adquirido {myProp.level > 0 ? `(+${myProp.level})` : ''}
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                  Não adquirido
                                </span>
                              )}
                            </div>

                          </div>

                          {/* CONTROLES: [-] [VALOR PAGO NO CENTRO] [+] */}
                          <div className="pt-1 border-t border-white/10 flex items-center justify-between gap-2">
                            
                            <div className="text-[10px] text-zinc-400 leading-tight">
                              {isMine ? (
                                <span>Pago: <strong className="text-emerald-300 font-mono">${myProp.paidPrice}</strong> {myProp.level > 0 ? `| Nível ${myProp.level}` : ''}</span>
                              ) : (
                                <span>Informar valor pago:</span>
                              )}
                            </div>

                            {/* Bloco de Botões */}
                            <div className="flex items-center gap-1.5 bg-black/70 p-1 rounded-xl border border-white/10 shrink-0">
                              
                              {/* BOTÃO MENOS (-) */}
                              <button
                                onClick={() => handlePropertyMinus(prop)}
                                disabled={!isMine}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black transition active:scale-95 cursor-pointer ${
                                  isMine 
                                    ? 'bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30' 
                                    : 'opacity-20 text-zinc-600 cursor-not-allowed'
                                }`}
                                title={isMine ? (myProp.level > 0 ? 'Diminuir evolução' : 'Remover imóvel') : 'Você não possui este imóvel'}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              {/* VALOR PAGO AO CENTRO (Editável para compra) */}
                              <div className="flex items-center text-xs font-mono font-bold px-1">
                                <span className="text-zinc-400 mr-0.5">$</span>
                                <input
                                  type="number"
                                  value={isMine ? myProp.paidPrice : currentCustomPrice}
                                  onChange={(e) => handleCustomPriceChange(prop.id, e.target.value)}
                                  disabled={isMine}
                                  className={`w-14 bg-transparent text-center font-bold focus:outline-none focus:bg-white/10 rounded py-0.5 ${
                                    isMine ? 'text-emerald-300 cursor-default' : 'text-white border-b border-white/20'
                                  }`}
                                  title="Valor que foi pago / negociado pelo imóvel"
                                />
                              </div>

                              {/* BOTÃO MAIS (+) */}
                              <button
                                onClick={() => handlePropertyPlus(prop)}
                                className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-black transition active:scale-95 shadow border border-emerald-400/30 cursor-pointer"
                                title={isMine ? `Evoluir imóvel (+50% = $${Math.round((myProp.paidPrice || prop.price) * 0.5)})` : `Comprar por $${currentCustomPrice || prop.price}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </main>

        {/* NAVEGAÇÃO INFERIOR MENOR E DISCRETA (Apenas para mudar de aba) */}
        <nav className="py-1 px-4 bg-zinc-900/90 border-t border-white/10 grid grid-cols-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('banco')}
            className={`py-1.5 px-2 rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'banco' 
                ? `${activeTheme.chipBg} text-black shadow-md font-black` 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Banco</span>
          </button>
          
          <button
            onClick={() => setActiveTab('imoveis')}
            className={`py-1.5 px-2 rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'imoveis' 
                ? `${activeTheme.chipBg} text-black shadow-md font-black` 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Imóveis</span>
            {totalMyPropertiesCount > 0 && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'imoveis' ? 'bg-black/30 text-black' : 'bg-white/15 text-zinc-200'
              }`}>
                {totalMyPropertiesCount}
              </span>
            )}
          </button>
        </nav>

        {/* MODAL: RENOMEAR PEÃO */}
        {showRenameModal && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/20 rounded-2xl p-4 w-full max-w-xs space-y-3 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm flex items-center gap-1.5 text-white">
                  <Edit3 className="w-4 h-4 text-amber-400" /> Renomear Peão
                </h3>
                <button onClick={() => setShowRenameModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Nome do jogador ({activeTheme.defaultName})
                </label>
                <input 
                  type="text"
                  maxLength={20}
                  value={tempPawnName}
                  onChange={(e) => setTempPawnName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePawnName()}
                  autoFocus
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                  placeholder="Ex: Thiago"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 rounded-xl text-xs cursor-pointer transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePawnName}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-2 rounded-xl text-xs cursor-pointer shadow transition"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: NOVO JOGO / CONFIGURAR BANCA */}
        {showNewGameModal && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/20 rounded-2xl p-4 w-full max-w-xs space-y-3 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm flex items-center gap-1.5 text-white">
                  <RotateCcw className="w-4 h-4 text-amber-400" /> Iniciar Novo Jogo
                </h3>
                <button onClick={() => setShowNewGameModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Isso resetará o saldo de todos os jogadores para o valor inicial e zerará todos os imóveis da partida.
              </p>

              <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/10">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Valor Inicial da Banca ($)
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400 font-bold">$</span>
                  <input 
                    type="number"
                    value={newGameStartBalance}
                    onChange={(e) => setNewGameStartBalance(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-black text-sm focus:outline-none focus:border-emerald-400"
                    placeholder="2500"
                  />
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[1500, 2000, 2500, 3000].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewGameStartBalance(preset.toString())}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] font-bold py-1 rounded border border-white/5 text-zinc-300 cursor-pointer"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowNewGameModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 rounded-xl text-xs cursor-pointer transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmNewGame}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-2 rounded-xl text-xs cursor-pointer shadow transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CALCULADORA */}
        {showCalc && (
          <div className="absolute top-14 right-3 z-50 bg-zinc-900 border border-white/20 rounded-2xl p-2.5 w-60 shadow-2xl space-y-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
              <span className="text-xs font-bold text-zinc-400">Calculadora</span>
              <button onClick={() => setShowCalc(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black/60 px-2 py-1.5 rounded-xl text-right font-mono font-bold text-lg text-emerald-400 overflow-x-auto min-h-[38px] flex items-center justify-end">
              {calcDisplay}
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs font-bold">
              {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalcBtn(btn)}
                  className={`py-1.5 rounded-lg transition active:scale-95 cursor-pointer ${
                    btn === 'C' ? 'bg-red-600/40 text-red-300' :
                    btn === '=' ? 'bg-emerald-500 text-black font-black' :
                    ['+','-','*','/'].includes(btn) ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="pt-1.5 border-t border-white/10 flex gap-1">
              <button
                onClick={() => handleUseCalcResult('gain')}
                className="flex-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
              >
                + Receber
              </button>
              <button
                onClick={() => handleUseCalcResult('loss')}
                className="flex-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
              >
                - Pagar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
