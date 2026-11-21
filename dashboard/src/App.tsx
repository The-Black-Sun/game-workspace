import { useEffect, useMemo, useState } from 'react';
import type { RegistryEntity } from './types';
import { loadWorkspace, type WorkspaceData } from './lib/data';
import { STATUS_META, TYPE_META } from './lib/meta';
import { Overview } from './components/Overview';
import { EntityDetail } from './components/EntityDetail';
import { Pin } from './components/bits';

type TypeFilter = 'all' | RegistryEntity['type'];

export default function App() {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadWorkspace().then(setData);
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.entities.filter(
      (e) => (typeFilter === 'all' || e.type === typeFilter) && (showArchived || e.status === 'active'),
    );
  }, [data, typeFilter, showArchived]);

  const selected = data?.entities.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="flex min-h-dvh bg-[#0e0f12] text-zinc-200">
      <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-800 bg-[#111318]">
        <div className="border-b border-zinc-800 px-4 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400/90">Game Workspace</p>
          <h1 className="mt-1 text-lg font-semibold text-zinc-50">游戏工作区看板</h1>
          {data?.syncedAt && (
            <p className="mt-1.5 font-mono text-[11px] text-zinc-600">
              数据同步于 {new Date(data.syncedAt).toLocaleString('zh-CN')}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1 border-b border-zinc-800 px-3 py-3">
          {(['all', 'project', 'asset-card', 'research', 'note'] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${
                typeFilter === t
                  ? 'bg-amber-400/15 text-amber-300'
                  : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
            >
              {t === 'all' ? '全部' : TYPE_META[t].label}
            </button>
          ))}
          <button
            onClick={() => setShowArchived((v) => !v)}
            aria-pressed={showArchived}
            className={`ml-auto rounded-full px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${
              showArchived ? 'bg-zinc-600/40 text-zinc-200' : 'text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400'
            }`}
          >
            归档
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2" aria-label="实体列表">
          <button
            onClick={() => setSelectedId(null)}
            className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${
              selectedId === null ? 'bg-amber-400/10 text-amber-200' : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            总览
          </button>
          {filtered.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${
                selectedId === e.id ? 'bg-amber-400/10' : 'hover:bg-zinc-800/70'
              }`}
            >
              <span
                className={`size-2 shrink-0 rounded-full ${STATUS_META[e.status]?.dot ?? 'bg-zinc-500'}`}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className={`flex items-center gap-1.5 truncate text-sm ${selectedId === e.id ? 'text-amber-100' : 'text-zinc-200'}`}>
                  <Pin show={e.pinned} />
                  {e.title}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[11px] text-zinc-600">
                  {TYPE_META[e.type]?.label ?? e.type} · {e.updated}
                </span>
              </span>
            </button>
          ))}
          {data && filtered.length === 0 && (
            <p className="px-3 py-4 text-xs text-zinc-600">当前筛选下没有实体。</p>
          )}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto px-6 py-6 lg:px-10">
        {!data ? (
          <p className="text-sm text-zinc-500">加载注册表…</p>
        ) : data.loadError ? (
          <div className="max-w-[65ch] rounded-lg border border-red-400/30 bg-red-400/10 p-5">
            <p className="text-sm text-red-300">数据加载失败：{data.loadError}</p>
            <p className="mt-2 font-mono text-xs text-zinc-400">
              请在 dashboard 目录执行 npm run sync 生成 public/data/ 后重试。
            </p>
          </div>
        ) : selected ? (
          <EntityDetail entity={selected} key={selected.id} />
        ) : (
          <Overview entities={data.entities} onOpen={setSelectedId} />
        )}
      </main>
    </div>
  );
}
