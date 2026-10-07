import { redirect, type LoaderFunctionArgs } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
  const projectId = params.projectId;
  return redirect(projectId ? `/studio?projectId=${encodeURIComponent(projectId)}` : "/studio");
}

export default function StudioProjectLegacyRedirect() {
  return null;
}
