export interface MediaSlotConfig {
  slotId: string;
  label: string;
  meta: string;
  type: 'image' | 'video';
  src?: string;
  alt?: string;
}

export const MEDIA_SLOTS: Record<string, MediaSlotConfig> = {
  'home-hero-bg': { slotId: 'home-hero-bg', label: 'HOME HERO BACKGROUND', meta: 'Video or image, 1920x1080 minimum', type: 'video' },
  'home-section-3-image': { slotId: 'home-section-3-image', label: 'EDITORIAL IMAGE', meta: 'Portrait or landscape, 1200px min', type: 'image' },
  'home-tier-op': { slotId: 'home-tier-op', label: 'OPERATIONAL PARTNERSHIP', meta: 'Card image, 800x600', type: 'image' },
  'home-tier-sa': { slotId: 'home-tier-sa', label: 'STRATEGIC ALIGNMENT', meta: 'Card image, 800x600', type: 'image' },
  'home-tier-ss': { slotId: 'home-tier-ss', label: 'STUDIO SYSTEMS', meta: 'Card image, 800x600', type: 'image' },
  'work-hero-bg': { slotId: 'work-hero-bg', label: 'WORK WITH OCEO LUXE HERO', meta: 'Image, 1920x1080 minimum', type: 'image' },
  'op-hero-bg': { slotId: 'op-hero-bg', label: 'OPERATIONAL PARTNERSHIP HERO', meta: 'Image, 1920x1080 minimum', type: 'image' },
  'op-mid-image': { slotId: 'op-mid-image', label: 'EDITORIAL IMAGE', meta: 'Visual break, 1200px min width', type: 'image' },
  'align-hero-bg': { slotId: 'align-hero-bg', label: 'STRATEGIC ALIGNMENT HERO', meta: 'Image, 1920x1080 minimum', type: 'image' },
  'align-mid-image': { slotId: 'align-mid-image', label: 'EDITORIAL IMAGE', meta: 'Visual break, 1200px min width', type: 'image' },
  'studio-hero-bg': { slotId: 'studio-hero-bg', label: 'STUDIO SYSTEMS HERO', meta: 'Image, 1920x1080 minimum', type: 'image' },
  'about-hero-bg': { slotId: 'about-hero-bg', label: 'ABOUT HERO BACKGROUND', meta: 'Image, 1920x1080 minimum', type: 'image' },
  'about-portrait': { slotId: 'about-portrait', label: 'PORTRAIT', meta: 'As provided, do not crop', type: 'image', src: '/images/Kerri-11.webp', alt: 'Kerri Bridgman, founder of Oceo Luxe' },
  'apply-hero-bg': { slotId: 'apply-hero-bg', label: 'APPLY HERO BACKGROUND', meta: 'Image, 1920x1080 minimum', type: 'image' },
};
