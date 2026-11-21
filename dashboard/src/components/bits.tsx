import { STATUS_META, TYPE_META, statusLabel } from '../lib/meta';
import type { RegistryEntity } from '../types';

export function StatusChip({ status }: { status?: string }) {
  if (!status) return null;
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${meta?.chip ?? 'text-zinc-400 border-zinc-600'}`}>
      <span className={`size-1.5 rounded-full ${meta?.dot ?? 'bg-zinc-500'}`} />
      {statusLabel(status)}
    </span>
  );
}

export function TypeChip({ type }: { type: RegistryEntity['type'] }) {
  const meta = TYPE_META[type];
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[11px] leading-none ${meta?.chip ?? ''}`}>
      {meta?.label ?? type}
    </span>
  );
}

export function Pin({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 fill-amber-400" aria-label="已置顶">
      <path d="M16 3a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-.5 1.7l-2.9.72-2.01 6.04a1 1 0 0 1-1.61.38L12 14.4l-4.3 4.3a1 1 0 0 1-1.4-1.42L10.6 13l-1.74-1.74a1 1 0 0 1 .38-1.61l6.04-2 .72-2.9A1 1 0 0 1 16 3Z" />
    </svg>
  );
}

export function Mono({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <code className={`font-mono text-[13px] ${className}`}>{children}</code>;
}
