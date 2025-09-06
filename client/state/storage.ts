const PREFIX = "ecofinds";

function k(key: string) {
  return `${PREFIX}:${key}`;
}

export function saveJSON<T>(key: string, value: T) {
  localStorage.setItem(k(key), JSON.stringify(value));
}

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function remove(key: string) {
  localStorage.removeItem(k(key));
}
