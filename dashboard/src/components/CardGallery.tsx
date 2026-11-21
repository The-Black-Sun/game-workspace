import { useEffect, useState } from 'react';
import type { AssetCard, LoadedEntity } from '../types';
import { cardImageUrl, loadAssetCard } from '../lib/data';
import { StatusChip } from './bits';
import { Markdown } from './Markdown';

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
      role="dialog"
      aria-label="图片预览"
    >
      <button
        className="absolute right-5 top-5 rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-amber-400"
        onClick={onClose}
        autoFocus
      >
        关闭 Esc
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full rounded-md object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export function CardGallery({ entity, stepPath }: { entity: LoadedEntity; stepPath: string }) {
  const [card, setCard] = useState<AssetCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    let alive = true;
    setCard(null);
    setError(null);
    loadAssetCard(entity, stepPath)
      .then((c) => alive && setCard(c))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [entity, stepPath]);

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!card) return <p className="text-sm text-zinc-500">加载卡片…</p>;

  return (
    <div>
      {card.summary && (
        <div className="mb-5 max-w-[75ch]">
          <Markdown text={card.summary} />
        </div>
      )}
      {card.assetType && (
        <p className="mb-4 font-mono text-xs text-zinc-500">assetType: {card.assetType}</p>
      )}
      {card.items.length === 0 ? (
        <p className="text-sm text-zinc-500">这张卡片还没有条目。</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {card.items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col rounded-lg border border-zinc-800 bg-[#15171c] transition-colors hover:border-zinc-600"
            >
              {item.image && (
                <button
                  className="block overflow-hidden rounded-t-lg focus-visible:outline-2 focus-visible:outline-amber-400"
                  onClick={() =>
                    setLightbox({
                      src: cardImageUrl(entity, stepPath, item.image!),
                      alt: item.alt ?? item.title,
                    })
                  }
                  aria-label={`放大图片：${item.title}`}
                >
                  <img
                    src={cardImageUrl(entity, stepPath, item.image)}
                    alt={item.alt ?? item.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </button>
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-medium leading-snug text-zinc-100">{item.title}</h3>
                  <StatusChip status={item.status} />
                </div>
                {item.body && <Markdown text={item.body} className="text-sm" />}
                {item.license && (
                  <p className="font-mono text-xs text-zinc-500">许可：{item.license}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <p className="font-mono text-xs text-zinc-500">{item.tags.map((t) => `#${t}`).join(' ')}</p>
                )}
                {item.prompt && (
                  <details className="rounded-md border border-zinc-800 bg-[#101216] px-3 py-2">
                    <summary className="cursor-pointer text-xs text-amber-300/90 hover:text-amber-200">
                      提示词 / 迭代备注
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-400">
                      {item.prompt}
                    </p>
                  </details>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto pt-1 text-xs text-sky-400 underline-offset-2 hover:underline"
                  >
                    {item.linkLabel ?? '来源链接'} ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </div>
  );
}
