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
const heroSlides = Array.from(containerHeroSlider.children)
const containerHeroSliderDots = document.querySelector(".hero__slider__nav")
const heroSliderDots = Array.from(containerHeroSliderDots.children)

// ____________________
// gallery
const containerGallerySlider = document.querySelector("ul.gallery__carousel__cn")
const gallerySlides = Array.from(containerGallerySlider.children)

const btnGallerySlideLeft = document.querySelector("button.gallery__carousel__controller--left")
const btnGallerySlideRight = document.querySelector("button.gallery__carousel__controller--right")

// ____________________
// books carousel
const containerBooksSlider = document.querySelector("ul.books__carousel__cn")
const booksSlides = Array.from(containerBooksSlider.children)

const btnBooksSliderRight = document.querySelector("button.books__carousel__action--right")
const btnBooksSliderLeft = document.querySelector("button.books__carousel__action--left")


// ____________________
// teacher intro
const containerIntroSlider = document.querySelector("ul.intro__carousel__cn")
const introSlides = Array.from(containerIntroSlider.children)

const btnIntroSliderRight = document.querySelector("button.intro__carousel__indicator--right")
const btnIntroSliderLeft = document.querySelector("button.intro__carousel__indicator--left")

// ____________________
// schools
const containerSchoolSlider = document.querySelector("ul.school__carousel__cn")
const schoolSlides = Array.from(containerSchoolSlider.children)

const containerSchoolDots = document.querySelector("div.school__carousel__indicators")
const schoolDots = Array.from(containerSchoolDots.children)

// ____________________
// news
const containerNewsSlider = document.querySelector("ul.news__carousel__cn")
const newsSlides = Array.from(containerNewsSlider.children)

const btnNewsSliderRight = document.querySelector("button.news__carousel__ind--right")
const btnNewsSliderLeft = document.querySelector("button.news__carousel__ind--left")

// ____________________
// article
const containerArticleSlider = document.querySelector("ul.article__carousel__cn")
const articleSlides = Array.from(containerArticleSlider.children)

const containerArticleDots = document.querySelector(".article__carousel__indicators")
const articleDots = Array.from(containerArticleDots.children)

// ____________________
// footer
const footerNavList = document.querySelector('ul.footer__link')
const footerFormCn = document.querySelector("div.footer__section--form__cn")
const btnFooterListToggler = document.querySelector("button.footer__section__toggle-btn--links")
const btnFooterFormToggler = document.querySelector("button.footer__section__toggle-btn--form")

// ________________________________________________________________________________
// Accordion
class Accordion {
    constructor(controller, content, padding = null,) {
        this._controller = controller;
        this._content = content;
        this._padding = padding && padding + "rem";

        this._setInitial()
        this._controller.addEventListener("click", () => this._toggle())
    }

    _isActive() {
        return !(this._content.style.maxHeight)
    }

    _setInitial() {
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

const getViewPort = () => Math.max(document.documentElement.clientWidth, window.innerWidth);


// ________________________________________________________________________________
// mobile nav dropdown
headerDropDownParents.forEach(function (el) {
    if (!el.querySelector("ul")) return
    new Accordion(el.querySelector(".header__list__item__title"), el.querySelector("ul.header__list__dropdown-content"))
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
if (getViewPort() < 768) {
    new Accordion(btnFooterListToggler, footerNavList, false,)
    new Accordion(btnFooterFormToggler, footerFormCn, false,)
}

// ________________________________________________________________________________
// Slider 
class Slider {
    constructor(parent, slides) {
        this._parent = parent;
        this._slides = slides;
    }
    // position
    _getSlideWidth() {
        return this._slides[0].getBoundingClientRect().width
    }

    _setSlidePosition(el, i, margin = 0) {
        el.style.left = this._getSlideWidth() * i + margin + "px"
    }

    setPosition(margin) {
        this._slides.forEach((el, i) => this._setSlidePosition(el, i, margin))
    }

    // move
    _identifyTarget(target, currentSlide) {
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

class SliderWithInd extends Slider {
    constructor(parent, slides, indCn) {
        super(parent, slides);
        // indicator container
        this._indCn = indCn;
        this._indicators;
    }

    _getClass() {
        return this._indCn.firstElementChild.classList[0] + "--current"
    }

    // create ind
    _insertIndicator(ind, i) {
        const newInd = ind.cloneNode()
        newInd.dataset.target = i;
        this._indCn.appendChild(newInd)
    }

    createIndicators() {
        const { _indCn, _insertIndicator, _slides, _getClass } = this;
        const indicator = _indCn.firstElementChild;
        _indCn.innerHTML = "";

        for (let i = 0; i < _slides.length; i++) _insertIndicator.call(this, indicator, i)

        this._indicators = Array.from(this._indCn.children)
        console.log(this._indicators)
        // make active class
        const className = _getClass.call(this);
        this._indicators[0].classList.add(className)

    }

    // click handling
    getIndex(e) {
        const clickedInd = e.target.closest("button");
        return clickedInd.dataset.target
    }

    // update ind
    update() {
        const className = this._getClass.call(this);
        this._indicators.forEach(ind => ind.classList.remove(className))
        const index = Math.abs(this._slides.findIndex(item => item.dataset.current === "true"))
        this._indicators[index].classList.add(className)
    }
}

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

// hero carousel
activateSlider(containerHeroSlider, heroSlides, false, false, containerHeroSliderDots)

// gallery carousel
activateSlider(containerGallerySlider, gallerySlides, btnGallerySlideRight, btnGallerySlideLeft, false)

// books slider
activateSlider(containerBooksSlider, booksSlides, btnBooksSliderRight, btnBooksSliderLeft, false, 5)

// teacher intro slider
activateSlider(containerIntroSlider, introSlides, btnIntroSliderRight, btnIntroSliderLeft, false, 5)

// school Slider
activateSlider(containerSchoolSlider, schoolSlides, false, false, containerSchoolDots)

// news slider
activateSlider(containerNewsSlider, newsSlides, btnNewsSliderRight, btnNewsSliderLeft, false)

// articles carousel
activateSlider(containerArticleSlider, articleSlides, false, false, containerArticleDots)

