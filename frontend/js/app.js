document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const USERS_KEY = 'votechain_users';
    const CURRENT_USER_KEY = 'votechain_current_user';
    const VOTES_KEY = 'votechain_votes';

    // Initialize Mock Data if empty
    if(!localStorage.getItem(USERS_KEY)){
        const initialUsers = [
            { fullname: 'System Admin', email: 'admin@example.com', password: 'password', role: 'admin' },
            { fullname: 'Test Voter', email: 'voter@example.com', password: 'password', role: 'voter' }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }

    if(!localStorage.getItem(VOTES_KEY)){
        localStorage.setItem(VOTES_KEY, JSON.stringify({ 'Candidate A': 0, 'Candidate B': 0, 'Candidate C': 0 }));
    }

    // Router / Page Logic
    const path = window.location.pathname;

    if(path.endsWith('login.html')){
        handleLogin();
    } 
    else if(path.endsWith('register.html')){
        handleRegister();
    }
     else if(path.endsWith('voter-dashboard.html')){
        checkAuth('voter');
        handleVoterDashboard();
    }
     else if(path.endsWith('admin-dashboard.html')){
        checkAuth('admin');
        handleAdminDashboard();
    }
     else if(path.endsWith('vote.html')){
        checkAuth('voter');
        handleVotePage();
    }

    // Authentication Functions
    function handleLogin(){
        const loginForm = document.getElementById('loginForm');
        if (loginForm){loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;

                const users = JSON.parse(localStorage.getItem(USERS_KEY));
                const user = users.find(u => u.email === email && u.password === password);

                if (user){
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                    if(user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else{
                        window.location.href = 'voter-dashboard.html';
                    }
                } else{
                    alert('Invalid credentials');
                }
            });
        }
    }

    function handleRegister(){
        const registerForm = document.getElementById('registerForm');
        if (registerForm){
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fullname = e.target.fullname.value;
                const email = e.target.email.value;
                const password = e.target.password.value;
                const role = e.target.role.value;

                const users = JSON.parse(localStorage.getItem(USERS_KEY));

                if(users.some(u => u.email === email)){
                    alert('Email already registered');
                    return;
                }

                users.push({ fullname, email, password, role });
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            });
        }
    }

    function checkAuth(requiredRole){
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Simple role check. Admin can access "admin" pages. Voter can access "voter" pages.
        // In a real app, logic might be more complex.
        if(requiredRole && currentUser.role !== requiredRole){
            alert('Access Denied');
            window.location.href = currentUser.role === 'admin' ? 'admin-dashboard.html' : 'voter-dashboard.html';
        }

        // Setup Logout Button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem(CURRENT_USER_KEY);
                window.location.href = 'login.html';
            });
        }

        // Display User Name
        const userNameDisplay = document.getElementById('userName');
        if (userNameDisplay) {
             userNameDisplay.textContent = currentUser.fullname || currentUser.email;
        }

        // Display User Email (For new dashboards)
        const userEmailDisplay = document.getElementById('userEmail');
        if (userEmailDisplay) {
            userEmailDisplay.textContent = currentUser.email;
        }
    }

    // Dashboard Functions
    function handleVoterDashboard() {
        // Just navigation logic mostly
    }

    function handleAdminDashboard() {
        const votes = JSON.parse(localStorage.getItem(VOTES_KEY));
        
        // Populate total votes
        const totalVotesElement = document.getElementById('totalVotes');
        if (totalVotesElement && votes) {
            const total = Object.values(votes).reduce((a, b) => a + b, 0);
            totalVotesElement.innerText = total.toLocaleString();
        }

        const resultsContainer = document.getElementById('voteResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            for (const [candidate, count] of Object.entries(votes)) {
                const div = document.createElement('div');
                div.className = 'candidate-card';
                div.innerHTML = `<strong>${candidate}</strong> <span>${count} votes</span>`;
                resultsContainer.appendChild(div);
            }
        }
    }

    function handleVotePage() {
        const voteForm = document.getElementById('voteForm');
        if (voteForm) {
            voteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const selectedCandidate = e.target.candidate.value;
                
                const votes = JSON.parse(localStorage.getItem(VOTES_KEY));
                if (votes[selectedCandidate] !== undefined) {
                    votes[selectedCandidate]++;
                    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
                    alert(`You voted for ${selectedCandidate}`);
                    window.location.href = 'voter-dashboard.html';
                } else {
                    alert('Invalid candidate');
                }
            });
        }
    }
});
