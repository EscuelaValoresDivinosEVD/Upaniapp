import { Redis } from '@upstash/redis'

// Lazy singleton so build-time import doesn't fail when env vars are absent
let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) _redis = Redis.fromEnv()
  return _redis
}
