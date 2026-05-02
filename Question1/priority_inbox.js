import fs from "fs";
import { Log, setAuthToken } from "../logging_middleware/index.js";

import { fileURLToPath } from 'url';

const envPath = new URL('../.env', import.meta.url);
const env = fs.readFileSync(envPath, "utf8");
const tokenMatch = env.match(/AUTH_TOKEN=(.*)/);
if (tokenMatch) {
    setAuthToken(tokenMatch[1].trim());
}

class MinHeap {
    constructor() {
        this.heap = [];
    }
    push(val) {
        this.heap.push(val);
        this.bubbleUp(this.heap.length - 1);
    }
    pop() {
        if (this.heap.length === 1) return this.heap.pop();
        const top = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.sinkDown(0);
        return top;
    }
    peek() {
        return this.heap[0];
    }
    size() {
        return this.heap.length;
    }
    bubbleUp(idx) {
        const element = this.heap[idx];
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            const parent = this.heap[parentIdx];
            if (this.compare(element, parent) >= 0) break;
            this.heap[idx] = parent;
            this.heap[parentIdx] = element;
            idx = parentIdx;
        }
    }
    sinkDown(idx) {
        const length = this.heap.length;
        const element = this.heap[idx];
        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.heap[leftChildIdx];
                if (this.compare(leftChild, element) < 0) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.heap[rightChildIdx];
                if ((swap === null && this.compare(rightChild, element) < 0) || 
                    (swap !== null && this.compare(rightChild, leftChild) < 0)) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.heap[idx] = this.heap[swap];
            this.heap[swap] = element;
            idx = swap;
        }
    }
    compare(a, b) {
        if (a.weight !== b.weight) {
            return a.weight - b.weight; 
        }
        return a.timestamp - b.timestamp; 
    }
}

const WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

async function fetchNotifications() {
    await Log("backend", "info", "handler", "Starting notification fetch");
    const res = await fetch("http://20.207.122.201/evaluation-service/notifications", {
        headers: { "Authorization": `Bearer ${tokenMatch[1].trim()}` }
    });
    if (!res.ok) {
        await Log("backend", "error", "handler", `Fetch failed with status ${res.status}`);
        throw new Error("Failed to fetch");
    }
    const data = await res.json();
    await Log("backend", "info", "handler", "Successfully fetched notifications");
    return data.notifications;
}

async function run() {
    try {
        const notifications = await fetchNotifications();
        const heap = new MinHeap();
        
        await Log("backend", "info", "handler", "Processing notifications");
        
        for (const n of notifications) {
            const weight = WEIGHTS[n.Type] || 0;
            const ts = new Date(n.Timestamp).getTime();
            const item = { ...n, weight, timestamp: ts };
            
            if (heap.size() < 10) {
                heap.push(item);
            } else {
                if (heap.compare(item, heap.peek()) > 0) {
                    heap.pop();
                    heap.push(item);
                }
            }
        }
        
        const top10 = [];
        while (heap.size() > 0) {
            top10.push(heap.pop());
        }
        top10.reverse();
        
        console.log("TOP 10 PRIORITY NOTIFICATIONS:");
        top10.forEach((n, i) => {
            console.log(`${i + 1}. [${n.Type}] ${n.Message} (${n.Timestamp})`);
        });
        await Log("backend", "info", "handler", "Successfully processed top 10 notifications");

    } catch (e) {
        await Log("backend", "error", "handler", e.message);
    }
}

run();
