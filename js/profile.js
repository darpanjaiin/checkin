document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load profile data
    loadProfileData();
    setupProfileForm();
    setupPasswordForm();
    setupDeleteAccount();

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    });

    async function loadProfileData() {
        try {
            const { data: host, error } = await supabase
                .from('hosts')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            document.getElementById('name').value = host.name;
            document.getElementById('email').value = host.email;
        } catch (error) {
            console.error('Error:', error);
            alert('Error loading profile data');
        }
    }

    function setupProfileForm() {
        const profileForm = document.getElementById('profileForm');
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const { error } = await supabase
                    .from('hosts')
                    .update({ name: document.getElementById('name').value })
                    .eq('id', user.id);

                if (error) throw error;

                alert('Profile updated successfully');
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating profile');
            }
        });
    }

    function setupPasswordForm() {
        const passwordForm = document.getElementById('passwordForm');
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;

            if (newPassword !== confirmNewPassword) {
                alert("New passwords don't match!");
                return;
            }

            try {
                const { error } = await supabase.auth.updateUser({
                    password: newPassword
                });

                if (error) throw error;

                alert('Password updated successfully');
                passwordForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating password');
            }
        });
    }

    function setupDeleteAccount() {
        const deleteBtn = document.getElementById('deleteAccountBtn');
        deleteBtn.addEventListener('click', async () => {
            const confirmed = confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            );

            if (confirmed) {
                try {
                    const { error } = await supabase
                        .from('hosts')
                        .delete()
                        .eq('id', user.id);

                    if (error) throw error;

                    await supabase.auth.signOut();
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error deleting account');
                }
            }
        });
    }
}); 