"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useTabsStore } from "@/store/tabs-store";
import { PerspectiveHero } from "@/components/ui/perspective-hero";
import MaskText from "@/components/MaskText";

export default function TalkItOutClient({ playlists = [], playlistVideos = {} }: { playlists?: any[], playlistVideos?: Record<string, any[]> }) {
  const setPlaylists = useTabsStore(s => s.setPlaylists);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  const getVisibleCount = (playlistId: string) => visibleCounts[playlistId] || 6;

  const handleShowMore = (playlistId: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [playlistId]: getVisibleCount(playlistId) + 6
    }));
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-32">
      <div id="talk-it-out" className="relative scroll-m-20">
        <PerspectiveHero hero={talkHero} cover={talkAboutCover}>
          <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 max-w-[1400px] relative z-10">
            <div className="space-y-24 mb-32 mt-12">
              {playlists.map((playlist) => {
                const videos = playlistVideos[playlist.id] || [];
                const visibleCount = getVisibleCount(playlist.id);
                const visibleVideos = videos.slice(0, visibleCount);
                const hasMore = visibleCount < videos.length;

                return (
                  <div key={playlist.id} id={`playlist-${playlist.id}`} className="scroll-m-40 min-h-[50vh]">
                    <div className="flex items-center justify-between mb-8">
                      <MaskText text={playlist.title} className="text-3xl md:text-4xl font-bold tracking-tight" />
                    </div>
                    
                    {videos.length === 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={`skeleton-${i}`} className="group flex flex-col gap-4">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                                <Play className="w-8 h-8" />
                              </div>
                            </div>
                            <div>
                              <div className="h-6 bg-zinc-900 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-zinc-900/50 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-12 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {visibleVideos.map((video: any) => (
                            <a 
                              key={video.id} 
                              href={video.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex flex-col gap-4"
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

                        {hasMore && (
                          <div className="flex justify-center mt-12">
                            <button
                              onClick={() => handleShowMore(playlist.id)}
                              className="px-8 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 font-medium transition-colors"
                            >
                              Show More
                            </button>
                          </div>
                        )}
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
