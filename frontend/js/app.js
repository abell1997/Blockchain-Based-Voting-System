document.addEventListener('DOMContentLoaded', () => {
    // Current User Session Key (Keep for session persistence)
    const CURRENT_USER_KEY = 'votechain_current_user';

    // Helper: Show Notification
    function showNotification(message, type = 'success', redirectUrl = null) {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';

            // Hide after 3 seconds
            setTimeout(() => {
                notification.style.display = 'none';
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }, 3000);
        } else {
            // Fallback if element missing
            alert(message);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }
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
    else if(path.endsWith('create-poll.html')){
        checkAuth('admin');
        handleCreatePoll();
    }

    // Authentication Functions
    function handleLogin(){
        const loginForm = document.getElementById('loginForm');
        if (loginForm){
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;

                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
                        const redirect = data.user.role === 'admin' ? 'admin-dashboard.html' : 'voter-dashboard.html';
                        showNotification('Login successful! Redirecting...', 'success', redirect);
                    } else {
                        showNotification(data.message || 'Login failed', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showNotification('Login error occurred', 'error');
                }
            });
        }
    }

    function handleRegister(){
        const registerForm = document.getElementById('registerForm');
        if (registerForm){
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fullName = e.target.fullname.value;
                const email = e.target.email.value;
                const password = e.target.password.value;
                const role = e.target.role.value;

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  //To validate email format
                if (!emailRegex.test(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }


                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fullName, email, password, role })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showNotification('Registration successful! Please login.', 'success', 'login.html');
                    } else {
                        showNotification(data.message || 'Registration failed', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showNotification('Registration error', 'error');
                }
            });
        }
    }

    function checkAuth(requiredRole, redirectIfFail = true){
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (!currentUser) {
            if (redirectIfFail) window.location.href = 'login.html';
            return;
        }

        if(requiredRole && currentUser.role !== requiredRole){
            showNotification('Access Denied', 'error');
            setTimeout(() => {
                window.location.href = currentUser.role === 'admin' ? 'admin-dashboard.html' : 'voter-dashboard.html';
            }, 1000);
            return;
        }

        // Setup Logout Button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem(CURRENT_USER_KEY);
                window.location.href = 'login.html';
            });
        }

        // Display User Name/Email
        const userNameDisplay = document.getElementById('userName');
        if (userNameDisplay) userNameDisplay.textContent = currentUser.fullName || currentUser.email;

        const userEmailDisplay = document.getElementById('userEmail');
        if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;
    }

    // Dashboard Functions
    function handleVoterDashboard() {
        // Future: Fetch if user has voted status?
    }

    async function handleAdminDashboard() {
        try {
            const response = await fetch('/api/results');
            const votes = await response.json(); // Expecting { "Candidate A": 0, ... }

            // Populate total votes
            const totalVotesElement = document.getElementById('totalVotes');
            if (totalVotesElement && votes) {
                const total = Object.values(votes).reduce((a, b) => a + b, 0);
                totalVotesElement.innerText = total.toLocaleString();
            }

            const resultsContainer = document.getElementById('voteResults');
            if (resultsContainer) {
                resultsContainer.style.display = 'block'; // Make visible
                resultsContainer.innerHTML = '';
                for (const [candidate, count] of Object.entries(votes)) {
                    const div = document.createElement('div');
                    div.className = 'candidate-card';
                    // Inline styling or class from style.css
                    div.style.border = '1px solid hsl(0, 0%, 87%)';
                    div.style.padding = '10px';
                    div.style.marginBottom = '5px';
                    div.style.borderRadius = '4px';
                    div.innerHTML = `<strong>${candidate}</strong> <span>${count} votes</span>`;
                    resultsContainer.appendChild(div);
                }
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    }

    function handleVotePage() {
        const voteForm = document.getElementById('voteForm');
        if (voteForm) {
            voteForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const selectedCandidate = e.target.candidate.value; // "Candidate A"
                const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

                if (!currentUser) return;

                try {
                    const response = await fetch('/api/vote', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            voterId: currentUser.id, 
                            candidate: selectedCandidate 
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showNotification(`You voted for ${selectedCandidate}`, 'success', 'voter-dashboard.html');
                    } else {
                        showNotification(data.message || 'Voting failed', 'error');
                    }
                } catch (error) {
                    console.error('Error voting:', error);
                    showNotification('Error casting vote', 'error');
                }
            });
        }
    }

    // New: Handle Create Poll Page Logic
    function handleCreatePoll() {
        const addCandidateBtn = document.getElementById('addCandidateBtn');
        const container = document.getElementById('candidatesContainer');

        if (addCandidateBtn && container) {
            addCandidateBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = 'candidate[]';
                input.placeholder = 'Candidate Name';
                input.className = 'candidate-input';
                input.style.marginBottom = '0.5rem';
                input.required = true;
                container.appendChild(input);
            });
        }

        const createPollForm = document.getElementById('createPollForm');
        if (createPollForm) {
            createPollForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Collect Data
                const title = document.getElementById('pollTitle').value;
                const candidateInputs = document.querySelectorAll('input[name="candidate[]"]');
                const candidates = Array.from(candidateInputs).map(input => input.value).filter(val => val.trim() !== "");

                if (candidates.length < 2) {
                    showNotification("Please provide at least 2 candidates", "error");
                    return;
                }

                // In a real app, we'd send this to the backend
                console.log("Creating Poll:", title, candidates);
                
                // Simulation for Prototype
                showNotification("Poll Created Successfully!", "success", "admin-dashboard.html");
            });
        }
    }
});
