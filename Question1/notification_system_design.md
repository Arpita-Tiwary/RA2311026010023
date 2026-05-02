# Stage 1

We need an efficient approach to display the top 10 most important unread notifications from a continuous stream. 

Priority is determined by:
1. Category Weight: Placement (3) > Result (2) > Event (1).
2. Recency: If weights are equal, newer notifications take priority.

To maintain the top 10 efficiently without sorting the entire dataset repeatedly (which would be slow for continuous streams), we utilize a Min-Heap (Priority Queue) restricted to a maximum size of 10 (`K = 10`).

When a new notification arrives:
1. If the heap has fewer than 10 elements, we insert it.
2. If the heap has exactly 10 elements, we compare the new notification with the root of the Min-Heap (the lowest priority element among the top 10).
3. If the new notification has a higher priority than the root, we remove the root and insert the new notification. 

Time Complexity: O(N log K), where N is the number of notifications and K is 10. Since K is constant, the time complexity per insertion is O(1).
Space Complexity: O(K), keeping memory footprint minimal and constant regardless of the stream size.
