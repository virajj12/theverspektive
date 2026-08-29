export const runtime = 'edge';

import ProjectsManager from "@/components/admin/g3/ProjectsManager";

export default function G3ProjectsPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Projects</h1>
      <p className="mb-8 text-zinc-500">
        Drag to reorder how projects appear on the site. Star marks a project as featured on the homepage.
      </p>
      <ProjectsManager />
    </div>
  );
}
