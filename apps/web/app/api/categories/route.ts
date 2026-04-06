import { success } from '@/lib/api/response';
import { handleRoute } from '@/lib/api/route';
import { readJson } from '@/lib/api/request';
import { createCategory, listCategories } from '@/lib/services/catalog-service';
import { pageQuerySchema, upsertCategorySchema } from '@/lib/validators/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleRoute(async () => {
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = pageQuerySchema.parse(query);
    return success(await listCategories(parsed));
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    const payload = await readJson(request, upsertCategorySchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await createCategory(payload.data));
  });
}
