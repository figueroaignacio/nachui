'use client';

import { useId } from 'react';

import { AlertDialog } from '@repo/ui/components/alert-dialog';
import { Button } from '@repo/ui/components/button';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Popover } from '@repo/ui/components/popover';
import { Textarea } from '@repo/ui/components/textarea';
import { Tooltip } from '@repo/ui/components/tooltip';
import { Confirm } from '@repo/ui/src/hybrids/confirm';

import { useCopy } from './use-copy';

export function PopoverShortTask() {
  const t = useCopy({
    en: { trigger: 'Rename project', label: 'Project name', cancel: 'Cancel', save: 'Rename' },
    es: {
      trigger: 'Renombrar proyecto',
      label: 'Nombre del proyecto',
      cancel: 'Cancelar',
      save: 'Renombrar',
    },
  });

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </Popover.Trigger>
      <Popover.Content aria-label={t.trigger} className="w-72 max-w-[calc(100vw-2rem)]">
        <div className="grid gap-3">
          <Input label={t.label} defaultValue="acme-web" />
          <div className="flex justify-end gap-2">
            <Popover.Close asChild>
              <Button variant="outline" size="sm">
                {t.cancel}
              </Button>
            </Popover.Close>
            <Popover.Close asChild>
              <Button size="sm">{t.save}</Button>
            </Popover.Close>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}

export function PopoverLongForm() {
  const copyId = useId();
  const t = useCopy({
    en: {
      trigger: 'Invite teammate',
      name: 'Full name',
      email: 'Email',
      role: 'Role',
      team: 'Team',
      message: 'Personal message',
      copy: 'Send me a copy',
      cancel: 'Cancel',
      send: 'Send invite',
    },
    es: {
      trigger: 'Invitar a alguien',
      name: 'Nombre completo',
      email: 'Email',
      role: 'Rol',
      team: 'Equipo',
      message: 'Mensaje personal',
      copy: 'Mandarme una copia',
      cancel: 'Cancelar',
      send: 'Enviar invitación',
    },
  });

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </Popover.Trigger>
      <Popover.Content aria-label={t.trigger} className="w-72 max-w-[calc(100vw-2rem)]">
        <div className="grid gap-3">
          <Input label={t.name} />
          <Input label={t.email} type="email" />
          <Input label={t.role} />
          <Input label={t.team} />
          <Textarea label={t.message} rows={3} />
          <div className="flex items-center gap-2">
            <Checkbox id={copyId} />
            <Label htmlFor={copyId}>{t.copy}</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Popover.Close asChild>
              <Button variant="outline" size="sm">
                {t.cancel}
              </Button>
            </Popover.Close>
            <Popover.Close asChild>
              <Button size="sm">{t.send}</Button>
            </Popover.Close>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}

export function DisabledReasonVisible() {
  const reasonId = useId();
  const t = useCopy({
    en: { publish: 'Publish', reason: 'Add a cover image to publish this post.' },
    es: { publish: 'Publicar', reason: 'Agregá una imagen de portada para publicar el post.' },
  });

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Button disabled aria-describedby={reasonId}>
        {t.publish}
      </Button>
      <p id={reasonId} className="text-muted-foreground max-w-56 text-xs">
        {t.reason}
      </p>
    </div>
  );
}

export function DisabledReasonTooltip() {
  const t = useCopy({
    en: { publish: 'Publish', reason: 'Add a cover image to publish this post.' },
    es: { publish: 'Publicar', reason: 'Agregá una imagen de portada para publicar el post.' },
  });

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button disabled>{t.publish}</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{t.reason}</Tooltip.Content>
    </Tooltip>
  );
}

export function ConfirmIrreversible() {
  const t = useCopy({
    en: {
      trigger: 'Delete project',
      title: 'Delete acme-web?',
      description:
        'This deletes the project, its 14 deployments and every environment variable. You cannot undo it.',
      confirm: 'Delete project',
      cancel: 'Keep project',
    },
    es: {
      trigger: 'Eliminar proyecto',
      title: '¿Eliminar acme-web?',
      description:
        'Se borran el proyecto, sus 14 deploys y todas las variables de entorno. No se puede deshacer.',
      confirm: 'Eliminar proyecto',
      cancel: 'Conservar proyecto',
    },
  });

  return (
    <Confirm
      title={t.title}
      description={t.description}
      variant="destructive"
      confirmText={t.confirm}
      cancelText={t.cancel}
    >
      <Confirm.Trigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </Confirm.Trigger>
    </Confirm>
  );
}

export function AlertDialogReversible() {
  const t = useCopy({
    en: {
      trigger: 'Archive conversation',
      title: 'Archive this conversation?',
      description: 'You can restore it from Archive at any time.',
      cancel: 'Cancel',
      confirm: 'Archive',
    },
    es: {
      trigger: 'Archivar conversación',
      title: '¿Archivar esta conversación?',
      description: 'Podés restaurarla desde Archivo cuando quieras.',
      cancel: 'Cancelar',
      confirm: 'Archivar',
    },
  });

  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{t.title}</AlertDialog.Title>
          <AlertDialog.Description>{t.description}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>{t.cancel}</AlertDialog.Cancel>
          <AlertDialog.Action>{t.confirm}</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
