document.addEventListener('DOMContentLoaded', async function() {
    const messageContainer = document.getElementById('messageContainer');
    const checkInsList = document.getElementById('checkInsList');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    const profileModal = document.getElementById('profileModal');
    const checkInModal = document.getElementById('checkInModal');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    let currentCheckInId = null;

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // Set user email in navbar
    document.getElementById('userEmail').textContent = session.user.email;

    // Load host profile
    async function loadProfile() {
        const { data: profile, error } = await supabase
            .from('hosts')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) {
            showMessage(error.message, 'error');
            return;
        }

        document.getElementById('name').value = profile.name;
        document.getElementById('email').value = profile.email;
    }

    // Load check-ins
    async function loadCheckIns() {
        loadingSpinner.style.display = 'block';
        checkInsList.innerHTML = '';

        try {
            const status = statusFilter.value;
            const date = dateFilter.value;

            let query = supabase
                .from('guests')
                .select(`
                    *,
                    additional_guests (
                        name,
                        id_proof_url
                    )
                `)
                .eq('host_email', session.user.email)
                .order('check_in_time', { ascending: false });

            if (status !== 'all') {
                query = query.eq('status', status);
            }

            if (date) {
                query = query.gte('check_in_time', `${date}T00:00:00`)
                           .lte('check_in_time', `${date}T23:59:59`);
            }

            const { data: checkIns, error } = await query;

            if (error) throw error;

            checkIns.forEach(checkIn => {
                const card = document.createElement('div');
                card.className = 'check-in-card';
                card.innerHTML = `
                    <div class="check-in-info">
                        <h3>${checkIn.name}</h3>
                        <p>Purpose: ${checkIn.purpose}</p>
                        <p>Time: ${new Date(checkIn.check_in_time).toLocaleString()}</p>
                        <span class="check-in-status status-${checkIn.status}">${checkIn.status}</span>
                    </div>
                    <button onclick="showCheckInDetails('${checkIn.id}')" class="view-btn">View Details</button>
                `;
                checkInsList.appendChild(card);
            });

        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // Show check-in details
    window.showCheckInDetails = async function(checkInId) {
        currentCheckInId = checkInId;
        const { data: checkIn, error } = await supabase
            .from('guests')
            .select(`
                *,
                additional_guests (
                    name,
                    id_proof_url
                )
            `)
            .eq('id', checkInId)
            .single();

        if (error) {
            showMessage(error.message, 'error');
            return;
        }

        const idProofUrl = await supabase.storage
            .from('identity-proofs')
            .createSignedUrl(checkIn.id_proof_url, 300);

        const details = document.getElementById('checkInDetails');
        details.innerHTML = `
            <div class="guest-details">
                <h3>Main Guest</h3>
                <p><strong>Name:</strong> ${checkIn.name}</p>
                <p><strong>Email:</strong> ${checkIn.email}</p>
                <p><strong>Phone:</strong> ${checkIn.phone}</p>
                <p><strong>Purpose:</strong> ${checkIn.purpose}</p>
                <p><strong>ID Proof:</strong> <a href="${idProofUrl.data.signedUrl}" target="_blank">View ID</a></p>
                
                ${checkIn.additional_guests.length > 0 ? `
                    <h3>Additional Guests</h3>
                    <ul>
                        ${checkIn.additional_guests.map(guest => `
                            <li>
                                ${guest.name} - 
                                <a href="${supabase.storage
                                    .from('identity-proofs')
                                    .createSignedUrl(guest.id_proof_url, 300)
                                    .then(url => url.data.signedUrl)}" 
                                target="_blank">View ID</a>
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
        `;

        checkInModal.style.display = 'block';
    }

    // Update check-in status
    async function updateCheckInStatus(status) {
        try {
            const { error } = await supabase
                .from('guests')
                .update({ status })
                .eq('id', currentCheckInId);

            if (error) throw error;

            // Send email notification
            const { data: guest } = await supabase
                .from('guests')
                .select('email, name')
                .eq('id', currentCheckInId)
                .single();

            // Here you would integrate with your email service
            // For now, we'll just log it
            console.log(`Email would be sent to ${guest.email} about ${status} status`);

            checkInModal.style.display = 'none';
            loadCheckIns();
            showMessage(`Check-in ${status} successfully`, 'success');

        } catch (error) {
            showMessage(error.message, 'error');
        }
    }

    // Event Listeners
    refreshBtn.addEventListener('click', loadCheckIns);
    statusFilter.addEventListener('change', loadCheckIns);
    dateFilter.addEventListener('change', loadCheckIns);

    document.getElementById('approveBtn').addEventListener('click', () => updateCheckInStatus('approved'));
    document.getElementById('rejectBtn').addEventListener('click', () => updateCheckInStatus('rejected'));

    profileBtn.addEventListener('click', () => {
        loadProfile();
        profileModal.style.display = 'block';
    });

    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
        if (event.target === checkInModal) {
            checkInModal.style.display = 'none';
        }
    }

    // Handle profile updates
    document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;

        try {
            const { error } = await supabase
                .from('hosts')
                .update({ name })
                .eq('id', session.user.id);

            if (error) throw error;

            showMessage('Profile updated successfully', 'success');
            profileModal.style.display = 'none';

        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    // Helper function to show messages
    function showMessage(message, type = 'error') {
        messageContainer.innerHTML = `
            <div class="message ${type}">
                ${message}
            </div>
        `;
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
    }

    // Initial load
    loadCheckIns();
}); 