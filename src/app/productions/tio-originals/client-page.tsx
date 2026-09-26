"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mic, Utensils, Sparkles, Play } from "lucide-react";
import { PerspectiveHero } from "@/components/ui/perspective-hero";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";
import { TiltCard } from "@/components/ui/be-ui-tilt-card";
import TeamsSection from "@/components/TeamsSection";
import BorderGlow from "@/components/ui/BorderGlow";
import MaskText from "@/components/MaskText";
import { useTheme } from "next-themes";
import { useTabsStore } from "@/store/tabs-store";

interface Video {
  id: string | number;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  created_at?: string;
  published_at?: string;
  viewCount?: string;
}

const formatViews = (viewsStr: string | undefined) => {
  if (!viewsStr || viewsStr === "0") return "";
  const views = parseInt(viewsStr, 10);
  if (isNaN(views)) return "";
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M views";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K views";
  return views + " views";
};

export default function TioOriginalsClient({ 
  initialVideos = [], 
  teams = [], 
  youtubeApiVideos = [],
  playlists = [],
  playlistVideos = {}
}: { 
  initialVideos?: Video[], 
  teams?: any[], 
  youtubeApiVideos?: any[],
  playlists?: any[],
  playlistVideos?: Record<string, any[]>
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [visibleLongCount, setVisibleLongCount] = useState(3);
  const [visibleShortCount, setVisibleShortCount] = useState(5);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("all");
  
  const setPlaylists = useTabsStore(s => s.setPlaylists);

  // If no youtubeApiVideos, provide some sleek mock data so the UI works until API keys are added
  const recentYoutubeVideos = youtubeApiVideos.length > 0 ? youtubeApiVideos : [
    {
      id: "mock1",
      title: "VerspeKtive Studios - Behind the Scenes",
      thumbnail_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
      youtube_url: "#",
      published_at: new Date().toISOString(),
    },
    {
      id: "mock2",
      title: "Talk It Out - Episode 01 Premiere",
      thumbnail_url: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop",
      youtube_url: "#",
      published_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "mock3",
      title: "Taste It Out - Exploring Culinary Masterpieces",
      thumbnail_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
      youtube_url: "#",
      published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "mock4",
      title: "Talk It Out - Shorts #1",
      thumbnail_url: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop",
      youtube_url: "#",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      isShort: true,
    }
  ];

  const longVideos = recentYoutubeVideos.filter((v: any) => !v.isShort);
  const shortVideos = recentYoutubeVideos.filter((v: any) => v.isShort);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleRecentLongVideos = longVideos.slice(0, visibleLongCount);
  const hasMoreLong = visibleLongCount < longVideos.length;

  const handleShowMoreLong = () => {
    setVisibleLongCount((prev) => prev + 3);
  };

  const handleShowLessLong = () => {
    setVisibleLongCount((prev) => Math.max(3, prev - 3));
  };

  const visibleRecentShortVideos = shortVideos.slice(0, visibleShortCount);
  const hasMoreShort = visibleShortCount < shortVideos.length;

  const handleShowMoreShort = () => {
    setVisibleShortCount((prev) => prev + 5);
  };

  const handleShowLessShort = () => {
    setVisibleShortCount((prev) => Math.max(5, prev - 5));
  };

  const getVisiblePlaylistCount = (playlistId: string) => visibleCounts[playlistId] || 3;

  const handleShowMorePlaylist = (playlistId: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [playlistId]: getVisiblePlaylistCount(playlistId) + 3
    }));
  };

  const handleShowLessPlaylist = (playlistId: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [playlistId]: Math.max(3, getVisiblePlaylistCount(playlistId) - 3)
    }));

    setTimeout(() => {
      const btnContainer = document.getElementById(`playlist-${playlistId}-buttons`);
      if (btnContainer) {
        btnContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 50);
  };

  useEffect(() => {
    setPlaylists(playlists);
  }, [playlists, setPlaylists]);

  const tioOriginalsHero = (
    <div className="flex flex-col items-center justify-center text-foreground bg-background transition-colors duration-300 w-full h-full px-6 text-center">
      <div
        className="relative w-full max-w-[400px] h-[150px] mx-auto mb-8"
        style={{
          maskImage: `url(/TIO-01.png)`,
          WebkitMaskImage: `url(/TIO-01.png)`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center"
        }}
      >
        <LiquidMetal {...liquidMetalPresets[2]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "scale(5)" }} />
      </div>
      <p className="text-xl md:text-2xl text-foreground/60 font-medium max-w-2xl leading-relaxed">
        Pioneering perspectives. Authentic stories.
      </p>
    </div>
  );

  const tioOriginalsAboutCover = (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-6 md:p-16 text-center transition-colors duration-300">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">About TIO Originals</h2>
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
          TIO Originals (Talk It Out Originals) is the flagship podcast series produced by VerspeKtive Productions. It features meaningful, insightful, and inspiring conversations with personalities from diverse fields, including entrepreneurship, entertainment, healthcare, education, sports, social service, and the arts.
        </p>
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
          Driven by the belief that every individual has a story worth sharing, TIO Originals aims to educate, inspire, entertain, and create a positive impact through authentic conversations and exceptional production quality.
        </p>
      </div>
    </div>
  );

  const ENABLE_TASTE_IT_OUT = false;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 pb-32">
      {/* TIO Originals Section */}
      <div id="tio-originals" className="relative scroll-m-20">
        <PerspectiveHero hero={tioOriginalsHero} cover={tioOriginalsAboutCover}>
          <div className="container mx-auto px-6 md:px-12 py-24 max-w-[1200px] relative z-10 flex flex-col items-center justify-center min-h-[50vh]">


            {/* YouTube Section */}
            <div className="mb-32 w-full">
              <div className="flex flex-col items-center text-center space-y-6 mb-12">
                <MaskText text="Explore our channel" className="text-4xl font-bold tracking-tight justify-center" />
                <MaskText
                  text="Stay updated with our latest video projects, behind-the-scenes, and more on YouTube."
                  className="text-lg text-muted-foreground max-w-2xl justify-center"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                  { id: "all", label: "All" },
                  { id: "shorts", label: "Shorts" },
                  ...playlists.map((p: any) => ({ id: p.id, label: p.title }))
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-foreground text-background shadow-md scale-105"
                        : "bg-zinc-100 dark:bg-zinc-900 text-foreground/70 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "shorts" ? (
                <div>
                  {shortVideos.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {visibleRecentShortVideos.map((video: any) => (
                          <Link
                            key={video.id}
                            href={video.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col h-full"
                          >
                            <BorderGlow 
                              className="w-full h-full p-2 flex flex-col gap-3" 
                              borderRadius={16}
                              backgroundColor={!mounted ? '#120F17' : (resolvedTheme === 'light' ? '#ffffff' : '#120F17')}
                            >
                              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 shrink-0">
                                <Image
                                  src={video.thumbnail_url}
                                  alt={video.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                    <Play className="w-4 h-4 text-white fill-white ml-1" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col flex-1 px-1 pb-1">
                                <h3 className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground transition-colors mb-1">
                                  {video.title}
                                </h3>
                                {video.viewCount && video.viewCount !== "0" && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatViews(video.viewCount)}
                                  </p>
                                )}
                              </div>
                            </BorderGlow>
                          </Link>
                        ))}
                      </div>
                      {(hasMoreShort || visibleShortCount > 5) && (
                        <div className="flex justify-center mt-4 gap-4">
                          {visibleShortCount > 5 && (
                            <button
                              onClick={handleShowLessShort}
                              className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 font-medium transition-colors text-foreground"
                            >
                              Show Less
                            </button>
                          )}
                          {hasMoreShort && (
                            <button
                              onClick={handleShowMoreShort}
                              className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 font-medium transition-colors text-foreground"
                            >
                              Show More Shorts
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-12">No shorts available right now.</p>
                  )}
                </div>
              ) : (
                <div id={`playlist-${activeTab}-buttons`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {(activeTab === "all" ? visibleRecentLongVideos : (playlistVideos[activeTab] || []).slice(0, getVisiblePlaylistCount(activeTab))).map((video: any) => (
                      <Link
                        key={video.id}
                        href={video.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col h-full"
                      >
                        <BorderGlow 
                          className="w-full h-full p-4 flex flex-col gap-4" 
                          borderRadius={24}
                          backgroundColor={!mounted ? '#120F17' : (resolvedTheme === 'light' ? '#ffffff' : '#120F17')}
                        >
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 shrink-0">
                            <Image
                              src={video.thumbnail_url}
                              alt={video.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col flex-1 justify-between px-2 pb-2">
                            <h3 className="text-sm sm:text-base font-medium leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
                              {video.title}
                            </h3>
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-2 gap-2">
                              <span>{new Date(video.published_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                              {video.viewCount && video.viewCount !== "0" && (
                                <>
                                  <span>•</span>
                                  <span>{formatViews(video.viewCount)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </BorderGlow>
                      </Link>
                    ))}
                  </div>
                  {activeTab === "all" ? (
                    (hasMoreLong || visibleLongCount > 3) && (
                      <div className="flex justify-center mt-4 gap-4">
                        {visibleLongCount > 3 && (
                          <button
                            onClick={handleShowLessLong}
                            className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 font-medium transition-colors text-foreground"
                          >
                            Show Less
                          </button>
                        )}
                        {hasMoreLong && (
                          <button
                            onClick={handleShowMoreLong}
                            className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 font-medium transition-colors text-foreground"
                          >
                            Show More Videos
                          </button>
                        )}
                      </div>
                    )
                  ) : (
                    (getVisiblePlaylistCount(activeTab) < (playlistVideos[activeTab] || []).length || getVisiblePlaylistCount(activeTab) > 3) && (
                      <div className="flex justify-center mt-4 gap-4">
                        {getVisiblePlaylistCount(activeTab) > 3 && (
                          <button
                            onClick={() => handleShowLessPlaylist(activeTab)}
                            className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 font-medium transition-colors text-foreground"
                          >
                            Show Less
                          </button>
                        )}
                        {getVisiblePlaylistCount(activeTab) < (playlistVideos[activeTab] || []).length && (
                          <button
                            onClick={() => handleShowMorePlaylist(activeTab)}
                            className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 font-medium transition-colors text-foreground"
                          >
                            Show More
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {teams && teams.length > 0 && (
              <div id="team" className="w-full mt-24 scroll-mt-20">
                <TeamsSection teams={teams} />
              </div>
            )}

          </div>
        </PerspectiveHero>
      </div>
    </div>
  );
}
