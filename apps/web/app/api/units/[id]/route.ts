import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { deleteUnit, updateUnit } from '@/lib/services/catalog-service';
import { upsertUnitSchema } from '@/lib/validators/catalog';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    const payload = await readJson(request, upsertUnitSchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await updateUnit(id, payload.data));
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    await deleteUnit(id);
    return success({ ok: true });
  });
}
