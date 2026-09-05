const apiBase = (process.env.VITE_API_TARGET || process.env.VITE_SSR_API_BASE || "https://api.web-lec.com").replace(/\/$/, "");
const sanctumBase = (process.env.VITE_SANCTUM_TARGET || apiBase).replace(/\/$/, "");

function copyRequestHeaders(request: Request) {
  const headers = new Headers();
  const forward = ["accept", "content-type", "authorization", "cookie", "x-xsrf-token", "user-agent"];
  for (const name of forward) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("X-Requested-With", "XMLHttpRequest");
  return headers;
}

export async function proxyApiRequest(request: Request, path: string[], base = apiBase, prefix = "/api") {
  const cleanPath = path.filter(Boolean).map(encodeURIComponent).join("/");
  const incomingUrl = new URL(request.url);
  const target = `${base}${prefix}/${cleanPath}${incomingUrl.search}`;
  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  try {
    const upstream = await fetch(target, {
      method,
      headers: copyRequestHeaders(request),
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    for (const name of ["content-type", "cache-control", "location", "set-cookie"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
  } catch (error) {
    console.error("API proxy failed:", target, error);
    return Response.json({ status: false, message: "API unavailable" }, { status: 502 });
  }
}

export { apiBase, sanctumBase };
