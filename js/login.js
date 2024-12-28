document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Login failed. Please check your credentials.');
        }
    });
}); 