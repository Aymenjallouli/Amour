// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initial setup
    let currentSection = 0;
    const sections = document.querySelectorAll('.section');
    const content = document.querySelector('.content');
    const loader = document.querySelector('.loader-container');
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('i');
    let musicPlaying = false;
    
    // Navigation elements
    const navigationDots = document.querySelectorAll('.nav-dot');
    const sectionNav = document.querySelector('.section-nav');
    const prevSectionBtn = document.querySelector('.prev-section');
    const nextSectionBtn = document.querySelector('.next-section');
    const pageIndicator = document.querySelector('.page-indicator');
    const currentPageSpan = document.querySelector('.current-page');
    const totalPagesSpan = document.querySelector('.total-pages');
    
    // Set total pages
    totalPagesSpan.textContent = sections.length;
    
    // Helper function to delay execution
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      // Initialize the page with loading animation
    initPage();
    
    // Create mini hearts for loader
    createMiniHearts();
    
    // Navigation dot click
    navigationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSection) {
                navigateToSection(index);
            }
        });
    });
    
    // Section navigation arrows
    prevSectionBtn.addEventListener('click', () => {
        if (currentSection > 0) {
            navigateToSection(currentSection - 1);
        }
    });
    
    nextSectionBtn.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            navigateToSection(currentSection + 1);
        }
    });
      // Toggle sections
    document.querySelectorAll('.continue-btn').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // Get the current section (parent of the button)
            const currentSectionElement = btn.closest('.section');
            // Get the index of the current section
            const sectionIndex = Array.from(sections).indexOf(currentSectionElement);
            // Navigate to next section
            navigateToSection(sectionIndex + 1);
        });
    });
    
    // Open surprise button
    document.getElementById('open-surprise').addEventListener('click', function() {
        console.log('Surprise button clicked'); // Debug log
        navigateToSection(1); // Navigate to the second section (love-letter)
    });
    
    // Final question button
    document.getElementById('final-question-btn').addEventListener('click', () => {
        document.getElementById('response-container').classList.remove('hidden');
        document.getElementById('final-question-btn').classList.add('hidden');
    });
    
    // Yes button response
    document.getElementById('yes-btn').addEventListener('click', () => {
        document.getElementById('response-container').classList.add('hidden');
        document.getElementById('yes-response').classList.remove('hidden');
        document.getElementById('final-response').classList.remove('hidden');
        createHeartExplosion();
    });
    
    // No button response
    document.getElementById('no-btn').addEventListener('click', () => {
        document.getElementById('response-container').classList.add('hidden');
        document.getElementById('no-response').classList.remove('hidden');
        document.getElementById('final-response').classList.remove('hidden');
    });
      // Make the "No" button move away when hovered
    const noBtn = document.getElementById('no-btn');
    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    // Carousel navigation - only initialize if elements exist
    const carousel = document.querySelector('.carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let currentItem = 0;
    const itemWidth = 300; // Match with CSS
    
    // Only initialize carousel if elements exist
    if (carousel && prevBtn && nextBtn) {
        // Initial carousel position
        updateCarousel();
        
        // Carousel buttons
        prevBtn.addEventListener('click', () => {
            currentItem = Math.max(0, currentItem - 1);
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentItem = Math.min(carouselItems.length - 1, currentItem + 1);
            updateCarousel();
        });
    }
    
    // Flip cards on click
    document.querySelectorAll('.message-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
    
    // Toggle music
    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            music.pause();
            musicIcon.className = 'fas fa-volume-mute';
        } else {
            music.play();
            musicIcon.className = 'fas fa-volume-up';
        }
        musicPlaying = !musicPlaying;
    });
      // Download certificate
    document.getElementById('download-certificate').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add loading state to button
        this.classList.add('loading');
        this.textContent = 'Génération du certificat...';
        
        // Generate and download certificate
        generateCertificate();
        
        // Reset button after some time
        setTimeout(() => {
            this.classList.remove('loading');
            this.textContent = 'Télécharger mon certificat d\'amour';
        }, 3000);
    });
    
    // Functions    // Initialize the page
    async function initPage() {
        console.log('Initializing page'); // Debug log
        
        // Create visual effects
        createFloatingHearts();
        createFallingPetals();
        createParticles();
        
        // Ensure we have defined sections before continuing
        if (!sections || sections.length === 0) {
            console.error('No sections found');
            return;
        }

        try {
            // Show loader for a few seconds
            await delay(3000);
            
            // Hide loader and show content
            loader.style.opacity = '0';
            await delay(1000);
            loader.style.display = 'none';
            
            // Show content with a slight delay for smoother transition
            setTimeout(() => {
                content.classList.remove('hidden');
                
                // Make sure all sections except the first one are hidden
                sections.forEach((section, index) => {
                    if (index === 0) {
                        showSection(section);
                    } else {
                        section.classList.add('hidden');
                        section.style.opacity = '0';
                        section.style.pointerEvents = 'none';
                    }
                });
                
                // Initialize navigation
                updateNavigation(0);
            }, 200);
        } catch (error) {
            console.error('Error in initialization:', error);
            // Emergency fallback - force hide loader and show content
            loader.style.display = 'none';
            content.classList.remove('hidden');
            if (sections[0]) showSection(sections[0]);
        }
    }// Show a section
    function showSection(section) {
        if (!section) {
            console.error('Section is undefined in showSection function');
            return; 
        }
        
        // Get section index
        const sectionIndex = Array.from(sections).indexOf(section);
        currentSection = sectionIndex;
        
        console.log('Showing section:', section.id, 'Index:', sectionIndex); // Debug log
        
        // Update navigation
        updateNavigation(sectionIndex);
        
        // Show section
        section.classList.remove('hidden');
        
        // Ensure opacity is set to 1 in the next frame for proper transition
        requestAnimationFrame(() => {
            section.style.opacity = '1';
            section.style.pointerEvents = 'auto';
        });
    }
    
    // Hide a section
    function hideSection(section) {
        if (!section) {
            console.error('Section is undefined in hideSection function');
            return;
        }
        console.log('Hiding section:', section.id); // Debug log
        section.style.opacity = '0';
        section.style.pointerEvents = 'none';
        // Add class after a short delay to prevent interaction during transition
        setTimeout(() => {
            section.classList.add('hidden');
        }, 500);
    }
    
    // Navigate to specific section
    function navigateToSection(index) {
        if (index < 0 || index >= sections.length) {
            console.error('Invalid section index:', index);
            return;
        }
        
        hideSection(sections[currentSection]);
        
        setTimeout(() => {
            showSection(sections[index]);
            
            // Special case for love letter section
            if (index === 1 && sections[index].id === 'love-letter') {
                startTypewriter();
            }
        }, 500);
    }
    
    // Update navigation UI
    function updateNavigation(sectionIndex) {
        // Update dots
        navigationDots.forEach((dot, i) => {
            if (i === sectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update arrows
        if (sectionIndex === 0) {
            prevSectionBtn.classList.add('disabled');
        } else {
            prevSectionBtn.classList.remove('disabled');
        }
        
        if (sectionIndex === sections.length - 1) {
            nextSectionBtn.classList.add('disabled');
        } else {
            nextSectionBtn.classList.remove('disabled');
        }
        
        // Update page indicator
        currentPageSpan.textContent = sectionIndex + 1;
        
        // Show navigation elements after first section
        if (sectionIndex > 0) {
            sectionNav.classList.remove('hidden');
            pageIndicator.classList.remove('hidden');
        } else {
            sectionNav.classList.add('hidden');
            pageIndicator.classList.add('hidden');
        }
    }
      // Update carousel position
    function updateCarousel() {
        // Guard clause: only proceed if all elements exist
        if (!carousel || !prevBtn || !nextBtn) {
            console.log('Carousel elements not found, skipping updateCarousel');
            return;
        }
        
        const offset = -currentItem * itemWidth;
        carousel.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        prevBtn.disabled = currentItem === 0;
        nextBtn.disabled = currentItem === carouselItems.length - 1;
        
        // Visual feedback
        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }
    
    // Start typewriter effect
    function startTypewriter() {
        const text = document.getElementById('typewriter-text').textContent;
        const typewriterElement = document.getElementById('typewriter-text');
        typewriterElement.textContent = '';
        
        let i = 0;
        const speed = 30; // Speed in milliseconds
        
        function typeWriter() {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        typeWriter();
    }
    
    // Create floating hearts
    function createFloatingHearts() {
        const welcomeSection = document.getElementById('welcome');
        const finalSection = document.getElementById('final');
        
        for (let i = 0; i < 20; i++) {
            createHeart(welcomeSection);
            createHeart(finalSection);
        }
    }
    
    // Create a single floating heart
    function createHeart(container) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        // Random starting position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        heart.style.left = `${startX}%`;
        heart.style.bottom = `-50px`;
        
        // Random size
        const size = Math.random() * 20 + 10;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        
        // Random opacity
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Add to container
        container.appendChild(heart);
        
        // Animate
        animateHeart(heart);
    }
    
    // Animate a heart
    function animateHeart(heart) {
        // Random duration and delay
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        // Set animation properties
        heart.style.animation = `float ${duration}s linear ${delay}s infinite`;
        
        // Define the animation
        const keyframes = `
            @keyframes float {
                0% {
                    transform: translateY(0) rotate(0);
                    opacity: ${heart.style.opacity};
                }
                25% {
                    transform: translateY(-25vh) translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 360}deg);
                }
                50% {
                    transform: translateY(-50vh) translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 360}deg);
                }
                75% {
                    transform: translateY(-75vh) translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 360}deg);
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        
        // Add the animation to the document
        const styleElement = document.createElement('style');
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);
    }
    
    // Create falling petals
    function createFallingPetals() {
        const petalContainers = document.querySelectorAll('.falling-petals');
        
        petalContainers.forEach(container => {
            for (let i = 0; i < 30; i++) {
                createPetal(container);
            }
        });
    }
    
    // Create a single petal
    function createPetal(container) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Random starting position
        const startX = Math.random() * 100;
        petal.style.left = `${startX}%`;
        petal.style.top = `-50px`;
        
        // Random size
        const size = Math.random() * 15 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        // Random rotation
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Random opacity
        petal.style.opacity = Math.random() * 0.7 + 0.3;
        
        // Add to container
        container.appendChild(petal);
        
        // Animate
        animatePetal(petal);
    }
    
    // Animate a petal
    function animatePetal(petal) {
        // Random duration and delay
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 10;
        
        // Set animation properties
        petal.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        
        // Define the animation
        const keyframes = `
            @keyframes fall {
                0% {
                    transform: translateY(0) rotate(0) translateX(0);
                    opacity: ${petal.style.opacity};
                }
                25% {
                    transform: translateY(25vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                }
                50% {
                    transform: translateY(50vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                }
                75% {
                    transform: translateY(75vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                }
                100% {
                    transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        
        // Add the animation to the document
        const styleElement = document.createElement('style');
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);
    }
    
    // Create particles
    function createParticles() {
        const particleContainers = document.querySelectorAll('.particles');
        
        particleContainers.forEach(container => {
            for (let i = 0; i < 50; i++) {
                createParticle(container);
            }
        });
    }
    
    // Create a single particle
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random size
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random color (gold, pink, white)
        const colors = ['#FFD700', '#ff85a2', '#FFFFFF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.7 + 0.3;
        
        // Add to container
        container.appendChild(particle);
        
        // Animate
        animateParticle(particle);
    }
    
    // Animate a particle
    function animateParticle(particle) {
        // Random duration and delay
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        
        // Set animation properties
        particle.style.animation = `twinkle ${duration}s ease-in-out ${delay}s infinite`;
        
        // Define the animation
        const keyframes = `
            @keyframes twinkle {
                0%, 100% {
                    opacity: ${particle.style.opacity};
                    transform: scale(1);
                }
                50% {
                    opacity: ${parseFloat(particle.style.opacity) + 0.3};
                    transform: scale(1.2);
                }
            }
        `;
        
        // Add the animation to the document
        const styleElement = document.createElement('style');
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);
    }
    
    // Create heart explosion
    function createHeartExplosion() {
        const container = document.querySelector('.heart-explosion');
        
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            
            // Start at the center
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = 'translate(-50%, -50%)';
            
            // Random size
            const size = Math.random() * 15 + 10;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            
            // Random opacity
            heart.style.opacity = Math.random() * 0.7 + 0.3;
            
            // Add to container
            container.appendChild(heart);
            
            // Animate explosion
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 50;
            const duration = Math.random() * 2 + 1;
            const delay = Math.random() * 0.5;
            
            const keyframes = `
                @keyframes explode-${i} {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: ${heart.style.opacity};
                    }
                    50% {
                        opacity: ${heart.style.opacity};
                    }
                    100% {
                        transform: translate(
                            calc(-50% + ${Math.cos(angle) * distance}px),
                            calc(-50% + ${Math.sin(angle) * distance}px)
                        ) scale(1) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);
            
            heart.style.animation = `explode-${i} ${duration}s ease-out ${delay}s forwards`;
        }
    }
      // Generate love certificate
    function generateCertificate() {
        // Create a temporary container for the certificate
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '800px';
        tempContainer.style.height = 'auto';
        tempContainer.style.background = '#fff9fb';
        tempContainer.style.padding = '50px';
        tempContainer.style.borderRadius = '10px';
        tempContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        tempContainer.style.overflow = 'hidden';
        
        // Certificate HTML content
        tempContainer.innerHTML = `
            <div class="certificate" style="background: #fff9fb; position: relative; padding: 50px; text-align: center;">
                <div style="border: 2px solid #e94057; position: absolute; top: 20px; right: 20px; bottom: 20px; left: 20px; z-index: 1;"></div>
                <div style="position: relative; z-index: 2;">
                    <h1 style="font-family: 'Dancing Script', cursive; color: #e94057; font-size: 48px; margin-bottom: 20px;">Certificat d'Amour Éternel</h1>
                    <h2 style="font-family: 'Montserrat', sans-serif; color: #333; font-size: 24px; margin-bottom: 40px;">Huit Années d'Un Amour Sincère et Profond</h2>
                    
                    <div style="font-family: 'Dancing Script', cursive; font-size: 36px; color: #e94057; margin: 40px 0;">De Aymen pour sa Tesnouma bien-aimée</div>
                    
                    <div style="font-family: 'Playfair Display', serif; font-size: 18px; line-height: 1.8; margin-bottom: 40px; color: #555; text-align: center;">
                        Par la présente, je certifie que depuis huit longues années, mon cœur bat uniquement pour Tesnim.
                        Ce certificat témoigne d'un amour pur, sincère et inébranlable qui a traversé le temps sans jamais faiblir.
                        <br><br>
                        Mon amour pour toi, Tesnouma, transcende les mots et le temps. Tu es l'étoile qui guide mes nuits,
                        la lumière qui illumine mes jours, et l'espoir qui nourrit mon âme. Chaque battement de mon cœur
                        porte ton nom, chaque souffle que je prends est une prière pour toi.
                        <br><br>
                        Tu es et resteras à jamais l'amour de ma vie, ma plus belle évidence, mon éternité.
                    </div>
                    
                    <div style="font-family: 'Montserrat', sans-serif; font-size: 16px; margin-bottom: 40px;">
                        Fait le ${new Date().toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                    
                    <div style="display: flex; justify-content: center; margin-top: 60px;">
                        <div style="width: 200px; text-align: center;">
                            <div style="width: 100%; height: 1px; background: #333; margin-bottom: 10px;"></div>
                            <div>Avec tout mon amour, Aymen</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
          // Add container to the body
        document.body.appendChild(tempContainer);
        
        // Add decorative hearts to the certificate
        const addDecorativeHearts = () => {
            const hearts = [];
            for (let i = 0; i < 20; i++) {
                const heart = document.createElement('div');
                heart.style.position = 'absolute';
                heart.style.width = `${Math.random() * 20 + 10}px`;
                heart.style.height = `${Math.random() * 20 + 10}px`;
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.top = `${Math.random() * 100}%`;
                heart.style.transform = `rotate(${Math.random() * 360}deg)`;
                heart.style.opacity = '0.2';
                heart.style.background = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M25,10 C25,10 10,10 10,25 C10,32 25,45 25,45 C25,45 40,32 40,25 C40,10 25,10 25,10 Z" fill="%23ff5a8c"/></svg>')`;
                heart.style.backgroundSize = 'contain';
                heart.style.zIndex = '0';
                
                tempContainer.querySelector('.certificate').appendChild(heart);
                hearts.push(heart);
            }
            return hearts;
        };
        
        const hearts = addDecorativeHearts();
        
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Préparation de votre certificat...';
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.background = 'rgba(0, 0, 0, 0.7)';
        loadingMessage.style.color = 'white';
        loadingMessage.style.padding = '20px';
        loadingMessage.style.borderRadius = '10px';
        loadingMessage.style.zIndex = '9999';
        document.body.appendChild(loadingMessage);
        
        // Use html2canvas to convert the certificate to an image
        setTimeout(() => {
            html2canvas(tempContainer, {
                scale: 2, // Better quality
                useCORS: true,
                backgroundColor: null
            }).then(canvas => {
                // Remove temp elements
                document.body.removeChild(tempContainer);
                document.body.removeChild(loadingMessage);
                
                // Convert canvas to data URL
                const imageURL = canvas.toDataURL('image/png');
                
                // Create download link
                const downloadLink = document.createElement('a');
                downloadLink.href = imageURL;
                downloadLink.download = 'Certificat_Amour_Tesnouma.png';
                
                // Add to document, click, then remove
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);            }).catch(error => {
                console.error('Erreur lors de la génération du certificat:', error);
                alert('Une erreur est survenue lors de la génération du certificat. Veuillez réessayer.');
                document.body.removeChild(tempContainer);
                document.body.removeChild(loadingMessage);
            });
        }, 500); // Small delay to ensure fonts are loaded
    }
    
    // Create mini hearts for loader animation
    function createMiniHearts() {
        const miniHeartsContainer = document.querySelector('.mini-hearts-container');
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'mini-heart';
                  // Random position around the main heart
                const angle = Math.random() * Math.PI * 2;
                const distance = 70 + Math.random() * 40;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                heart.style.left = `calc(50% + ${x}px)`;
                heart.style.top = `calc(50% + ${y}px)`;
                
                // Random size
                const size = 5 + Math.random() * 10;
                heart.style.width = `${size}px`;
                heart.style.height = `${size}px`;
                
                // Random animation
                const tx = Math.random() * 200 - 100;
                const ty = Math.random() * 200 - 100;
                const tr = Math.random() * 360;
                heart.style.setProperty('--tx', `${tx}px`);
                heart.style.setProperty('--ty', `${ty}px`);
                heart.style.setProperty('--tr', `${tr}deg`);
                
                // Set animation
                const duration = 1 + Math.random() * 2;
                heart.style.animation = `float-mini-heart ${duration}s ease-out forwards`;
                
                // Add to container
                miniHeartsContainer.appendChild(heart);
                
                // Remove after animation
                setTimeout(() => {
                    heart.remove();
                }, duration * 1000);
                
                // Create new heart
                if (loader.style.display !== 'none') {
                    createMiniHeart();
                }
            }, i * 200); // Stagger creation
        }
    }
    
    function createMiniHeart() {
        if (loader.style.display === 'none') return;
        
        const miniHeartsContainer = document.querySelector('.mini-hearts-container');
        
        const heart = document.createElement('div');
        heart.className = 'mini-heart';
        
        // Random position around the main heart
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        heart.style.left = `calc(50% + ${x}px)`;
        heart.style.top = `calc(50% + ${y}px)`;
        
        // Random size
        const size = 5 + Math.random() * 10;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        
        // Random animation
        const tx = Math.random() * 200 - 100;
        const ty = Math.random() * 200 - 100;
        const tr = Math.random() * 360;
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        heart.style.setProperty('--tr', `${tr}deg`);
        
        // Set animation
        const duration = 1 + Math.random() * 2;
        heart.style.animation = `float-mini-heart ${duration}s ease-out forwards`;
        
        // Add to container
        miniHeartsContainer.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            heart.remove();
            
            // Create new heart only if loader is still visible
            if (loader.style.display !== 'none') {
                setTimeout(createMiniHeart, Math.random() * 500);
            }
        }, duration * 1000);
    }
});
