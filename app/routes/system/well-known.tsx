// redirect não utilizado nesta rota; removido para evitar imports desnecessários

export async function loader({ params }: { params: { path: string } }) {
  // Handle Chrome DevTools and other .well-known requests
  const { path } = params;
  
  // Return empty response for Chrome DevTools
  if (path === "appspecific/com.chrome.devtools.json") {
    return new Response(JSON.stringify({}), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // Return 404 for other .well-known paths
  throw new Response("Not Found", { status: 404 });
}

export default function WellKnownRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">System Route</h1>
        <p className="text-gray-600">This is a system route for handling .well-known requests.</p>
      </div>
    </div>
  );
}
