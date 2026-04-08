// NexLabel Auth Handler

// Check if user is logged in
// Redirect to login if not
async function requireAuth() {
    const session = await getSession();
    if (!session) {
        window.location.href = '../login.html';
        return null;
    }
    const profile = await getCurrentProfile();
    if (!profile) {
        window.location.href = '../login.html';
        return null;
    }
    return profile;
}

// Check auth for root pages (login.html)
async function requireAuthRoot() {
    const session = await getSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    const profile = await getCurrentProfile();
    if (!profile) {
        window.location.href = 'login.html';
        return null;
    }
    return profile;
}

// Redirect after login based on role
function redirectByRole(role) {
    switch(role) {
        case 'owner':
        case 'subowner':
            window.location.href = 
                'dashboard/owner.html';
            break;
        case 'approver':
            window.location.href = 
                'dashboard/approver.html';
            break;
        case 'reviewer':
            window.location.href = 
                'dashboard/reviewer.html';
            break;
        case 'annotator':
            window.location.href = 
                'dashboard/annotator.html';
            break;
        case 'client':
            window.location.href = 
                'dashboard/client.html';
            break;
        default:
            window.location.href = 'login.html';
    }
}

// Load user info into page
function loadUserInfo(profile) {
    // Set name
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = profile.full_name;

    // Set welcome message
    const welcomeEl = document
        .getElementById('welcomeMsg');
    if (welcomeEl) {
        welcomeEl.textContent = 
            'Welcome back, ' + profile.full_name + '!';
    }

    // Set role badge
    const roleEl = document
        .getElementById('roleBadge');
    if (roleEl) {
        roleEl.textContent = 
            profile.role.charAt(0).toUpperCase() + 
            profile.role.slice(1);
    }
}

// Load notifications
async function loadNotifications(userId) {
    try {
        const notifs = await getNotifications(userId);
        const countEl = document
            .getElementById('notifCount');
        const listEl = document
            .getElementById('notifList');

        if (countEl) {
            countEl.textContent = notifs.length;
            countEl.style.display = 
                notifs.length > 0 ? 'flex' : 'none';
        }

        if (listEl) {
            if (notifs.length === 0) {
                listEl.innerHTML = 
                    '<div style="color:#8892a4;' +
                    'font-size:13px;padding:10px;">'+
                    'No new notifications</div>';
            } else {
                listEl.innerHTML = notifs.map(n => `
                    <div class="notif-item" 
                        onclick="markRead('${n.id}')"
                        style="color:${
                            n.type === 'rejection' 
                            ? '#ff4d4d' : '#00c48c'
                        }">
                        ${n.type === 'rejection' 
                            ? '❌' : '✅'} 
                        ${n.message}
                    </div>
                `).join('');
            }
        }
    } catch(e) {
        console.error('Error loading notifications:', e);
    }
}

// Mark notification as read
async function markRead(notifId) {
    await markNotificationRead(notifId);
    location.reload();
}

// Toggle notification dropdown
function toggleNotif() {
    const dropdown = document
        .getElementById('notifDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}