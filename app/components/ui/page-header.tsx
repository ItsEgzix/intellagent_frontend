"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string; // For additional styling if needed
}

export default function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-32 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/5 pb-12 ${className || ''}`}
    >
      <h1 className="text-5xl md:text-8xl font-medium tracking-tighter">
        {title}
      </h1>
      {description && (
        <div className="mt-8 md:mt-0 max-w-xl text-left md:text-right">
           <p className="text-xl md:text-2xl text-gray-900 leading-relaxed font-normal">
             {description}
           </p>
        </div>
      )}
    </motion.div>
  );
}
