import { redirect, type LoaderFunctionArgs } from "react-router-dom";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return redirect(`/studio${url.search}`);
}

export default function StudioProRevestLegacyRedirect() {
  return null;
}
