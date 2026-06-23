from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from services.soft_delete import get_all_trashed, restore_item, permanent_delete


@login_required
def trash_list(request):
    items = get_all_trashed()
    return render(request, 'admin/trash.html', {'items': items})


@login_required
def trash_restore(request, model_name, pk):
    if restore_item(model_name, pk):
        messages.success(request, 'Elemento restaurado correctamente.')
    else:
        messages.error(request, 'No se pudo restaurar el elemento.')
    return redirect('trash_list')


@login_required
def trash_delete_permanent(request, model_name, pk):
    if permanent_delete(model_name, pk):
        messages.success(request, 'Elemento eliminado definitivamente.')
    else:
        messages.error(request, 'No se pudo eliminar el elemento.')
    return redirect('trash_list')
