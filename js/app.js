jQuery(document).ready(function ($) {
  // 1. Initialize Lenis Globally
  window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // 2. Sync GSAP with Lenis (Single Unified Loop)
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Prevents jumps if there's a momentary lag
  gsap.ticker.lagSmoothing(0);

  // 3. UI Helpers
  const fullYearElement = document.querySelector(".fullYear");
  if (fullYearElement) fullYearElement.textContent = new Date().getFullYear();

  Fancybox.bind("[data-fancybox]", {});

  // 4. Menu Class Logic (has-children & in-dropdown)
  // Identifies parent items and sub-items for the dropdown logic
  $(".dsk_menu ul > li:has(ul)").addClass("has-child");

  $("#menu.menuNav > li:has(ul)")
    .addClass("has-children")
    .children("ul")
    .addClass("children");

  $("#menu.menuNav li ul.children li:has(ul)")
    .addClass("in-dropdown")
    .children("ul")
    .addClass("in-dropdown");

  // 5. Optimized Mobile Menu Trigger
  const offCanvas = $(".off_canvas");
  const menuTrigger = $(".offset_menu_trigger");
  const header = $("header");

  menuTrigger.on("click", function () {
    const isMenuOpen = $(this).hasClass("active");

    $(this).toggleClass("active");
    $("html, body").toggleClass("overflow-hidden", !isMenuOpen);
    header.toggleClass("menu_open", !isMenuOpen);
    offCanvas.toggleClass("active", !isMenuOpen);

    // Stop Lenis when menu is open to prevent background scrolling
    isMenuOpen ? lenis.start() : lenis.stop();
  });

  // 6. Smooth GSAP Accordion (Replaces jQuery slideToggle)
  $(".has-children, .in-dropdown").on("click", function (e) {
    e.stopPropagation();
    const submenu = $(this).children("ul");
    const isOpen = $(this).hasClass("active");

    // Close sibling menus
    const siblings = $(this).siblings(".active");
    if (siblings.length) {
      gsap.to(siblings.children("ul"), {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
      siblings
        .removeClass("active")
        .find(".icon-arrow, .icon-caret")
        .removeClass("open open-caret");
    }

    // Toggle current menu
    if (!isOpen) {
      $(this).addClass("active");
      gsap.fromTo(
        submenu,
        { height: 0 },
        { height: "auto", duration: 0.5, ease: "power2.out" },
      );
    } else {
      $(this).removeClass("active");
      gsap.to(submenu, { height: 0, duration: 0.4, ease: "power2.inOut" });
    }

    $(this).find(".icon-arrow, .icon-caret").toggleClass("open open-caret");
  });

  // 7. Lenis Exclusion for Side Menu
  const menuNav = document.querySelector(".menuNav");
  if (menuNav) {
    // Built-in Lenis attribute to allow internal scrolling in fixed sidebars
    menuNav.setAttribute("data-lenis-prevent", "");
  }

  // 8. Smart Header (Hide on Scroll Down / Show on Scroll Up)
  ScrollTrigger.create({
    start: "top -100",
    onUpdate: (self) => {
      const headerEl = document.querySelector(".header");

      // Toggle 'fixed' background class
      if (self.scroll() > 100) {
        headerEl.classList.add("fixed");
      } else {
        headerEl.classList.remove("fixed");
      }

      // Hide/Show logic using yPercent for performance
      if (self.progress > 0.05) {
        gsap.to(headerEl, {
          yPercent: self.direction === 1 ? -100 : 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
  });

  // 9. Initialize AOS (for minor entrance animations)
  // Wait for Lenis and AOS to be ready
  function initAOSWithLenis() {
    if (typeof AOS === "undefined") {
      console.warn("AOS not loaded yet");
      return;
    }

    // Destroy any existing AOS instance to avoid conflicts
    if (AOS.init && document.body.hasAttribute("data-aos-init")) {
      // AOS already initialized – we'll re-init with new options
    }

    // Recommended AOS settings for smooth scroll + visibility on each scroll
    AOS.init({
      once: true, // Allow animations to replay when scrolling back up
      offset: 100, // Trigger offset (px from viewport edge)
      duration: 1200, // Animation duration
      easing: "ease-out-quad",
      delay: 0,
      startEvent: "DOMContentLoaded",
      throttleDelay: 99,
      debounceDelay: 50,
    });

    // Force AOS to refresh after Lenis scroll events
    if (window.lenis) {
      window.lenis.on("scroll", () => {
        AOS.refresh();
      });
    }

    // Also on window scroll fallback
    window.addEventListener("scroll", () => {
      AOS.refresh();
    });

    // Refresh after page load and any content changes
    window.addEventListener("load", () => {
      AOS.refresh();
    });

    console.log("✅ AOS reconfigured with Lenis support");
  }

  // If document already loaded, run; else wait
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAOSWithLenis);
  } else {
    initAOSWithLenis();
  }
});
