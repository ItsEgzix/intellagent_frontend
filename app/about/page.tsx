"use client";

import { useI18n } from "../contexts/i18n-context";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="bg-white min-h-screen">
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Main Content */}
          <div className="flex-1">
            <span className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
              {t.about.pageIntro}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-12 text-black leading-tight">
              {t.about.heading}
            </h1>

            <div className="space-y-16">
              {/* Philosophy */}
              <div>
                <h2 className="text-2xl font-bold mb-8">{t.about.philosophy.heading}</h2>
                <ul className="space-y-4">
                  {t.about.philosophy.points.map((point: string, index: number) => (
                    <li key={index} className="text-2xl md:text-4xl font-light text-gray-800 border-b border-gray-100 pb-4">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

               {/* Why We Exist */}
               <div className="bg-black text-white p-8 md:p-12 rounded-2xl">
                 <h2 className="text-2xl font-bold mb-6 text-yellow-400">{t.about.whyWeExist.heading}</h2>
                 <p className="text-xl md:text-3xl leading-relaxed font-light">
                   {t.about.whyWeExist.text}
                 </p>
               </div>
            </div>
          </div>

          {/* Sidebar / Visual (Optional placeholder for now) */}
          <div className="hidden lg:block w-1/3">
             <div className="sticky top-32">
                <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
                   <p className="text-gray-400 font-mono">Image / Studio Shot</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}
