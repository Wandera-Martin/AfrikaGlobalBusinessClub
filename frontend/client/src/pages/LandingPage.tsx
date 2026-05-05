import React from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface LandingPageProps {
  onRegister: () => void;
  onLogin: () => void;
}

interface Sector {
  name: string;
  desc: string;
  bg: string;
  bgImg: string;
}

interface Feature {
  title: string;
  desc: string;
  icon: string;
  accent: string;
}

// ─── LANDING PAGE ────────────────────────────────────────────────────────────
const LandingPage: React.FC<LandingPageProps> = ({ onRegister, onLogin }) => {
  const sectors: Sector[] = [
    { name: 'Shipping & Logistics', desc: 'Streamline your supply chain with verified shipping partners across Africa', bg: 'bg-blue', bgImg: 'https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Internal Trade', desc: 'Access cross-border trade opportunities within AfCFTA framework', bg: 'bg-teal', bgImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
    { name: 'Mining & Resources', desc: 'Connect with mineral and resource traders across the continent', bg: 'bg-purple', bgImg: 'https://images.unsplash.com/photo-1578500494198-246f612b3b6d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Manufacturing', desc: 'Partner with manufacturers and industrial suppliers', bg: 'bg-orange', bgImg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' },
    { name: 'Agriculture', desc: 'Trade agricultural products and connect with agribusinesses globally', bg: 'bg-green', bgImg: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c4c11?q=80&w=800&auto=format&fit=crop' },
    { name: 'Retail Commerce', desc: 'Expand your retail business and discover new distribution channels', bg: 'bg-red', bgImg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' },
  ];

  const features: Feature[] = [
    { title: 'Verified Business Profiles', desc: 'Showcase your products, certifications, and export capabilities to international buyers.', icon: '📋', accent: '#f59e0b' },
    { title: 'Cross-Border Opportunities', desc: 'Access buyer requests, tenders, and trade missions across all 54 African countries.', icon: '🌐', accent: '#10b981' },
    { title: 'Sector Communities', desc: 'Network with peers in your industry and learn from sector leaders.', icon: '👥', accent: '#8b5cf6' },
    { title: 'Trade Readiness Scoring', desc: 'Track your export readiness and get personalized improvement recommendations.', icon: '📊', accent: '#3b82f6' },
    { title: 'Service Marketplace', desc: 'Access expert advisory, compliance support, and professional services.', icon: '🛒', accent: '#ef4444' },
    { title: 'Direct Messaging', desc: 'Connect with buyers and suppliers through secure, real-time messaging.', icon: '💬', accent: '#06b6d4' },
  ];

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-10 h-16 bg-navy/95 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center font-extrabold text-[15px] text-white">🌍</div>
          <div>
            <div className="text-white font-bold text-[15px]">Afrika Global Business Club</div>
            <div className="text-white/50 text-[11px]">Powered by Trade Afrika Group</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-transparent text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-white/10" onClick={onLogin}>Sign In</button>
          <button className="bg-orange text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all hover:bg-orange-light hover:-translate-y-px" onClick={onRegister}>Join Now</button>
        </div>
      </nav>

      <section className="min-h-screen bg-navy bg-[url('/hero.jpg')] bg-cover bg-center pt-16 relative overflow-hidden flex flex-col">
        <div className="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(19,196,163,0.15) 0%, transparent 70%)' }}></div>
        <div className="grid grid-cols-2 gap-10 px-20 pt-20 pb-15 items-center flex-1 relative z-10">
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 text-[12px] font-semibold px-3.5 py-1.5 rounded-full mb-7 border border-white/20 tracking-wider">✦ Africa's Premier B2B Trade Platform</div>
            <h1 className="text-[58px] font-extrabold text-white leading-[1.05] mb-5 tracking-tight">Connect.<br/>Trade.<br/><span className="text-teal-light">Grow Across<br/>Afrika.</span></h1>
            <p className="text-white/75 text-base leading-relaxed max-w-[420px] mb-9">
              Join Africa's premier B2B trade platform - Connect with verified suppliers, discover cross-border opportunities, and accelerate your business growth under AfCFTA.
            </p>
            <div className="flex gap-3 flex-wrap mb-12">
              <button className="bg-orange text-white px-7 py-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-orange-light hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,82,26,0.4)] inline-block" onClick={onRegister}>Start Free Membership</button>
              <button className="bg-transparent text-white px-7 py-3.5 rounded-lg text-[15px] font-semibold border-[1.5px] border-white/40 transition-all hover:bg-white/10 hover:border-white/70 inline-block">Learn More</button>
            </div>
            <div className="flex gap-9">
              <div>
                <div className="text-[28px] font-extrabold text-white">2,500+</div>
                <div className="text-xs text-white/60 mt-0.5">Active SMEs</div>
              </div>
              <div>
                <div className="text-[28px] font-extrabold text-white">54</div>
                <div className="text-xs text-white/60 mt-0.5">Countries</div>
              </div>
              <div>
                <div className="text-[28px] font-extrabold text-white">$12M+</div>
                <div className="text-xs text-white/60 mt-0.5">Trade Facilitated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-20 bg-gray-50">
        <h2 className="text-4xl font-extrabold text-center mb-3 text-gray-800">Trade Across Key African Sectors</h2>
        <p className="text-gray-600 text-center text-[15px] mb-12">Access diverse industries and connect with verified businesses across the continent</p>
        <div className="grid grid-cols-3 gap-5">
          {sectors.map((s, i) => (
            <div className="rounded-xl overflow-hidden aspect-[4/3] relative cursor-pointer outline-none border-2 border-transparent transition-all duration-300 hover:border-[#2b6cb0] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:z-10 focus-visible:border-[#2b6cb0] focus-visible:-translate-y-2 focus-visible:shadow-[0_20px_40px_rgba(0,0,0,0.15)] focus-visible:z-10 group" key={i} tabIndex={0}>
              <div
                className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-0 group-hover:scale-110 group-focus-visible:scale-110"
                style={s.bgImg ? { backgroundImage: `url(${s.bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              />
              <div className={`w-full h-full flex items-end p-6 relative z-10 ${
                i === 0 ? 'bg-gradient-to-t from-[#0d3a5c] to-transparent' :
                i === 1 ? 'bg-gradient-to-t from-[#0d505a] to-transparent' :
                i === 2 ? 'bg-gradient-to-t from-[#3c1a6a] to-transparent' :
                i === 3 ? 'bg-gradient-to-t from-[#1a2a3c] to-transparent' :
                i === 4 ? 'bg-gradient-to-t from-[#1a3c1a] to-transparent' :
                'bg-gradient-to-t from-[#3c2a1a] to-transparent'
              }`}>
                <div>
                  <div className="text-[26px] font-extrabold text-white tracking-tight leading-tight">{s.name}</div>
                  <div className="text-[15px] text-white/95 mt-2.5 leading-snug">{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-20 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(15,155,130,0.18) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 60%, rgba(26,107,171,0.18) 0%, transparent 60%), linear-gradient(160deg, #0d1b2a 0%, #0f1f2e 40%, #0d2238 70%, #111827 100%)' }}>
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.06) 0%, transparent 100%), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.04) 0%, transparent 100%), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 100%)' }}></div>
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <h2 className="text-[38px] font-extrabold text-center mb-3 bg-gradient-to-br from-white to-[#a5f3eb] clip-text text-transparent">Everything You Need to Succeed in African Trade</h2>
          <p className="text-white/55 text-center text-[15px] mb-12">A complete platform combining professional networking, opportunity discovery, and trade intelligence.</p>
          <div className="grid grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                className="relative overflow-hidden rounded-[18px] px-7 pt-9 pb-7 bg-white/5 border border-white/10 backdrop-blur-xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-2 hover:scale-[1.01] hover:bg-white/10 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4),0_0_32px_rgba(0,0,0,0.3)] animate-feature-in group"
                key={i}
                style={{ '--accent': f.accent, animationDelay: `${i * 0.07}s` } as React.CSSProperties}
              >
                {/* Top accent line */}
                <div className="absolute top-0 inset-x-0 h-[3px] opacity-0 transition-opacity duration-300 rounded-t-[18px] group-hover:opacity-100" style={{ background: `linear-gradient(90deg, ${f.accent}, transparent)` }}></div>
                
                {/* Accent glow blob */}
                <div className="absolute -top-10 -right-10 w-[140px] h-[140px] rounded-full opacity-10 blur-[36px] transition-all duration-400 pointer-events-none z-0 group-hover:opacity-20 group-hover:scale-125" style={{ background: f.accent }} />
                
                <div className="relative z-10 w-[54px] h-[54px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[26px] mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-white/10">{f.icon}</div>
                <div className="relative z-10 text-[17px] font-extrabold text-[#f1f5f9] mb-2.5 tracking-tight">{f.title}</div>
                <div className="relative z-10 text-sm text-white/50 leading-relaxed mb-5">{f.desc}</div>
                <div className="relative z-10 text-lg opacity-0 -translate-x-1.5 transition-all duration-300 font-bold group-hover:opacity-100 group-hover:translate-x-0" style={{ color: f.accent }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-grad-hero py-20 px-20 text-center text-white">
        <h2 className="text-[40px] font-extrabold mb-3">Ready to Expand Your Business Across Afrika?</h2>
        <p className="text-[15px] text-white/80 mb-8">Join 2,500+ SMEs already growing their business through AGBC</p>
        <button className="bg-orange text-white px-7 py-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-orange-light hover:-translate-y-0.5" onClick={onRegister}>Create Your Free Account</button>
      </div>

      <footer className="bg-navy text-white/50 text-center p-6 text-[13px] flex flex-wrap items-center justify-center gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-grad flex items-center justify-center font-extrabold text-xs text-white">🌍</div>
            <span className="font-bold text-[15px] tracking-tight text-gray-800">Afrika Global Business Club</span>
        </div>
        <span>•</span>
        <span>Powered by Trade Afrika Group</span>
        <span>•</span>
        <span>© 2024 Afrika Global Business Club. All rights reserved.</span>
      </footer>
    </>
  );
};

export default LandingPage;
