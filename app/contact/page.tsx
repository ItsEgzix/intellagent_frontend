"use client";

import { useI18n } from "../contexts/i18n-context";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <main className="bg-white min-h-screen flex flex-col">
      
      {/* Centered Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 pt-32 pb-20 max-w-[1600px] mx-auto w-full text-center">
        
        <h1 className="text-5xl md:text-8xl font-bold mb-8 text-black tracking-tighter">
          {t.contact.pageIntro}
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-600 max-w-4xl mb-16 leading-relaxed">
          {t.contact.subheading}
        </p>
        
        <div className="w-full max-w-2xl bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm text-left">
           <h2 className="text-2xl font-bold mb-8">{t.contact.cta}</h2>
           
           {/* Simple Form Placeholder */}
           <form className="space-y-6">
              <div>
                 <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Name</label>
                 <input type="text" className="w-full bg-white border-b-2 border-gray-200 p-4 text-lg focus:outline-none focus:border-black transition-colors" placeholder="Type your name" />
              </div>
              <div>
                 <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Email</label>
                 <input type="email" className="w-full bg-white border-b-2 border-gray-200 p-4 text-lg focus:outline-none focus:border-black transition-colors" placeholder="Type your email" />
              </div>
               <div>
                 <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Message</label>
                 <textarea rows={4} className="w-full bg-white border-b-2 border-gray-200 p-4 text-lg focus:outline-none focus:border-black transition-colors resize-none" placeholder="What are you building?" />
              </div>
              
              <button type="submit" className="w-full bg-black text-white text-xl font-bold py-6 rounded-full hover:bg-gray-800 transition-colors mt-8">
                 Send Message
              </button>
           </form>
        </div>

      </div>
    </main>
  );
}
