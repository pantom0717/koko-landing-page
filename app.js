// 코코 랜딩페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 이전의 Smooth scrolling for navigation links 코드는 제거됩니다.
    // CSS의 scroll-padding-top이 작동하도록 브라우저의 기본 앵커 이동 기능을 사용합니다.

    // Email form submission
    const emailForm = document.getElementById('emailForm');
    const successMessage = document.getElementById('successMessage');

    if (emailForm) {
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const emailInput = emailForm.querySelector('.email-input');
        const email = emailInput.value.trim();

        if (!isValidEmail(email)) {
            showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }

        const submitButton = emailForm.querySelector('.btn');
        const originalText = submitButton.textContent;

        submitButton.textContent = '전송 중...';
        submitButton.disabled = true;

        try {
            // --- 수정 시작: FormData를 URLSearchParams로 변환 ---
            const formData = new FormData(e.target);
            // Netlify Forms는 'form-name' 필드를 반드시 필요로 합니다.
            // (히든 폼에 이미 있지만, AJAX 제출 시 명시적으로 추가하는 것이 안전합니다.)
            formData.append("form-name", e.target.getAttribute("name"));

            const body = new URLSearchParams(formData).toString(); // FormData를 URLSearchParams로 변환
            // --- 수정 끝 ---

            const response = await fetch(e.target.action, {
                method: "POST",
                headers: {
                    // --- 수정: Content-Type 헤더 추가 ---
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: body, // 변환된 body 사용
            });

            if (response.ok) {
                emailForm.style.display = 'none';
                successMessage.classList.remove('hidden');

                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    successMessage.style.transition = 'all 0.5s ease';
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 100);

                showNotification('이메일 주소가 성공적으로 전송되었습니다! ✨', 'success');
                emailInput.value = ''; // 폼 필드 초기화
            } else {
                const errorText = await response.text();
                console.error('폼 제출 실패:', response.status, errorText);
                showNotification(`이메일 전송에 실패했습니다: ${errorText || response.statusText}. 다시 시도해주세요.`, 'error');
            }
        } catch (error) {
            console.error('폼 제출 중 오류 발생:', error);
            showNotification('오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(255, 182, 193, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Intersection Observer for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    const cards = document.querySelectorAll('.problem-card, .solution-card, .feature-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects to cards
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Avatar hover effect
    const heroAvatar = document.querySelector('.hero-avatar');
    if (heroAvatar) {
        heroAvatar.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) saturate(1.2)';
        });

        heroAvatar.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1) saturate(1)';
        });
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;

            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    // Add floating animation to badges
    const badges = document.querySelectorAll('.badge');
    badges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
        badge.classList.add('floating');
    });

    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        .floating {
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-5px);
            }
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            background: linear-gradient(135deg, #4CAF50, #45a049);
        }

        .notification.error {
            background: linear-gradient(135deg, #f44336, #d32f2f);
        }
    `;
    document.head.appendChild(style);
}); // <-- 이 부분이 document.addEventListener('DOMContentLoaded'의 닫는 괄호입니다.

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add some easter eggs for user engagement
document.addEventListener('keydown', function(e) {
    // Konami code easter egg (↑↑↓↓←→←→BA)
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    window.konamiIndex = window.konamiIndex || 0;

    if (e.keyCode === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            showNotification('🎉 코코 개발자를 위한 특별한 인사! 곧 만나요~ ✨', 'success');
            window.konamiIndex = 0;

            // Add special effect
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    } else {
        window.konamiIndex = 0;
    }
});

// Add rainbow effect CSS
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);