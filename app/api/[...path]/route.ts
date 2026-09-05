import { proxyApiRequest } from "@/server/apiProxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path);
}
export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path);
}
export async function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path);
}
export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path);
}
export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyApiRequest(request, (await context.params).path);
}
