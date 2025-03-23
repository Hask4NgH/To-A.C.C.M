const local_dev_cors_message = `<br><br><strong>Possível Solução:</strong><br>Isso pode ser um problema com a política <i>CORS</i>. Para corrigir, hospede o site em qualquer serviço como <a href="https://vercel.com/" target="_blank">Vercel</a>, Github Pages, <a href="https://cloudflare.com/" target="_blank">Cloudflare Pages</a>, etc.`

// Create falling hearts
function createFallingHearts() {
    const container = document.querySelector('.falling-hearts');
    const heartTypes = ['❤️', '💕', '💖', '💓', '💗', '💘', '💝'];
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        
        // Randomize heart positions and animation duration
        const left = Math.random() * 100;
        const size = Math.random() * 0.8 + 0.5;
        const animationDuration = Math.random() * 15 + 10;
        const delay = Math.random() * 15;
        
        heart.style.left = `${left}vw`;
        heart.style.fontSize = `${size}rem`;
        heart.style.animationDuration = `${animationDuration}s`;
        heart.style.animationDelay = `${delay}s`;
        
        container.appendChild(heart);
    }
}

// Add audio background function
function addAudioBackground() {
    const audio = document.createElement('audio');
    audio.id = 'background-music';
    audio.loop = true;
    audio.volume = 0.4;
    
    // You can replace this with any love song URL if you host the file online
    // audio.src = 'your-love-song.mp3';
    
    // The audio controls are hidden but can be implemented if needed
    audio.style.display = 'none';
    document.body.appendChild(audio);
    
    return audio;
}

// markdown it on top (real)
function loadMessage(md) {
    const message = document.querySelector("#message");

    // Create a confetti effect when message is loaded
    const createConfetti = () => {
        const colors = ['#ff0066', '#ff77a9', '#ffb3c6', '#ffd9e3', '#ffffff'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `${Math.random() * 100}%`;
            confetti.style.opacity = '0';
            confetti.style.transform = 'translateY(-20px)';
            confetti.style.animation = `confetti ${1 + Math.random() * 3}s ease-out forwards ${Math.random() * 2}s`;
            
            message.appendChild(confetti);
        }
    };

    fetch("message.txt")
        .then(response => response.text())
        .then(data => {
            // Add animation class to message container
            message.classList.add('animate__animated', 'animate__fadeIn');
            message.innerHTML = md.render(data);
            
            // Add special styling to the signature
            const content = message.innerHTML;
            const signatureRegex = /\*\*Caio S\. S\.\*\*/g;
            const enhancedContent = content.replace(signatureRegex, '<div class="signature">Caio S. S.</div>');
            message.innerHTML = enhancedContent;
            
            // Trigger confetti effect
            setTimeout(createConfetti, 1500);
        })
        .catch(error => {
            if (document.location.hostname === "localhost" || document.location.href.startsWith("file://")) {
                message.innerHTML = `Ocorreu um erro ao carregar a mensagem. <code>${error}</code>${local_dev_cors_message}`;
                return;
            }
            
            message.innerHTML = `Ocorreu um erro ao carregar a mensagem. <code>${error}</code>`;
        });
}

// Add animation keyframes
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti {
            0% { opacity: 1; transform: translateY(-20px); }
            100% { opacity: 0; transform: translateY(40px); }
        }
        
        .message-highlight {
            background: linear-gradient(120deg, rgba(255,182,193,0) 0%, rgba(255,182,193,0.5) 50%, rgba(255,182,193,0) 100%);
            background-size: 200% 100%;
            animation: highlight 2s ease-in-out infinite;
        }
        
        @keyframes highlight {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function() {
    let tempdata = {
        "did_open": false
    }

    const heart = document.querySelector("#solid-heart");
    const msg_container = document.querySelector("#message-container");
    const md = window.markdownit({html: true});
    
    // Initialize additional features
    createFallingHearts();
    addAnimationStyles();
    const backgroundMusic = addAudioBackground();

    loadMessage(md);

    heart.addEventListener("click", function() {
        if (tempdata.did_open) {
            return;
        }
        tempdata.did_open = true;
        
        // Add animation to the message container
        msg_container.classList.remove("hidden");
        msg_container.classList.add("flex", "animate__animated", "animate__zoomInUp");
        
        // Try to play background music (might be blocked by browser)
        try {
            backgroundMusic.play().catch(e => console.log('Auto-play prevented by browser'));
        } catch (e) {
            console.log('Audio playback error:', e);
        }
        
        // Calculate height for smooth animation
        const auto_css_height = msg_container.scrollHeight + 20;
        msg_container.style.height = 'auto';
        msg_container.style.maxHeight = '80vh';
        
        // Remove heart animation after click
        heart.classList.remove("fa-beat");
        heart.classList.add("animate__animated", "animate__heartBeat");
        
        // Add a slight delay to ensure smooth animation
        setTimeout(() => {
            if (msg_container.scrollHeight > msg_container.clientHeight) {
                msg_container.classList.add("overflow-y-auto");
                msg_container.classList.add("scroll-smooth");
            }
            
            window.onresize = function() {
                if (msg_container.scrollHeight > msg_container.clientHeight) {
                    msg_container.classList.add("overflow-y-auto");
                } else {
                    msg_container.classList.remove("overflow-y-auto");
                }
            }
            
            // Add special effects after message is shown
            const messageElement = document.querySelector("#message");
            messageElement.querySelectorAll('p').forEach(p => {
                p.classList.add('animate__animated', 'animate__fadeIn');
                p.style.animationDelay = `${Math.random() * 0.5 + 0.5}s`;
            });
        }, 1000);
    });
});
