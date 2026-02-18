import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { setAuthUser } from "@/lib/auth";
import { User, Company } from "@/types";
import { Mail, Lock, Chrome } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock authentication
    const mockUser: User = {
      id: "user-" + Date.now(),
      email: email,
      role: "SME",
      membershipTier: "Free",
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    const mockCompany: Company = {
      id: "company-" + Date.now(),
      userId: mockUser.id,
      companyName: "",
      sector: "Agriculture",
      country: "",
      description: "",
      tradeReadinessScore: 0,
      profileCompletion: 0,
    };

    setAuthUser(mockUser, mockCompany);
    
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    navigate("/onboarding");
  };

  const handleGoogleAuth = () => {
    // Mock Google authentication
    const mockUser: User = {
      id: "user-google-" + Date.now(),
      email: "user@gmail.com",
      role: "SME",
      membershipTier: "Free",
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    const mockCompany: Company = {
      id: "company-" + Date.now(),
      userId: mockUser.id,
      companyName: "",
      sector: "Agriculture",
      country: "",
      description: "",
      tradeReadinessScore: 0,
      profileCompletion: 0,
    };

    setAuthUser(mockUser, mockCompany);
    toast.success("Signed in with Google!");
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agbc-blue via-agbc-blue-dark to-agbc-green flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">AG</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Join AGBC"}
          </h1>
          <p className="text-blue-100">
            {isLogin
              ? "Sign in to continue growing your business"
              : "Start connecting with African businesses"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-agbc-blue hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full bg-agbc-blue hover:bg-agbc-blue-dark text-white">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full mt-4 border-gray-300 hover:bg-gray-50"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-agbc-blue font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-white hover:text-blue-100 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
