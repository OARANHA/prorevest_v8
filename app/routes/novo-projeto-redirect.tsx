import { redirect } from "react-router-dom";

export async function loader() {
  return redirect("/studio");
}

export default function NovoProjetoLegacyRedirect() {
  return null;
}
