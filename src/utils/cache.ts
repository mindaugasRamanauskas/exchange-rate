import logger from './logger';

interface CacheItem<T> {
    value: T,
    timestamp?: number,
}

export default class LRUCache<T> {
    private readonly capacity: number;
    private cache: Map<string, CacheItem<T>>;

    constructor() {
        this.capacity = parseInt(process.env.CACHE_SIZE, 10) || 1000;
        this.cache = new Map<string, CacheItem<T>>();

        // Time to live in seconds, defaults to 180 minutes
        const ttl = parseInt(process.env.CACHE_ITEM_TTL) || 10800;

        setInterval(() => this.evictCacheItems(ttl), 
            ttl * 1000);
    }

    public set(key: string, value: T): void {
        const lowerKey = key.trim().toLowerCase();

        if (this.cache.size >= this.capacity) {
            const leastUsed = this.cache.keys().next().value;
            this.cache.delete(leastUsed);
        }

        this.cache.set(lowerKey, {
            value,
            timestamp: Date.now(),
        });
    }

    public get(key: string): T | undefined {
        const lowerKey = key.trim().toLowerCase();

        const cacheItem = this.cache.get(lowerKey);

        if (cacheItem) {
            this.cache.delete(lowerKey);
            this.cache.set(lowerKey, {
                ...cacheItem,
                timestamp: Date.now()
            });
        }

        return cacheItem?.value;
    }

    public evictCache(): void {
        this.cache.clear();
    }

    private evictCacheItems(itemTtl: number): void {
        if (this.cache.size === 0) {
            return;
        }

        this.cache.forEach((cacheItem, key) => {
            if (cacheItem.timestamp && (Date.now() - cacheItem.timestamp) > itemTtl * 1000) {
                logger.info(`${key} cache items has expired, removing...`);
                this.cache.delete(key);
            }
        });
    }
}