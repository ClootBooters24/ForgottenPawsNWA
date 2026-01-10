// Adoption/Foster Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Application type toggle
    const adoptionRadio = document.getElementById('adoption');
    const fosterRadio = document.getElementById('foster');
    const accessKeyInput = document.getElementById('access_key');
    const subjectInput = document.getElementById('form_subject');
    const appTypeInput = document.getElementById('application_type');
    const submitBtn = document.getElementById('submitBtn');
    
    // Activity level slider
    const activitySlider = document.getElementById('activityLevel');
    const activityValue = document.getElementById('activityValue');
    const sliderContainer = document.querySelector('.slider-container');
    
    // Update activity level display
    const activityLabels = {
        1: 'Low (Couch Potato)',
        2: 'Low-Moderate',
        3: 'Moderate',
        4: 'Moderate-High',
        5: 'High (Very Active)'
    };
    
    function updateActivityValue() {
        const value = parseInt(activitySlider.value);
        activityValue.textContent = activityLabels[value];
        
        // Get slider dimensions and position
        const sliderRect = activitySlider.getBoundingClientRect();
        const min = parseInt(activitySlider.min);
        const max = parseInt(activitySlider.max);
        
        // Calculate the correct position for the popup
        // The slider thumb is offset by half its width
        const percent = ((value - min) / (max - min)) * 100;
        
        // Calculate pixel position for the thumb
        const thumbPosition = (percent / 100) * (sliderRect.width - 20); // Subtract thumb radius
        
        // Position the popup directly above the thumb
        activityValue.style.left = `${thumbPosition}px`;
        
        // Adjust popup color based on value
        if (value >= 4) {
            activityValue.style.background = '#0d6efd';
            activityValue.style.color = '#ffffff';
            activityValue.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.3)';
            activityValue.style.setProperty('--arrow-color', '#0d6efd');
        } else {
            activityValue.style.background = '#2a2d34';
            activityValue.style.color = '#ffffff';
            activityValue.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            activityValue.style.setProperty('--arrow-color', '#2a2d34');
        }
    }
    
    // Add resize listener to recalculate on window resize
    window.addEventListener('resize', updateActivityValue);
    
    // Update slider on input
    activitySlider.addEventListener('input', updateActivityValue);
    
    // Initialize slider position
    updateActivityValue();
    
    // Handle application type change
    function updateFormType() {
        if (adoptionRadio.checked) {
            accessKeyInput.value = 'a5bebfb2-ef39-42d8-8667-69268521f6e5';
            subjectInput.value = 'Adoption Application';
            appTypeInput.value = 'adoption';
            submitBtn.textContent = 'Submit Adoption Application';
        } else {
            accessKeyInput.value = 'a5bebfb2-ef39-42d8-8667-69268521f6e5';
            subjectInput.value = 'Foster Application';
            appTypeInput.value = 'foster';
            submitBtn.textContent = 'Submit Foster Application';
        }
    }
    
    adoptionRadio.addEventListener('change', updateFormType);
    fosterRadio.addEventListener('change', updateFormType);
    
    // Form submission
    const form = document.getElementById('adoptForm');
    const modal = document.getElementById('submission-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    const resetBtn = document.querySelector('.btn-reset');
    
    // Track modal state
    let isModalClosing = false;
    
    function showModal(type, message) {
        modal.classList.remove('modal-success', 'modal-error');
        if (type === 'success') {
            modal.classList.add('modal-success');
            modalTitle.textContent = 'Application Submitted!';
        } else if (type === 'error') {
            modal.classList.add('modal-error');
            modalTitle.textContent = 'Submission Error';
        } else {
            modalTitle.textContent = 'Please wait...';
        }
        modalMessage.textContent = message || '';
        modal.setAttribute('aria-hidden', 'false');
        isModalClosing = false; // Reset closing flag when showing modal
        
        // Focus the close button for accessibility
        setTimeout(() => {
            modalClose.focus();
        }, 100);
        
        // Auto-dismiss after a short time for success
        clearTimeout(window._submissionModalTimeout);
        if (type === 'success') {
            window._submissionModalTimeout = setTimeout(hideModal, 8000);
        }
    }
    
    function hideModal() {
        if (isModalClosing) return; // Prevent multiple calls
        
        isModalClosing = true;
        modal.setAttribute('aria-hidden', 'true');
        clearTimeout(window._submissionModalTimeout);
        // Return focus to submit button
        setTimeout(() => {
            submitBtn.focus();
            isModalClosing = false; // Reset flag after animation
        }, 300);
    }
    
    // Clean event listeners before adding new ones
    const oldModalClose = modalClose.cloneNode(true);
    modalClose.parentNode.replaceChild(oldModalClose, modalClose);
    const newModalClose = document.getElementById('modal-close');
    
    // Add single click event listener
    newModalClose.addEventListener('click', hideModal);
    
    // Click outside dialog to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal && !isModalClosing) {
            hideModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false' && !isModalClosing) {
            hideModal();
        }
    });    

    // Handle form reset
    function handleFormReset() {
        // Reset the slider value to 3 (Moderate)
        activitySlider.value = 3;
        
        // Use setTimeout to ensure the slider value is updated before recalculating position
        setTimeout(() => {
            updateActivityValue();
        }, 0);
        
        // Reset application type to adoption
        adoptionRadio.checked = true;
        updateFormType();
        
        // Hide modal if it's open
        modal.setAttribute('aria-hidden', 'true');
    }
    
    // Add reset event listener to the form
    form.addEventListener('reset', handleFormReset);
    
    // Also add click event to reset button for better UX
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            // Allow default reset behavior first, then update slider
            setTimeout(() => {
                activitySlider.value = 3;
                updateActivityValue();
                adoptionRadio.checked = true;
                updateFormType();
            }, 0);
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        showModal('', 'Please wait — submitting your application...');
        
        // Validate at least one size preference is selected
        const sizeCheckboxes = document.querySelectorAll('input[name="size_preference"]:checked');
        if (sizeCheckboxes.length === 0) {
            showModal('error', 'Please select at least one size preference.');
            submitBtn.disabled = false;
            updateFormType(); // Reset button text
            return;
        }
        
        const formData = new FormData(form);
        const object = Object.fromEntries(formData.entries());
        const json = JSON.stringify(object);
        
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let data = {};
            try { 
                data = await response.json(); 
            } catch(e) { 
                /* ignore parse errors */ 
            }
            
            if (response.ok) {
                const type = adoptionRadio.checked ? 'adoption' : 'foster';
                const message = type === 'adoption' 
                    ? 'Thank you for your adoption application! We will review it and contact you within 3-5 business days.'
                    : 'Thank you for your foster application! We will review it and contact you within 3-5 business days.';
                
                showModal('success', message);
                form.reset();
                // Explicitly reset slider since form.reset() doesn't update the display
                activitySlider.value = 3;
                updateActivityValue();
            } else {
                console.error('Submission error', response, data);
                showModal('error', (data && data.message) ? data.message : 'Unable to submit your application. Please try again later.');
            }
        })
        .catch((err) => {
            console.error(err);
            showModal('error', 'Something went wrong while submitting your application. Please check your connection and try again.');
            form.reset();
        })
        .finally(() => {
            submitBtn.disabled = false;
            updateFormType(); // Reset button text
        });
    });
    
    // Initialize form type
    updateFormType();
    
    // Initialize slider position after a short delay to ensure DOM is fully loaded
    setTimeout(updateActivityValue, 100);
});