"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, UploadCloud } from "lucide-react";

export interface TeamMember {
  id: string;
  src: string;
}

export interface TeamRow {
  id: string;
  title: string;
  duration: number;
  members: TeamMember[];
}

export default function TeamManager({ slug }: { slug: string }) {
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/content?slug=${slug}`)
      .then(res => res.json())
      .then((data: any) => {
        if (data.data) {
          const teamConfig = data.data.find((p: any) => p.section_key === "teams");
          if (teamConfig && teamConfig.value) {
            try {
              setTeams(JSON.parse(teamConfig.value));
            } catch (e) {}
          }
        }
        setLoading(false);
      });
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          section_key: "teams",
          content_type: "json",
          value: JSON.stringify(teams)
        })
      });
      alert("Teams saved successfully!");
    } catch (e) {
      alert("Error saving teams");
    } finally {
      setSaving(false);
    }
  };

  const addRow = () => {
    setTeams([...teams, { id: Date.now().toString(), title: "New Team", duration: 3000, members: [] }]);
  };

  const deleteRow = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  const updateRow = (id: string, field: string, value: any) => {
    setTeams(teams.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const uploadPhoto = async (teamId: string, file: File) => {
    setUploading(teamId);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json() as any;
      if (data.success) {
        setTeams(teams.map(t => {
          if (t.id === teamId) {
            return { ...t, members: [...t.members, { id: Date.now().toString(), src: data.url }] };
          }
          return t;
        }));
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const removePhoto = (teamId: string, memberId: string) => {
    setTeams(teams.map(t => {
      if (t.id === teamId) {
        return { ...t, members: t.members.filter(m => m.id !== memberId) };
      }
      return t;
    }));
  };

  if (loading) return <p>Loading teams...</p>;

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
        <h3 className="text-xl font-semibold">Team Sections</h3>
        <button type="button" onClick={addRow} className="text-sm bg-zinc-100 px-3 py-1.5 rounded hover:bg-zinc-200 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Team Row
        </button>
      </div>

      {teams.length === 0 ? (
        <p className="text-zinc-500">No teams configured for this page yet.</p>
      ) : (
        <div className="space-y-8">
          {teams.map(team => (
            <div key={team.id} className="border border-zinc-200 rounded-xl p-6 bg-zinc-50 space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Team Title</label>
                  <input type="text" value={team.title} onChange={e => updateRow(team.id, "title", e.target.value)} className="w-full px-3 py-2 rounded border bg-white" />
                </div>
                <div className="w-48">
                  <label className="text-sm font-medium mb-1 block">Auto-Play Duration (ms)</label>
                  <input type="number" value={team.duration} onChange={e => updateRow(team.id, "duration", parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded border bg-white" />
                </div>
                <button type="button" onClick={() => deleteRow(team.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 mb-[2px]">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Team Members</label>
                <div className="flex flex-wrap gap-4">
                  {team.members.map(member => (
                    <div key={member.id} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-200 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={member.src} alt="Team Member" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(team.id, member.id)} className="absolute top-1 right-1 bg-black/50 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors text-zinc-500">
                    <UploadCloud className="w-6 h-6 mb-1" />
                    <span className="text-xs">{uploading === team.id ? 'Wait...' : 'Add'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      if (e.target.files?.[0]) uploadPhoto(team.id, e.target.files[0]);
                      e.target.value = '';
                    }} disabled={uploading === team.id} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {teams.length > 0 && (
        <div className="flex justify-end pt-4 border-t border-zinc-200">
          <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Teams"}
          </button>
        </div>
      )}
    </div>
  );
}
