document.getElementById("year").textContent = new Date().getFullYear();

const themeToggle = document.querySelector(".theme-toggle");

let savedTheme = null;
try {
    savedTheme = localStorage.getItem("theme");
} catch (e) {}

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.setAttribute("aria-label", "Switch to light theme");
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");

    try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
});

const navList = document.querySelector(".hero_nav-list");
const NAV_TOP = 14;
const SHRINK_DISTANCE = 250;

let navStart = 0;

function measureNav() {
    document.body.classList.remove("nav-is-fixed");
    document.documentElement.style.setProperty("--nav-p", 0);
    navStart = navList.getBoundingClientRect().top + window.scrollY - NAV_TOP;
    updateNav();
}

function updateNav() {
    const passed = window.scrollY - navStart;
    const isFixed = passed >= 0;
    const progress = Math.min(Math.max(passed / SHRINK_DISTANCE, 0), 1);

    document.body.classList.toggle("nav-is-fixed", isFixed);
    document.documentElement.style.setProperty("--nav-p", progress.toFixed(3));
}

window.addEventListener("scroll", updateNav, { passive: true });
window.addEventListener("resize", measureNav);
document.fonts.ready.then(measureNav);
measureNav();

const list = document.querySelector(".projects_list");
const prevBtn = document.querySelector(".slider-btn--prev");
const nextBtn = document.querySelector(".slider-btn--next");
const originals = [...list.querySelectorAll(".projects_item")];

function makeClone(item) {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((a) => a.removeAttribute("tabindex", "-1"));
    return clone;
}

originals.forEach((item) => list.append(makeClone(item)));
[...originals].reverse().forEach((item) => list.prepend(makeClone(item)));

function cardStep() {
    const card = list.querySelector(".projects_item");
    const gap = parseFloat(getComputedStyle(list).gap) || 0;
    return card.offsetWidth + gap;
}

function setWidth() {
    return cardStep() * originals.length;
}

function jumpTo(position) {
    list.style.scrollBehavior = "auto";
    list.scrollLeft = position;
    list.style.scrollBehavior = "";
}

jumpTo(setWidth());

function wrapAround() {
    const width = setWidth();
    if (list.scrollLeft < width * 0.5) {
        jumpTo(list.scrollLeft + width);
    } else if (list.scrollLeft >= width * 1.5) {
        jumpTo(list.scrollLeft - width);
    }
}

let scrollTimer;
list.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(wrapAround, 120);
});

window.addEventListener("resize", () => jumpTo(setWidth()));

prevBtn.addEventListener("click", () => list.scrollBy({ left: -cardStep()}));
nextBtn.addEventListener("click", () => list.scrollBy({ left: cardStep()}));