(() => {
    'use strict';

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 20) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        navList.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navList.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    const stats = document.querySelectorAll('.stat-num');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.target || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
        const so = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateCount(e.target);
                    so.unobserve(e.target);
                }
            });
        }, { threshold: 0.4 });
        stats.forEach(s => so.observe(s));
    } else {
        stats.forEach(animateCount);
    }

    const typingEl = document.querySelector('.typing');
    if (typingEl) {
        const words = (typingEl.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
        if (words.length > 0) {
            let wi = 0;
            let ci = 0;
            let deleting = false;
            const speed = 100;
            const pauseEnd = 1600;
            const pauseStart = 400;

            const type = () => {
                const word = words[wi];
                if (!deleting) {
                    ci++;
                    typingEl.textContent = word.slice(0, ci);
                    if (ci === word.length) {
                        deleting = true;
                        setTimeout(type, pauseEnd);
                        return;
                    }
                } else {
                    ci--;
                    typingEl.textContent = word.slice(0, ci);
                    if (ci === 0) {
                        deleting = false;
                        wi = (wi + 1) % words.length;
                        setTimeout(type, pauseStart);
                        return;
                    }
                }
                setTimeout(type, deleting ? speed / 2 : speed);
            };

            ci = words[0].length;
            typingEl.textContent = words[0];
            setTimeout(() => { deleting = true; type(); }, pauseEnd);
        }
    }

    const glow = document.querySelector('.bg-glow');
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.matchMedia('(pointer: fine)').matches) {
        let raf = null;
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            if (raf) return;
            raf = requestAnimationFrame(() => {
                if (glow) {
                    const tx = (mx / window.innerWidth - 0.5) * 20;
                    const ty = (my / window.innerHeight - 0.5) * 20;
                    glow.style.transform = `translate(${tx}px, ${ty}px)`;
                }
                if (cursorGlow) {
                    cursorGlow.style.transform = `translate(${mx - 260}px, ${my - 260}px)`;
                }
                raf = null;
            });
        }, { passive: true });
    }

    const tiltCards = document.querySelectorAll('.tilt');
    if (window.matchMedia('(pointer: fine)').matches) {
        const MAX_TILT = 8;
        tiltCards.forEach(card => {
            let raf = null;
            const onMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rx = (0.5 - y) * MAX_TILT * 2;
                const ry = (x - 0.5) * MAX_TILT * 2;
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    card.style.transform =
                        `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
                });
            };
            const reset = () => {
                if (raf) cancelAnimationFrame(raf);
                card.style.transform = '';
            };
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', reset);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    const modalState = { current: null, opener: null };

    const openModal = (id) => {
        const modal = document.getElementById(id);
        if (!modal) return;
        if (modalState.current) closeModal();
        modal.hidden = false;
        requestAnimationFrame(() => {
            modal.classList.add('is-open');
        });
        document.body.classList.add('modal-open');
        modalState.current = modal;
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 50);
        }
        const firstTab = modal.querySelector('.modal-tab.is-active');
        if (firstTab) {
            const paneName = firstTab.dataset.tab;
            modal.querySelectorAll('.modal-pane').forEach(p => {
                p.classList.toggle('is-active', p.dataset.pane === paneName);
            });
        }
    };

    const closeModal = () => {
        const modal = modalState.current;
        if (!modal) return;
        modal.classList.remove('is-open');
        setTimeout(() => {
            modal.hidden = true;
        }, 250);
        document.body.classList.remove('modal-open');
        if (modalState.opener) {
            try { modalState.opener.focus(); } catch (e) {}
        }
        modalState.current = null;
        modalState.opener = null;
    };

    document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modalState.opener = btn;
            openModal(btn.dataset.modalOpen);
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalState.current) {
            closeModal();
        }
    });

    document.querySelectorAll('.modal').forEach(modal => {
        const tabs = modal.querySelectorAll('.modal-tab');
        const panes = modal.querySelectorAll('.modal-pane');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const name = tab.dataset.tab;
                tabs.forEach(t => t.classList.toggle('is-active', t === tab));
                panes.forEach(p => p.classList.toggle('is-active', p.dataset.pane === name));
                const body = modal.querySelector('.modal-body');
                if (body) body.scrollTop = 0;
            });
        });
    });

})();
