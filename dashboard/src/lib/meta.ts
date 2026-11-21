import type { CardStatus, RegistryEntity } from '../types';

export const STATUS_META: Record<string, { label: string; dot: string; chip: string }> = {
  idea:          { label: '想法',   dot: 'bg-sky-400',     chip: 'text-sky-300 border-sky-400/30 bg-sky-400/10' },
  'in-progress': { label: '进行中', dot: 'bg-amber-400',   chip: 'text-amber-300 border-amber-400/30 bg-amber-400/10' },
  review:        { label: '待评审', dot: 'bg-violet-400',  chip: 'text-violet-300 border-violet-400/30 bg-violet-400/10' },
  done:          { label: '完成',   dot: 'bg-emerald-400', chip: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10' },
  archived:      { label: '已归档', dot: 'bg-zinc-500',    chip: 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10' },
  active:        { label: '活跃',   dot: 'bg-emerald-400', chip: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10' },
};

export const TYPE_META: Record<RegistryEntity['type'], { label: string; chip: string }> = {
  project:      { label: '项目',   chip: 'text-amber-300 border-amber-400/30 bg-amber-400/10' },
  'asset-card': { label: '资产卡', chip: 'text-sky-300 border-sky-400/30 bg-sky-400/10' },
  research:     { label: '调研',   chip: 'text-violet-300 border-violet-400/30 bg-violet-400/10' },
  note:         { label: '笔记',   chip: 'text-zinc-300 border-zinc-400/30 bg-zinc-400/10' },
};

export const CARD_STATUSES: CardStatus[] = ['idea', 'in-progress', 'review', 'done', 'archived'];

export function statusLabel(s?: string): string {
  return (s && STATUS_META[s]?.label) ?? '无状态';
}
