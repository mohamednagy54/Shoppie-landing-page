// mobile navbar toggler

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

navToggler.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// header active
// scroll to top

const header = document.querySelector("[data-header]");

const goTop = document.querySelector(".to-top");

goTop.addEventListener("click", () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

window.addEventListener("scroll", () => {
  header.classList[this.scrollY > 50 ? "add" : "remove"]("active");

  scrollFunction();
});

function scrollFunction() {
  if (
    document.body.scrollTop > 700 ||
    document.documentElement.scrollTop > 700
  ) {
    goTop.classList.add("show");
  } else {
    goTop.classList.remove("show");
  }
}

// Animation

ScrollReveal({
  reset: false,
  distance: "60px",
  duration: 1500,
  delay: 300,
});

ScrollReveal().reveal(".slide-left", { delay: 200, origin: "left" });
ScrollReveal().reveal(".slide-right", { delay: 300, origin: "bottom" });

ScrollReveal().reveal(".left", { delay: 200, origin: "left" });
ScrollReveal().reveal(".center", { delay: 400, origin: "bottom" });
ScrollReveal().reveal(".right", { delay: 200, origin: "right" });
