"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";
import careersData from "../../../content/careers.json";

export default function CareersClientPage() {
  const { pageContent, jobs } = careersData;

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase">
            {pageContent.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {pageContent.subtitle}
          </p>
        </motion.div>

        <div className="space-y-8">
          {jobs.length === 0 ? (
            <div className="text-center py-20 bg-zinc-100 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-2xl">
              <p className="text-muted-foreground">{pageContent.noJobsMessage}</p>
            </div>
          ) : (
            jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-zinc-100 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-3xl p-8 md:p-10 hover:border-black/30 dark:hover:border-white/30 transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full font-medium">
                        <Briefcase className="w-4 h-4" />
                        {job.department} &bull; {job.type}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full font-medium">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                    </div>

                    <p className="text-foreground/80 mb-6 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      <h4 className="font-semibold text-foreground">Requirements:</h4>
                      <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                        {job.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <ContactEmailDropdown
                  email="hey@verspektive.in"
                  subject={`Application for ${job.title}`}
                  className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </ContactEmailDropdown>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
