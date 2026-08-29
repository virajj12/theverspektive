export const runtime = 'edge';

import ProjectEditor from "@/components/admin/g3/ProjectEditor";
import { notFound } from "next/navigation";

export default async function G3ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) notFound();

  return <ProjectEditor projectId={projectId} />;
}
