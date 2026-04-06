import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { deleteOrderItem, updateOrderItem } from '@/lib/services/order-service';
import { upsertOrderItemSchema } from '@/lib/validators/catalog';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  return handleRoute(async () => {
    const { id, itemId } = await params;
    const payload = await readJson(request, upsertOrderItemSchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await updateOrderItem(id, itemId, payload.data));
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  return handleRoute(async () => {
    const { id, itemId } = await params;
    await deleteOrderItem(id, itemId);
    return success({ ok: true });
  });
}
