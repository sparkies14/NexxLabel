// NexLabel Supabase Connection
// Replace these with your actual keys!

const SUPABASE_URL = 'https://kaokmbcopipumjqivpvo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb2ttYmNvcGlwdW1qcWl2cHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2Mzk1ODIsImV4cCI6MjA5MTIxNTU4Mn0.HbD5mErx65-pI6M15aJ-IySt18N419dYlkV7VM8mBI8';

// Initialize Supabase Client
const { createClient } = supabase;
const supabaseClient = createClient(
    SUPABASE_URL, 
    SUPABASE_ANON_KEY
);

// =====================
// AUTH FUNCTIONS
// =====================

// Sign In
async function signIn(email, password) {
    const { data, error } = await supabaseClient
        .auth.signInWithPassword({
            email: email,
            password: password
        });
    if (error) throw error;
    return data;
}

// Sign Out
async function signOut() {
    const { error } = await supabaseClient
        .auth.signOut();
    if (error) throw error;
    window.location.href = '../login.html';
}

// Get Current Session
async function getSession() {
    const { data: { session } } = 
        await supabaseClient.auth.getSession();
    return session;
}

// Get Current User Profile
async function getCurrentProfile() {
    const session = await getSession();
    if (!session) return null;

    const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error) throw error;
    return data;
}

// =====================
// USER FUNCTIONS
// =====================

// Get All Team Members
async function getTeamMembers() {
    const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .neq('role', 'client')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Get All Clients
async function getClients() {
    const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Create New User
async function createUser(
    email, password, fullName, role, company) {
    // Create auth user
    const { data: authData, error: authError } = 
        await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

    if (authError) throw authError;

    // Create profile
    const { data, error } = await supabaseClient
        .from('users')
        .insert([{
            id: authData.user.id,
            email: email,
            full_name: fullName,
            role: role,
            company: company || null
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Delete User
async function deleteUser(userId) {
    const { error } = await supabaseClient
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) throw error;
}

// =====================
// PROJECT FUNCTIONS
// =====================

// Get All Projects
async function getAllProjects() {
    const { data, error } = await supabaseClient
        .from('projects')
        .select(`
            *,
            client:users!projects_client_id_fkey(
                full_name, company
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Get Projects by Client
async function getClientProjects(clientId) {
    const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Create Project
async function createProject(
    name, clientId, createdBy) {
    const { data, error } = await supabaseClient
        .from('projects')
        .insert([{
            name: name,
            client_id: clientId,
            created_by: createdBy
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Delete Project (Owner Only)
async function deleteProject(projectId) {
    const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', projectId);

    if (error) throw error;
}

// Update Project Progress
async function updateProjectProgress(
    projectId, progress, status) {
    const { data, error } = await supabaseClient
        .from('projects')
        .update({ progress: progress, status: status })
        .eq('id', projectId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// =====================
// TASK FUNCTIONS
// =====================

// Get Tasks for Annotator
async function getAnnotatorTasks(userId) {
    const { data, error } = await supabaseClient
        .from('tasks')
        .select(`
            *,
            project:projects(name)
        `)
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Get Tasks for Reviewer
async function getReviewerTasks() {
    const { data, error } = await supabaseClient
        .from('tasks')
        .select(`
            *,
            project:projects(name),
            annotator:users!tasks_assigned_to_fkey(
                full_name
            )
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Get Tasks for Approver
async function getApproverTasks() {
    const { data, error } = await supabaseClient
        .from('tasks')
        .select(`
            *,
            project:projects(name),
            annotator:users!tasks_assigned_to_fkey(
                full_name
            ),
            reviewer:users!tasks_reviewed_by_fkey(
                full_name
            )
        `)
        .eq('status', 'reviewed')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Submit Task (Annotator)
async function submitTask(taskId) {
    const { data, error } = await supabaseClient
        .from('tasks')
        .update({ status: 'submitted' })
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Pass Task (Reviewer)
async function passTask(taskId, reviewerId) {
    const { data, error } = await supabaseClient
        .from('tasks')
        .update({
            status: 'reviewed',
            reviewed_by: reviewerId
        })
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Reject Task (Reviewer)
async function rejectTask(
    taskId, reviewerId, reason) {
    // Update task
    const { data, error } = await supabaseClient
        .from('tasks')
        .update({
            status: 'rejected',
            reviewed_by: reviewerId,
            rejection_reason: reason
        })
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw error;

    // Send notification to annotator
    await sendNotification(
        data.assigned_to,
        `Your task "${data.title}" was rejected. Reason: ${reason}`,
        'rejection'
    );

    return data;
}

// Approve Task (Approver)
async function approveTask(taskId, approverId) {
    const { data, error } = await supabaseClient
        .from('tasks')
        .update({
            status: 'approved',
            approved_by: approverId
        })
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Decline Task (Approver)
async function declineTask(
    taskId, approverId, reason) {
    // Update task back to submitted
    const { data, error } = await supabaseClient
        .from('tasks')
        .update({
            status: 'submitted',
            approved_by: approverId,
            rejection_reason: reason
        })
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw error;

    // Notify reviewer
    await sendNotification(
        data.reviewed_by,
        `Approver declined task "${data.title}". Reason: ${reason}`,
        'rejection'
    );

    return data;
}

// =====================
// NOTIFICATION FUNCTIONS
// =====================

// Send Notification
async function sendNotification(
    userId, message, type) {
    const { error } = await supabaseClient
        .from('notifications')
        .insert([{
            user_id: userId,
            message: message,
            type: type
        }]);

    if (error) throw error;
}

// Get Notifications
async function getNotifications(userId) {
    const { data, error } = await supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Mark Notification as Read
async function markNotificationRead(notifId) {
    const { error } = await supabaseClient
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notifId);

    if (error) throw error;
}