import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Image, Timer, FileText, Type, BarChart as FlowChart, Calculator, Clock, ClipboardCheck, BookOpen, MessageSquare, ExternalLink, ChevronRight, Globe, Link2, FileSpreadsheet, Calendar, FileEdit, Menu, X, Search, Rocket } from 'lucide-react';
import Logo from './components/Logo';
import ImageTool from './components/ImageTool';
import HeadlineAnalyzer from './components/HeadlineAnalyzer';
import PomodoroTimer from './components/PomodoroTimer';
import PolicyGenerator from './components/PolicyGenerator';
import FlowchartTool from './components/FlowchartTool';
import HourlyRateCalculator from './components/HourlyRateCalculator';
import MeetingCostCalculator from './components/MeetingCostCalculator';
import ClientOnboardingGenerator from './components/ClientOnboardingGenerator';
import ReadabilityAnalyzer from './components/ReadabilityAnalyzer';
import StatementGenerator from './components/StatementGenerator';
import TimeZoneVisualizer from './components/TimeZoneVisualizer';
import LinkHubGenerator from './components/LinkHubGenerator';
import WordProcessor from './components/WordProcessor';
import SpreadsheetTool from './components/SpreadsheetTool';
import AppointmentScheduler from './components/AppointmentScheduler';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';

