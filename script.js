//________________________________________________________________________________
// elements
// header ____________________

const header = document.querySelector("header")
const headerDropDownParents = document.querySelectorAll(".header__list__item")
const headerDropDownEl = document.querySelectorAll("ul.header__list__dropdown-content")
const headerNav = document.querySelector(".header__nav");

const overlayShadowEl = document.querySelector("div.overlay-shadow")
const btnHamburger = document.querySelector(".header__hamburger")

// hero ____________________
const sectionHero = document.querySelector("div.hero")
const containerHeroSlider = document.querySelector(".hero__slider__cn")
const heroSlides = Array.from(containerHeroSlider.children)
const containerHeroSliderDots = document.querySelector(".hero__slider__nav")
const heroSliderDots = Array.from(containerHeroSliderDots.children)

// gallery ____________________
const containerGallerySlider = document.querySelector("ul.gallery__carousel__cn")
const gallerySlides = Array.from(containerGallerySlider.children)

const btnGallerySlideLeft = document.querySelector("button.gallery__carousel__controller--left")
const btnGallerySlideRight = document.querySelector("button.gallery__carousel__controller--right")

// books carousel ____________________
const containerBooksSlider = document.querySelector("ul.books__carousel__cn")
const booksSlides = Array.from(containerBooksSlider.children)

const btnBooksSliderRight = document.querySelector("button.books__carousel__action--right")
const btnBooksSliderLeft = document.querySelector("button.books__carousel__action--left")


// teacher intro ____________________
const containerIntroSlider = document.querySelector("ul.intro__carousel__cn")
const introSlides = Array.from(containerIntroSlider.children)

const btnIntroSliderRight = document.querySelector("button.intro__carousel__indicator--right")
const btnIntroSliderLeft = document.querySelector("button.intro__carousel__indicator--left")

// schools ____________________
const containerSchoolSlider = document.querySelector("ul.school__carousel__cn")
const schoolSlides = Array.from(containerSchoolSlider.children)

const containerSchoolDots = document.querySelector("div.school__carousel__indicators")
const schoolDots = Array.from(containerSchoolDots.children)

// news ____________________
const containerNewsSlider = document.querySelector("ul.news__carousel__cn")
const newsSlides = Array.from(containerNewsSlider.children)

const btnNewsSliderRight = document.querySelector("button.news__carousel__ind--right")
const btnNewsSliderLeft = document.querySelector("button.news__carousel__ind--left")

// article ____________________
const containerArticleSlider = document.querySelector("ul.article__carousel__cn")
const articleSlides = Array.from(containerArticleSlider.children)

const containerArticleDots = document.querySelector(".article__carousel__indicators")
const articleDots = Array.from(containerArticleDots.children)

// footer ____________________
const footerNavList = document.querySelector('ul.footer__link')
const footerFormCn = document.querySelector("div.footer__section--form__cn")
const btnFooterListToggler = document.querySelector("button.footer__section__toggle-btn--links")
const btnFooterFormToggler = document.querySelector("button.footer__section__toggle-btn--form")

const getViewPort = () => Math.max(document.documentElement.clientWidth, window.innerWidth);

// Classes ________________________________________________________________________________

// Accordion ____________________
class Accordion {
    constructor(controller, content, padding = null,) {
        this._controller = controller; // btn to open / close the accordion
        this._content = content;    // element which is hidden by default
        this._padding = padding && padding + "rem";

        this._setInitial();
        this._controller.addEventListener("click", this._toggle)
    }

    _isActive() { // true / false
        return !(this._content.style.maxHeight)
    }

    _setInitial() { // being closed by default
        this._content.classList.add("accordion--hidden")
    }

    _toggle() {
        if (this._isActive()) {
            this._content.style.maxHeight = this._content.scrollHeight + "px"
            this._content.style.padding = this._padding
        }
        else {
            this._content.style.maxHeight = null
            this._content.style.padding = null
        }
    }
}

// navigation toggle ____________________
class Navigation {
    constructor() {
        this._isActive = false;
        btnHamburger.addEventListener("click", this._toggle.bind(this)); // top right (=) button
        overlayShadowEl.addEventListener("click", this._close.bind(this)); // shadow on page when nav is active
    }
    _toggle() { // close / open
        this._isActive = !this._isActive;
        if (this._isActive) {
            headerNav.style.transform = "translateX(0)"
            overlayShadowEl.style.display = "block"
        }
        else {
            headerNav.style.transform = "translateX(120%)"
            overlayShadowEl.style.display = "none"
        }
    }
    _close() {
        this._isActive = false
        headerNav.style.transform = "translateX(120%)"
        overlayShadowEl.style.display = "none";
        // closeAllNavDropDowns()
    }
}

// sticky nav ____________________
class StickyHeader {
    constructor() {
        this._observer = new IntersectionObserver(this._stickHeader, {
            root: null,
            threshold: 0,
            rootMargin: "0px"
        });
        this._observer.observe(sectionHero);
    }

    _stickHeader(entries) { // call back F
        const [entry] = entries;
        if (!entry.isIntersecting) {
            header.classList.add("sticky-header")
        } else header.classList.remove('sticky-header')
    }
}

// Slider ____________________
class Slider {
    constructor(parent, slides) {
        this._parent = parent; // <ul> [all slides] </ul>
        this._slides = slides; // <li> [each item] </li>
    }

