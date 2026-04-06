import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { createOrder, listOrders } from '@/lib/services/order-service';
import { pageQuerySchema, upsertOrderSchema } from '@/lib/validators/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleRoute(async () => {
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());
    return success(await listOrders(pageQuerySchema.parse(query)));
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    const payload = await readJson(request, upsertOrderSchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await createOrder(payload.data));
  });
}
