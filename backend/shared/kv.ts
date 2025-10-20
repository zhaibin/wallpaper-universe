// KV cache helpers
export async function kvGet(kv: KVNamespace | undefined, key: string) {
  if (!kv) return null;
  return await kv.get(key);
}
export async function kvPut(kv: KVNamespace | undefined, key: string, value: string, ttlSec?: number) {
  if (!kv) return;
  await kv.put(key, value, ttlSec ? { expirationTtl: ttlSec } : {});
}
