"use client";

/**
 * Projects CRUD list (spec 5a): create, reorder, feature toggle, publish
 * toggle, delete. Reordering is drag-and-drop and persists sort_order.
 *
 * Drag-and-drop uses the native HTML5 API rather than a library — the list is
 * short, the interaction is a single-axis reorder, and adding a dnd dependency
 * for it would cost more bundle than it saves in code.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, GripVertical, Star, Eye, EyeOff, Trash2, Loader2, Edit2, FolderCog, X } from "lucide-react";

interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  location: string | null;
  year: number | null;
  status: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const CATEGORIES = ["Residential", "Commercial", "Interiors", "Concept"];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);

  // Category Manager State
  const [managingCategories, setManagingCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const dynamicCategories = Array.from(new Set([...CATEGORIES, ...projects.map(p => p.category)]));

  const load = useCallback(async () => {
    // `loading` starts true, so no setState here — refreshes update in place
    // rather than flashing a spinner, and the effect stays synchronously pure.
    try {
      const res = await fetch("/api/g3/projects");
      const data = (await res.json()) as { projects?: Project[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not load projects");
      setProjects(data.projects || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load projects");
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
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/g3/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), category: newCategory }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not create");
      setNewTitle("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the project");
    } finally {
      setCreating(false);
    }
  }

  async function patch(id: number, body: Record<string, unknown>) {
    const res = await fetch(`/api/g3/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Could not save");
    }
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/g3/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((p) => p.filter((x) => x.id !== id));
    else setError("Could not delete the project");
  }

  /** Reorder locally for instant feedback, then persist every affected row. */
  async function drop(targetId: number) {
    if (dragId === null || dragId === targetId) return;
    const from = projects.findIndex((p) => p.id === dragId);
    const to = projects.findIndex((p) => p.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...projects];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setProjects(next);
    setDragId(null);

    await Promise.all(next.map((p, i) => (p.sort_order === i ? null : patch(p.id, { sortOrder: i }))));
  }

  async function handleCategoryAction(action: "rename" | "delete", oldName: string, newName?: string) {
    if (action === "delete" && !confirm(`Delete category "${oldName}"? All projects in this category will be moved to "${CATEGORIES[0]}".`)) {
      return;
    }

    try {
      const res = await fetch("/api/g3/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName, action }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to update category");
      
      setEditingCategory(null);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update category");
    }
  }

  return (
    <div>
      {/* Create */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="New project title…"
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          {customCategory ? (
            <div className="flex flex-1 sm:flex-none items-center gap-2">
              <input
                autoFocus
                placeholder="New category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full sm:w-auto rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setCustomCategory(false);
                  if (!newCategory) setNewCategory(CATEGORIES[0]);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              value={dynamicCategories.includes(newCategory) ? newCategory : (newCategory ? newCategory : CATEGORIES[0])}
              onChange={(e) => {
                if (e.target.value === "__NEW__") {
                  setCustomCategory(true);
                  setNewCategory("");
                } else {
                  setNewCategory(e.target.value);
                }
              }}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              {!dynamicCategories.includes(newCategory) && newCategory && (
                <option value={newCategory}>{newCategory}</option>
              )}
              {dynamicCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__NEW__">+ Create new...</option>
            </select>
          )}
          <button
            onClick={create}
            disabled={creating || !newTitle.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-zinc-500">New projects start as drafts — publish when the gallery is ready.</p>
          <button 
            onClick={() => setManagingCategories(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900"
          >
            <FolderCog className="h-4 w-4" /> Manage Types
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="text-center text-zinc-500">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-zinc-500">No projects yet.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((p) => (
            <li
              key={p.id}
              draggable
              onDragStart={() => setDragId(p.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(p.id)}
              className={`flex items-center gap-3 rounded-lg border bg-white p-3 ${
                dragId === p.id ? "border-amber-400 opacity-60" : "border-zinc-200"
              }`}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-zinc-300" />

              <div className="min-w-0 flex-1">
                <Link href={`/admin/g3/projects/${p.id}`} className="block truncate font-medium text-zinc-900 hover:underline">
                  {p.title}
                </Link>
                <p className="truncate text-xs text-zinc-500">
                  {p.category}{p.location ? ` · ${p.location}` : ""}{p.year ? ` · ${p.year}` : ""} · {p.status}
                </p>
              </div>

              <button
                onClick={() => { setProjects((v) => v.map((x) => x.id === p.id ? { ...x, featured: !x.featured } : x)); patch(p.id, { featured: !p.featured }); }}
                title={p.featured ? "Featured on the homepage" : "Not featured"}
                className={p.featured ? "text-amber-500" : "text-zinc-300 hover:text-zinc-400"}
              >
                <Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} />
              </button>

              <button
                onClick={() => { setProjects((v) => v.map((x) => x.id === p.id ? { ...x, published: !x.published } : x)); patch(p.id, { published: !p.published }); }}
                title={p.published ? "Published" : "Draft"}
                className={p.published ? "text-green-600" : "text-zinc-300 hover:text-zinc-400"}
              >
                {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>

              <button onClick={() => remove(p.id, p.title)} className="text-red-400 hover:text-red-600" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Category Manager Modal */}
      {managingCategories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">Manage Project Types</h3>
              <button onClick={() => setManagingCategories(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {dynamicCategories.map(c => (
                <div key={c} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3">
                  {editingCategory === c ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input 
                        autoFocus
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm"
                      />
                      <button 
                        onClick={() => handleCategoryAction("rename", c, editCategoryName)}
                        className="rounded bg-zinc-900 px-3 py-1 text-xs text-white"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingCategory(null)}
                        className="text-xs text-zinc-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-sm text-zinc-700">{c}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingCategory(c);
                            setEditCategoryName(c);
                          }}
                          className="text-zinc-400 hover:text-zinc-700"
                          title="Rename"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {!CATEGORIES.includes(c) && (
                          <button 
                            onClick={() => handleCategoryAction("delete", c)}
                            className="text-zinc-400 hover:text-red-600"
                            title="Delete type"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
