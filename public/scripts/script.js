// elements

// header ____________________
const headerEl = document.querySelector("header")
const headerDropDownParents = document.querySelectorAll(".header__list__item")
const headerDropDownEl = document.querySelectorAll("ul.header__list__dropdown-content")
const headerNav = document.querySelector(".header__nav");

const overlayShadowEl = document.querySelector("div.overlay-shadow")
const btnHamburger = document.querySelector(".header__hamburger")

const btnLanToggler = headerEl.querySelector("button.header__btn--lan--toggler")
const containerLanOptions = headerEl.querySelector("ul.header__lan__options")

// hero ____________________
const sectionHero = document.querySelector(".hero")
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

const breakPoints = { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };
const getViewPort = () => Math.max(document.documentElement.clientWidth, window.innerWidth);

// Classes ________________________________________________________________________________

// Accordion ____________________
class Accordion {
    constructor(controller, content, padding = null,) {
        this._controller = controller; // btn to open / close the accordion
        this._content = content;    // element which is hidden by default
        this._padding = padding && padding + "rem";

        this._setInitial();
        this._controller.addEventListener("click", this._toggle.bind(this))
    }

    _isActive() { // true / false
        return !(this._content.style.maxHeight)
    }

    _setInitial() { // being closed by default
        this._content.classList.add("accordion--hidden")
    }

    _toggle() {
        if (this._isActive.call(this)) {
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

        window.addEventListener("resize", function ({ target: { innerWidth } }) { // make nav back to its original place when vw > 768
            if (innerWidth > breakPoints.md)
                headerNav.style.transform = "translateX(0)"
        })
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
            headerEl.classList.add("sticky-header")
        } else headerEl.classList.remove('sticky-header')
    }
}

// language selecting ____________________
class Language {
    constructor() {
        this._active = false;
        this._currentImg = "iran.png";
        this._currentValue = "fa";
        this._optionBtn = Array.from(containerLanOptions.querySelectorAll("button"))

        this._updateBtn(this._currentImg)
        this._hideOptions(); // initial
        btnLanToggler.addEventListener("click", this._toggleOptions.bind(this))

        // each option click handling
        this._optionBtn.forEach(btn => btn.addEventListener("click", this._changeData.bind(this)))
    }

    _hideOptions() {
        containerLanOptions.style.opacity = 0;
        setTimeout(() => containerLanOptions.style.display = 'none', 1000)
    }

    _showOptions() {
        containerLanOptions.style.display = 'block'
        containerLanOptions.style.opacity = 1;
    }

    _toggleOptions() {
        this._active = !this._active;
        this._active ? this._showOptions() : this._hideOptions()
    }

    _updateBtn(img) { // change image of toggler button
        const path = `./images/${img}`
        btnLanToggler.querySelector("img").src = path;
    }

    _changeData({ target }) { // get data-flag and data-lan from option buttons
        const btn = target.closest("button")
        this._currentImg = btn.dataset.flag;
        this._currentValue = btn.dataset.value;
        this._updateBtn(this._currentImg)
    }
}

// Slider ____________________
class Slider {
    constructor(parent, slides, margin = 0, buttons = false) {
        this._parent = parent; // <ul> [all slides] </ul>
        this._slides = slides; // <li> [each item] </li>
        this._margin = margin;
        this._buttons = buttons // [prevBtn, nextBtn]

        this._setPosition(margin);

        // make spaces between carousel items change when items width change 
        window.addEventListener("resize", this._setPosition.bind(this, margin))

        if (!this._buttons) return;
        this._buttons[1].addEventListener("click", () => this.move.call(this, "next"))
        this._buttons[0].addEventListener("click", () => this.move.call(this, "prev"))
    }

    // position
    _getSlideWidth() { // width of the first el 
        return this._slides[0].getBoundingClientRect().width;

    }

    _setSlidePosition(el, i, margin = 0) { // make each slide item sit next to each other
        // margin is used to make space between each item
        el.style.left = this._getSlideWidth() * i + margin + "px"
    }

    _setPosition(margin) {
        this._slides.forEach((el, i) => this._setSlidePosition(el, i, margin))
    }

    // moving the slides 🚎
    _identifyTarget(target, currentSlide) { // identify which item user wants to see
        if (target === "next") return currentSlide.nextElementSibling;
        else if (target === "prev") return currentSlide.previousElementSibling;
        else return target
    }

    _resetSlider() { // show first element
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

        currentSlide.dataset.current = "false"; // change "data-current"
        targetSlide.dataset.current = "true"
    }
}

class SliderWithInd extends Slider { // slide which can be controlled using indicators ⚫⚫⚫ 
    constructor(parent, slides, margin = 0, buttons = false, indCn) {
        super(parent, slides, margin, buttons);
        this._indCn = indCn; // indicator container
        this._indicators;

        this._createIndicators()

        this._indCn.addEventListener("click", e => {
            if (e.target.localName !== "button") return
            this.move.call(this, this._slides[this._getIndex(e)])
            this._update.call(this)
        })
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

    _createIndicators() { // make ⚫ as much as slides
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

    _getIndex(e) { // witch one is clicked
        const clickedInd = e.target.closest("button");
        return clickedInd.dataset.target
    }

    _update() { // update ind
        const className = this._getClass.call(this);
        this._indicators.forEach(ind => ind.classList.remove(className))
        const index = Math.abs(this._slides.findIndex(item => item.dataset.current === "true"))
        this._indicators[index].classList.add(className)
    }
}

// ________________________________________________________________________________
// ________________________________________________________________________________
new Language();

// mobile nav dropdown
headerDropDownParents.forEach(function (el) {
    if (!el.querySelector("ul")) return
    new Accordion(el.querySelector(".header__list__item__title"), el.querySelector("ul.header__list__dropdown-content"))
})

// footer dropDowns
if (getViewPort() < breakPoints.md) {
    new Accordion(btnFooterListToggler, footerNavList, false,)
    new Accordion(btnFooterFormToggler, footerFormCn, false,)
}

// navigation toggle in mobile
const navigation = new Navigation();

// sticky nav on scroll
const stickyHeader = new StickyHeader();

// Sliders
const pageSlidersData = [ // arguments for {activateSlider} function
    //[--slidesContainer--, --slidesArray--, [--btnPrev--, --btnNext--}, --⚫Container--, --margin = 0-- ]
    // hero carousel
    [containerHeroSlider, heroSlides, false, containerHeroSliderDots],
    // gallery carousel
    [containerGallerySlider, gallerySlides, [btnGallerySlideLeft, btnGallerySlideRight], false],
    // books slider
    [containerBooksSlider, booksSlides, [btnBooksSliderLeft, btnBooksSliderRight], false, 5],
    // teacher intro slider
    [containerIntroSlider, introSlides, [btnIntroSliderLeft, btnIntroSliderRight], false, 5],
    // school Slider
    [containerSchoolSlider, schoolSlides, false, containerSchoolDots],
    // news slider
    [containerNewsSlider, newsSlides, [btnNewsSliderLeft, btnNewsSliderRight], false],
    // articles carousel
    [containerArticleSlider, articleSlides, false, containerArticleDots]
]

const activateSlider = function (slidesCn, slidesArr, btnArr, dotsCn, margin = 0) { // make slider
    let slider;
    if (dotsCn) slider = new SliderWithInd(slidesCn, slidesArr, margin, btnArr, dotsCn)
    else slider = new Slider(slidesCn, slidesArr, margin, btnArr)
}

pageSlidersData.forEach(argArr => activateSlider(...argArr))

