// Intencao temporaria, nunca modifica projetos automaticamente.
export const PENDING_STUDIO_COLOR_KEY = 'prorevest:pending-studio-color';

export type PendingStudioColor = { name: string; hex: string; code?: string; createdAt: number };

export function savePendingStudioColor(color: { name: string; hex: string; code?: string }): boolean {
  if (typeof window === 'undefined' || !/^#[0-9a-f]{6}$/i.test(color.hex)) return false;
  try {
    sessionStorage.setItem(PENDING_STUDIO_COLOR_KEY, JSON.stringify({
      name: color.name.slice(0, 120), hex: color.hex, code: color.code?.slice(0, 60), createdAt: Date.now()
    }));
    return true;
  } catch { return false; }
}

export function readPendingStudioColor(): PendingStudioColor | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PENDING_STUDIO_COLOR_KEY);
    if (!raw) return null;
    const color = JSON.parse(raw) as PendingStudioColor;
    if (!color || !/^#[0-9a-f]{6}$/i.test(color.hex) || typeof color.name !== 'string' ||
      !Number.isFinite(color.createdAt) || Date.now() - color.createdAt > 24 * 60 * 60 * 1000) {
      sessionStorage.removeItem(PENDING_STUDIO_COLOR_KEY);
      return null;
    }
    return color;
  } catch { return null; }
}

export function clearPendingStudioColor() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(PENDING_STUDIO_COLOR_KEY);
}
