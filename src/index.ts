export interface Logger {
    debug: (...data: unknown[]) => void;
}

const fakeLogger: Logger = {
    debug: () => {},
};

export class CacheStore {
    private storeName: string;

    logger: Logger;

    constructor(storeName: string, logger: Logger = fakeLogger) {
        this.storeName = storeName;
        this.logger = logger;
    }

    async setItem(key: string, item: object): Promise<void> {
        this.logger.debug('saveItem:', 'key:', key, 'item:', item);

        const cache = await globalThis.caches.open(this.storeName);
        const response = new Response(JSON.stringify(item), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        await cache.put(key, response);
    }

    async getItem(key: string): Promise<object> {
        const cache = await globalThis.caches.open(this.storeName);
        const response = await cache.match(key);

        if (response) {
            const item = await response.json();

            this.logger.debug('getItem:', 'key:', key, 'item:', item);

            return item;
        }

        this.logger.debug('getItem:', 'key:', key, 'item:', {});
        return {};
    }

    async removeItem(key: string): Promise<boolean> {
        this.logger.debug('removeItem:', 'key:', key);

        const cache = await globalThis.caches.open(this.storeName);

        return await cache.delete(key);
    }

    async clear(storeName: string): Promise<boolean> {
        this.logger.debug('clear storage');

        return await globalThis.caches.delete(storeName);
    }
}
