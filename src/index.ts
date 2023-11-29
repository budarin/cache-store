export class CacheStore {
    private storeName: string;

    constructor(storeName: string) {
        this.storeName = storeName;
    }

    async setItem(key: string, json: object): Promise<void> {
        const cache = await globalThis.caches.open(this.storeName);
        const response = new Response(JSON.stringify(json), {
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
            return response.json();
        }

        return {};
    }

    async removeItem(key: string): Promise<boolean> {
        const cache = await globalThis.caches.open(this.storeName);

        return await cache.delete(key);
    }

    static async removeStore(storeName: string): Promise<boolean> {
        return await globalThis.caches.delete(storeName);
    }
}
