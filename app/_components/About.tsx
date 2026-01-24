import React from 'react'
import { Target, Eye, Lightbulb, CheckCircle2 } from 'lucide-react'

function About({ webData }: any) {
    const primaryColor = webData?.style?.primary_color || '#0f172a';
    const secondaryColor = webData?.style?.secondary_color || '#3b82f6';

    if (!webData?.about) return null;

    return (
        <section id='about' className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
            <div className="space-y-16">
                {/* Section Header */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-700">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: primaryColor }}>
                        About the Program
                    </h2>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        Mission, Vision & Objectives
                    </h3>
                    <div className="w-20 h-1.5 mx-auto rounded-full" style={{ backgroundColor: primaryColor }}></div>
                </div>

                {/* Overview Card */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-in fade-in zoom-in duration-700">
                    <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: primaryColor }}></div>
                    <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed font-medium relative z-10 text-center italic">
                        "{webData.about.overview}"
                    </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Mission */}
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-transparent hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-start gap-5">
                            <div className="p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300" style={{ color: primaryColor }}>
                                <Target size={32} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xl font-bold text-slate-900">Our Mission</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    {webData.about.mission}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-transparent hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-start gap-5">
                            <div className="p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300" style={{ color: secondaryColor }}>
                                <Eye size={32} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xl font-bold text-slate-900">Our Vision</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    {webData.about.vision}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Objectives Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                            <Lightbulb size={24} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900">Key Objectives</h4>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {webData.about.objectives.map((item: string, index: number) => (
                            <div 
                                key={index} 
                                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <CheckCircle2 size={20} style={{ color: primaryColor }} className="shrink-0" />
                                <span className="font-semibold text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About