"use client";

import { useI18n } from "../contexts/i18n-context";

export default function OpenDataPage() {
  const { t } = useI18n();

  return (
    <main className="bg-white min-h-screen">
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        {/* Page Intro */}
        <div className="mb-16">
          <span className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
            {t.openData.pageIntro}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl text-black">
            {t.openData.heading}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            {t.openData.subheading}
          </p>
        </div>

        {/* Featured Dataset */}
        <div className="bg-black text-white p-8 md:p-16 rounded-3xl mb-20 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 inline-block">
              FEATURED DATASET
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t.openData.featuredDataset.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
              {t.openData.featuredDataset.description}
            </p>
            
            <div className="bg-white/10 p-8 rounded-xl border border-white/20">
              <p className="text-xl font-bold mb-6 text-yellow-400">
                {t.openData.featuredDataset.callToAction}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                  Contribute to Dataset
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Why it Matters */}
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Why This Matters</h3>
          <p className="text-xl text-gray-700">
            {t.openData.whyItMatters}
          </p>
        </div>
      </div>
    </main>
  );
}
