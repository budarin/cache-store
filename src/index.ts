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

        const fakeUrl = new URL(key, location.origin);
        const request = new Request(fakeUrl.toString());

        await cache.put(request, response);
    }

    async getItem(key: string): Promise<object> {
        const cache = await globalThis.caches.open(this.storeName);
        const fakeUrl = new URL(key, location.origin);
        const response = await cache.match(fakeUrl.toString());

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
        const fakeUrl = new URL(key, location.origin);
        return await cache.delete(fakeUrl.toString());
    }

    async clear(storeName: string): Promise<boolean> {
        this.logger.debug('clear storage');

        return await globalThis.caches.delete(storeName);
    }
}
