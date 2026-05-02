# SRM Full Stack Engineering Challenge - Frontend Track

This repository contains the complete implementation for the SRM Full Stack Engineering Challenge, focusing on the Frontend track.

## Project Structure

The project is cleanly divided into the required modules:

- **`logging_middleware/`**: Contains the custom logging utility implemented during the Pre-Test Setup. It handles authenticated POST requests to the remote evaluation server to securely log application events, errors, and status updates.
- **`Question1/` (Stage 1)**: Contains the algorithmic implementation for the Priority Inbox. It utilizes a highly efficient Min-Heap data structure to maintain the top 10 most important notifications based on weight (`Placement` > `Result` > `Event`) and recency, running in O(N log K) time.
- **`Question2/` (Stage 2)**: Contains the full React Frontend Application.

## React Application Features (Stage 2)

The frontend application was built from scratch without the use of prohibited CSS libraries (like Tailwind or ShadCN). It uses pure Native CSS to achieve a modern, premium glassmorphism design.

- **Dynamic Data Fetching**: Communicates with the remote evaluation API to fetch and render notifications.
- **Priority Inbox**: Implements the algorithm from Stage 1 to dynamically filter, sort, and display the highest priority notifications.
- **Filtering & Pagination**: Users can filter notifications by category and seamlessly page through the data.
- **State Management**: Tracks read/unread status of notifications and updates the UI accordingly.
- **Middleware Integration**: Deeply integrated with the `logging_middleware` to record all component mounts, API requests, and user actions (such as marking a message as read).

## Demonstration Video

**▶️ [Watch the Application Walkthrough here](INSERT_YOUR_GOOGLE_DRIVE_LINK_HERE)**

*(The video demonstrates the desktop view, the mobile responsive view, the pagination, filtering, and the unread notification state updates).*

## How to Run Locally

1. Clone the repository.
2. Navigate to the `Question2/` directory:
   ```bash
   cd Question2
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.
