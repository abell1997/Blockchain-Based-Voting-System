# VoteChain - Blockchain-Based Voting Prototype

This Voting system is a simple prototype of a blockchain-based voting system. It demonstrates a simple voting process where votes are recorded on a mock blockchain to ensure integrity. This project separates the Frontend (Client) and Backend (Application/Blockchain Layer).

## 🚀 Purpose & Scope
This project serves as a proof-of-concept for a secure voting application.
*   **Authentication**: Users can register and log in as Voters or Admins.
*   **Voting**: Voters can cast a tamper-proof vote (stored in a mock blockchain).
*   **Results**: Real-time tallying of votes visible on the dashboards.
*   **Integrity**: Prevents double voting and invalid candidate selection.

>**Note**: This is a prototype. All data is stored in **memory** and will reset when the server restarts.

## ✨ Key Features
*   **User Authentication**: Simple email/password login (Mocked/In-memory).
*   **Role-Based Access**:
    *   **Admin**: View total votes and simulate creating polls.
    *   **Voter**: Cast a single vote for a candidate.
*   **Mock Blockchain**: A service that simulates mining blocks and verifying vote uniqueness.
*   **Responsive UI**: A clean, mobile-friendly interface built with vanilla HTML/CSS/JS.

## 🛠️ Technologies
*   **Frontend**: HTML, CSS, Vanilla JavaScript (Fetch API).
*   **Backend**: Node.js, Express.js.
*   **Storage**: In-memory JavaScript objects (for Users and Blockchain).

## 👥 Demo Accounts
You can use these demo accounts to test the application immediately:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` |
| **Voter** | `voter@example.com` | `password` |

## ⚙️ How to Run Locally

### Prerequisites
*   Node.js installed (v14+ recommended)

### Steps
1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node server.js
    ```
4.  Open your browser and visit:
    **`http://localhost:3000/login.html`**

## ⚠️ Limitations & Notes
*   **Data Persistence**: There is no database. Stopping the server wipes all users and votes.
*   **Poll Creation**: The "Create New Poll" feature in the Admin Dashboard is a UI simulation and does not persist new polls in this version.
*   **Security**: Passwords are stored in plain text for demonstration purposes. Do not use real passwords.
*   **Blockchain**: The "Blockchain" is a JavaScript array simulating a ledger structure (`mockBlockchain.js`).

---
