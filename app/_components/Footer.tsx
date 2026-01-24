'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Github, Globe, Mail, Phone, MapPin, LinkedinIcon, LucideTwitter, LucideGithub, Globe2, Facebook, Instagram } from 'lucide-react'

function Footer({ webData }: { webData: any }) {
  const primaryColor = webData?.style?.primary_color || '#0f172a'
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <LinkedinIcon size={20} />;
      case 'twitter': return <LucideTwitter size={20} />;
      case 'github': return <LucideGithub size={20} />;
      case 'facebook': return <Facebook size={20} />;
      case 'instagram': return <Instagram size={20} />;
      default: return <Globe2 size={20} />;
    }
  }

  const socialLinks = webData.links ? Object.entries(webData.links)
    .filter(([key]) => key !== 'website')
    .map(([key, value]) => ({ platform: key, url: value }))
    : webData.contactPage?.social_links || [];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 px-6 sm:px-12 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] opacity-10 blur-[120px] rounded-full -z-10"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: primaryColor }}>
                {webData.name?.charAt(0)}
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                {webData.name}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {webData.description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((social: any, idx: number) => (
                  <motion.a 
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    {getSocialIcon(social.platform)}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-white transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-slate-500 mt-1" />
                <span className="text-sm">{webData.contactPage?.support?.email}</span>
              </li>
              {webData.contactPage?.support?.helpline && (
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-slate-500 mt-1" />
                  <span className="text-sm">{webData.contactPage.support.helpline}</span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-slate-500 mt-1" />
                <span className="text-sm">
                  {webData.contactPage?.offices?.[0]?.location}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-4">Stay Updated</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Subscribe to our newsletter for the latest in digital transformation.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs w-full focus:outline-none focus:border-slate-500 transition-colors"
              />
              <button 
                className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">
            {webData.headings?.footer_text || `© 2026 ${webData.name}. All rights reserved.`}
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer