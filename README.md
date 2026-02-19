# Research Team Survey Project

This project implements a survey platform for the Research Team, focusing on "Secure AI Code Generation Framework".

## Features

-   **Unified Navigation**: Consistent header and navigation across `index.html`, `survey.html`, and `guidance.html`.
-   **Theme Toggle**: Light/Dark mode support.
-   **Survey Form**: Comprehensive questionnaire with validation and Likert scales.
-   **Guidance Page**: Supplementary information and best practices tables.
-   **Node.js Backend**: Express.js server to handle survey submissions and store them in MongoDB.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

## Setup

1.  **Clone or Navigate to the project directory:**
    ```bash
    https://github.com/whis-19/research-team.git
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory (if not already present) with your MongoDB credentials:
    ```env
    MONGO_URI=mongodb://localhost:27017/
    DB_NAME=research_survey
    COLLECTION_NAME=responses
    PORT=5000
    ```

4.  **Start the Server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5000` (or your configured PORT).

## Usage

-   Open your browser and navigate to `http://localhost:5000`.
-   Navigate to the **Survey** page to fill out the form.
-   Submissions are automatically saved to your MongoDB database.

## Project Structure

-   `server.js`: Main backend entry point (Express & MongoDB).
-   `index.html`: Home page.
-   `survey.html`: Survey form page.
-   `guidance.html`: Informational page.
-   `init_db.py`: (Deprecated) Python initialization script.
