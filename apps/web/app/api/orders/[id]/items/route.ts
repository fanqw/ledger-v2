import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { createOrderItem } from '@/lib/services/order-service';
import { upsertOrderItemSchema } from '@/lib/validators/catalog';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    const payload = await readJson(request, upsertOrderItemSchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await createOrderItem(id, payload.data));
  });
}
