"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Save } from "lucide-react";
import TeamManager from "@/components/admin/team-manager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("homepage");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const tabs = [
    { id: "homepage", label: "Homepage" },
    { id: "productions", label: "Productions" },
    { id: "studios", label: "Studios" },
    { id: "talk-it-out", label: "Talk It Out" },
    { id: "taste-it-out", label: "Taste It Out" },
    { id: "g3-builders", label: "G3 Builders" },
  ];

  // Dummy state to represent form fields
  const [formData, setFormData] = useState({
    heroHeadline: "VerspeKtive",
    heroTagline: "Premium storytelling, from studio to screen.",
    heroImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2574&auto=format&fit=crop",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Typically we would iterate over modified fields and push to /api/content
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: "home",
          section_key: "heroHeadline",
          value: formData.heroHeadline,
          content_type: "text",
        }),
      });
      alert("Saved successfully!");
    } catch (err) {
      alert("Error saving content");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data: any = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, heroImage: data.url }));
        alert("Image uploaded to R2!");
      }
    } catch (error) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Content Editor</h1>
      </div>

      <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 md:p-8 space-y-8">
        
        {/* Placeholder for dynamic fields based on active tab */}
        {activeTab === "homepage" && (
          <HomepageAdmin />
        )}
        
        {activeTab === "productions" && (
          <ProductionsAdmin />
        )}

        {activeTab === "studios" && (
          <StudiosAdmin />
        )}

        {activeTab === "talk-it-out" && (
          <TalkItOutAdmin />
        )}

        {activeTab === "taste-it-out" && (
          <TasteItOutAdmin />
        )}

        {activeTab === "g3-builders" && (
          <G3BuildersAdmin />
        )}
      </div>
    </div>
  );
}

function HomepageAdmin() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    heroHeadline: "VerspeKtive",
    heroTagline: "Premium storytelling, from studio to screen.",
    heroImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2574&auto=format&fit=crop",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "home", section_key: "heroHeadline", value: formData.heroHeadline, content_type: "text" }),
      });
      alert("Saved successfully!");
    } catch (err) {
      alert("Error saving content");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data: any = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, heroImage: data.url }));
        alert("Image uploaded to R2!");
      }
    } catch (error) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-zinc-100 pb-2">Hero Section</h3>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Headline</label>
          <input
            type="text"
            value={formData.heroHeadline}
            onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Tagline</label>
          <input
            type="text"
            value={formData.heroTagline}
            onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Background Image (R2 Upload)</label>
          <div className="relative group border-2 border-dashed border-zinc-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50 transition-colors cursor-pointer overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {uploading ? (
              <span className="text-sm font-medium">Uploading to R2...</span>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-zinc-500 mb-3 group-hover:text-zinc-900 transition-colors" />
                <span className="text-sm font-medium">Drag & drop or click to upload</span>
                <span className="text-xs text-zinc-500 mt-1">Replaces current URL</span>
              </>
            )}
          </div>
          {formData.heroImage && (
            <div className="mt-2 text-sm text-zinc-500 break-all">
              Current: <a href={formData.heroImage} target="_blank" className="underline">{formData.heroImage}</a>
            </div>
          )}
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function StudiosAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactEmail: "verspektive@gmail.com",
    heroText: "Premium podcast & content creation studio",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "global", section_key: "contact_email", value: formData.contactEmail, content_type: "text" }),
      });
      alert("Studios content saved successfully!");
    } catch (err) {
      alert("Error saving content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <h3 className="text-xl font-semibold border-b border-zinc-100 pb-2">Studios Content Editor</h3>
      
      <div className="grid gap-2">
        <label className="text-sm font-medium">Contact Email (Global Settings)</label>
        <input
          type="email"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
        />
        <p className="text-xs text-zinc-500">This email will receive inquiries from the Studios page.</p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Hero Subtitle</label>
        <input
          type="text"
          value={formData.heroText}
          onChange={(e) => setFormData({ ...formData, heroText: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function TalkItOutAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "Talk It Out",
    subtitle: "Talk It Out — the flagship podcast series produced by VerspeKtive Productions.",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "talk-it-out", section_key: "heroTitle", value: formData.title, content_type: "text" }),
      });
      alert("Talk It Out content saved successfully!");
    } catch (err) {
      alert("Error saving content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <h3 className="text-xl font-semibold border-b border-zinc-100 pb-2">Talk It Out Content Editor</h3>
      
      <div className="grid gap-2">
        <label className="text-sm font-medium">Hero Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Hero Subtitle</label>
        <textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all h-24"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      
      <div className="pt-8 border-t border-zinc-100">
        <TeamManager slug="talk-it-out" />
      </div>
    </form>
  );
}

function TasteItOutAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "Taste It Out",
    subtitle: "Taste It Out — discovering the finest culinary experiences.",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "taste-it-out", section_key: "heroTitle", value: formData.title, content_type: "text" }),
      });
      alert("Taste It Out content saved successfully!");
    } catch (err) {
      alert("Error saving content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <h3 className="text-xl font-semibold border-b border-zinc-100 pb-2">Taste It Out Content Editor</h3>
      
      <div className="grid gap-2">
        <label className="text-sm font-medium">Hero Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Hero Subtitle</label>
        <textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all h-24"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      
      <div className="pt-8 border-t border-zinc-100">
        <TeamManager slug="taste-it-out" />
      </div>
    </form>
  );
}

function ProductionsAdmin() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", youtube_url: "", thumbnail_url: "" });

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/youtube_videos");
      const data: any = await res.json();
      if (data.data) {
        setVideos(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data: any = await res.json();
      if (data.success) {
        setNewVideo((prev) => ({ ...prev, thumbnail_url: data.url }));
        alert("Image uploaded to R2!");
      }
    } catch (error) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.youtube_url || !newVideo.thumbnail_url) {
      alert("Please fill all fields and upload a thumbnail");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/youtube_videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });
      if (res.ok) {
        setNewVideo({ title: "", youtube_url: "", thumbnail_url: "" });
        fetchVideos();
        alert("Video added successfully!");
      }
    } catch (error) {
      alert("Error adding video");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      const res = await fetch(`/api/youtube_videos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchVideos();
      }
    } catch (error) {
      alert("Error deleting video");
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold border-b border-zinc-100 pb-2">YouTube Videos</h3>
      
      <form onSubmit={handleAddVideo} className="bg-zinc-50 p-6 rounded-xl space-y-4 border border-zinc-200">
        <h4 className="font-medium text-lg">Add New Video</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Video Title</label>
            <input
              type="text"
              required
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube URL</label>
            <input
              type="url"
              required
              value={newVideo.youtube_url}
              onChange={(e) => setNewVideo({ ...newVideo, youtube_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Thumbnail Image</label>
          <div className="relative group border-2 border-dashed border-zinc-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-100 transition-colors cursor-pointer overflow-hidden bg-white">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {uploading ? (
              <span className="text-sm font-medium">Uploading...</span>
            ) : newVideo.thumbnail_url ? (
              <div className="text-sm text-green-600 font-medium">Uploaded: {newVideo.thumbnail_url.split("/").pop()}</div>
            ) : (
              <span className="text-sm font-medium text-zinc-500">Click or drag to upload thumbnail</span>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={adding || uploading}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {adding ? "Adding..." : "Add Video"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h4 className="font-medium text-lg">Existing Videos</h4>
        {loading ? (
          <p>Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-zinc-500">No videos added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="flex gap-4 p-4 rounded-xl border border-zinc-200 bg-white items-start">
                <img src={video.thumbnail_url} alt={video.title} className="w-32 h-20 object-cover rounded-lg bg-zinc-100" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium truncate" title={video.title}>{video.title}</h5>
                  <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block mt-1">
                    {video.youtube_url}
                  </a>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-xs text-red-500 hover:text-red-600 font-medium mt-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <TeamManager slug="productions" />
    </div>
  );
}

function G3BuildersAdmin() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">G3 Builders Config</h2>
      <p className="text-zinc-500 mb-8">Manage the content and teams for G3 Builders.</p>
      
      <TeamManager slug="g3-builders" />
    </div>
  );
}
