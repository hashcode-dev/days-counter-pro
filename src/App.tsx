import { useState, useEffect, type ReactNode } from 'react';
import { Calendar, CalendarDays, Clock, ShieldCheck, Briefcase, Zap, AlertCircle, Mail, Copy, Check, Shield, Scale, HelpCircle, MessageSquare, BookOpen, Globe, Lightbulb, TrendingUp, Plane, GraduationCap, Heart, DollarSign } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';

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

function FeatureItem({ icon, title, desc, colorClass }: { icon: ReactNode, title: string, desc: string, colorClass: string }) {
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

function PolicySection({ title, children }: { title: string, children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="space-y-3 text-slate-600 text-base leading-relaxed">{children}</div>
    </section>
  );
}

function PrivacyPolicy() {
  return (
    <div className="py-16 px-8 max-w-3xl mx-auto flex-grow w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-4">Privacy Policy</h2>
      <p className="text-sm text-slate-400 mb-8">Last updated: June 29, 2026</p>

      <div className="space-y-8">
        <p className="text-slate-600 text-base leading-relaxed">
          This Privacy Policy explains how Day Counter Pro ("we", "us", or "our"), operated by Hash Code Technologies &amp; Software Solutions, collects, uses, and protects information when you visit <strong>daycounterpro.com</strong> (the "Site"). By using the Site, you agree to the practices described below.
        </p>

        <PolicySection title="1. Information We Collect">
          <p>
            The date calculations you perform are processed entirely within your browser. The start dates, end dates, and results you enter are <strong>never transmitted to or stored on our servers</strong>.
          </p>
          <p>We do, however, collect limited information automatically through third-party services:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Usage and device data</strong> — pages visited, time on site, browser type, device type, approximate location, and referring website, collected via analytics.</li>
            <li><strong>Cookies and similar technologies</strong> — small files stored on your device to enable analytics and advertising (see Sections 3 and 4).</li>
          </ul>
        </PolicySection>

        <PolicySection title="2. How We Use Information">
          <p>We use the information we collect to operate and maintain the Site, understand how visitors use it, improve our features and performance, and to display relevant advertising that helps keep the tool free to use.</p>
        </PolicySection>

        <PolicySection title="3. Cookies">
          <p>
            Cookies are small text files placed on your device. We use them to remember your cookie-consent choice, to measure traffic and usage, and to support advertising. You can control or delete cookies through your browser settings, and you can withdraw consent at any time. Disabling cookies will not affect the core date-calculation functionality, which runs locally.
          </p>
        </PolicySection>

        <PolicySection title="4. Advertising &amp; Google AdSense">
          <p>
            We use <strong>Google AdSense</strong> to serve advertisements. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this and other websites.
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this Site and/or other sites on the Internet.</li>
            <li>Google uses the <strong>DoubleClick DART cookie</strong> and other identifiers in the course of serving ads.</li>
            <li>You may opt out of personalized advertising by visiting <a className="text-blue-600 hover:underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            <li>You can opt out of third-party vendor cookies at <a className="text-blue-600 hover:underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a> and <a className="text-blue-600 hover:underline" href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">youronlinechoices.com</a>.</li>
          </ul>
          <p>For more information, see <a className="text-blue-600 hover:underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google's Advertising Policies</a>.</p>
        </PolicySection>

        <PolicySection title="5. Google Analytics">
          <p>
            We use Google Analytics to understand how visitors interact with the Site. Google Analytics collects information such as pages visited and time spent, and may set cookies and process anonymized IP addresses. This data is aggregated and used only to improve the Site. Learn more in <a className="text-blue-600 hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
          </p>
        </PolicySection>

        <PolicySection title="6. Your Privacy Rights (GDPR &amp; CCPA)">
          <p>
            Depending on where you live, you may have the right to access, correct, or delete personal information we hold about you, to object to or restrict its processing, and to withdraw consent. Visitors in the European Economic Area (GDPR) and California residents (CCPA) have specific rights regarding their data, including the right to opt out of the "sale" of personal information. To exercise any of these rights, contact us using the details below.
          </p>
        </PolicySection>

        <PolicySection title="7. Children's Privacy">
          <p>The Site is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has provided us information, please contact us so we can remove it.</p>
        </PolicySection>

        <PolicySection title="8. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. Changes take effect when posted on this page, and we will revise the "Last updated" date accordingly. We encourage you to review it periodically.</p>
        </PolicySection>

        <PolicySection title="9. Contact Us">
          <p>
            If you have questions about this Privacy Policy or your data, email us at <a className="text-blue-600 hover:underline" href="mailto:hashcode.dev@gmail.com">hashcode.dev@gmail.com</a> or visit our <Link to="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
          </p>
        </PolicySection>
      </div>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="py-16 px-8 max-w-3xl mx-auto flex-grow w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-4">Terms of Service</h2>
      <p className="text-sm text-slate-400 mb-8">Last updated: June 29, 2026</p>

      <div className="space-y-8">
        <p className="text-slate-600 text-base leading-relaxed">
          These Terms of Service ("Terms") govern your access to and use of Day Counter Pro (the "Service"), operated by Hash Code Technologies &amp; Software Solutions. Please read them carefully. By accessing or using the Service, you agree to be bound by these Terms; if you do not agree, please do not use the Service.
        </p>

        <PolicySection title="1. Acceptance of Terms">
          <p>By accessing or using Day Counter Pro, you confirm that you can form a binding contract and that you accept these Terms and our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. We may update these Terms from time to time, and continued use of the Service after changes are posted constitutes acceptance of the revised Terms.</p>
        </PolicySection>

        <PolicySection title="2. Use License">
          <p>We grant you a personal, non-exclusive, non-transferable, revocable license to use Day Counter Pro for lawful personal and business date calculations. You agree not to misuse the Service, attempt to disrupt it, scrape it at scale, or use it in any way that infringes the rights of others or violates applicable law.</p>
        </PolicySection>

        <PolicySection title="3. Disclaimer of Warranties">
          <p>The Service and all materials are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including but not limited to fitness for a particular purpose. We do not warrant that the Service will be uninterrupted, error-free, or available at all times.</p>
        </PolicySection>

        <PolicySection title="4. Accuracy of Calculations">
          <p>We strive for high accuracy and our calculations follow the standard Gregorian calendar, including leap-year handling. However, results are provided for general informational purposes. You are responsible for verifying any calculation before relying on it for legal, financial, medical, or other consequential decisions.</p>
        </PolicySection>

        <PolicySection title="5. Limitation of Liability">
          <p>To the fullest extent permitted by law, Day Counter Pro and Hash Code Technologies &amp; Software Solutions shall not be liable for any indirect, incidental, special, or consequential damages — including loss of data, revenue, or profit — arising out of your use of, or inability to use, the Service.</p>
        </PolicySection>

        <PolicySection title="6. Third-Party Services & Advertising">
          <p>The Service displays advertising through Google AdSense and uses analytics provided by third parties. Your interactions with advertisers and any third-party links are governed by their own terms and privacy policies, for which we are not responsible. See our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for details.</p>
        </PolicySection>

        <PolicySection title="7. Governing Law">
          <p>These Terms are governed by the laws of India, without regard to conflict-of-law principles. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the competent courts located in Prayagraj, Uttar Pradesh, India.</p>
        </PolicySection>

        <PolicySection title="8. Contact">
          <p>Questions about these Terms can be sent to <a className="text-blue-600 hover:underline" href="mailto:hashcode.dev@gmail.com">hashcode.dev@gmail.com</a> or via our <Link to="/contact" className="text-blue-600 hover:underline">Contact page</Link>.</p>
        </PolicySection>
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
  const values = [
    {
      icon: <CalendarDays size={20} />,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      title: "Accuracy first",
      desc: "Every result follows the standard Gregorian calendar with automatic leap-year handling, so the numbers you see are numbers you can trust.",
    },
    {
      icon: <Globe size={20} />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      title: "Built for everyone",
      desc: "Day Counter Pro is free, requires no sign-up, and works on any modern device or browser anywhere in the world.",
    },
    {
      icon: <TrendingUp size={20} />,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      title: "Privacy by design",
      desc: "Your dates are calculated locally in your browser and are never uploaded to our servers — speed and privacy, together.",
    },
  ];

  return (
    <div className="py-16 px-8 max-w-3xl mx-auto flex-grow w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">About Us</h2>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">HASH CODE TECHNOLOGIES & SOFTWARE SOLUTIONS</h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            We are dedicated to building high-performance, accurate, and easy-to-use digital utility solutions like Day Counter Pro. Our mission is to simplify complex date and time calculations for users around the globe — whether you are planning a project, managing finances, or counting down to a special event.
          </p>
          <p>
            Day Counter Pro began with a simple frustration: working out the number of days between two dates by hand is slow and easy to get wrong. We set out to build a tool that gives an exact answer instantly, presents it clearly, and respects your privacy by doing all the work right inside your browser. Today the tool is used by project managers, freelancers, students, travelers, and anyone who needs a precise, dependable date duration in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {values.map((v, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 border ${v.color}`}>
              {v.icon}
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">{v.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-base font-bold text-slate-800 mb-5">Company Information</h3>
        <div className="space-y-4">
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
    },
    {
      question: "Does the day count include both the start and end date?",
      answer: "The Total Days figure measures the number of full days that elapse between your start date and end date. For example, from June 1 to June 8 is 7 days. If you need to count both endpoints inclusively (often called 'inclusive counting'), simply add one to the total — so June 1 to June 8 would be 8 inclusive days."
    },
    {
      question: "Do you account for leap years and February 29?",
      answer: "Yes. The calculator is built on standard Gregorian calendar rules and automatically accounts for leap years, including February 29 in years divisible by four (with the standard century exceptions). You never have to adjust your dates manually."
    },
    {
      question: "Can I calculate how many days until a future event?",
      answer: "Absolutely. Set the start date to today and the end date to your target — a wedding, product launch, exam, vacation, or deadline — and you will instantly see the number of days remaining. The built-in presets for New Year and Christmas make common countdowns one click away."
    },
    {
      question: "Is Day Counter Pro free to use?",
      answer: "Yes, Day Counter Pro is completely free. The tool is supported by unobtrusive advertising, which allows us to keep every feature available to everyone at no cost, with no sign-up or subscription required."
    },
    {
      question: "Does the business-days calculation exclude public holidays?",
      answer: "The Business Days figure excludes weekends (Saturdays and Sundays) automatically. Public holidays vary widely by country and region, so they are not removed by default; if your project requires holiday adjustments, subtract the relevant holidays that fall on weekdays from the business-days total."
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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

function UseCases() {
  const cases = [
    {
      icon: <Briefcase size={20} />,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      title: "Project & deadline planning",
      desc: "Project managers count business days between a kickoff and a delivery date to build realistic schedules, track sprint lengths, and measure how many working days remain before a milestone.",
    },
    {
      icon: <DollarSign size={20} />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      title: "Finance & billing cycles",
      desc: "Accountants and freelancers calculate invoice payment terms (Net 30, Net 60), interest accrual periods, and the exact number of days in a billing cycle to keep cash flow accurate.",
    },
    {
      icon: <Plane size={20} />,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      title: "Travel & visa stays",
      desc: "Travelers verify the length of a trip and confirm they stay within visa limits, such as the 90-days-in-180 rule, by counting the precise number of days between entry and exit dates.",
    },
    {
      icon: <GraduationCap size={20} />,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      title: "Education & exams",
      desc: "Students build revision timetables by counting the days until an exam, and educators measure the length of terms, assignment windows, and academic calendars.",
    },
    {
      icon: <Heart size={20} />,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      title: "Events & milestones",
      desc: "Count down to weddings, anniversaries, birthdays, and product launches, or look back to find out exactly how long ago a memorable date occurred.",
    },
    {
      icon: <Clock size={20} />,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
      title: "Legal & contract terms",
      desc: "Confirm notice periods, contract durations, warranty windows, and statutory deadlines where the exact day count carries real legal and financial weight.",
    },
  ];

  return (
    <section className="py-16 px-8 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Who uses a day counter, and why?</h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            Calculating the duration between two dates sounds simple, but doing it accurately by hand is error-prone. Here are the most common real-world situations where Day Counter Pro saves time and prevents costly mistakes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 border ${c.color}`}>
                {c.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guide() {
  return (
    <section className="py-16 px-8 bg-slate-50 border-t border-slate-200">
      <article className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen size={14} /> Guide
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">How to calculate the number of days between two dates</h2>

        <div className="space-y-5 text-slate-600 text-base leading-relaxed">
          <p>
            Working out how many days separate two dates is one of the most common everyday calculations — and one of the easiest to get wrong. Months have different lengths, leap years add a day every four years, and "counting on your fingers" across a calendar quickly breaks down once the span crosses several months. Day Counter Pro removes that friction by giving you an exact, instant answer.
          </p>

          <h3 className="text-xl font-bold text-slate-900 pt-2">The manual method</h3>
          <p>
            To calculate the days between two dates by hand, you count the remaining days in the start month, add the full days of every month in between, and then add the day-of-month of the end date. For a span like <strong>March 15 to July 2</strong>, that means 16 days left in March, plus April (30), May (31) and June (30), plus 2 days in July — a total of 109 days. Miss a 31-day month or forget a leap day and the answer is off.
          </p>

          <h3 className="text-xl font-bold text-slate-900 pt-2">The instant method</h3>
          <p>
            With Day Counter Pro you simply pick a <strong>start date</strong> and an <strong>end date</strong>. The result updates the moment you choose them — no button to press. You instantly see four figures: total calendar days, business days, weeks, and months. Use the presets (New Year, Christmas, +30 days) for one-click countdowns, or the Reset button to start again from today.
          </p>

          <h3 className="text-xl font-bold text-slate-900 pt-2">Total days vs. business days</h3>
          <p>
            <strong>Total days</strong> counts every calendar day, including weekends. <strong>Business days</strong> counts only Monday through Friday, which is what matters for project timelines, shipping estimates, and payment terms. The difference is significant: a 30-day span typically contains only about 22 business days, so using the wrong figure can throw a schedule off by more than a week.
          </p>

          <h3 className="text-xl font-bold text-slate-900 pt-2">Weeks and months</h3>
          <p>
            Weeks are the total days divided by 7. Months are trickier because they vary in length, so the calculator uses the average Gregorian month of <strong>30.44 days</strong> — that is, 365.25 days divided by 12. This gives a far more accurate duration in months than assuming every month is 30 or 31 days long, which is why the figure may show a decimal.
          </p>

          <h3 className="text-xl font-bold text-slate-900 pt-2">A note on accuracy</h3>
          <p>
            All calculations follow the Gregorian calendar and automatically account for leap years. Because the math runs entirely in your browser, results are instant and your dates never leave your device. For most planning, billing, and countdown purposes this is exactly the precision you need.
          </p>
        </div>
      </article>
    </section>
  );
}

function Examples() {
  const examples = [
    { from: "Jan 1, 2026", to: "Dec 31, 2026", total: "364 days", note: "A full non-leap calendar year, end-exclusive." },
    { from: "Today", to: "New Year's Day", total: "varies", note: "One-click with the New Year preset for a live countdown." },
    { from: "Mon, Jun 1", to: "Fri, Jun 26", total: "25 days / 20 business days", note: "Four working weeks — note how weekends are stripped out." },
    { from: "Invoice date", to: "+30 days", total: "30 days", note: "Standard Net 30 payment term using the +30 Days preset." },
  ];

  return (
    <section className="py-16 px-8 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3 justify-center">
          <Lightbulb size={14} /> Worked examples
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center tracking-tight">Common calculations at a glance</h2>
        <p className="text-slate-500 text-center text-sm mb-10 max-w-xl mx-auto">
          A few typical scenarios to show how total days, business days, and presets work together.
        </p>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold">From</th>
                <th className="px-5 py-3 font-semibold">To</th>
                <th className="px-5 py-3 font-semibold">Result</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examples.map((e, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-5 py-4 font-medium text-slate-900 whitespace-nowrap">{e.from}</td>
                  <td className="px-5 py-4 font-medium text-slate-900 whitespace-nowrap">{e.to}</td>
                  <td className="px-5 py-4 text-blue-600 font-semibold whitespace-nowrap">{e.total}</td>
                  <td className="px-5 py-4 text-slate-500 hidden md:table-cell">{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      <UseCases />
      <Guide />
      <Examples />
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

// Route metadata — consumed by the prerender script to emit one static HTML
// file per route with unique <title> and meta description for SEO/crawlers.
export const routes = [
  {
    path: '/',
    title: 'Day Counter Pro - Calculate Days Between Dates Instantly',
    description:
      'Calculate the exact number of days, business days, weeks, and months between any two dates instantly. The most accurate free date duration calculator online.',
  },
  {
    path: '/about',
    title: 'About Us - Day Counter Pro',
    description:
      'Learn about Hash Code Technologies & Software Solutions, the team behind Day Counter Pro, our mission, and how to reach us.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy - Day Counter Pro',
    description:
      'How Day Counter Pro handles data, cookies, Google AdSense and Google Analytics, and your privacy choices under GDPR and CCPA.',
  },
  {
    path: '/terms',
    title: 'Terms of Service - Day Counter Pro',
    description:
      'The terms and conditions governing your use of Day Counter Pro, including acceptable use, disclaimers, and limitations of liability.',
  },
  {
    path: '/contact',
    title: 'Contact Us - Day Counter Pro',
    description:
      'Get in touch with the Day Counter Pro team for support, privacy requests, legal questions, or product feedback.',
  },
];

// Router-agnostic application shell. Wrapped in <BrowserRouter> on the client
// (entry-client) and <StaticRouter> on the server (entry-server) so the same
// markup can be hydrated after being pre-rendered to static HTML.
export function AppShell() {
  return (
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
  );
}

