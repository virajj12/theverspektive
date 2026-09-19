"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, GripVertical, Trash2, Edit2, Loader2, X, Image as ImageIcon } from "lucide-react";
import MediaLibrary, { type MediaItem } from "./MediaLibrary";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  photo_media_id: number | null;
  sort_order: number;
  photoUrl: string | null;
}

export default function G3TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  const [pickerForId, setPickerForId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/g3/team");
      const data = await res.json() as { data?: TeamMember[], error?: string };
      if (!res.ok) throw new Error(data.error || "Could not load team");
      setTeam(data.data || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await load(); })();
    return () => { cancelled = true; };
  }, [load]);

  async function create() {
    if (!newName.trim() || !newRole.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/g3/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), role: newRole.trim(), sort_order: team.length }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not create");
      setNewName("");
      setNewRole("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the team member");
    } finally {
      setCreating(false);
    }
  }

  async function patch(id: number, body: Record<string, unknown>) {
    const res = await fetch(`/api/g3/team/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error || "Could not save");
    }
  }

  async function remove(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/g3/team/${id}`, { method: "DELETE" });
    if (res.ok) setTeam((t) => t.filter((x) => x.id !== id));
    else setError("Could not delete the team member");
  }

  async function drop(targetId: number) {
    if (dragId === null || dragId === targetId) return;
    const from = team.findIndex((p) => p.id === dragId);
    const to = team.findIndex((p) => p.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...team];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setTeam(next);
    setDragId(null);

    await Promise.all(next.map((p, i) => (p.sort_order === i ? null : patch(p.id, { sort_order: i }))));
  }

  async function pickPhoto(media: MediaItem) {
    if (pickerForId === null) return;
    await patch(pickerForId, { photo_media_id: media.id });
    setTeam(team.map(t => t.id === pickerForId ? { ...t, photo_media_id: media.id, photoUrl: media.url } : t));
    setPickerForId(null);
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold">G3 Team Roster</h3>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name..."
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="Role / Title..."
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <button
            onClick={create}
            disabled={creating || !newName.trim() || !newRole.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="text-zinc-500">Loading…</p>
      ) : team.length === 0 ? (
        <p className="text-zinc-500">No team members yet.</p>
      ) : (
        <ul className="space-y-3">
          {team.map((t) => (
            <li
              key={t.id}
              draggable
              onDragStart={() => setDragId(t.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(t.id)}
              className={`flex items-start gap-4 rounded-xl border bg-white p-4 ${
                dragId === t.id ? "border-amber-400 opacity-60" : "border-zinc-200"
              }`}
            >
              <div className="pt-2"><GripVertical className="h-5 w-5 shrink-0 cursor-grab text-zinc-300" /></div>
              
              <button onClick={() => setPickerForId(t.id)} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 flex items-center justify-center group">
                {t.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photoUrl} alt={t.name} className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-zinc-400" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="h-4 w-4 text-zinc-900" />
                </div>
              </button>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex gap-2">
                  <input
                    value={t.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTeam(team.map(x => x.id === t.id ? { ...x, name: val } : x));
                    }}
                    onBlur={() => patch(t.id, { name: t.name })}
                    className="flex-1 font-medium bg-transparent border-b border-transparent focus:border-zinc-300 focus:outline-none"
                    placeholder="Name"
                  />
                  <input
                    value={t.role}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTeam(team.map(x => x.id === t.id ? { ...x, role: val } : x));
                    }}
                    onBlur={() => patch(t.id, { role: t.role })}
                    className="flex-1 text-sm text-zinc-600 bg-transparent border-b border-transparent focus:border-zinc-300 focus:outline-none"
                    placeholder="Role"
                  />
                </div>
                <textarea
                  value={t.bio || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTeam(team.map(x => x.id === t.id ? { ...x, bio: val } : x));
                  }}
                  onBlur={() => patch(t.id, { bio: t.bio })}
                  placeholder="Bio..."
                  className="w-full text-sm text-zinc-500 bg-transparent resize-none border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:outline-none rounded p-2 min-h-[60px]"
                />
              </div>

              <button onClick={() => remove(t.id, t.name)} className="text-zinc-400 hover:text-red-600 p-2" title="Delete">
                <Trash2 className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {pickerForId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 md:p-12">
          <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4">
              <h3 className="font-semibold text-zinc-900">Choose a team photo</h3>
              <button onClick={() => setPickerForId(null)} className="text-zinc-400 hover:text-zinc-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <MediaLibrary
              pickMode
              onPick={pickPhoto}
              selectedIds={team.find(t => t.id === pickerForId)?.photo_media_id ? [team.find(t => t.id === pickerForId)!.photo_media_id!] : []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
