export interface MediaSlotConfig {
  slotId: string;
  label: string;
  meta: string;
  type: 'image' | 'video';
  src?: string;
  alt?: string;
}

export const MEDIA_SLOTS: Record<string, MediaSlotConfig> = {
  'home-hero-bg': { slotId: 'home-hero-bg', label: 'HOME HERO BACKGROUND', meta: 'Video or image, 1920x1080 minimum', type: 'image', src: '/images/home-hero.webp', alt: 'Ocean sunset with golden light reflecting off dark water' },
  'home-section-3-image': { slotId: 'home-section-3-image', label: 'EDITORIAL IMAGE', meta: 'Portrait or landscape, 1200px min', type: 'image', src: '/images/home-editorial.webp', alt: 'Kerri Bridgman at a Tulum resort in white shirt and black shorts' },
  'home-tier-op': { slotId: 'home-tier-op', label: 'OPERATIONAL PARTNERSHIP', meta: 'Card image, 800x600', type: 'image', src: '/images/tier-op.webp', alt: 'Harbor at sunset with silhouetted coastline' },
  'home-tier-sa': { slotId: 'home-tier-sa', label: 'STRATEGIC ALIGNMENT', meta: 'Card image, 800x600', type: 'image', src: '/images/tier-sa.webp', alt: 'Ancient ruins framed by cypress trees at sunset' },
  'home-tier-ss': { slotId: 'home-tier-ss', label: 'STUDIO SYSTEMS', meta: 'Card image, 800x600', type: 'image', src: '/images/tier-ss.webp', alt: 'Latte art on a sandy beach with ocean rocks' },
  'work-hero-bg': { slotId: 'work-hero-bg', label: 'WORK WITH OCEO LUXE HERO', meta: 'Image, 1920x1080 minimum', type: 'image', src: '/images/work-hero.webp', alt: 'Beach club at dusk with palm silhouettes and ocean horizon' },
  'op-hero-bg': { slotId: 'op-hero-bg', label: 'OPERATIONAL PARTNERSHIP HERO', meta: 'Image, 1920x1080 minimum', type: 'image', src: '/images/op-hero.webp', alt: 'Bali rice paddies at sunset with palm silhouettes reflected in water' },
  'op-mid-image': { slotId: 'op-mid-image', label: 'EDITORIAL IMAGE', meta: 'Visual break, 1200px min width', type: 'image', src: '/images/op-editorial.webp', alt: 'Working on laptop in a tropical outdoor setting' },
  'align-hero-bg': { slotId: 'align-hero-bg', label: 'STRATEGIC ALIGNMENT HERO', meta: 'Image, 1920x1080 minimum', type: 'image', src: '/images/align-hero.webp', alt: 'Croatian waterfront town with mountain backdrop' },
  'align-mid-image': { slotId: 'align-mid-image', label: 'EDITORIAL IMAGE', meta: 'Visual break, 1200px min width', type: 'image', src: '/images/align-editorial.webp', alt: 'Journal and coffee on a sandy beach with ocean view' },
  'studio-hero-bg': { slotId: 'studio-hero-bg', label: 'STUDIO SYSTEMS HERO', meta: 'Image, 1920x1080 minimum', type: 'image', src: '/images/studio-hero.webp', alt: 'Dual-screen workspace overlooking palm trees and turquoise ocean' },
  'about-hero-bg': { slotId: 'about-hero-bg', label: 'ABOUT HERO BACKGROUND', meta: 'Image, 1920x1080 minimum', type: 'image', src: '/images/about-hero.webp', alt: 'Tropical sunset with palm silhouettes reflected in infinity pool' },
  'about-portrait': { slotId: 'about-portrait', label: 'PORTRAIT', meta: 'As provided, do not crop', type: 'image', src: '/images/Kerri-11.webp', alt: 'Kerri Bridgman, founder of Oceo Luxe' },
  'apply-hero-bg': { slotId: 'apply-hero-bg', label: 'APPLY HERO BACKGROUND', meta: 'Image, 1920x1080 minimum', type: 'image', src: '/images/apply-hero.webp', alt: 'Wooden boardwalk leading toward the turquoise ocean' },
};
