'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, ShieldCheck, Users, Phone, Mail, IdCard, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProcess } from '@/context/ProcessContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Webdata } from '@/data/data';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login } = useAuth();
  const { setSelectedProcess } = useProcess();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.process && (Webdata.processes as any)[user.process]) {
        setSelectedProcess((Webdata.processes as any)[user.process]);
      }
      router.push('/');
    }
  }, [user, router, setSelectedProcess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(identifier, password);
      toast.success("Welcome back!", {
        description: "You have successfully logged in."
      });
      router.push('/');
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message || "Invalid credentials. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Geometric Shapes */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-16 h-16 bg-emerald-500/10 rounded-2xl backdrop-blur-sm"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-20 w-12 h-12 bg-blue-500/10 rounded-full backdrop-blur-sm"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/30">
           
          </div>
            */}
            <div className="flex flex-col items-center justify-center text-center gap-2">
  <Image
    src={"/logo/Vision.png"}
    alt="Vision Logo"
    width={200}
    height={100}
  />
  <p className="text-slate-600 font-medium">Training Assessment Portal</p>
</div>

          {/* <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Vision Plus</h1> */}
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl shadow-slate-900/10 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500">Sign in to access your assessment</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-slate-700 font-semibold flex items-center gap-2">
                    <Mail size={16} />
                    Email or Employee ID
                  </Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      placeholder="Enter your email or employee ID"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl pl-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Users size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700 font-semibold flex items-center gap-2">
                      <Lock size={16} />
                      Password
                    </Label>
                    <Link href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl pl-12 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 group"
                  disabled={isLoading}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span>Sign In</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 text-sm">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                    Create one
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mt-8"
        >
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 flex flex-col items-center gap-3 text-center group hover:bg-white/80 transition-all duration-300">
            <div className="bg-emerald-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-slate-700 font-bold text-sm">Secure Assessment</span>
          </div>
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 flex flex-col items-center gap-3 text-center group hover:bg-white/80 transition-all duration-300">
            <div className="bg-blue-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-slate-700 font-bold text-sm">One Attempt Only</span>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-slate-400 text-xs leading-relaxed">
            Need help? Contact your administrator for support<br />
            or employee ID recovery assistance.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
