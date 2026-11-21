import type { LoadedEntity } from '../types';
import { STATUS_META, TYPE_META } from '../lib/meta';
import { Pin } from './bits';

export function Overview({
  entities,
  onOpen,
}: {
  entities: LoadedEntity[];
  onOpen: (id: string) => void;
}) {
  const active = entities.filter((e) => e.status === 'active');
  const byType = (Object.keys(TYPE_META) as (keyof typeof TYPE_META)[]).map((t) => ({
    type: t,
    count: active.filter((e) => e.type === t).length,
  }));
  const recent = [...active].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 8);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-50">工作区总览</h1>
      <p className="mb-6 text-sm text-zinc-500">注册表中的全部实体与其当前状态。</p>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {byType.map(({ type, count }) => (
          <div key={type} className="rounded-lg border border-zinc-800 bg-[#15171c] p-4">
            <p className="text-3xl font-semibold tabular-nums text-zinc-100">{count}</p>
            <p className="mt-1 text-sm text-zinc-500">{TYPE_META[type].label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium text-zinc-300">最近更新</h2>
      {recent.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center">
          <p className="text-sm text-zinc-400">注册表还是空的。</p>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            按 processes/godot-project-setup.md 创建第一个项目，或按 processes/asset-intake.md 入库第一个资产。
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-[#15171c]">
          {recent.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => onOpen(e.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${STATUS_META[e.status]?.dot ?? 'bg-zinc-500'}`}
                  aria-hidden
                />
                <Pin show={e.pinned} />
                <span className="min-w-0 flex-1 truncate text-[15px] text-zinc-100">{e.title}</span>
                <span className="hidden font-mono text-xs text-zinc-500 sm:inline">
                  {TYPE_META[e.type]?.label ?? e.type}
                </span>
                <span className="font-mono text-xs text-zinc-500">{e.updated}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
