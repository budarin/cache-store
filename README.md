# cache-store

Service for storing json data in the browser cache.

The service is a simple alternative to IndexedDB, but without an overhead for the description of the structure and the ceremonies for updating and changing structure.

This storage is convenient both for direct storage of unstructured data in the form of JSON and as a common data storage shared by the client and the service worker.

## Instalation

```bash
yarn add @budarin/cache-store
```

## Usage

```ts
import { CacheStore } from '@budarin/cache-store';

const store = new CacheStore('kv-storage');
const usersStore = [
    {
        name: 'Ivan',
        age: 20,
    },
    {
        name: 'Petr',
        age: 21,
    },
];

await store.setData('users', usersStore);

const users = await store.getData('users');

users.forEach((user) => console.log(user));
```