function SearchBox({ tools }: { tools: any[] }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerms = value.toLowerCase().split(' ');
    const filtered = tools.filter(tool => {
      const nameMatch = searchTerms.every(term => 
        tool.name.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term)
      );
      return nameMatch;
    });

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelect = (tool: any) => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(tool.path);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search tools..."
          className="pl-9 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
          {suggestions.map((tool) => (
            <button
              key={tool.path}
              onClick={() => handleSelect(tool)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
            >
              {React.cloneElement(tool.icon, { className: 'w-4 h-4 text-gray-500' })}
              <div>
                <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                <div className="text-xs text-gray-500">{tool.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const tools = [
    { name: 'Image Compressor', description: 'Optimize your images without losing quality', icon: <Image className="w-5 h-5" />, path: '/image-compressor', component: ImageTool },
    { name: 'Headline Analyzer', description: 'Write better headlines that engage readers', icon: <Type className="w-5 h-5" />, path: '/headline-analyzer', component: HeadlineAnalyzer },
    { name: 'Pomodoro Timer', description: 'Stay focused and boost productivity', icon: <Timer className="w-5 h-5" />, path: '/pomodoro-timer', component: PomodoroTimer },
    { name: 'Policy Generator', description: 'Create privacy policies in minutes', icon: <FileText className="w-5 h-5" />, path: '/policy-generator', component: PolicyGenerator },
    { name: 'Flowchart Tool', description: 'Design flowcharts and diagrams easily', icon: <FlowChart className="w-5 h-5" />, path: '/flowchart', component: FlowchartTool },
    { name: 'Hourly Rate Calculator', description: 'Calculate your ideal freelance rate', icon: <Calculator className="w-5 h-5" />, path: '/rate-calculator', component: HourlyRateCalculator },
    { name: 'Meeting Cost Calculator', description: 'Track the real cost of meetings', icon: <Clock className="w-5 h-5" />, path: '/meeting-calculator', component: MeetingCostCalculator },
    { name: 'Client Onboarding', description: 'Generate professional onboarding checklists', icon: <ClipboardCheck className="w-5 h-5" />, path: '/onboarding', component: ClientOnboardingGenerator },
    { name: 'Readability Analyzer', description: 'Improve your content clarity', icon: <BookOpen className="w-5 h-5" />, path: '/readability', component: ReadabilityAnalyzer },
    { name: 'Statement Generator', description: 'Create compelling problem/solution statements', icon: <MessageSquare className="w-5 h-5" />, path: '/statement', component: StatementGenerator },
    { name: 'Time Zone Visualizer', description: 'Track team member time zones and working hours', icon: <Globe className="w-5 h-5" />, path: '/timezone', component: TimeZoneVisualizer },
    { name: 'Link Hub Generator', description: 'Create shareable project resource pages', icon: <Link2 className="w-5 h-5" />, path: '/linkhub', component: LinkHubGenerator },
    { name: 'Word Processor', description: 'Create and format documents with ease', icon: <FileEdit className="w-5 h-5" />, path: '/word-processor', component: WordProcessor },
    { name: 'Spreadsheet', description: 'Create and edit spreadsheets online', icon: <FileSpreadsheet className="w-5 h-5" />, path: '/spreadsheet', component: SpreadsheetTool },
    { name: 'Appointment Scheduler', description: 'Schedule meetings with Zoom integration', icon: <Calendar className="w-5 h-5" />, path: '/scheduler', component: AppointmentScheduler }
  ];

  const resources = [
    {
      category: "Design & Creative",
      tools: [
        { name: "Figma", description: "Professional design tool with real-time collaboration", url: "https://www.figma.com" },
        { name: "Canva", description: "Create stunning graphics and presentations", url: "https://www.canva.com" },
        { name: "Unsplash", description: "Beautiful, free images for your projects", url: "https://unsplash.com" }
      ]
    },
    {
      category: "Project Management",
      tools: [
        { name: "ClickUp", description: "All-in-one project management solution", url: "https://clickup.com" },
        { name: "Notion", description: "All-in-one workspace for notes and collaboration", url: "https://notion.so" },
        { name: "Trello", description: "Visual project management boards", url: "https://trello.com" }
      ]
    },
    {
      category: "Development",
      tools: [
        { name: "GitHub", description: "Code hosting and collaboration platform", url: "https://github.com" },
        { name: "Vercel", description: "Deploy web projects with ease", url: "https://vercel.com" },
        { name: "Supabase", description: "Open source Firebase alternative", url: "https://supabase.com" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link to="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <SearchBox tools={tools} />
              <a
                href="https://www.trackerjam.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Try TrackerJam
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-[1600px] mx-auto px-4">
          <a 
            href="https://www.trackerjam.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-2 py-3 hover:opacity-90 transition-opacity"
          >
            <Rocket className="w-5 h-5" />
            <span className="font-medium">
              Boost your productivity with TrackerJam - The smart Chrome extension for time tracking and analytics
            </span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform lg:translate-x-0 lg:static lg:inset-auto lg:w-64 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full overflow-y-auto py-4">
            <div className="px-3 mb-6">
              <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</h2>
            </div>
            <nav className="space-y-1 px-3">
              {tools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`sidebar-link ${location.pathname === tool.path ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {tool.icon}
                  <span>{tool.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="max-w-[1600px] mx-auto p-6">
            <Routes>
              <Route path="/" element={
                <>
                  <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-8 mb-4">
                      <h1 className="text-4xl font-bold text-gray-900">
                        Free Tools for Freelancers and Teams
                      </h1>
                      <a 
                        href="https://www.producthunt.com/posts/freetoolstack?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-freetoolstack" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <img 
                          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=955773&theme=light&t=1745358608180" 
                          alt="FreeToolStack - 15 powerful tools to create, collab, and optimize your work | Product Hunt" 
                          width="250" 
                          height="54" 
                        />
                      </a>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      A collection of free, powerful tools to help you create, analyze, and optimize your work.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="tool-card p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            {tool.icon}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                              {tool.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                      Recommended Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {resources.map((category) => (
                        <div key={category.category}>
                          <h3 className="font-semibold text-gray-900 mb-4">
                            {category.category}
                          </h3>
                          <ul className="space-y-3">
                            {category.tools.map((tool) => (
                              <li key={tool.name}>
                                <a
                                  href={tool.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900">
                                      {tool.name}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {tool.description}
                                  </p>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              } />
              {tools.map((tool) => (
                <Route key={tool.path} path={tool.path} element={<tool.component />} />
              ))}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
            </Routes>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-sm text-gray-600">
                FreeToolStack provides free tools and resources for freelancers and teams to streamline their workflow and boost productivity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-600 hover:text-gray-900">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
              <p className="text-sm text-gray-600">
                Questions or feedback? Email us at:<br />
                <a href="mailto:hello@freetoolstack.com" className="text-blue-600 hover:text-blue-700">
                  hello@freetoolstack.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Tools</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} FreeToolStack. All tools are free to use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;