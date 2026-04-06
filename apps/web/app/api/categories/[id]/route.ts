import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { deleteCategory, updateCategory } from '@/lib/services/catalog-service';
import { upsertCategorySchema } from '@/lib/validators/catalog';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    const payload = await readJson(request, upsertCategorySchema);
    if ('error' in payload) {
      return payload.error;
    }

    return success(await updateCategory(id, payload.data));
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const { id } = await params;
    await deleteCategory(id);
    return success({ ok: true });
  });
}
