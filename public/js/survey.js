// Custom Modal Logic
        const modal = document.getElementById('successModal');
        const closeModalBtn = document.getElementById('closeModal');

        if (closeModalBtn) {
            closeModalBtn.onclick = function () {
                modal.style.display = "none";
            }
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // Form Submission Handler
        const surveyForm = document.getElementById('surveyForm');

        // Disable default browser validation to handle specific scrolling behavior manually
        surveyForm.setAttribute('novalidate', true);

        surveyForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const form = e.target;

            // Custom Validation: Check required fields manually
            const requiredElements = form.querySelectorAll('[required]');
            let firstInvalid = null;

            for (const el of requiredElements) {
                // Check if empty
                if (!el.value || el.value.trim() === '') {
                    if (!firstInvalid) firstInvalid = el;
                    el.style.borderColor = '#dc3545'; // Highlight error

                    // Reset border on input
                    el.addEventListener('input', function () {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            }

            if (!firstInvalid && !form.checkValidity()) {
                const invalidEls = form.querySelectorAll(':invalid');
                if (invalidEls.length > 0) {
                    firstInvalid = invalidEls[0];
                }
            }

            if (firstInvalid) {
                // Manual calculation to force centering and avoid browser quirks
                const rect = firstInvalid.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetY = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);

                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                });

                // Focus after a delay to allow scroll to start, but prevent default scroll
                setTimeout(() => {
                    firstInvalid.focus({ preventScroll: true });
                }, 500);
                return; // Stop submission
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                const formData = new FormData(form);
                const searchParams = new URLSearchParams();
                for (const pair of formData) {
                    searchParams.append(pair[0], pair[1]);
                }

                const response = await fetch('http://localhost:5000/submit-survey', {
                    method: 'POST',
                    body: searchParams
                });

                const result = await response.json();

                if (response.ok) {
                    // Show Custom Modal
                    if (modal) {
                        modal.style.display = "flex";
                    }

                    form.reset();
                    window.scrollTo(0, 0);
                } else {
                    alert('Error: ' + (result.error || 'Failed to submit survey'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.\nMake sure the server is running.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });