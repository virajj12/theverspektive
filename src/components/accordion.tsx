"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface AccordionItem {
  title: string;
  content: string[];
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
            >
              <span className="text-lg font-medium">{item.title}</span>
              <ChevronDown
                className={clsx(
                  "w-5 h-5 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-6 pt-0 text-muted-foreground">
                    <ul className="list-disc list-outside ml-5 space-y-2">
                      {item.content.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
