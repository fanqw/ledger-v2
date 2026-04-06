import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { deleteOrder, getOrderDetail, updateOrder } from '@/lib/services/order-service';
import { upsertOrderSchema } from '@/lib/validators/catalog';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    return success(await getOrderDetail(id));
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    const payload = await readJson(request, upsertOrderSchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await updateOrder(id, payload.data));
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    await deleteOrder(id);
    return success({ ok: true });
  });
}
