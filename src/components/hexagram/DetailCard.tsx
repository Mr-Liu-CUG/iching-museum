"use client";

import { motion } from "framer-motion";

interface Props {
  icon?: string;
  title: string;
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export default function DetailCard({ icon, title, children, index = 0, className = "" }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-lg border border-border-gold bg-card-bg-solid p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border-dashed border-dashed">
        {icon && (
          <span className="text-gold-primary text-lg select-none" aria-hidden>
            {icon}
          </span>
        )}
        <h3 className="font-song text-base tracking-[2px] text-ink-dark m-0">{title}</h3>
      </div>
      <div className="text-ink-mid text-sm leading-relaxed">{children}</div>
    </motion.section>
  );
}
