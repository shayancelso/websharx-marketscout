import { useState, useEffect } from 'react';
import { Home, Map, Users, Target, HelpCircle, Menu, X } from 'lucide-react';
import { MarketScout } from './components/MarketScout';
import { ProspectGenerator } from './components/ProspectGenerator';
import { CampaignPlanner } from './components/CampaignPlanner';
import { WelcomeModal } from './components/WelcomeModal';
import { HowItWorks } from './components/HowItWorks';
import { HomePage } from './components/HomePage';
import { PhaseStepper } from './components/PhaseStepper';
import { prospects } from './data/prospects';
import './index.css';

type Page = 'home' | 'phase-1' | 'phase-2' | 'phase-3';

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { id: 'phase-1', label: 'Market Scout', icon: <Map className="h-5 w-5" /> },
  { id: 'phase-2', label: 'Prospects', icon: <Users className="h-5 w-5" /> },
  { id: 'phase-3', label: 'Campaign', icon: <Target className="h-5 w-5" /> },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pipeline state — flows between phases
  const [selectedMarketIds, setSelectedMarketIds] = useState<Set<string>>(new Set());
  const [selectedProspectIds, setSelectedProspectIds] = useState<Set<string>>(new Set());
  const [monthlyBudget, setMonthlyBudget] = useState(5000);

  useEffect(() => {
    const visited = localStorage.getItem('websharx-ms-visited-v2');
    if (!visited) {
      setShowWelcome(true);
      localStorage.setItem('websharx-ms-visited-v2', 'true');
    }
  }, []);

  const toggleMarket = (id: string) => {
    setSelectedMarketIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleProspect = (id: string) => {
    setSelectedProspectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Prospects available in selected markets
  const availableProspects = prospects.filter((p) => selectedMarketIds.has(p.marketId));
  const selectedProspects = prospects.filter((p) => selectedProspectIds.has(p.id));

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={(p) => setCurrentPage(p as Page)} />;
      case 'phase-1':
        return (
          <MarketScout
            selectedMarketIds={selectedMarketIds}
            onToggleMarket={toggleMarket}
            onNext={() => setCurrentPage('phase-2')}
          />
        );
      case 'phase-2':
        return (
          <ProspectGenerator
            selectedMarketIds={selectedMarketIds}
            availableProspects={availableProspects}
            selectedProspectIds={selectedProspectIds}
            onToggleProspect={toggleProspect}
            onBack={() => setCurrentPage('phase-1')}
            onNext={() => setCurrentPage('phase-3')}
          />
        );
      case 'phase-3':
        return (
          <CampaignPlanner
            selectedMarketIds={selectedMarketIds}
            selectedProspects={selectedProspects}
            monthlyBudget={monthlyBudget}
            onSetBudget={setMonthlyBudget}
            onBack={() => setCurrentPage('phase-2')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-bg flex flex-col">
      {/* Nav */}
      <header className="bg-white border-b border-card-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <img src="/websharx-logo-blue.png" alt="Web Sharx" className="h-8" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm font-medium text-teal">MarketScout</span>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-teal/10 text-teal'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              ))}
              <div className="w-px h-8 bg-gray-200 mx-2" />
              <button
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-teal hover:bg-teal/5 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden lg:inline">How It Works</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-card-border bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id ? 'bg-teal/10 text-teal' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setShowHowItWorks(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <HelpCircle className="h-5 w-5" /> How It Works
            </button>
          </div>
        )}

        {/* Phase Stepper — only on phase pages */}
        {currentPage !== 'home' && (
          <PhaseStepper
            currentPhase={currentPage}
            onNavigate={(p) => setCurrentPage(p as Page)}
            marketCount={selectedMarketIds.size}
            prospectCount={availableProspects.length}
            selectedProspectCount={selectedProspectIds.size}
          />
        )}
      </header>

      {/* Content */}
      <main className="flex-1">{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-card-border py-4 px-4">
        <p className="text-xs text-gray-400 text-center">
          © 2026 Web Sharx. All rights reserved. Proof of concept prototype by{' '}
          <a href="https://buildwithgloo.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
            Gloo Labs Inc.
          </a>{' '}
          Not intended for production use.{' '}
          <a href="https://buildwithgloo.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
            buildwithgloo.com
          </a>
        </p>
      </footer>

      {/* Modals */}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} onStart={() => { setShowWelcome(false); setCurrentPage('phase-1'); }} />}
      {showHowItWorks && <HowItWorks page={currentPage} onClose={() => setShowHowItWorks(false)} />}
    </div>
  );
}

export default App;