    // position
    _getSlideWidth() { // width of the first el 
        return this._slides[0].getBoundingClientRect().width
    }

    _setSlidePosition(el, i, margin = 0) { // make each slide item sit next to each other
        // margin is used to make space between each item
        el.style.left = this._getSlideWidth() * i + margin + "px"
    }

    setPosition(margin) {
        this._slides.forEach((el, i) => this._setSlidePosition(el, i, margin))
    }

    // moving the slides 🚎
    _identifyTarget(target, currentSlide) { // identify which item user wants to see
        if (target === "next") return currentSlide.nextElementSibling;
        else if (target === "prev") return currentSlide.previousElementSibling;
        else return target
    }

    _resetSlider() {
        this._slides.forEach(el => el.dataset.current = "false");
        this._slides[0].dataset.current = "true";
        this.move(this._slides[0])
    }

    _transformParent(amount) {
        this._parent.style.transform = `translateX(-${amount})`
    }

    move(target) {
        const currentSlide = this._parent.querySelector(`li[data-current="true"]`)
        let targetSlide = this._identifyTarget(target, currentSlide);
        if (!targetSlide) {
            this._resetSlider();
            return
        }
        const amountToMove = targetSlide.style.left;
        this._transformParent(amountToMove)

        currentSlide.dataset.current = "false";
        targetSlide.dataset.current = "true"
    }
}

class SliderWithInd extends Slider { // slide which can be controlled using indicators ⚫⚫⚫ 
    constructor(parent, slides, indCn) {
        super(parent, slides);
        // indicator container
        this._indCn = indCn;
        this._indicators;
    }

    _getClass() { // indicator class for changing the ui
        return this._indCn.firstElementChild.classList[0] + "--current"
    }

    // create ind __________

    _insertIndicator(ind, i) { // appendChild
        const newInd = ind.cloneNode()
        newInd.dataset.target = i;
        this._indCn.appendChild(newInd)
    }

    createIndicators() { // make ⚫ as much as slides
        const { _indCn, _insertIndicator, _slides, _getClass } = this;
        const indicator = _indCn.firstElementChild; // need one example from DOM
        _indCn.innerHTML = ""; // empty container

        for (let i = 0; i < _slides.length; i++) _insertIndicator.call(this, indicator, i)

        this._indicators = Array.from(this._indCn.children)
        // make active class
        const className = _getClass.call(this);
        this._indicators[0].classList.add(className) // first el being active
    }

    // click handling __________

    getIndex(e) { // witch one is clicked
        const clickedInd = e.target.closest("button");
        return clickedInd.dataset.target
    }

    update() { // update ind
        const className = this._getClass.call(this);
        this._indicators.forEach(ind => ind.classList.remove(className))
        const index = Math.abs(this._slides.findIndex(item => item.dataset.current === "true"))
        this._indicators[index].classList.add(className)
    }
}

// ________________________________________________________________________________
// ________________________________________________________________________________

// mobile nav dropdown
headerDropDownParents.forEach(function (el) {
    if (!el.querySelector("ul")) return
    new Accordion(el.querySelector(".header__list__item__title"), el.querySelector("ul.header__list__dropdown-content"))
})

// footer dropDowns
if (getViewPort() < 768) {
    new Accordion(btnFooterListToggler, footerNavList, false,)
    new Accordion(btnFooterFormToggler, footerFormCn, false,)
}

// navigation toggle in mobile
const navigation = new Navigation();

// sticky nav on scroll
const stickyHeader = new StickyHeader();

// Sliders
const pageSlidersData = [
    //[--slidesContainer--, --slidesArray--, --btnNext--, --btnPrev--, --⚫Container--, --margin = 0-- ]
    // hero carousel
    [containerHeroSlider, heroSlides, false, false, containerHeroSliderDots],
    // gallery carousel
    [containerGallerySlider, gallerySlides, btnGallerySlideRight, btnGallerySlideLeft, false],
    // books slider
    [containerBooksSlider, booksSlides, btnBooksSliderRight, btnBooksSliderLeft, false, 5],
    // teacher intro slider
    [containerIntroSlider, introSlides, btnIntroSliderRight, btnIntroSliderLeft, false, 5],
    // school Slider
    [containerSchoolSlider, schoolSlides, false, false, containerSchoolDots],
    // news slider
    [containerNewsSlider, newsSlides, btnNewsSliderRight, btnNewsSliderLeft, false],
    // articles carousel
    [containerArticleSlider, articleSlides, false, false, containerArticleDots]
]

const activateSlider = function (slidesCn, slidesArr, btnNext, btnPrev, dotsCn, margin = 0) {
    let slider;
    if (dotsCn) slider = new SliderWithInd(slidesCn, slidesArr, dotsCn)
    else slider = new Slider(slidesCn, slidesArr)

    slider.setPosition(margin)

    btnNext && btnNext.addEventListener("click", () => slider.move("next"))
    btnPrev && btnPrev.addEventListener("click", () => slider.move("prev"))

    if (!dotsCn) return

    slider.createIndicators()
    dotsCn.addEventListener("click", e => {
        if (e.target.localName !== "button") return
        slider.move(slidesArr[slider.getIndex(e)])
        slider.update()
    })
}

pageSlidersData.forEach(argArr => activateSlider(...argArr))

