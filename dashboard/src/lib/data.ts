import type { AssetCard, LoadedEntity, Manifest, Registry } from '../types';

const DATA_BASE = './data';

export interface WorkspaceData {
  entities: LoadedEntity[];
  syncedAt: string | null;
  loadError: string | null;
}

export async function loadWorkspace(): Promise<WorkspaceData> {
  try {
    const [regRes, manRes] = await Promise.all([
      fetch(`${DATA_BASE}/workspace.json`),
      fetch(`${DATA_BASE}/manifest.json`).catch(() => null),
    ]);
    if (!regRes.ok) throw new Error(`workspace.json 加载失败（HTTP ${regRes.status}）`);
    const registry = (await regRes.json()) as Registry;
    const manifest = manRes && manRes.ok ? ((await manRes.json()) as Manifest) : null;
    const copiedMap = new Map(manifest?.entities.map((e) => [e.id, e.copied]) ?? []);
    const entities = (registry.entities ?? [])
      .map((e) => ({ ...e, copied: copiedMap.get(e.id) ?? false }))
      .sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false) || b.updated.localeCompare(a.updated));
    return { entities, syncedAt: manifest?.syncedAt ?? null, loadError: null };
  } catch (err) {
    return {
      entities: [],
      syncedAt: null,
      loadError: err instanceof Error ? err.message : String(err),
    };
  }
}

export function entityBase(entity: LoadedEntity): string {
  return `${DATA_BASE}/entities/${entity.folder}`;
}

export async function loadAssetCard(entity: LoadedEntity, stepPath: string): Promise<AssetCard> {
  const res = await fetch(`${entityBase(entity)}/${stepPath}`);
  if (!res.ok) throw new Error(`卡片加载失败（HTTP ${res.status}）：${stepPath}`);
  const card = (await res.json()) as AssetCard;
  if (card.format !== 'gws-asset-card') throw new Error(`不支持的卡片格式：${card.format}`);
  return card;
}

export async function loadMarkdown(entity: LoadedEntity, stepPath: string): Promise<string> {
  const res = await fetch(`${entityBase(entity)}/${stepPath}`);
  if (!res.ok) throw new Error(`文档加载失败（HTTP ${res.status}）：${stepPath}`);
  return res.text();
}

/** 卡片条目图片的完整地址（相对卡片文件解析） */
export function cardImageUrl(entity: LoadedEntity, stepPath: string, image: string): string {
  const dir = stepPath.includes('/') ? stepPath.slice(0, stepPath.lastIndexOf('/')) : '';
  return `${entityBase(entity)}/${dir ? `${dir}/` : ''}${image}`;
}
