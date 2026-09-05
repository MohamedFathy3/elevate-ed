import { proxyApiRequest, sanctumBase } from "@/server/apiProxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path, sanctumBase, "/sanctum");
}
export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path, sanctumBase, "/sanctum");
}
export async function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path, sanctumBase, "/sanctum");
}
export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path, sanctumBase, "/sanctum");
}
export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path, sanctumBase, "/sanctum");
}
