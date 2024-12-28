document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('guestCheckInForm');
    const addGuestBtn = document.getElementById('addGuestBtn');
    const additionalGuests = document.getElementById('additionalGuests');
    let guestCount = 0;

    // Add new guest fields
    addGuestBtn.addEventListener('click', function() {
        guestCount++;
        const guestSection = document.createElement('div');
        guestSection.className = 'guest-section';
        guestSection.innerHTML = `
            <h3>Additional Guest ${guestCount}</h3>
            <div class="form-group">
                <label for="firstName${guestCount}">First Name *</label>
                <input type="text" id="firstName${guestCount}" name="firstName${guestCount}" required>
            </div>
            <div class="form-group">
                <label for="lastName${guestCount}">Last Name *</label>
                <input type="text" id="lastName${guestCount}" name="lastName${guestCount}" required>
            </div>
            <div class="form-group">
                <label for="contact${guestCount}">Contact Number *</label>
                <input type="tel" id="contact${guestCount}" name="contact${guestCount}" required>
            </div>
            <button type="button" class="secondary-btn remove-guest">Remove Guest</button>
        `;
        additionalGuests.appendChild(guestSection);

        // Add remove functionality
        const removeBtn = guestSection.querySelector('.remove-guest');
        removeBtn.addEventListener('click', function() {
            guestSection.remove();
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Basic form validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Upload identity proof
            const idProofFile = document.getElementById('idProof').files[0];
            const fileExt = idProofFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('identity-proofs')
                .upload(fileName, idProofFile);

            if (uploadError) throw uploadError;

            // Get the public URL of the uploaded file
            const { data: { publicUrl } } = supabase.storage
                .from('identity-proofs')
                .getPublicUrl(fileName);

            // Insert main guest data
            const { data: guestData, error: guestError } = await supabase
                .from('guests')
                .insert([
                    {
                        first_name: document.getElementById('firstName').value,
                        last_name: document.getElementById('lastName').value,
                        contact_number: document.getElementById('contact').value,
                        check_in_date: document.getElementById('checkIn').value,
                        check_out_date: document.getElementById('checkOut').value,
                        identity_proof_url: publicUrl,
                        special_requests: document.getElementById('specialRequests').value
                    }
                ])
                .select()
                .single();

            if (guestError) throw guestError;

            // Insert additional guests
            const additionalGuestsData = [];
            document.querySelectorAll('#additionalGuests .guest-section').forEach((section, index) => {
                additionalGuestsData.push({
                    guest_id: guestData.id,
                    first_name: section.querySelector(`#firstName${index + 1}`).value,
                    last_name: section.querySelector(`#lastName${index + 1}`).value,
                    contact_number: section.querySelector(`#contact${index + 1}`).value
                });
            });

            if (additionalGuestsData.length > 0) {
                const { error: additionalGuestsError } = await supabase
                    .from('additional_guests')
                    .insert(additionalGuestsData);

                if (additionalGuestsError) throw additionalGuestsError;
            }

            alert('Check-in submitted successfully!');
            form.reset();
            additionalGuests.innerHTML = '';
            guestCount = 0;
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting form: ' + error.message);
        }
    });

    // Date validation
    const checkInDate = document.getElementById('checkIn');
    const checkOutDate = document.getElementById('checkOut');

    checkInDate.addEventListener('change', function() {
        checkOutDate.min = this.value;
    });

    checkOutDate.addEventListener('change', function() {
        checkInDate.max = this.value;
    });
}); 