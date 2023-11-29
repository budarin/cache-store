export interface Logger {
    debug: (...data: unknown[]) => void;
}

export class CacheStore {
    private storeName: string;

    logger: Logger;

    constructor(storeName: string, logger: Logger) {
        this.storeName = storeName;
        this.logger = logger;
    }

    async setItem(key: string, item: object): Promise<void> {
        this.logger.debug('[ CACHE STORE ]', 'saveItem:', 'key:', key, 'item:', `"${item}"`);

        const cache = await globalThis.caches.open(this.storeName);
        const response = new Response(JSON.stringify(item), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        await cache.put(key, response);
    }

    async getItem(key: string): Promise<object> {
        this.logger.debug('[ CACHE STORE ]', 'getItem:', 'key:', key);

        const cache = await globalThis.caches.open(this.storeName);
        const response = await cache.match(key);

        if (response) {
            return response.json();
        }

        return {};
    }

    async removeItem(key: string): Promise<boolean> {
        this.logger.debug('[ CACHE STORE ]', 'removeItem:', 'key:', key);

        const cache = await globalThis.caches.open(this.storeName);

        return await cache.delete(key);
    }

    async clear(storeName: string): Promise<boolean> {
        this.logger.debug('[ CACHE STORE ]', 'clear storage');

        return await globalThis.caches.delete(storeName);
    }
}
