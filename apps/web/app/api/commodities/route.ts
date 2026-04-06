import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { createCommodity, listCommodities } from '@/lib/services/catalog-service';
import { pageQuerySchema, upsertCommoditySchema } from '@/lib/validators/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleRoute(async () => {
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());
    return success(await listCommodities(pageQuerySchema.parse(query)));
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    const payload = await readJson(request, upsertCommoditySchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await createCommodity(payload.data));
  });
}
