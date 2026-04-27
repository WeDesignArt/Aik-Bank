 
    (function () {
      'use strict';

      var MOBILE_BP = 991;

      function initPeDeck() {
        var deck = document.getElementById('peDeck');
        if (!deck || typeof gsap === 'undefined') return;

        var cards = Array.from(deck.querySelectorAll('.pe-card'));
        var isAnimating = false;

        function isMobile() { return window.innerWidth <= MOBILE_BP; }

        /* ── desktop: width helpers ────────────────────────── */
        function getWidths() {
          var dw = deck.offsetWidth;
          var ew = Math.round(dw * 0.555);
          var cw = Math.round((dw - ew) / (cards.length - 1));
          return { expanded: ew, collapsed: cw };
        }

        /* ── mobile: height helpers ────────────────────────── */
        function getHeights() {
          return {
            expanded: window.innerWidth <= 767 ? 340 : 380,
            collapsed: 60
          };
        }

        /* ── border-radius: curved away from the active card ── */
        function updateBorderRadius() {
          var activeIdx = cards.findIndex(function (c) { return c.classList.contains('pe-card--active'); });
          cards.forEach(function (card, idx) {
            if (idx === activeIdx) {
              card.style.borderRadius = '0';
            } else if (isMobile()) {
              /* vertical stack: round bottom of card above active, top of card below */
              card.style.borderRadius = idx < activeIdx ? '0 0 8px 8px' : '8px 8px 0 0';
            } else {
              /* horizontal row: round the outer edge away from active card */
              card.style.borderRadius = idx < activeIdx ? '8px 0 0 8px' : '0 8px 8px 0';
            }
          });
        }

        /* ── set dimensions & opacity ──────────────────────── */
        function applyInitialState() {
          if (isMobile()) {
            var h = getHeights();
            cards.forEach(function (card) {
              var a = card.classList.contains('pe-card--active');
              gsap.set(card, { height: a ? h.expanded : h.collapsed, clearProps: 'width' });
              gsap.set(card.querySelector('.pe-card__expanded'), { opacity: a ? 1 : 0, pointerEvents: a ? 'auto' : 'none' });
              gsap.set(card.querySelector('.pe-card__collapsed'), { opacity: a ? 0 : 1 });
            });
          } else {
            var w = getWidths();
            cards.forEach(function (card) {
              var a = card.classList.contains('pe-card--active');
              gsap.set(card, { width: a ? w.expanded : w.collapsed, clearProps: 'height' });
              gsap.set(card.querySelector('.pe-card__expanded'), { opacity: a ? 1 : 0, pointerEvents: a ? 'auto' : 'none' });
              gsap.set(card.querySelector('.pe-card__collapsed'), { opacity: a ? 0 : 1 });
            });
          }
          updateBorderRadius();
        }

        /* ── animate to new active card ────────────────────── */
        function activate(target) {
          if (isAnimating || target.classList.contains('pe-card--active')) return;
          isAnimating = true;

          var prev = deck.querySelector('.pe-card--active');
          var tl = gsap.timeline({ onComplete: function () { isAnimating = false; } });

          if (isMobile()) {
            var h = getHeights();
            /* collapse prev */
            tl.to(prev.querySelector('.pe-card__expanded'), { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0);
            tl.to(prev, { height: h.collapsed, duration: 0.5, ease: 'power3.inOut' }, 0);
            tl.to(prev.querySelector('.pe-card__collapsed'), { opacity: 1, duration: 0.22 }, 0.25);
            /* expand target */
            tl.to(target.querySelector('.pe-card__collapsed'), { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0);
            tl.to(target, { height: h.expanded, duration: 0.5, ease: 'power3.inOut' }, 0);
            tl.to(target.querySelector('.pe-card__expanded'), { opacity: 1, duration: 0.25 }, 0.28);
            /* text fade-up animation */
            tl.fromTo(target.querySelector('.pe-card__text'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.35);
          } else {
            var w = getWidths();
            /* collapse prev */
            tl.to(prev.querySelector('.pe-card__expanded'), { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0);
            tl.to(prev, { width: w.collapsed, duration: 0.55, ease: 'power3.inOut' }, 0);
            tl.to(prev.querySelector('.pe-card__collapsed'), { opacity: 1, duration: 0.22 }, 0.28);
            /* expand target */
            tl.to(target.querySelector('.pe-card__collapsed'), { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0);
            tl.to(target, { width: w.expanded, duration: 0.55, ease: 'power3.inOut' }, 0);
            tl.to(target.querySelector('.pe-card__expanded'), { opacity: 1, duration: 0.25 }, 0.32);
            /* text fade-up animation */
            tl.fromTo(target.querySelector('.pe-card__text'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.4);
          }

          /* swap state classes & toggle icons immediately */
          prev.classList.remove('pe-card--active');
          prev.classList.add('pe-card--inactive');
          prev.querySelector('.pe-card__toggle i').className = 'bi bi-plus-lg';
          gsap.set(prev.querySelector('.pe-card__expanded'), { pointerEvents: 'none' });

          target.classList.remove('pe-card--inactive');
          target.classList.add('pe-card--active');
          target.querySelector('.pe-card__toggle i').className = 'bi bi-dash-lg';
          gsap.set(target.querySelector('.pe-card__expanded'), { pointerEvents: 'auto' });

          /* update corner rounding: curve away from the new active card */
          updateBorderRadius();
        }

        /* ── bind clicks ───────────────────────────────────── */
        cards.forEach(function (card) {
          card.addEventListener('click', function () { activate(this); });
        });

        /* ── init & resize ─────────────────────────────────── */
        applyInitialState();

        var resizeTimer;
        window.addEventListener('resize', function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(applyInitialState, 150);
        });
      }

      /* ── Trusted Partners Marquee ──────────────────── */
      function initPartnersMarquee() {
        var track = document.getElementById('partnersTrack');
        if (!track || typeof gsap === 'undefined') return;

        var halfW = track.scrollWidth / 2;

        gsap.to(track, {
          x: -halfW,
          duration: halfW / 60,   /* ~60 px/s — adjust for speed */
          ease: 'none',
          repeat: -1,             /* seamless: at -halfW content = content at 0 */
        });

        /* pause on hover */
        track.addEventListener('mouseenter', function () { gsap.globalTimeline.pause(); });
        track.addEventListener('mouseleave', function () { gsap.globalTimeline.resume(); });
      }

      if (document.readyState === 'complete') {
        initPeDeck();
        initPartnersMarquee();
      } else {
        window.addEventListener('load', function () {
          initPeDeck();
          initPartnersMarquee();
        });
      }
    })();
  


 
    // ========================================
    // SWIPER INITIALIZATION
    // ========================================
    const testimonialSwiper = new Swiper('#testimonialSwiper', {

      // Slides per view
      slidesPerView: 1,

      // Space between cards
      spaceBetween: 24,

      // Loop infinitely
      loop: true,

      // Auto play - medium speed
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      // Transition speed (ms) - medium
      speed: 800,

      // Smooth easing
      autoplayDisableOnInteraction: false,

      // Dots / Pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: false,
      },

      // Responsive Breakpoints
      breakpoints: {

        // Mobile
        0: {
          slidesPerView: 1,
          spaceBetween: 16,
        },

        // Tablet
        576: {
          slidesPerView: 1.5,
          spaceBetween: 20,
        },

        // Small Laptop
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },

        // Desktop - 3 cards like image
        1024: {
          slidesPerView: 3,
          spaceBetween: 28,
        },

        // Large Desktop
        1280: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },

    });

    // AOS Animation 

     // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 50
    });

    // Wait for the window 'load' event to ensure all images and vendor.js are ready
    window.addEventListener('load', () => {

      // 1. Register Plugins (Bundled in your vendor.js via Gulp)
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      // 2. Sync ScrollTrigger with your global Lenis instance
      if (typeof window.lenis !== 'undefined') {
        window.lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          window.lenis.raf(time * 1000);
        });
      }

      // 3. Variables for the "One-Way Jump"
      let hasJumped = false;
      const introSection = document.querySelector(".intro_section");

      // 4. The Jump Logic
      const handleInitialScroll = (e) => {
        // Trigger jump only if at the top and hasn't happened yet
        if (!hasJumped && window.scrollY < 50 && introSection) {
          hasJumped = true;

          // Prevent native scroll jitter
          if (e && e.cancelable) e.preventDefault();

          gsap.to(window, {
            scrollTo: {
              y: introSection,
              autoKill: false,
              offsetY: 0 // Change to 80 if you have a fixed header
            },
            duration: 1.5,
            ease: "power4.inOut",
            onStart: () => {
              // Stop Lenis from fighting the GSAP scroll
              if (window.lenis) window.lenis.stop();
            },
            onComplete: () => {
              // Resume Lenis and kill jump listeners
              if (window.lenis) window.lenis.start();
              window.removeEventListener("wheel", handleInitialScroll);
              window.removeEventListener("touchmove", handleInitialScroll);
            }
          });
        }
      };

      // 5. Attach Interaction Listeners
      window.addEventListener("wheel", handleInitialScroll, { passive: false });
      window.addEventListener("touchmove", handleInitialScroll, { passive: false });

      // 6. Revolut-Style Hero Entrance Animations
      const heroTl = gsap.timeline({ delay: 0.2 });

      heroTl.from(".home_hero_wrapper", {
        scale: 1.05,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      })
        .from(".home_main_title", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        }, "-=1.0")
        .from(".hero_main_text p", {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        }, "-=0.8")
        .from(".hero_main_text .btn_fill", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        }, "-=0.6");

      // 7. Hero Image Parallax
      if (document.querySelector(".hero_img")) {
        gsap.to(".hero_img", {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: ".home_hero_wrapper",
            start: "top top",
            end: "bottom top",
            scrub: 1
          },
        });
      }

      // 8. Feature Cards & Hover Effects
      document.querySelectorAll(".feature_card_single").forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          rotation: 2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -10, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
        });
      });

      // 9. About Section Timeline
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".home_about_section",
          start: "top 80%",
        }
      });

      aboutTl.from(".home_about_section_media figure", {
        clipPath: "inset(0% 0% 0% 100%)",
        duration: 1.2,
        ease: "power3.inOut"
      })
        .from(".home_about_section_content", {
          opacity: 0,
          x: -60,
          duration: 1,
        }, "-=0.8")
        .from(".mb_ui", {
          opacity: 0,
          filter: "blur(10px)",
          scale: 0.8,
          duration: 0.8,
        }, "-=0.6");

      // Refresh ScrollTrigger to catch new heights after loading
      ScrollTrigger.refresh();
    });

    // Reset scroll to top on refresh
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
  