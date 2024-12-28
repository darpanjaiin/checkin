document.addEventListener('DOMContentLoaded', function() {
    debug('DOM Content Loaded');

    const registerForm = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.loading-spinner');
    const buttonText = submitButton.querySelector('span');
    const messageContainer = document.getElementById('messageContainer');

    function showMessage(message, type = 'error') {
        messageContainer.innerHTML = `
            <div class="${type}-message">
                ${message}
            </div>
        `;
        debug(`Showing message: ${message} (${type})`);
    }

    function setLoading(loading) {
        submitButton.disabled = loading;
        spinner.style.display = loading ? 'inline-block' : 'none';
        buttonText.style.display = loading ? 'none' : 'inline';
        debug(`Loading state: ${loading}`);
    }

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        debug('Form submitted');

        setLoading(true);
        
        try {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const passwordValue = password.value;

            if (passwordValue !== confirmPassword.value) {
                throw new Error("Passwords don't match!");
            }

            debug('Starting registration process');

            // First sign up the user with auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: passwordValue,
                options: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo: window.location.origin + '/confirm-email.html'
                }
            });

            debug('Auth response:', { authData, authError });

            if (authError) throw authError;

            if (!authData.user) {
                throw new Error('Registration failed. Please try again.');
            }

            // Then insert into hosts table using the auth user's ID
            const { error: hostError } = await supabase
                .from('hosts')
                .insert([{
                    id: authData.user.id,  // Use the auth user's ID
                    name: name,
                    email: email
                }]);

            debug('Host insert response:', { hostError });

            if (hostError) throw hostError;

            showMessage('Registration successful! Please check your email for verification.', 'success');
            registerForm.reset();
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            debug('Error occurred:', error);
            showMessage(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    });
}); 