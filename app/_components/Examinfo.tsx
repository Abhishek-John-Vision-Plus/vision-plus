import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, RotateCcw, Award, AlertCircle, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProcess } from '@/context/ProcessContext';

export const Examinfo = () => {
  const router = useRouter();
  const { selectedProcess } = useProcess();

  const primaryColor = selectedProcess?.style?.primary_color || '#4f46e5'; // fallback indigo-600
  const secondaryColor = selectedProcess?.style?.secondary_color || '#9333ea'; // fallback purple-600
  const accentColor = selectedProcess?.style?.accent_color || '#f8fafc'; // fallback slate-50
  
  const title = selectedProcess?.headings?.hero_title 
    ? `${selectedProcess.name} Assessment` 
    : `${selectedProcess?.name || 'Module'} Assessment`;
    
  const subtitle = selectedProcess?.headings?.hero_subtitle || 'Please read the instructions carefully before starting';

  const handleStart = () => {
    router.push('/Questionnaire');
  };

  const instructions = [
    {
      icon: <HelpCircle className="w-5 h-5" style={{ color: primaryColor }} />,
      text: "Total questions in module (optional)"
    },
    {
      icon: <Award className="w-5 h-5" style={{ color: primaryColor }} />,
      text: "Best 3 out of 5 will be considered for scoring."
    },
    {
      icon: <Clock className="w-5 h-5" style={{ color: '#d97706' }} />, // amber-600
      text: "Time limit: Please complete the assessment within the allotted time."
    },
    {
      icon: <RotateCcw className="w-5 h-5" style={{ color: '#2563eb' }} />, // blue-600
      text: "Retake rule: Limited attempts allowed for each module."
    },
    {
      icon: <AlertCircle className="w-5 h-5" style={{ color: '#dc2626' }} />, // red-600
      text: "Minimum questions required for evaluation"
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />, // green-600
      text: "Best 3 answers will be counted"
    },
    {
      icon: <Award className="w-5 h-5" style={{ color: secondaryColor }} />,
      text: "Higher than 75 marks question"
    }
  ];

  return (
    <Card className="w-full max-w-2xl shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
      <CardHeader 
        className="text-white p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${primaryColor})` }}
      >
          {selectedProcess?.images?.logo && (
            <div className="absolute top-4 right-4 w-16 h-16 opacity-20 pointer-events-none">
              <img src={selectedProcess.images.logo} alt="" className="w-full h-full object-contain filter brightness-0 invert" />
            </div>
          )}
          <CardTitle className="text-3xl font-black text-center tracking-tight uppercase italic">
            {title}
          </CardTitle>
          <p className="text-center mt-2 font-medium opacity-90">{subtitle}</p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instructions.map((item, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-white transition-all group shadow-sm hover:shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                <div className="mt-1 p-2 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-slate-700 leading-tight self-center">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100">
            <Button 
              onClick={handleStart}
              className="w-full py-8 text-xl font-black text-white shadow-xl transition-all active:scale-[0.98] gap-3 rounded-2xl uppercase italic tracking-wider"
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: `0 10px 15px -3px ${primaryColor}40` 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              Start Questionnaire
              <CheckCircle2 className="w-6 h-6" />
            </Button>
            <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest opacity-60">
              By clicking "Start", you agree to the assessment terms
            </p>
          </div>
        </CardContent>
    </Card>
  );
};
