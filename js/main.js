jQuery(document).ready(function ($) {
  Fancybox.bind("[data-fancybox]", {
    // Your custom options
  });

  // blank click function for ios
  $("a, .btn_outline, .btn_fill").click(function () {});

  // Handle hamburger menu click
  $(".hamburger-menu").on("click", function () {
    $(".bar").toggleClass("animate");
    $(".mobile-menu").toggleClass("active");
    return false;
  });

  // Add class 'has-children' to any li that has a direct ul child and add class 'children' to the ul
  $("#menu.menuNav > li:has(ul)")
    .addClass("has-children")
    .children("ul")
    .addClass("children");

  // Add class 'in-dropdown' to any li within 'children' that has a ul child and add class 'in-dropdown' to the ul
  $("#menu.menuNav li ul.children li:has(ul)")
    .addClass("in-dropdown")
    .children("ul")
    .addClass("in-dropdown");

  $(".has-children > ul").each(function () {
    if ($(this).children("li").length > 4) {
      $(this).addClass("many-items");
    }
  });

  // Handle submenu click for top-level menu items
  $(".has-children").on("click", function (e) {
    e.stopPropagation(); // Prevent event from bubbling up
    // Close other open submenus
    $(".has-children").not(this).children("ul").slideUp("slow", "swing");
    $(".has-children").not(this).find(".icon-arrow").removeClass("open");
    $(".has-children").not(this).removeClass("active");

    // Toggle the clicked submenu
    $(this).children("ul").slideToggle("slow", "swing");
    $(this).find(".icon-arrow").toggleClass("open");
    $(this).toggleClass("active");
  });

  // Handle submenu click for dropdown items within submenus
  $(".in-dropdown").on("click", function (e) {
    e.stopPropagation(); // Prevent event from bubbling up
    // Close other open submenus
    $(".in-dropdown").not(this).children("ul").slideUp("slow", "swing");
    $(".in-dropdown").not(this).find(".icon-caret").removeClass("open-caret");
    $(".in-dropdown").not(this).removeClass("active");

    // Toggle the clicked submenu
    $(this).children("ul").slideToggle("slow", "swing");
    $(this).find(".icon-caret").toggleClass("open-caret");
    $(this).toggleClass("active");
  });

  // Handle close menu button click
  $(".close-menu").on("click", function () {
    $(".mobile-menu").removeClass("active");
    $(".bar").removeClass("animate");
  });

  $(".offset_menu_trigger").on("click", function () {
    const $this = $(this);
    const isMenuOpen = $this.hasClass("active");

    // Toggle classes for menu state
    $this.toggleClass("active");
    $("html, body").toggleClass("overflow-hidden", !isMenuOpen);
    $("header").toggleClass("menu_open", !isMenuOpen);
    $(".off_canvas").toggleClass("active", !isMenuOpen);

    // Pause or resume Lenis based on the menu state
    if (!isMenuOpen) {
      lenis.stop(); // Stop Lenis when the menu is open
    } else {
      lenis.start(); // Start Lenis when the menu is closed
    }
  });

  // inner hero
  const innerHero = document.querySelector(".inner_hero");

  if (innerHero) {
    // Select the title and wrapper elements
    const title = document.querySelector(".hero_main_text_title");
    const wrapper = document.querySelector(".hero_main_text_wrapper");

    // Check the text content length without spaces
    const titleTextLength = title.textContent.replace(/\s+/g, "").length;

    // Add or remove a class based on the character count
    if (titleTextLength > 12) {
      wrapper.classList.add("long-title"); // Add a class if more than 12 characters
    } else {
      wrapper.classList.remove("long-title"); // Ensure class is removed if not
    }
  }

  // values swiper
  const valuesSwiper = document.querySelector(".values_swiper");

  if (valuesSwiper) {
    new Swiper(valuesSwiper, {
      pagination: {
        el: ".values_pagination",
        clickable: true,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },

        1024: {
          slidesPerView: 3,
          pagination: false,
        },
      },
    });
  }

  // recent swiper
  const recentSwiper = document.querySelector(".recent_swiper");

  if (recentSwiper) {
    new Swiper(recentSwiper, {
      pagination: {
        el: ".recent_pagination",
        clickable: true,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },

        1024: {
          slidesPerView: 4,
          pagination: false,
        },
      },
    });
  }

  // services swiper
  const serviceSwiper = document.querySelector(".service_swiper");

  if (serviceSwiper) {
    new Swiper(serviceSwiper, {
      pagination: {
        el: ".services_pagination",
        clickable: true,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },

        1024: {
          slidesPerView: 3,
          pagination: false,
        },
      },
    });
  }

  if ($(window).width() < 768) {
  }

  if ($(window).width() < 1199) {
    console.log("Less than window");
  }

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis({
    smooth: true,
    direction: "vertical", // Change if horizontal scrolling is needed
  });

  // Exclude `.menuNav` from Lenis smooth scrolling
  const menuNav = document.querySelector(".menuNav");

  menuNav.addEventListener("wheel", (e) => {
    e.stopPropagation(); // Prevent Lenis from handling scroll events inside `.menuNav`
  });

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);

  // Header animation
  const header = document.querySelector(".header");

  ScrollTrigger.create({
    start: "top -=100",
    onEnter: () => header.classList.add("header--fixed"),
    onLeaveBack: () => header.classList.remove("header--fixed"),
  });

  // Optional: Animate header on scroll
  gsap.to(".header", {
    scrollTrigger: {
      start: "top -=100",
      toggleActions: "play none none reverse",
    },
    yPercent: 0,
    duration: 0.2,
  });

  const homeMainTitle = document.querySelector(".home_main_title");
  gsap.from(homeMainTitle, {
    opacity: 0, // Start with the element fully transparent
    scale: 0, // Start with the element 50px below its final position
    duration: 1.2, // Duration of the animation
    ease: "power3.Out", // Optional easing function
  });

  const arrowClip = document.querySelector(".arrow_link");
  gsap.from(arrowClip, {
    opacity: 0, // Start with the element fully transparent
    y: 50, // Start with the element 50px below its final position
    duration: 1.2, // Duration of the animation
    delay: 1, // Delay before the animation starts (in seconds)
    ease: "power2.out", // Optional easing function
  });

  const projectFeaturedImg = document.querySelector(".featured_img_clip");
  const projectSection = document.querySelector(".featured_prj_section");

  if (projectFeaturedImg) {
    // Add ScrollTrigger animation for scroll-based effects
    gsap.to(projectFeaturedImg, {
      scrollTrigger: {
        trigger: projectSection, // The element that triggers the animation
        start: "top 80%", // Trigger when the top of the element hits 80% of the viewport
        end: "bottom 50%", // Animation ends at 50% of the viewport
        toggleActions: "play", // Animation actions (onEnter, onLeave, etc.)
      },
      duration: 1, // Animation duration in seconds
      clipPath: "inset(0)",
      ease: "power2.out", // Easing function for the scroll animation
    });
  }

  const recentWork = document.querySelector(
    ".recent_work_section .swiper-wrapper"
  );
  const triggerRecentWrapper = document.querySelector(".recent_work_section");

  if (recentWork && triggerRecentWrapper) {
    // Select all Swiper slides
    const swiperSlides = recentWork.querySelectorAll(".swiper-slide");

    // Loop through each slide and apply GSAP animation
    swiperSlides.forEach((slide, index) => {
      gsap.from(slide, {
        scrollTrigger: {
          trigger: triggerRecentWrapper, // Trigger the animation when the section is in view
          start: "top 80%", // Start animation when top of section reaches 80% of viewport
          end: "bottom 50%", // End animation when bottom of section reaches 50% of viewport
          toggleActions: "play", // Play animation on enter, reverse on leave
        },
        opacity: 0, // Start slide fully transparent
        y: 150, // Start slide 50px below its final position
        duration: 2.5, // Animation duration in seconds
        delay: index * 0.5, // Stagger the animation for each slide
        ease: "power2.out", // Easing function for the animation
      });
    });
  }

  const serviceSection = document.querySelector(
    ".services_section .swiper-wrapper"
  );
  const triggerServices = document.querySelector(".services_section");

  if (serviceSection && triggerServices) {
    // Select all Swiper slides
    const serviceSwiperSlides =
      serviceSection.querySelectorAll(".swiper-slide");

    // Loop through each slide and apply GSAP animation
    serviceSwiperSlides.forEach((serviceSlide, index) => {
      gsap.to(serviceSlide, {
        scrollTrigger: {
          trigger: triggerServices, // Trigger the animation when the section is in view
          start: "top 60%", // Start animation when top of section reaches 80% of viewport
          end: "bottom 50%", // End animation when bottom of section reaches 50% of viewport
          toggleActions: "play", // Play animation on enter, reverse on leave
        },
        clipPath: "inset(0)",
        duration: 2, // Animation duration in seconds
        delay: index * 0.3, // Stagger the animation for each slide
        ease: "power3.out", // Easing function for the animation
      });
    });
  }

  const clientSection = document.querySelector(
    ".clients_logo_holder .clients_data"
  );
  const triggerClient = document.querySelector(".clients_section");

  if (clientSection && triggerClient) {
    // Select all Swiper slides
    const clientsItem = clientSection.querySelectorAll("li");

    // Loop through each slide and apply GSAP animation
    clientsItem.forEach((cltItem, index) => {
      gsap.to(cltItem, {
        scrollTrigger: {
          trigger: triggerClient, // Trigger the animation when the section is in view
          start: "top 60%", // Start animation when top of section reaches 80% of viewport
          end: "bottom 50%", // End animation when bottom of section reaches 50% of viewport
          toggleActions: "play", // Play animation on enter, reverse on leave
        },
        clipPath: "inset(0)",
        duration: 2, // Animation duration in seconds
        delay: index * 0.1, // Stagger the animation for each slide
        ease: "power2.out", // Easing function for the animation
      });
    });
  }

  const agencyPartnerHolder = document.querySelector(".agency_partners");

  if (agencyPartnerHolder) {
    gsap.to(agencyPartnerHolder, {
      scrollTrigger: {
        trigger: agencyPartnerHolder, // Trigger the animation when this section is in view
        start: "top 90%", // Start animation when the top of the section is 10% away from the viewport
        end: "top 10%", // Animation ends when 90% of the section is within the viewport
        toggleActions: "play", // Play on enter, reverse on leave
      },
      clipPath: "inset(0)", // Reveal the section
      duration: 2.5, // Animation duration in seconds
      ease: "cric.out", // Easing function for smooth animation
    });
  }

  // Define fonts to observe
  const fonts = [
    { family: "Hanken Grotesk", weight: 100 },
    { family: "Hanken Grotesk", weight: 200 },
    { family: "Hanken Grotesk", weight: 300 },
    { family: "Hanken Grotesk", weight: 400 },
    { family: "Hanken Grotesk", weight: 500 },
    { family: "Hanken Grotesk", weight: 600 },
    { family: "Hanken Grotesk", weight: 700 },
    { family: "Hanken Grotesk", weight: 800 },
    { family: "Hanken Grotesk", weight: 900 },
  ];

  // Create observers
  const observers = fonts.map((font) => {
    return new FontFaceObserver(font.family, { weight: font.weight }).load();
  });

  // Wait for all fonts to load
  Promise.all(observers)
    .then(() => {
      document.body.classList.add("fonts-loaded");
      console.log("All fonts have loaded");

      const sectionTitle = document.querySelector(".section_title");

      if (sectionTitle) {
        //   animation 1
        new Textify(
          {
            el: ".section_title_heading",
            animation: {
              duration: 1,
              ease: "power3.inOut",
              animateProps: {
                y: "200%",
              },
            },
          },
          gsap
        );
      }

      const featuredTitle = document.querySelector(
        ".media_main_featured_heading"
      );

      if (featuredTitle) {
        //   animation 1
        new Textify(
          {
            el: ".media_main_featured_heading h2",
            animation: {
              duration: 1.5,
              ease: "power3.inOut",
              animateProps: {
                y: "-100%",
              },
            },
          },
          gsap
        );

        // Add ScrollTrigger animation for scroll-based effects
        gsap.from(".media_main_featured_heading h2", {
          scrollTrigger: {
            trigger: featuredTitle, // The element that triggers the animation
            start: "top 80%", // Trigger when the top of the element hits 80% of the viewport
            end: "bottom 50%", // Animation ends at 50% of the viewport
            toggleActions: "play", // Animation actions (onEnter, onLeave, etc.)
          },
          opacity: 0, // Start with the element fully transparent
          y: 50, // Start with the element 50px below its final position
          duration: 1, // Animation duration in seconds
          ease: "power3.out", // Easing function for the scroll animation
        });
      }

      const projectHighlights = document.querySelector(
        ".media_main_featured_highlights"
      );

      if (projectHighlights) {
        //   animation 1
        new Textify(
          {
            el: ".media_main_featured_highlights ul li",
            animation: {
              duration: 1.5,
              ease: "power3.inOut",
              animateProps: {
                y: "100%",
              },
            },
          },
          gsap
        );

        // Add ScrollTrigger animation for scroll-based effects
        gsap.from(".media_main_featured_highlights ul li", {
          scrollTrigger: {
            trigger: projectHighlights, // The element that triggers the animation
            start: "top 80%", // Trigger when the top of the element hits 80% of the viewport
            end: "bottom 50%", // Animation ends at 50% of the viewport
            toggleActions: "play", // Animation actions (onEnter, onLeave, etc.)
          },
          opacity: 0, // Start with the element fully transparent
          y: 50, // Start with the element 50px below its final position
          duration: 1, // Animation duration in seconds
          ease: "power3.out", // Easing function for the scroll animation
        });
      }

      const techFeaturedTitle = document.querySelector(
        ".tech_main_featured_heading"
      );

      if (techFeaturedTitle) {
        //   animation 1
        new Textify(
          {
            el: ".tech_main_featured_heading h2",
            animation: {
              duration: 1.5,
              ease: "power3.inOut",
              animateProps: {
                y: "-100%",
              },
            },
          },
          gsap
        );

        // Add ScrollTrigger animation for scroll-based effects
        gsap.from(".tech_main_featured_heading h2", {
          scrollTrigger: {
            trigger: featuredTitle, // The element that triggers the animation
            start: "top 80%", // Trigger when the top of the element hits 80% of the viewport
            end: "bottom 50%", // Animation ends at 50% of the viewport
            toggleActions: "play", // Animation actions (onEnter, onLeave, etc.)
          },
          opacity: 0, // Start with the element fully transparent
          y: 50, // Start with the element 50px below its final position
          duration: 1, // Animation duration in seconds
          ease: "power3.out", // Easing function for the scroll animation
        });
      }

      const techProjectHighlights = document.querySelector(
        ".tech_main_featured_highlights"
      );

      if (techProjectHighlights) {
        //   animation 1
        new Textify(
          {
            el: ".tech_main_featured_highlights ul li",
            animation: {
              duration: 1.5,
              ease: "power3.inOut",
              animateProps: {
                y: "100%",
              },
            },
          },
          gsap
        );

        // Add ScrollTrigger animation for scroll-based effects
        gsap.from(".media_main_featured_highlights ul li", {
          scrollTrigger: {
            trigger: projectHighlights, // The element that triggers the animation
            start: "top 80%", // Trigger when the top of the element hits 80% of the viewport
            end: "bottom 50%", // Animation ends at 50% of the viewport
            toggleActions: "play", // Animation actions (onEnter, onLeave, etc.)
          },
          opacity: 0, // Start with the element fully transparent
          y: 50, // Start with the element 50px below its final position
          duration: 1, // Animation duration in seconds
          ease: "power3.out", // Easing function for the scroll animation
        });
      }

      const imFeaturedTitle = document.querySelector(
        ".im_main_featured_heading"
      );

      if (imFeaturedTitle) {
        //   animation 1
        new Textify(
          {
            el: ".im_main_featured_content_header h4, .im_main_featured_heading h2, .im_main_featured_heading small",
            animation: {
              duration: 1.5,
              ease: "power3.inOut",
              animateProps: {
                y: "-100%",
              },
            },
          },
          gsap
        );

        // Add ScrollTrigger animation for scroll-based effects
        gsap.from(
          ".im_main_featured_content_header h4, .im_main_featured_heading h2, .im_main_featured_heading small",
          {
            scrollTrigger: {
              trigger: featuredTitle, // The element that triggers the animation
              start: "top 80%", // Trigger when the top of the element hits 80% of the viewport
              end: "bottom 50%", // Animation ends at 50% of the viewport
              toggleActions: "play", // Animation actions (onEnter, onLeave, etc.)
            },
            opacity: 0, // Start with the element fully transparent
            y: 50, // Start with the element 50px below its final position
            duration: 1, // Animation duration in seconds
            ease: "power3.out", // Easing function for the scroll animation
          }
        );
      }

      const imProjectHighlights = document.querySelector(
        ".im_main_featured_highlights"
      );

      if (imProjectHighlights) {
        //   animation 1
        new Textify(
          {
            el: ".im_main_featured_highlights ul li",
            animation: {
              duration: 1.5,
              ease: "power3.inOut",
              animateProps: {
                y: "100%",
              },
            },
          },
          gsap
        );

        // Add ScrollTrigger animation for scroll-based effects
        gsap.from(".im_main_featured_highlights ul li", {
          scrollTrigger: {
            trigger: projectHighlights, // The element that triggers the animation
            start: "top 80%", // Trigger when the top of the element hits 80% of the viewport
            end: "bottom 50%", // Animation ends at 50% of the viewport
            toggleActions: "play", // Animation actions (onEnter, onLeave, etc.)
          },
          opacity: 0, // Start with the element fully transparent
          y: 50, // Start with the element 50px below its final position
          duration: 1, // Animation duration in seconds
          ease: "power3.out", // Easing function for the scroll animation
        });
      }

      const heroTagLines = document.querySelectorAll(".hero_tag_lines");

      if (heroTagLines) {
        new Textify(
          {
            el: ".hero_tag_lines p",
            largeText: true,
            splitType: "lines",
            animation: {
              by: "lines",
              duration: 2.5,
              ease: "power3.inOut",
              stagger: 0.1,
              animateProps: {
                scale: 0.5,
                opacity: 0,
              },
            },
          },
          gsap
        );
      }
    })
    .catch((err) => {
      console.error("One or more fonts failed to load", err);
    });

  /* 
  AOS.init({
    duration: 1200,
    once: true,
  }); 
  */
});
