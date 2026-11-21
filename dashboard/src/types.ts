// 与 docs/registry.schema.json、docs/asset-card.schema.json 对齐的类型定义

export interface RegistryStep {
  name: string;
  path: string;
  viewer?: 'card' | 'html' | 'md';
}

export interface RegistryEntity {
  id: string;
  title: string;
  description?: string;
  type: 'project' | 'asset-card' | 'research' | 'note';
  category?: string;
  created: string;
  updated: string;
  folder: string;
  status: 'active' | 'archived';
  pinned?: boolean;
  engine?: string;
  steps?: RegistryStep[];
}

export interface Registry {
  version: number;
  entities: RegistryEntity[];
}

export type CardStatus = 'idea' | 'in-progress' | 'review' | 'done' | 'archived';

export interface CardItem {
  id: string;
  title: string;
  body?: string;
  image?: string;
  alt?: string;
  prompt?: string;
  url?: string;
  linkLabel?: string;
  license?: string;
  status?: CardStatus;
  tags?: string[];
}

export interface AssetCard {
  format: 'gws-asset-card';
  version: number;
  template: 'gallery' | 'research';
  title: string;
  summary?: string;
  assetType?: string;
  items: CardItem[];
}

export interface Manifest {
  syncedAt: string;
  entities: { id: string; folder: string; copied: boolean }[];
}

/** 运行时装配好的实体：注册表条目 + 磁盘内容可用性 */
export interface LoadedEntity extends RegistryEntity {
  copied: boolean;
}

export function stepViewer(step: RegistryStep): 'card' | 'md' | 'html' | 'other' {
  if (step.viewer === 'card' || step.path.endsWith('.card.json')) return 'card';
  if (step.viewer === 'md' || step.path.endsWith('.md')) return 'md';
  if (step.viewer === 'html' || step.path.endsWith('.html')) return 'html';
  return 'other';
}
