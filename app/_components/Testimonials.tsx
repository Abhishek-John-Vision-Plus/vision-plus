'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

function Testimonials({ webData }: { webData: any }) {
  const primaryColor = webData?.style?.primary_color || '#0f172a'
  
  if (!webData.testimonials) return null;

  return (
    <section id="testimonials" className="py-24 px-6 sm:px-12 bg-white relative overflow-hidden">
      {/* Decorative quotes background */}
      <Quote 
        className="absolute top-10 left-10 text-slate-50 w-64 h-64 -z-10 rotate-12" 
        strokeWidth={0.5}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest uppercase mb-3 block"
            style={{ color: primaryColor }}
          >
            Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            What Our <span style={{ color: primaryColor }}>Clients Say</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {webData.testimonials.map((testimonial: any, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-slate-50 p-10 rounded-[3rem] border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <div className="absolute top-8 right-8 text-slate-200 group-hover:text-slate-300 transition-colors">
                <Quote size={48} fill="currentColor" />
              </div>
              
              <p className="text-xl text-slate-700 leading-relaxed mb-8 relative z-10 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials