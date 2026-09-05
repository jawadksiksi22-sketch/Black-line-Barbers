
/* BLACKLINE BARBERS — Premium Barbershop JavaScript */

(function () {
  "use strict";

  var navbar = document.getElementById("navbar");
  var backToTop = document.getElementById("backToTop");

  function handleScroll() {
    var scrolled = window.pageYOffset > 60;
    if (navbar) navbar.classList.toggle("scrolled", scrolled);
    if (backToTop) backToTop.classList.toggle("visible", window.pageYOffset > 500);
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  var menuToggle = document.getElementById("menuToggle");
  var navMenu = document.getElementById("navMenu");
  var navLinks = document.querySelectorAll(".nav-link, .nav-cta");

  function toggleMenu(open) {
    if (!menuToggle || !navMenu) return;
    var isActive = open !== undefined ? open : !navMenu.classList.contains("active");
    menuToggle.classList.toggle("active", isActive);
    navMenu.classList.toggle("active", isActive);
    menuToggle.setAttribute("aria-expanded", String(isActive));
    document.body.style.overflow = isActive ? "hidden" : "";
  }

  if (menuToggle) menuToggle.addEventListener("click", function () { toggleMenu(); });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navMenu && navMenu.classList.contains("active")) toggleMenu(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu && navMenu.classList.contains("active")) toggleMenu(false);
  });

  document.addEventListener("click", function (e) {
    if (navMenu && navMenu.classList.contains("active") && !navMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href === "#" || href === "") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  var revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add("visible"); });
  }

  var sections = document.querySelectorAll("section[id]");
  var navLinkEls = document.querySelectorAll(".nav-link");
  function updateActiveNav() {
    var scrollPos = window.pageYOffset + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) link.classList.add("active");
        });
      }
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  var counters = document.querySelectorAll(".stat-number[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1800;
    var startTime = null;
    function formatNumber(num) {
      if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K";
      return String(num);
    }
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = formatNumber(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  if (backToTop) backToTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var allImages = document.querySelectorAll("img");
  allImages.forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.opacity = "0";
      img.parentElement.style.background = "linear-gradient(135deg, #1a1a1a, #2a2a2a)";
      img.parentElement.style.minHeight = img.parentElement.style.minHeight || "200px";
    });
  });

  var heroBg = document.querySelector(".hero-bg");
  if (heroBg) {
    var testImg = new Image();
    testImg.src = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80";
    testImg.onerror = function () {
      heroBg.style.background =
