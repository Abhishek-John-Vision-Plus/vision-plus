'use client'
import { motion } from 'framer-motion'
import { ExternalLink, CheckCircle2, Clock, Activity, ArrowUpRight, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface ProjectItem {
  title: string;
  description: string;
  impact: string;
  status: string;
  image?: string;
  bgImage?: string;
  link?: string;
}

interface ProjectsProps {
  webData: {
    style?: {
      primary_color?: string;
    };
    images?: {
      banner?: string;
    };
    projects?: ProjectItem[];
  };
}

function Projects({ webData }: ProjectsProps) {
  const primaryColor = webData?.style?.primary_color || '#0f172a'
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'ongoing':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Activity size={12} />;
      case 'completed':
        return <CheckCircle2 size={12} />;
      default:
        return <Clock size={12} />;
    }
  };
  
  return (
    <section id="projects" className="py-32 px-6 sm:px-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-pulse" 
           style={{ background: `radial-gradient(circle, ${primaryColor}40, transparent)` }} 
      />
      <div className="absolute bottom-1/4 -right-48 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-pulse" 
           style={{ background: `radial-gradient(circle, ${primaryColor}40, transparent)`, animationDelay: '1s' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-black tracking-[0.3em] uppercase mb-6 px-5 py-2.5 rounded-full border-2 shadow-lg backdrop-blur-sm"
            style={{ 
              color: primaryColor,
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}10`
            }}
          >
            <Sparkles size={14} />
            Our Portfolio
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
          >
            Success Stories &<br />
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent" 
                  style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd, ${primaryColor})` }}>
              Featured Projects
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Transforming ideas into impactful digital solutions that drive real-world change
          </motion.p>
        </div>

        {/* Enhanced Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {webData.projects?.map((project: ProjectItem, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div 
                className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${primaryColor}40, ${primaryColor}20)` }}
              />
              
              <div className="relative h-full bg-white rounded-[2rem] border-2 border-slate-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-400/20 hover:-translate-y-3 hover:border-slate-300 backdrop-blur-sm">
                {/* Project Image with enhanced overlay */}
                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  {project.image ? (
                    <>
                      <Image 
                        src={project.image} 
                        alt={project.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                      {/* Multi-layer gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-7xl font-black text-white/30 bg-gradient-to-br"
                      style={{ 
                        backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` 
                      }}
                    >
                      {project.title.charAt(0)}
                    </div>
                  )}
                  
                  {/* Enhanced Status Badge */}
                  <div className="absolute top-5 right-5 z-20">
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-2 rounded-xl shadow-lg backdrop-blur-md ${getStatusColor(project.status)}`}
                    >
                      {getStatusIcon(project.status)}
                      {project.status.toUpperCase()}
                    </motion.span>
                  </div>

                  {/* Enhanced Link Icon Overlay */}
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"
                    >
                      <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        whileHover={{ scale: 1.1, rotate: 0 }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-2xl border-2 border-white/40 shadow-2xl transform transition-transform"
                        style={{ backgroundColor: `${primaryColor}e6` }}
                      >
                        <ArrowUpRight className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </motion.div>
                    </a>
                  )}
                </div>

                {/* Enhanced Content */}
                <div className="p-7 space-y-5">
                  {/* Title with better typography */}
                  <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-slate-700 transition-colors line-clamp-2 tracking-tight">
                    {project.title}
                  </h3>

                  {/* Description with better spacing */}
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                    {project.description}
                  </p>

                  {/* Enhanced Impact Badge */}
                  <div className="flex items-center gap-3 pt-3 pb-2">
                    <div className="relative">
                      <div 
                        className="w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div 
                        className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                      {project.impact}
                    </span>
                  </div>

                  {/* Enhanced Link Button */}
                  {project.link && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 8 }}
                      className="inline-flex items-center gap-2 text-sm font-black pt-2 group/link border-t border-slate-100"
                      style={{ color: primaryColor }}
                    >
                      <span className="relative">
                        View Project Details
                        <span 
                          className="absolute bottom-0 left-0 w-0 h-0.5 group-hover/link:w-full transition-all duration-300"
                          style={{ backgroundColor: primaryColor }}
                        />
                      </span>
                      <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                    </motion.a>
                  )}
                </div>

                {/* Enhanced Bottom accent with gradient */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
                  style={{ 
                    background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor})` 
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg text-white shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
            style={{ backgroundColor: primaryColor }}
          >
            {/* Animated background gradient */}
            <span 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />
            <span className="relative z-10">Explore All Projects</span>
            <ArrowUpRight size={22} className="relative z-10 group-hover:rotate-45 transition-transform duration-300" />
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-slate-500 font-medium"
          >
            Discover more innovative solutions and success stories
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
