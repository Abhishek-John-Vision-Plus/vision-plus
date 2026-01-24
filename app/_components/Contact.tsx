'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, Globe, Linkedin, Twitter, Github, Facebook, Instagram } from 'lucide-react'

function Contact({ webData }: { webData: any }) {
  const primaryColor = webData?.style?.primary_color || '#0f172a'
  const secondaryColor = webData?.style?.secondary_color || '#3b82f6'

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'github': return <Github size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'instagram': return <Instagram size={18} />;
      default: return <Globe size={18} />;
    }
  }

  const socialLinks = webData.links ? Object.entries(webData.links)
    .filter(([key]) => key !== 'website')
    .map(([key, value]) => ({ platform: key, url: value }))
    : webData.contactPage?.social_links || [];

  return (
    <section id="contact" className="py-24 px-6 sm:px-12 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest uppercase mb-3 block"
            style={{ color: primaryColor }}
          >
            Get In Touch
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            Let&apos;s Build Something <span style={{ color: primaryColor }}>Together</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100"
            >
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-50" style={{ color: primaryColor }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Email Us</p>
                    <p className="text-lg font-bold text-slate-900">{webData.contactPage?.support?.email}</p>
                  </div>
                </div>
                
                {webData.contactPage?.support?.helpline && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-50" style={{ color: primaryColor }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Call Us</p>
                      <p className="text-lg font-bold text-slate-900">{webData.contactPage.support.helpline}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-50" style={{ color: primaryColor }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Working Hours</p>
                    <p className="text-lg font-bold text-slate-900">{webData.contactPage?.working_hours}</p>
                  </div>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Follow Us</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social: any, idx: number) => (
                      <motion.a 
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="p-3 rounded-xl bg-slate-900 text-white hover:opacity-90 transition-all"
                      >
                        {getSocialIcon(social.platform)}
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Office Locations */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900 ml-2">Our Offices</h4>
              {webData.contactPage?.offices.map((office: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 hover:border-slate-200 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-slate-50" style={{ color: secondaryColor }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{office.name}</p>
                    <p className="text-sm text-slate-600">{office.location}</p>
                    {office.address && <p className="text-xs text-slate-400 mt-1">{office.address}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help you?"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                <textarea 
                  rows={6}
                  placeholder="Your message here..."
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all outline-none resize-none"
                ></textarea>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                Send Message
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact