// File-backed storage shim — calls the Vite dev server storage API
// Data persists to disk in the data/ directory as JSON files
export const storage = {
  async get(key: string): Promise<{ value: string } | null> {
    const res = await fetch(`/storage/${encodeURIComponent(key)}`);
    if (res.status === 404) return null;
    return res.json();
  },

  async set(key: string, value: string): Promise<void> {
    await fetch(`/storage/${encodeURIComponent(key)}`, {
      method: "PUT",
      body: value,
    });
  },

  async list(prefix: string): Promise<{ keys: string[] }> {
    const res = await fetch(`/storage?prefix=${encodeURIComponent(prefix)}`);
    return res.json();
  },
};
