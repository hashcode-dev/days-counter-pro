import { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, Briefcase, Zap, Menu, X, AlertCircle, Mail, Copy, Check, Info, Shield, Scale, HelpCircle, MessageSquare } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-3 cursor-pointer">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <Calendar size={18} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">Day Counter Pro</span>
      </Link>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
        <Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About Us</Link>
        <Link to="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</Link>
        <Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact Us</Link>
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
          Whether you're tracking a deadline, planning an event, or calculating business days, Day Counter Pro provides precision you can trust.
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
              <span>{start ? new Date(start + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Start'}</span>
              <span>{results.total} Days</span>
              <span>{end ? new Date(end + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'End'}</span>
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
        <p><strong>1. Acceptance of Terms:</strong> By using Day Counter Pro, you agree to these Terms of Service.</p>
        <p><strong>2. Use License:</strong> Permission is granted to temporarily use Day Counter Pro for personal or business calculations.</p>
        <p><strong>3. Disclaimer:</strong> The materials on Day Counter Pro are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
        <p><strong>4. Limitations:</strong> In no event shall Day Counter Pro be liable for any damages (including loss of data or profit) arising out of the use or inability to use the site.</p>
        <p><strong>5. Accuracy of Materials:</strong> We strive for accuracy in calculations, but cannot guarantee that algorithms are entirely error-free for historic calendar edge-cases.</p>
        <p className="text-sm text-slate-400 pt-4">Last Updated: June 20, 2026</p>
      </div>
    </div>
  );
}

function ContactUs() {
  const [copied, setCopied] = useState(false);
  const email = "hashcode.dev@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto flex-grow w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Contact Us</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
          Have questions, feedback, or need support? Connect with our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Email Card (Spans 3 cols on desktop) */}
        <div className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
              <Mail size={12} /> Contact Email
            </div>
            <h3 className="text-2xl font-bold">Connect With Us</h3>
            <p className="text-blue-100 text-sm max-w-md">
              If you need to connect with us, click the email address below to open your email client or copy it to your clipboard.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto justify-center">
            <a 
              href={`mailto:${email}`}
              className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all hover:bg-blue-50 active:scale-95 shadow-lg shadow-blue-900/20"
            >
              <Mail size={16} />
              {email}
            </a>
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-blue-500/30 hover:bg-blue-500/40 text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all border border-white/20 active:scale-95 cursor-pointer whitespace-nowrap min-w-[150px]"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reach Right Team */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap size={18} className="text-blue-600 animate-pulse" />
            How to Reach the Right Team Faster
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3.5">
                <HelpCircle size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1.5 font-sans">General Support</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Questions about calculator usage or result exports.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3.5">
                <Shield size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1.5 font-sans">Privacy Requests</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Data/privacy rights, policy questions, and related concerns.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3.5">
                <Scale size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1.5 font-sans">Legal Requests</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Terms, policy clarifications, or compliance-related communications.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3.5">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1.5 font-sans">Product Feedback</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Suggestions for features, improvements, and usability enhancements.
              </p>
            </div>
          </div>
        </div>

        {/* What to Include */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              What to Include in Your Email
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              To help us address your request as efficiently as possible, please try to include:
            </p>
            <ul className="space-y-3.5">
              {[
                "Clear subject line (for example: Support, Privacy, Legal, or Feedback).",
                "Short description of your request.",
                "Relevant context such as device/browser details for technical issues.",
                "Any timeline requirements if your request is time-sensitive."
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="text-xs text-slate-650 leading-relaxed font-sans">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutUs() {
  return (
    <div className="py-16 px-8 max-w-3xl mx-auto flex-grow w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">About Us</h2>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">HASH CODE TECHNOLOGIES & SOFTWARE SOLUTIONS</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          We are dedicated to building high-performance, accurate, and easy-to-use digital utility solutions like Day Counter Pro. Our mission is to simplify complex date and time calculations for users around the globe.
        </p>
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Address</h4>
            <p className="text-slate-800 text-sm font-medium leading-relaxed">
              62/46A/5C Nawab Yusuf Road<br />
              Prayagraj, Uttar Pradesh<br />
              India, PIN: 211001
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</h4>
            <a href="mailto:hashcode.dev@gmail.com" className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
              hashcode.dev@gmail.com
            </a>
          </div>
        </div>
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
          <span className="text-sm font-bold text-slate-900">Day Counter Pro</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-slate-900 transition-colors">About Us</Link>
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-slate-900 transition-colors">Contact Us</Link>
        </div>
        <p className="text-sm text-slate-500">
          © 2026 Day Counter Pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does Day Counter Pro calculate the days between dates?",
      answer: "Day Counter Pro uses high-precision, standard calendar algorithms to compute the exact difference between two dates. It counts every calendar day elapsed from the start date to the end date, taking into account leap years and month lengths automatically."
    },
    {
      question: "What is the difference between Total Days and Business Days?",
      answer: "Total Days counts every calendar day (Mondays through Sundays). Business Days calculates only weekdays (Mondays through Fridays), automatically excluding weekends (Saturdays and Sundays) to help you measure project deadlines and working days accurately."
    },
    {
      question: "How does the tool calculate Weeks and Months?",
      answer: "Weeks are calculated by dividing the total number of elapsed days by 7 (e.g., 14 days = 2.0 weeks). Months are calculated based on the standard average Gregorian month length of 30.44 days to give you a highly accurate representation of duration in months."
    },
    {
      question: "Are my input dates and calculations saved or shared?",
      answer: "No. Day Counter Pro values your privacy. All calculations are performed entirely client-side in your web browser. None of your date selections, calculation inputs, or results are ever sent to our servers or shared with third parties."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center tracking-tight">Frequently Asked Questions</h2>
        <p className="text-slate-500 text-center text-sm mb-10 max-w-xl mx-auto">
          Get answers to common questions about calculating date durations, business days, and how we keep your calculations private.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
              >
                <span className="font-bold text-slate-800 text-base">{faq.question}</span>
                <span className={`text-slate-400 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
              >
                <div className="px-6 py-5 text-slate-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="w-full">
      <Hero />
      <DayCalculator />
      <Features />
      <FAQ />
    </div>
  );
}

function NotFound() {
  return (
    <div className="py-16 px-8 max-w-md mx-auto flex-grow w-full flex flex-col justify-center items-center text-center">
      <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Page Not Found</h2>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed. Let's get you back on track.
      </p>
      <Link to="/" className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow border border-transparent">
        Go Back Home
      </Link>
    </div>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md bg-white border border-slate-200 shadow-lg rounded-2xl p-5 z-50 animate-fade-in-up">
      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        We use cookies to personalize content and ads, analyze our traffic, and improve your experience. By clicking "Accept", you consent to our use of cookies. Read our <Link to="/privacy" className="text-blue-600 font-semibold hover:underline">Privacy Policy</Link> for more details.
      </p>
      <div className="flex gap-3">
        <button onClick={handleAccept} className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer text-center border border-transparent">
          Accept
        </button>
        <button onClick={() => setVisible(false)} className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer text-center border border-slate-200">
          Decline
        </button>
      </div>
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
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}

