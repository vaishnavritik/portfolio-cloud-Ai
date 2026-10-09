/**
 * ==========================================================================
 * VAISHNAV SRIVASTAVA — PORTFOLIO SCRIPTS
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic typewriter effect
    const typingElement = document.getElementById('typingElement');

    const designations = [
        'Cloud Support Engineer',
        'DevOps Engineer in Progress',
        'Linux & AWS Learner',
        'Generative AI Enthusiast'
    ];

    if (typingElement) {
        let designationIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentText = designations[designationIndex];

            if (isDeleting) {
                charIndex--;
                typingElement.textContent =
                    currentText.substring(0, charIndex);
            } else {
                charIndex++;
                typingElement.textContent =
                    currentText.substring(0, charIndex);
            }

            let delay = isDeleting ? 45 : 95;

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                delay = 1500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                designationIndex =
                    (designationIndex + 1) % designations.length;
                delay = 350;
            }

            window.setTimeout(typeWriter, delay);
        }

        typeWriter();
    }

    // 2. Header scroll effect and active navigation
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    function handleScroll() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }

        let activeSectionId = 'home';
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
            if (scrollPosition >= section.offsetTop) {
                activeSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const isActive =
                link.getAttribute('href') === `#${activeSectionId}`;

            link.classList.toggle('active', isActive);
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 3. Mobile navigation
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navLinks');
    const menuIcon = document.getElementById('menuIcon');

    function closeMobileMenu() {
        if (navMenu) {
            navMenu.classList.remove('active');
        }

        if (menuIcon) {
            menuIcon.className = 'bx bx-menu';
        }

        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');

            mobileMenuBtn.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

            if (menuIcon) {
                menuIcon.className = isOpen
                    ? 'bx bx-x'
                    : 'bx bx-menu';
            }
        });

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // 4. Skills category filtering
    const skillTabs = document.querySelectorAll('.skill-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            skillTabs.forEach((button) => {
                button.classList.toggle('active', button === tab);
            });

            const filterValue = tab.dataset.filter || 'all';

            skillCards.forEach((card) => {
                const category = card.dataset.category || '';

                const shouldShow =
                    filterValue === 'all' ||
                    category === filterValue;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    card.style.animation =
                        'portfolioCardIn 0.3s ease both';
                } else {
                    card.style.removeProperty('animation');
                }
            });
        });
    });

    // Add card animation styles
    if (!document.getElementById('portfolioAnimationStyles')) {
        const style = document.createElement('style');

        style.id = 'portfolioAnimationStyles';

        style.textContent = `
            @keyframes portfolioCardIn {
                from {
                    opacity: 0;
                    transform: translateY(8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .skill-card[hidden] {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
    }

    // 5. Copy buttons and toast notifications
    const toastMsg = document.getElementById('toastMsg');
    const toastText = document.getElementById('toastText');
    let toastTimeout;

    function showToast(message) {
        if (!toastMsg) {
            console.info(message);
            return;
        }

        if (toastText) {
            toastText.textContent = message;
        }

        toastMsg.classList.add('show');

        window.clearTimeout(toastTimeout);

        toastTimeout = window.setTimeout(() => {
            toastMsg.classList.remove('show');
        }, 2800);
    }

    document.querySelectorAll('.copy-btn[data-copy]').forEach((button) => {
        button.addEventListener('click', async () => {
            const value = button.dataset.copy;

            if (!value) return;

            try {
                await navigator.clipboard.writeText(value);
                showToast('Copied to clipboard.');

                const label = button.querySelector('span');

                if (label) {
                    const originalLabel = label.textContent;
                    label.textContent = 'Copied!';

                    window.setTimeout(() => {
                        label.textContent = originalLabel;
                    }, 1600);
                }
            } catch (error) {
                showToast(
                    `Clipboard access unavailable. Copy this: ${value}`
                );
            }
        });
    });

    // 6. Contact form
    // Opens the visitor's email application.
    // A backend is not configured, so do not falsely report a sent message.
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    const recipientEmail = 'vaishnavsrivastavamzp@gmail.com';

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name =
                document.getElementById('formName')?.value.trim() || '';

            const senderEmail =
                document.getElementById('formEmail')?.value.trim() || '';

            const subject =
                document.getElementById('formSubject')?.value.trim() ||
                'Portfolio enquiry';

            const message =
                document.getElementById('formMessage')?.value.trim() || '';

            if (!name || !senderEmail || !message) {
                showToast('Please complete the required fields.');
                return;
            }

            const mailSubject = encodeURIComponent(subject);

            const mailBody = encodeURIComponent(
                `Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`
            );

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.setAttribute('aria-busy', 'true');
            }

            showToast('Opening your email application…');

            window.location.href =
                `mailto:${recipientEmail}?subject=${mailSubject}&body=${mailBody}`;

            window.setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }
            }, 1500);
        });
    }
});