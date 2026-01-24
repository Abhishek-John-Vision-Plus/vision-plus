'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Code, Cloud, Brain, Shield, Database, Cpu } from 'lucide-react'

function Services({ webData }: { webData: any }) {
  const primaryColor = webData?.style?.primary_color || '#0f172a'
  
  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'code': return <Code size={24} />;
      case 'cloud': return <Cloud size={24} />;
      case 'brain': return <Brain size={24} />;
      case 'shield': return <Shield size={24} />;
      case 'database': return <Database size={24} />;
      case 'cpu': return <Cpu size={24} />;
      default: return <Code size={24} />;
    }
  }

  if (!webData.services) return null;

  return (
    <section id="services" className="py-24 px-6 sm:px-12 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold tracking-widest uppercase mb-3 block"
              style={{ color: primaryColor }}
            >
              Our Expertise
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-slate-900"
            >
              Comprehensive <span style={{ color: primaryColor }}>Digital Solutions</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 max-w-sm"
          >
            We leverage cutting-edge technology to solve complex business challenges and drive digital innovation.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {webData.services.map((service: any, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
              >
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services