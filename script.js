// const allSections = document.querySelectorAll("section");
// const footer = document.querySelector("footer")

// allSections.forEach(el => el.remove())
// footer.remove()

// ________________________________________________________________________________
// elements
const header = document.querySelector("header")
const headerDropDownParents = document.querySelectorAll(".header__list__item")
const headerDropDownEl = document.querySelectorAll("ul.header__list__dropdown-content")
const headerNav = document.querySelector(".header__nav");


const sectionGallery = document.querySelector("div.gallery")
const sectionHero = document.querySelector("div.hero")

const overlayShadowEl = document.querySelector("div.overlay-shadow")
const btnHamburger = document.querySelector(".header__hamburger")

// ________________________________________________________________________________
// mobile nav dropdown
const headerDropDown = {}

// make a name from the class name of element
const getModifierClass = function (el) {
    const elClass = Array.from(el.classList).filter(className => className.includes("--")).join("")
    const elName = elClass.slice(elClass.indexOf("--") + 2);
    return elName
}

// get the needed info
const setHeaderDropDown = function (el) {
    const elName = getModifierClass(el);
    const child = el.querySelector("ul");
    headerDropDown[elName] = {
        el,
        isActive: false,
        dropDownEl: child,
        marginAmount: child.getBoundingClientRect().height + 20 + "px"
    }
}

const closeAllNavDropDowns = function () {
    for (let [key, { isActive, el, dropDownEl }] of Object.entries(headerDropDown)) {
        isActive = false
        dropDownEl.style.transform = "scale(0)"
        el.style.marginBottom = 0;
    }
}

headerDropDownParents.forEach(function (el) {
    if (el.children.length < 2) return
    setHeaderDropDown(el)

    el.addEventListener("click", function ({ target }) {
        // get the element which will get the margin
        const correctEl = target.closest(".header__list__item");
        const targetName = getModifierClass(correctEl);
        // change active state
        headerDropDown[targetName].isActive = !headerDropDown[targetName].isActive;

        if (headerDropDown[targetName].isActive) { // open
            correctEl.style.marginBottom = headerDropDown[targetName].marginAmount;
            headerDropDown[targetName].dropDownEl.style.transform = "scale(1)"

        } else { // close
            headerDropDown[targetName].dropDownEl.style.transform = "scale(0)"
            setTimeout(() => {
                correctEl.style.marginBottom = 0;
            }, 300);
        }

    })
})

headerDropDownEl.forEach(el => el.style.transform = "scaleY(0)")

// close dropdown when click outside
headerNav.addEventListener("click", function ({ target }) {
    console.log({ target })
    if (target.localName !== "img"
        && target.localName !== "form"
        && target.localName !== "input"
        && target.localName !== "button"
        && target.localName !== "ul") return
    else closeAllNavDropDowns();
})

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        headerNav.style.transform = "translateX(0)"
        closeAllNavDropDowns();
        overlayShadowEl.style.display = "none"
    }
})

// ________________________________________________________________________________
// navigation toggle in mobile
let navIsOpen = false;

btnHamburger.addEventListener("click", function () {
    navIsOpen = !navIsOpen;
    if (navIsOpen) {
        headerNav.style.transform = "translateX(0)"
        overlayShadowEl.style.display = "block"
    }
    else {
        headerNav.style.transform = "translateX(120%)"
        overlayShadowEl.style.display = "none"
    }
})

overlayShadowEl.addEventListener("click", () => {
    navIsOpen = false
    headerNav.style.transform = "translateX(120%)"
    overlayShadowEl.style.display = "none";
    closeAllNavDropDowns()
})

// ________________________________________________________________________________
// sticky nav on scroll
const stickHeader = function(entries){
    const [entry] = entries;
    if(!entry.isIntersecting){
        console.log(entry)
        header.classList.add("sticky-header")
    }else header.classList.remove('sticky-header')
}

const headerObserver = new IntersectionObserver(stickHeader, {
    root:null,
    threshold:0,
    rootMargin: "0px"
})

headerObserver.observe(sectionHero)

