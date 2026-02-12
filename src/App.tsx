import { useState, useEffect } from 'react';
import { Home, Map, Users, Target, Archive, HelpCircle, Menu, X } from 'lucide-react';
import { MarketScout } from './components/MarketScout';
import { ProspectGenerator } from './components/ProspectGenerator';
import { CampaignPlanner } from './components/CampaignPlanner';
import { Repository } from './components/Repository';
import { WelcomeModal } from './components/WelcomeModal';
import { HowItWorks } from './components/HowItWorks';
import { HomePage } from './components/HomePage';
import { PhaseStepper } from './components/PhaseStepper';
import { prospects } from './data/prospects';
import './index.css';

type Page = 'home' | 'phase-1' | 'phase-2' | 'phase-3' | 'repository';

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { id: 'phase-1', label: 'Market Scout', icon: <Map className="h-5 w-5" /> },
  { id: 'phase-2', label: 'Prospects', icon: <Users className="h-5 w-5" /> },
  { id: 'phase-3', label: 'Campaign', icon: <Target className="h-5 w-5" /> },
  { id: 'repository', label: 'Repository', icon: <Archive className="h-5 w-5" /> },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      case 'repository':
        return <Repository />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Frosted glass nav */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <img src="/websharx-logo-blue.png" alt="Web Sharx" className="h-8" />
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-[#86868b]">/</span>
                <span className="text-sm font-medium text-[#1d1d1f]">MarketScout</span>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-[#1d1d1f]/8 text-[#1d1d1f]'
                      : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#1d1d1f]/4'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              ))}
              <div className="w-px h-6 bg-[#1d1d1f]/8 mx-2" />
              <button
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#1d1d1f]/4 transition-all duration-200"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden lg:inline">How It Works</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-full text-[#86868b] hover:bg-[#1d1d1f]/4 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1d1d1f]/6 px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id ? 'bg-[#1d1d1f]/8 text-[#1d1d1f]' : 'text-[#86868b] hover:bg-[#1d1d1f]/4'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setShowHowItWorks(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-[#86868b] hover:bg-[#1d1d1f]/4"
            >
              <HelpCircle className="h-5 w-5" /> How It Works
            </button>
          </div>
        )}

        {/* Phase Stepper */}
        {currentPage !== 'home' && currentPage !== 'repository' && (
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
      <main className="flex-1 animate-fade-in" key={currentPage}>{renderPage()}</main>

      {/* Footer */}
      <footer className="py-6 px-4">
        <p className="text-xs text-[#86868b] text-center">
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
