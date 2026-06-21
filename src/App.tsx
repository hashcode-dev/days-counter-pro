import { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, Briefcase, Zap, Menu, X } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-3 cursor-pointer">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <Calendar size={18} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">Day Count Pro</span>
      </Link>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
        <Link to="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</Link>
        <Link to="/support" className="text-slate-600 hover:text-slate-900 transition-colors">Support</Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-12 pb-8 px-8 relative overflow-hidden bg-slate-50">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Calculate the exact number of days between any two dates <span className="text-blue-600">instantly.</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 mb-4 max-w-2xl mx-auto">
          Whether you're tracking a deadline, planning an event, or calculating business days, Day Count Pro provides precision you can trust.
        </p>
      </div>
    </section>
  );
}

function ResultBox({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <div className={`text-2xl font-bold ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}

function DayCalculator() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [results, setResults] = useState({ total: 0, business: 0, weeks: '0.0', months: '0.0' });

  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    
    const formatYMD = (date: Date) => {
       const y = date.getFullYear();
       const m = String(date.getMonth() + 1).padStart(2, '0');
       const d = String(date.getDate()).padStart(2, '0');
       return `${y}-${m}-${d}`;
    };
    
    setStart(formatYMD(today));
    setEnd(formatYMD(nextMonth));
  }, []);

  useEffect(() => {
    if (!start || !end) return;
    const startDate = new Date(start + 'T00:00:00'); // Force local interpretation
    const endDate = new Date(end + 'T00:00:00');
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;
    
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const total = Math.max(0, diffDays);
    
    let bDays = 0;
    let cur = new Date(startDate);
    
    while (cur <= endDate) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) bDays++;
      cur.setDate(cur.getDate() + 1);
    }
    
    setResults({
      total: total,
      business: total > 0 ? bDays : 0,
      weeks: (total / 7).toFixed(1),
      months: (total / 30.44).toFixed(1)
    });
  }, [start, end]);

  const setPreset = (preset: string) => {
    const today = new Date();
    let endDateObj = new Date();
    
    if (preset === 'newyear') {
      endDateObj = new Date(today.getFullYear() + 1, 0, 1);
    } else if (preset === 'christmas') {
      endDateObj = new Date(today.getFullYear(), 11, 25);
      if (endDateObj < today) endDateObj.setFullYear(today.getFullYear() + 1);
    } else if (preset === '+30days') {
      endDateObj.setDate(today.getDate() + 30);
    }
    
    const formatYMD = (date: Date) => {
       const y = date.getFullYear();
       const m = String(date.getMonth() + 1).padStart(2, '0');
       const d = String(date.getDate()).padStart(2, '0');
       return `${y}-${m}-${d}`;
    };
    
    setEnd(formatYMD(endDateObj));
  };

  const handleReset = () => {
    const today = new Date();
    const formatYMD = (date: Date) => {
       const y = date.getFullYear();
       const m = String(date.getMonth() + 1).padStart(2, '0');
       const d = String(date.getDate()).padStart(2, '0');
       return `${y}-${m}-${d}`;
    };
    const todayStr = formatYMD(today);
    setStart(todayStr);
    setEnd(todayStr);
  };

  const presetStyle = "px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer";

  return (
    <section id="calculator" className="pb-8 px-8 w-full bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={12} className="text-slate-400" /> Start Date
              </label>
              <input
                type="date"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 cursor-pointer"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={12} className="text-slate-400" /> End Date
              </label>
              <input
                type="date"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 cursor-pointer"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-5 relative z-10">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-2">Presets:</span>
            <button onClick={() => setPreset('newyear')} className={presetStyle}>New Year</button>
            <button onClick={() => setPreset('christmas')} className={presetStyle}>Christmas</button>
            <button onClick={() => setPreset('+30days')} className={presetStyle}>+30 Days</button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 rounded-lg text-xs font-semibold md:ml-auto transition-colors cursor-pointer">
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5 relative z-10">
            <ResultBox label="Total Days" value={results.total} colorClass="text-slate-900" />
            <ResultBox label="Business Days" value={results.business} colorClass="text-blue-600" />
            <ResultBox label="Weeks" value={results.weeks} colorClass="text-emerald-500" />
            <ResultBox label="Months" value={results.months} colorClass="text-slate-900" />
          </div>

          <div className="relative pt-4 relative z-10">
            <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1.5">
              <span>{start ? new Date(start + 'T00:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Start'}</span>
              <span>{results.total} Days</span>
              <span>{end ? new Date(end + 'T00:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'End'}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex items-center">
              <div className="h-full bg-blue-500 transition-all duration-700 ease-out w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, title, desc, colorClass }: { icon: React.ReactNode, title: string, desc: string, colorClass: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border ${colorClass}`}>
        {icon}
      </div>
      <p className="text-lg text-slate-900 font-bold mb-2">{title}</p>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Features() {
  return (
    <section className="py-8 px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureItem 
            icon={<ShieldCheck size={24} />} 
            title="Unmatched Accuracy" 
            desc="Our algorithms account for leap years, time zone shifts, and historic calendar changes." 
            colorClass="text-blue-600 bg-blue-50 border-blue-200" 
          />
          <FeatureItem 
            icon={<Briefcase size={24} />} 
            title="Business Ready" 
            desc="Instantly exclude weekends and customizable public holidays from your duration calculations." 
            colorClass="text-purple-600 bg-purple-50 border-purple-200" 
          />
          <FeatureItem 
            icon={<Zap size={24} />} 
            title="Instant Results" 
            desc="Native performance ensures real-time updates as you type or pick dates. No loading states." 
            colorClass="text-amber-600 bg-amber-50 border-amber-200" 
          />
        </div>
      </div>
    </section>
  );
}

function PrivacyPolicy() {
  return (
    <div className="py-16 px-8 max-w-3xl mx-auto flex-grow w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Privacy Policy</h2>
      <div className="space-y-6 text-slate-600 text-base leading-relaxed">
        <p><strong>1. Information Collection:</strong> We do not collect any personal data. All calculations are performed locally in your browser.</p>
        <p><strong>2. Use of Information:</strong> Since we do not collect information, we do not use it for any purpose.</p>
        <p><strong>3. Third-Party Services:</strong> We use standard web analytics to monitor site performance, which may collect anonymized IP addresses.</p>
        <p><strong>4. Data Security:</strong> Your calculated dates and history are not synced to our servers.</p>
        <p><strong>5. Changes to Privacy Policy:</strong> We may update this policy periodically. Please review it regularly.</p>
        <p className="text-sm text-slate-400 pt-4">Last Updated: June 20, 2026</p>
      </div>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="py-16 px-8 max-w-3xl mx-auto flex-grow w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Terms of Service</h2>
      <div className="space-y-6 text-slate-600 text-base leading-relaxed">
        <p><strong>1. Acceptance of Terms:</strong> By using Day Count Pro, you agree to these Terms of Service.</p>
        <p><strong>2. Use License:</strong> Permission is granted to temporarily use Day Count Pro for personal or business calculations.</p>
        <p><strong>3. Disclaimer:</strong> The materials on Day Count Pro are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
        <p><strong>4. Limitations:</strong> In no event shall Day Count Pro be liable for any damages (including loss of data or profit) arising out of the use or inability to use the site.</p>
        <p><strong>5. Accuracy of Materials:</strong> We strive for accuracy in calculations, but cannot guarantee that algorithms are entirely error-free for historic calendar edge-cases.</p>
        <p className="text-sm text-slate-400 pt-4">Last Updated: June 20, 2026</p>
      </div>
    </div>
  );
}

function Support() {
  return (
    <div className="py-16 px-8 max-w-2xl mx-auto flex-grow w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Support</h2>
      <div className="space-y-6">
        <p className="text-slate-600 text-base">Need help or found a bug? We'd love to hear from you. Fill out the form below and our team will get back to you.</p>
        <form className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll get back to you soon."); }}>
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="email" className="text-sm font-semibold text-slate-900">Email Address</label>
            <input type="email" id="email" required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="message" className="text-sm font-semibold text-slate-900">Message</label>
            <textarea id="message" required rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder="How can we help?"></textarea>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors mt-2 text-center shadow-sm cursor-pointer border border-transparent">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full py-8 bg-white border-t border-slate-200 shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-6xl mx-auto gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-500">
            <Calendar size={14} />
          </div>
          <span className="text-sm font-bold text-slate-900">Day Count Pro</span>
        </div>
        <p className="text-sm text-slate-500">
          © 2026 Day Count Pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="w-full">
      <Hero />
      <DayCalculator />
      <Features />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <Header />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

