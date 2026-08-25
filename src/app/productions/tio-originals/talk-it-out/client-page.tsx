"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useTabsStore } from "@/store/tabs-store";
import { PerspectiveHero } from "@/components/ui/perspective-hero";
import MaskText from "@/components/MaskText";

export default function TalkItOutClient({ playlists = [], playlistVideos = {} }: { playlists?: any[], playlistVideos?: Record<string, any[]> }) {
  const setPlaylists = useTabsStore(s => s.setPlaylists);

  useEffect(() => {
    setPlaylists(playlists);
  }, [playlists, setPlaylists]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const hash = `#${entry.target.id}`;
            if (window.location.hash !== hash) {
              window.history.replaceState(null, '', hash);
              window.dispatchEvent(new CustomEvent("updateActiveHash", { detail: hash }));
            }
          } else if (playlists.length > 0 && entry.target.id === `playlist-${playlists[0].id}`) {
            // If the first playlist leaves the active zone by moving down (user scrolled up to hero)
            if (entry.boundingClientRect.top > window.innerHeight * 0.3) {
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname);
                window.dispatchEvent(new CustomEvent("updateActiveHash", { detail: "" }));
              }
            }
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    const sections: string[] = [];
    playlists.forEach((p: any) => sections.push(`playlist-${p.id}`));

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [playlists]);

  const talkHero = (
    <div className="flex flex-col items-center justify-center text-foreground bg-background transition-colors duration-300 w-full h-full px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">Talk It Out</h1>
      <MaskText
        text="A series of profound conversations."
        className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl leading-relaxed justify-center"
      />
    </div>
  );

  const talkAboutCover = (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-6 md:p-16 text-center">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">About Talk It Out</h2>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
          Talk It Out is a platform for meaningful, unfiltered discussions. We invite guests from various walks of life to share their perspectives, challenges, and stories. Dive into deep conversations that explore the human experience.
        </p>
      </div>
    </div>
  );

  const scrollContainer = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(`scroll-container-${id}`);
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-32">
      <div id="talk-it-out" className="relative scroll-m-20">
        <PerspectiveHero hero={talkHero} cover={talkAboutCover}>
          <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 max-w-[1400px] relative z-10">
            <div className="space-y-24 mb-32 mt-12">
              {playlists.map((playlist) => {
                const videos = playlistVideos[playlist.id] || [];
                return (
                  <div key={playlist.id} id={`playlist-${playlist.id}`} className="scroll-m-40 min-h-[50vh]">
                    <div className="flex items-center justify-between mb-8">
                      <MaskText text={playlist.title} className="text-3xl md:text-4xl font-bold tracking-tight" />
                      {videos.length > 0 && (
                        <div className="flex gap-2">
                          <button onClick={() => scrollContainer(playlist.id, 'left')} className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button onClick={() => scrollContainer(playlist.id, 'right')} className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {videos.length === 0 ? (
                      <div className="bg-zinc-900/50 rounded-2xl p-12 text-center text-zinc-500 border border-white/5">
                        No videos found for this playlist.
                      </div>
                    ) : (
                      <div 
                        id={`scroll-container-${playlist.id}`}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {videos.map((video: any) => (
                          <a 
                            key={video.id} 
                            href={video.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-4 min-w-[300px] md:min-w-[400px] snap-start"
                          >
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                              <Image 
                                src={video.thumbnail_url} 
                                alt={video.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium leading-snug line-clamp-2 group-hover:text-white/80 transition-colors">{video.title}</h3>
                              <p className="text-sm text-zinc-500 mt-2">
                                {new Date(video.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </PerspectiveHero>
      </div>
    </div>
  );
}
