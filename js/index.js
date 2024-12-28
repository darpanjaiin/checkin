document.addEventListener('DOMContentLoaded', async function() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
}); 