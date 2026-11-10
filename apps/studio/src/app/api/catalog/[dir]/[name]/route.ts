import { readCatalogFile } from '@/lib/catalog-files';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dir: string; name: string }> },
) {
  const { dir, name } = await params;
  const file = await readCatalogFile(dir, name);
  if (!file) return Response.json({ message: 'Not in NachUI.' }, { status: 404 });
  return Response.json(file, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' },
  });
}
