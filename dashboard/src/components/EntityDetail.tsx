import { useEffect, useState } from 'react';
import type { LoadedEntity } from '../types';
import { stepViewer } from '../types';
import { loadMarkdown } from '../lib/data';
import { Mono, StatusChip, TypeChip } from './bits';
import { Markdown } from './Markdown';
import { CardGallery } from './CardGallery';

function MarkdownStep({ entity, stepPath }: { entity: LoadedEntity; stepPath: string }) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setText(null);
    setError(null);
    loadMarkdown(entity, stepPath)
      .then((t) => alive && setText(t))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [entity, stepPath]);
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (text === null) return <p className="text-sm text-zinc-500">加载文档…</p>;
  return (
    <div className="max-w-[75ch]">
      <Markdown text={text} />
    </div>
  );
}

export function EntityDetail({ entity }: { entity: LoadedEntity }) {
  const steps = entity.steps ?? [];
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [entity.id]);
  const step = steps[Math.min(active, Math.max(steps.length - 1, 0))];

  return (
    <div>
      <header className="mb-6 border-b border-zinc-800 pb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <TypeChip type={entity.type} />
          <StatusChip status={entity.status} />
          {entity.category && (
            <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
              {entity.category}
            </span>
          )}
          {entity.engine && (
            <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
              {entity.engine}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">{entity.title}</h1>
        {entity.description && <p className="mt-2 max-w-[75ch] text-[15px] text-zinc-400">{entity.description}</p>}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-zinc-500">
          <span>id: {entity.id}</span>
          <span>folder: {entity.folder}</span>
          <span>创建 {entity.created}</span>
          <span>更新 {entity.updated}</span>
        </div>
      </header>

      {!entity.copied && (
        <p className="mb-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          实体文件夹当前不可读（可能位于未挂载的项目仓库）。注册信息可见，内容页签不可用。
        </p>
      )}

      {steps.length === 0 ? (
        <p className="text-sm text-zinc-500">这个实体还没有内容页签。</p>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-1 border-b border-zinc-800" role="tablist">
            {steps.map((s, i) => (
              <button
                key={s.path + s.name}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`relative rounded-t-md px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${
                  i === active
                    ? 'bg-[#15171c] text-amber-300 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-amber-400'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
          {step && entity.copied && <StepContent entity={entity} stepPath={step.path} key={step.path} />}
        </>
      )}
    </div>
  );
}

function StepContent({ entity, stepPath }: { entity: LoadedEntity; stepPath: string }) {
  const viewer = stepViewer({ name: '', path: stepPath });
  if (viewer === 'card') return <CardGallery entity={entity} stepPath={stepPath} />;
  if (viewer === 'md') return <MarkdownStep entity={entity} stepPath={stepPath} />;
  return (
    <p className="text-sm text-zinc-500">
      此类型暂不支持内嵌预览（<Mono>{stepPath}</Mono>）。HTML 报告请直接用浏览器打开对应文件。
    </p>
  );
}
