import { Link } from "react-router-dom";
import { Building2, Globe, MapPin, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-networking.jpg";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AG</span>
              </div>
              <div>
                <div className="font-bold text-lg text-agbc-blue">Afrika Global Business Club</div>
                <div className="text-xs text-gray-600">Powered by Trade Afrika Group</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-agbc-blue">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-agbc-blue hover:bg-agbc-blue-dark text-white">Join Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-agbc-blue via-agbc-blue-dark to-agbc-green">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connect. Trade. Grow Across Afrika.
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join Afrika's premier B2B trade platform. Connect with verified suppliers, discover cross-border opportunities, and accelerate your business growth under AfCFTA.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-agbc-blue hover:bg-gray-100 font-semibold">
                    Start Free Membership
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold">2,500+</div>
                  <div className="text-sm text-blue-100">Active SMEs</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <div className="text-3xl font-bold">54</div>
                  <div className="text-sm text-blue-100">Countries</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <div className="text-3xl font-bold">$12M+</div>
                  <div className="text-sm text-blue-100">Deals Facilitated</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="African business professionals networking"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-agbc-green rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-agbc-blue">148% Growth</div>
                    <div className="text-sm text-gray-600">Cross-border trade</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-agbc-blue mb-4">
              Everything You Need to Succeed in African Trade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A complete platform combining professional networking, opportunity discovery, and trade intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Verified Business Profiles",
                description: "Showcase your products, certifications, and export capabilities to international buyers.",
                color: "bg-blue-50 text-agbc-blue",
              },
              {
                icon: Globe,
                title: "Cross-Border Opportunities",
                description: "Access buyer requests, tenders, and trade missions across all 54 African countries.",
                color: "bg-green-50 text-agbc-green",
              },
              {
                icon: Users,
                title: "Sector Communities",
                description: "Network with peers in your industry and learn from sector leaders.",
                color: "bg-amber-50 text-agbc-gold",
              },
              {
                icon: MapPin,
                title: "Trade Readiness Scoring",
                description: "Track your export readiness and get personalized improvement recommendations.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: TrendingUp,
                title: "Service Marketplace",
                description: "Access export advisory, compliance support, and professional services.",
                color: "bg-pink-50 text-pink-600",
              },
              {
                icon: Users,
                title: "Direct Messaging",
                description: "Connect with buyers and suppliers through secure business messaging.",
                color: "bg-indigo-50 text-indigo-600",
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className={`w-14 h-14 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-agbc-blue mb-4">Choose Your Membership</h2>
            <p className="text-xl text-gray-600">Start free, upgrade as you grow</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                tier: "Free",
                price: "$0",
                features: ["Basic profile", "Community access", "Limited opportunities", "Basic messaging"],
                color: "border-gray-300",
                cta: "Get Started",
              },
              {
                tier: "Silver",
                price: "$29",
                features: ["Enhanced profile", "Priority placement", "Full opportunities", "Unlimited messaging", "10% service discount"],
                color: "border-gray-400",
                cta: "Start Free Trial",
              },
              {
                tier: "Gold",
                price: "$79",
                popular: true,
                features: ["Premium profile + verification", "Featured placement", "Analytics", "Priority support", "20% service discount", "Event access"],
                color: "border-agbc-gold",
                cta: "Start Free Trial",
              },
              {
                tier: "Platinum",
                price: "$199",
                features: ["Elite profile", "Account manager", "AI matching", "Trade intelligence", "30% service discount", "VIP events", "Custom integrations"],
                color: "border-purple-500",
                cta: "Contact Sales",
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl p-6 border-2 ${plan.color} ${plan.popular ? 'shadow-xl scale-105' : 'shadow-sm'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-agbc-gold text-white text-sm font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.tier}</h3>
                  <div className="text-4xl font-bold text-agbc-blue mb-1">
                    {plan.price}
                    <span className="text-lg text-gray-600">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-agbc-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-agbc-green"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-agbc-blue hover:bg-agbc-blue-dark text-white">
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-agbc-blue to-agbc-green">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Expand Your Business Across Afrika?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join 2,500+ SMEs already growing their business through AGBC
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-agbc-blue hover:bg-gray-100 font-semibold">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AG</span>
            </div>
            <span className="font-bold text-lg text-white">Afrika Global Business Club</span>
          </div>
          <p className="text-sm mb-4">Powered by Trade Afrika Group</p>
          <p className="text-sm text-gray-400">
            © 2024 Afrika Global Business Club. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
