jQuery(document).ready(function ($) {
  // footer full year
  const fullYear = new Date().getFullYear();
  const fullYearElement = document.querySelector(".fullYear");

  if (fullYearElement) {
    fullYearElement.textContent = fullYear;
  }

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

  $(".dsk_menu ul > li:has(ul)").addClass("has-child");

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

  // Add this after your existing menu click handlers
  $("#menu.menuNav li ul.children li a").on("click", function (e) {
    // Don't add this handler to items with submenus
    if (!$(this).parent().hasClass("in-dropdown")) {
      // Close the off-canvas menu
      $(".off_canvas").removeClass("active");
      $(".offset_menu_trigger").removeClass("active");
      $("header").removeClass("menu_open");
      $("html, body").removeClass("overflow-hidden");

      // Reset any open submenus
      $(this).parent().removeClass("active");
      $(".icon-arrow").removeClass("open");
      $(".icon-caret").removeClass("open-caret");

      // Restore Lenis scrolling
      lenis.start();

      // Optional: Add a small delay to ensure smooth transition
      setTimeout(() => {
        $(".children, .in-dropdown").slideUp("slow", "swing");
      }, 300);
    }
  });

  /* 
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
          slidesPerView: 1.8,
          spaceBetween: 40,
        },

        1024: {
          slidesPerView: 2.5,
          spaceBetween: 20,
        },

        1199: {
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
          slidesPerView: 1.5,
        },

        1024: {
          slidesPerView: 1.5,
        },

        1199: {
          slidesPerView: 3,
          pagination: false,
        },
      },
    });
  } 
    */

  if ($(window).width() < 768) {
  }

  if ($(window).width() < 1199) {
    console.log("Less than window");
  }

  // Replace the GSAP/Lenis section with this new code
  const lenis = new Lenis({
    smooth: true,
    direction: "vertical",
  });

  // Basic Lenis RAF
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Exclude menuNav from Lenis smooth scrolling
  const menuNav = document.querySelector(".menuNav");
  menuNav.addEventListener("wheel", (e) => {
    e.stopPropagation();
  });

  // Handle touch events
  menuNav.addEventListener(
    "touchmove",
    (e) => {
      e.stopPropagation();
    },
    { passive: true }
  );

  // Optional: Add momentum scrolling for iOS
  menuNav.style.webkitOverflowScrolling = "touch";

  /* 
  // Header show/hide on scroll
  const header = document.querySelector(".header");
  let lastScrollTop = 0;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add fixed class when scrolled past 100px
    if (scrollTop > 100) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }

    // Hide/show header based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  }
 */
  // Throttle the scroll event for better performance
  let ticking = false;
  document.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  AOS.init({
    duration: 1200,
    once: true,
  });
});
