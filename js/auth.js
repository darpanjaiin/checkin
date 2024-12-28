async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return user;
}

async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
} 