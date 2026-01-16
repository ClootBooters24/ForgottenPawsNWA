// Contact form handler

document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    const form = document.getElementById('form');
    if (!form) return;
    
    const modal = document.getElementById('submission-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    const submitBtn = form.querySelector('.btn-submit');
    const resetBtn = form.querySelector('.btn-reset');
    
    // Track modal state
    let isModalClosing = false;
    
    function showModal(type, message) {
        // console.log('Showing modal:', type, message);
        
        // First ensure the modal is visible
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        
        // Clear any previous styling
        const modalDialog = document.querySelector('.modal-dialog');
        modalDialog.classList.remove('modal-success', 'modal-error');
        
        // Set content based on type
        if (type === 'success') {
            modalDialog.classList.add('modal-success');
            modalTitle.textContent = 'Inquiry Submitted!';
            modalMessage.textContent = message || 'Thank you for your inquiry! We will get back to you soon.';
            
            // Auto-dismiss after 8 seconds
            clearTimeout(window._contactModalTimeout);
            window._contactModalTimeout = setTimeout(hideModal, 8000);
            
        } else if (type === 'error') {
            modalDialog.classList.add('modal-error');
            modalTitle.textContent = 'Submission Error';
            modalMessage.textContent = message || 'An error occurred.';
            
        } else {
            // Loading state
            modalTitle.textContent = 'Please wait...';
            modalMessage.textContent = message || 'Submitting your inquiry...';
            
            // Remove any success/error styling
            clearTimeout(window._contactModalTimeout);
        }
        
        // Focus the close button for accessibility
        setTimeout(() => {
            modalClose.focus();
        }, 100);
    }
    
    function hideModal() {
        // console.log('Hiding modal');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        clearTimeout(window._contactModalTimeout);
        
        // Return focus to submit button
        setTimeout(() => {
            if (submitBtn) submitBtn.focus();
        }, 100);
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

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        showModal('', 'Please wait — submitting your inquiry...');
        
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
            // console.log('Response status:', response.status);
            // console.log('Response ok:', response.ok);
            
            let data = {};
            try { 
                data = await response.json(); 
                // console.log('Response data:', data);
            } catch(e) { 
                console.log('Response parse error:', e);
                // Continue anyway, we'll handle below
            }
            
            // Check if response indicates success
            // Web3Forms returns {success: true, message: "..."} on success
            if (response.ok && data.success === true) {
                const inquiryType = document.getElementById('inquiryType').value;
                const message = `Thank you for your ${inquiryType.toLowerCase()} inquiry! We will review it and get back to you as soon as possible.`;
                
                // console.log('Submission successful, showing success modal');
                showModal('success', message);
                
                // Reset form
                form.reset();
                
            } else {
                console.error('Submission error', response, data);
                const errorMsg = (data && data.message) 
                    ? data.message 
                    : `Submission failed (Status: ${response.status}). Please try again.`;
                showModal('error', errorMsg);
            }
        })
        .catch((err) => {
            console.error('Network error:', err);
            showModal('error', 'Network error. Please check your connection and try again.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Inquiry';
        });
    });
});
