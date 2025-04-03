import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Image, Timer, FileText, Type, BarChart as FlowChart, Calculator, Clock, ClipboardCheck, BookOpen, MessageSquare, ExternalLink, ChevronRight, Globe, Link2, FileSpreadsheet, Calendar, FileEdit } from 'lucide-react';
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

function App() {
  const tools = [
    { name: 'Image Compressor', description: 'Optimize your images without losing quality', icon: <Image className="w-6 h-6" />, path: '/image-compressor', component: ImageTool },
    { name: 'Headline Analyzer', description: 'Write better headlines that engage readers', icon: <Type className="w-6 h-6" />, path: '/headline-analyzer', component: HeadlineAnalyzer },
    { name: 'Pomodoro Timer', description: 'Stay focused and boost productivity', icon: <Timer className="w-6 h-6" />, path: '/pomodoro-timer', component: PomodoroTimer },
    { name: 'Policy Generator', description: 'Create privacy policies in minutes', icon: <FileText className="w-6 h-6" />, path: '/policy-generator', component: PolicyGenerator },
    { name: 'Flowchart Tool', description: 'Design flowcharts and diagrams easily', icon: <FlowChart className="w-6 h-6" />, path: '/flowchart', component: FlowchartTool },
    { name: 'Hourly Rate Calculator', description: 'Calculate your ideal freelance rate', icon: <Calculator className="w-6 h-6" />, path: '/rate-calculator', component: HourlyRateCalculator },
    { name: 'Meeting Cost Calculator', description: 'Track the real cost of meetings', icon: <Clock className="w-6 h-6" />, path: '/meeting-calculator', component: MeetingCostCalculator },
    { name: 'Client Onboarding', description: 'Generate professional onboarding checklists', icon: <ClipboardCheck className="w-6 h-6" />, path: '/onboarding', component: ClientOnboardingGenerator },
    { name: 'Readability Analyzer', description: 'Improve your content clarity', icon: <BookOpen className="w-6 h-6" />, path: '/readability', component: ReadabilityAnalyzer },
    { name: 'Statement Generator', description: 'Create compelling problem/solution statements', icon: <MessageSquare className="w-6 h-6" />, path: '/statement', component: StatementGenerator },
    { name: 'Time Zone Visualizer', description: 'Track team member time zones and working hours', icon: <Globe className="w-6 h-6" />, path: '/timezone', component: TimeZoneVisualizer },
    { name: 'Link Hub Generator', description: 'Create shareable project resource pages', icon: <Link2 className="w-6 h-6" />, path: '/linkhub', component: LinkHubGenerator },
    { name: 'Word Processor', description: 'Create and format documents with ease', icon: <FileEdit className="w-6 h-6" />, path: '/word-processor', component: WordProcessor },
    { name: 'Spreadsheet', description: 'Create and edit spreadsheets online', icon: <FileSpreadsheet className="w-6 h-6" />, path: '/spreadsheet', component: SpreadsheetTool },
    { name: 'Appointment Scheduler', description: 'Schedule meetings with Zoom integration', icon: <Calendar className="w-6 h-6" />, path: '/scheduler', component: AppointmentScheduler }
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
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
            </div>
          </div>
        </nav>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <a 
              href="https://www.trackerjam.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 py-3 hover:opacity-90 transition-opacity"
            >
              <span className="font-medium">
                🚀 Boost your productivity with TrackerJam - The smart Chrome extension for time tracking and analytics
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={
              <>
                <div className="text-center mb-16">
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Free Tools for Freelancers and Teams
                  </h1>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    A collection of free, powerful tools to help you create, analyze, and optimize your work.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                  {tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="tool-card p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                          {React.cloneElement(tool.icon, { className: "w-6 h-6 text-white" })}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            {tool.name}
                          </h2>
                          <p className="text-slate-600">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                    Recommended Resources
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {resources.map((category) => (
                      <div key={category.category}>
                        <h3 className="font-semibold text-slate-900 mb-4">
                          {category.category}
                        </h3>
                        <ul className="space-y-3">
                          {category.tools.map((tool) => (
                            <li key={tool.name}>
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block p-3 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-slate-900">
                                    {tool.name}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                </div>
                                <p className="text-sm text-slate-600 mt-1">
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
        </main>

        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-3">About</h3>
                <p className="text-slate-400 text-sm">
                  FreeToolStack provides free tools and resources for freelancers and teams to streamline their workflow and boost productivity.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Contact</h3>
                <p className="text-slate-400 text-sm">
                  Questions or feedback? Email us at:<br />
                  <a href="mailto:hello@freetoolstack.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    hello@freetoolstack.com
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Tools</h3>
                <div className="grid grid-cols-2 gap-1.5 text-sm">
                  {tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <p className="text-center text-slate-400 text-sm">
                © {new Date().getFullYear()} FreeToolStack. All tools are free to use.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;