      {/* Welcome Section */}
      <section className="py-32 px-6 md:px-12 lg:px-20 container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div className="inline-block px-3 py-1 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-sm">
              New Addition
            </div>
            
            <div className="space-y-2">
              <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-gray-400">
                {t.welcome.title}
              </h2>
              <h3 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
                {t.welcome.name}
              </h3>
            </div>

            <div className="space-y-6 max-w-lg">
              <p className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed italic border-l-4 border-black pl-8">
                {t.welcome.tagline}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest font-bold">
                <span className="w-8 h-px bg-black"></span>
                <span>{t.welcome.role}</span>
              </div>
            </div>
          </motion.div>

          {/* Profile Image with Halftone Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full max-w-xl aspect-square md:aspect-[4/5] group"
          >
            <div className="relative w-full h-full overflow-hidden border border-black/5 shadow-2xl transition-all duration-700"
                 style={{ 
                  WebkitMaskImage: "radial-gradient(circle, black 1.5px, transparent 2px)",
                  maskImage: "radial-gradient(circle, black 1.5px, transparent 2px)",
                  WebkitMaskSize: "4px 4px",
                  maskSize: "4px 4px"
                 }}
            >
              <Image 
                src="/team/AliProfile.jpg"
                alt="Ali Elhefnawi"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-transform duration-700 group-hover:scale-110"
                priority
              />
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gray-100 -z-10 rounded-full blur-3xl opacity-50"></div>
          </motion.div>
        </div>
      </section>