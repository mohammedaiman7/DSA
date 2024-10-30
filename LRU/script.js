class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (this.cache.has(key)) {
            // Move to the front to mark as most recently used
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return -1; // Key not found
    }

    put(key, value) {
        if (this.cache.has(key)) {
            // Delete and reinsert to mark as most recently used
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Remove least recently used (first inserted) element
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
        this.displayCache();
    }

    displayCache() {
        const cacheDisplay = document.getElementById('cache-display');
        cacheDisplay.innerHTML = ''; // Clear current display

        this.cache.forEach((value, key) => {
            const item = document.createElement('div');
            item.textContent = key;
            cacheDisplay.appendChild(item);
        });
    }
}

const cache = new LRUCache(3); // Set capacity of the cache

function addToCache() {
    const input = document.getElementById('input').value.toUpperCase();
    if (input) {
        cache.put(input, input); // Use key-value as the same in this simulation
        log(`Inserted/Accessed: ${input}`);
        document.getElementById('input').value = ''; // Clear input
    }
}

function log(message) {
    const logDiv = document.getElementById('log');
    logDiv.textContent = message;
}
