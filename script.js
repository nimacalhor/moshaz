//________________________________________________________________________________
// elements
// ____________________
// header
const header = document.querySelector("header")
const headerDropDownParents = document.querySelectorAll(".header__list__item")
const headerDropDownEl = document.querySelectorAll("ul.header__list__dropdown-content")
const headerNav = document.querySelector(".header__nav");

const overlayShadowEl = document.querySelector("div.overlay-shadow")
const btnHamburger = document.querySelector(".header__hamburger")

// ____________________
// hero
const sectionHero = document.querySelector("div.hero")
const containerHeroSlider = document.querySelector(".hero__slider__cn")
const HeroSlides = Array.from(containerHeroSlider.children)
const containerHeroSliderDots = document.querySelector(".hero__slider__nav")
const heroSliderDots = Array.from(containerHeroSliderDots.children)

// ____________________
// footer
const footerNavList = document.querySelector('ul.footer__link')
const footerFormCn = document.querySelector("div.footer__section--form__cn")
const btnFooterListToggler = document.querySelector("button.footer__section__toggle-btn--links")
const btnFooterFormToggler = document.querySelector("button.footer__section__toggle-btn--form")


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
const stickHeader = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
        header.classList.add("sticky-header")
    } else header.classList.remove('sticky-header')
}

const headerObserver = new IntersectionObserver(stickHeader, {
    root: null,
    threshold: 0,
    rootMargin: "0px"
})

headerObserver.observe(sectionHero)

// ________________________________________________________________________________
// footer dropDowns
const footerDropDowns = {
    list: {
        el: footerNavList,
        initialHeight: footerNavList.getBoundingClientRect().height,
        controller: btnFooterListToggler,
        isActive: false
    },
    from: {
        el: footerFormCn,
        initialHeight: footerFormCn.getBoundingClientRect().height,
        controller: btnFooterFormToggler,
        isActive: false
    }
}

for (let [section, { el, initialHeight, controller, isActive }] of Object.entries(footerDropDowns)) {

    if (window.innerWidth > 768) break

    // close dropDowns default
    el.style.height = 0;
    el.style.transform = "scaleY(0)"
    isActive = false

    // listen for click
    controller.addEventListener("click", function () {
        isActive = !isActive;

        if (isActive) {
            el.style.height = initialHeight + "px";
        }
        else {
            el.style.height = 0
        }
    })
}

// ________________________________________________________________________________
// carousel functions
const setSlidePosition = function (el, i, width) {
    el.style.left = width * i + "px"
}

const moveSlide = function (parent, className, target) {
    const currentClassName = `${className}--current`
    const currentSlide = parent.querySelector(`.${currentClassName}`)
    let targetSlide = target;

    // movement info
    if (target === "next") targetSlide = currentSlide.nextElementSibling;
    else if (target === "prev") targetSlide = currentSlide.previousElementSibling;

    // if there are no more slides 
    if (!targetSlide) {
        const allSlides = Array.from(parent.children)
        allSlides.forEach(el => el.classList.remove(currentClassName));
        moveSlide(parent, className, allSlides[0])
        return
    }

    const amountToMove = targetSlide.style.left;

    // move the parent
    parent.style.transform = `translateX(-${amountToMove})`

    // change current class
    currentSlide.classList.remove(currentClassName)
    currentSlide.dataset.current = "false";
    targetSlide.classList.add(currentClassName)
    targetSlide.dataset.current = "true"
}

const createSliderIndicators = function (container, amount) {
    // find indicator example
    const indicator = container.firstElementChild;
    // empty container
    container.innerHTML = "";
    // create indicator as amount 
    for (let i = 0; i < amount; i++) {
        const newInd = indicator.cloneNode()
        newInd.dataset.target = i;
        container.appendChild(newInd)
    }
    // make active class
    const className = indicator.classList[0] + "--current";
    const indicators = container.children;
    indicators[0].classList.add(className)
}

const getIndicatorIndex = function (e) {
    const clickedInd = e.target.closest("button");
    // find Index of indicator
    const result = clickedInd.dataset.target
    return result
}

const updateInd = function (sliderParent, indParent) {
    const className = indParent.firstElementChild.classList[0] + "--current";
    const indicatorArr = Array.from(indParent.children);

    indicatorArr.forEach(ind => ind.classList.remove(className))

    const index = Math.abs(Array.from(sliderParent.children).findIndex(item => item.dataset.current === "true"))

    indicatorArr[index].classList.add(className)
}
// ________________________________________________________________________________
// hero carousel
const heroSlideInfo = {
    slideWidth: HeroSlides[0].getBoundingClientRect().width
}

// arrange each slide item
HeroSlides.forEach((el, i) => setSlidePosition(el, i, heroSlideInfo.slideWidth))


// ____________________
// control by indicators
// create them
createSliderIndicators(containerHeroSliderDots, (Array.from(containerHeroSlider.children).length))

containerHeroSliderDots.addEventListener("click", e => {
    if (e.target.localName !== "button") return
    moveSlide(containerHeroSlider, "hero__slider__item", HeroSlides[getIndicatorIndex(e)]);

    updateInd(containerHeroSlider, containerHeroSliderDots)
})

// 1 check if the clicked el is not parent
// 2 change the current class name
// 3 find the index of that el
// 4 move the slider container