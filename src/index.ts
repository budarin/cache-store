export class CacheStore {
    private storeName: string;

    constructor(storeName: string) {
        this.storeName = storeName;
    }

    async setData(key: string, json: object): Promise<void> {
        const cache = await globalThis.caches.open(this.storeName);
        const response = new Response(JSON.stringify(json), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        await cache.put(key, response);
    }

    async getData(key: string): Promise<object> {
        const cache = await globalThis.caches.open(this.storeName);
        const response = await cache.match(key);

        if (response) {
            return response.json();
        }

        return {};
    }

    async removeData(key: string): Promise<boolean> {
        const cache = await globalThis.caches.open(this.storeName);

        return await cache.delete(key);
    }
}
