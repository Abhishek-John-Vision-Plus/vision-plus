'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, Phone, User, Mail, IdCard, Lock, Building } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProcess } from '@/context/ProcessContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Webdata } from '@/data/data';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    empId: '',
    password: '',
    phone: '',
  });
  const [selectedProcessKey, setSelectedProcessKey] = useState<string>('visionPlus');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup } = useAuth();
  const { setSelectedProcess } = useProcess();
  const router = useRouter();

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.empId.trim()) {
      newErrors.empId = 'Employee ID is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await signup({
        name: formData.fullName,
        email: formData.email,
        empId: formData.empId,
        password: formData.password,
        process: selectedProcessKey,
        phone: formData.phone || undefined,
      });

      const processData = (Webdata.processes as any)[selectedProcessKey];
      setSelectedProcess(processData);
      
      toast.success("Account created successfully!", {
        description: `Welcome ${formData.fullName}! Your portal is ready.`
      });
      
      router.push('/');
    } catch (error: any) {
      toast.error("Signup failed", {
        description: error.message || "Something went wrong. Please try again."
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

      {/* Main Content */}
      <div className="relative z-10 w-full pt-10 max-w-2xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/30">
            <Phone className="w-10 h-10 text-white" />
          </div> */}
       <div className="flex flex-col items-center justify-center text-center gap-2">
         <Image
           src={"/logo/Vision.png"}
           alt="Vision Logo"
           width={200}
           height={100}
         />
         <p className="text-slate-600 font-medium">Training Assessment Portal</p>
       </div>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl shadow-slate-900/10 rounded-3xl overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                initial={{ width: "50%" }}
                animate={{ width: `${(step / 2) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {step === 1 ? 'Create Your Account' : 'Choose Your Process'}
                </h2>
                <p className="text-slate-500">
                  {step === 1 
                    ? 'Enter your professional details to get started' 
                    : 'Select the project or department you are associated with'
                  }
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleNextStep}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-slate-700 font-semibold flex items-center gap-2">
                          <User size={16} />
                          Full Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={cn(
                              "bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl pl-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300",
                              errors.fullName && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            )}
                            required
                          />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <User size={18} />
                          </div>
                        </div>
                        {errors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Employee ID */}
                      <div className="space-y-2">
                        <Label htmlFor="empId" className="text-slate-700 font-semibold flex items-center gap-2">
                          <IdCard size={16} />
                          Employee ID
                        </Label>
                        <div className="relative">
                          <Input
                            id="empId"
                            placeholder="EMP-12345"
                            value={formData.empId}
                            onChange={handleInputChange}
                            className={cn(
                              "bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl pl-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300",
                              errors.empId && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            )}
                            required
                          />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <IdCard size={18} />
                          </div>
                        </div>
                        {errors.empId && (
                          <p className="text-red-500 text-xs mt-1">{errors.empId}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Phone size={16} />
                        Phone Number <span className="text-slate-400 text-sm">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl pl-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Phone size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Mail size={16} />
                        Work Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@company.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={cn(
                            "bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl pl-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300",
                            errors.email && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          )}
                          required
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Mail size={18} />
                        </div>
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Lock size={16} />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={cn(
                            "bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 rounded-2xl pl-12 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300",
                            errors.password && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          )}
                          required
                          minLength={6}
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
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 group"
                      >
                        Continue to Process Selection
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <p className="mt-6 text-center text-slate-600 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold flex items-center gap-2">
                        <Building size={16} />
                        Select Your Process/Department
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {Object.entries(Webdata.processes).map(([key, process]: [string, any]) => (
                          <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedProcessKey(key)}
                            className={cn(
                              "relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group",
                              selectedProcessKey === key 
                                ? "bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                                : "bg-slate-50 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white p-2 relative flex-shrink-0 shadow-sm">
                                <Image 
                                  src={process.images.logo} 
                                  alt={process.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                  "font-bold truncate",
                                  selectedProcessKey === key ? "text-emerald-700" : "text-slate-900"
                                )}>
                                  {process.name}
                                </h3>
                                <p className="text-slate-500 text-xs line-clamp-2 mt-1">
                                  {process.description}
                                </p>
                              </div>
                              {selectedProcessKey === key && (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 h-14 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Back
                      </Button>
                      <Button 
                        onClick={handleSignup}
                        className="flex-[2] h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5"
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
                              <span>Creating Account...</span>
                            </motion.div>
                          ) : (
                            <motion.span
                              key="signup"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              Complete Registration
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}