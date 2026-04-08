// NexLabel Main JavaScript

// Demo Users - Later this connects to Supabase
const users = [
    { email: "owner@nexxlabel.com", password: "owner123", role: "owner", name: "Erwin" },
    { email: "subowner@nexxlabel.com", password: "sub123", role: "subowner", name: "Mark" },
    { email: "approver@nexxlabel.com", password: "approver123", role: "approver", name: "Anna" },
    { email: "reviewer@nexxlabel.com", password: "reviewer123", role: "reviewer", name: "Sarah" },
    { email: "annotator@nexxlabel.com", password: "annotator123", role: "annotator", name: "John" },
    { email: "client@nexxlabel.com", password: "client123", role: "client", name: "Acme Corp" }
];

// Handle Login
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        errorMsg.style.display = 'block';
        return;
    }

    // Save user to session
    sessionStorage.setItem('user', JSON.stringify(user));

    // Redirect based on role
    switch(user.role) {
        case 'owner':
            window.location.href = 'dashboard/owner.html';
            break;
        case 'subowner':
            window.location.href = 'dashboard/owner.html';
            break;
        case 'approver':
            window.location.href = 'dashboard/approver.html';
            break;
        case 'reviewer':
            window.location.href = 'dashboard/reviewer.html';
            break;
        case 'annotator':
            window.location.href = 'dashboard/annotator.html';
            break;
        case 'client':
            window.location.href = 'dashboard/client.html';
            break;
        default:
            errorMsg.style.display = 'block';
    }
}

// Get Current User
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
}

// Logout
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = '../login.html';
}

// Protect Dashboard Pages
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '../login.html';
    }
    return user;
}

// Allow Enter Key on Login
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    });
});