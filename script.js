'use strict';

//////////////////////////////////////////////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {

    btn.addEventListener('click', openModal);
})

// for (let i = 0; i < btnsOpenModal.length; i++)
//     btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


//Tabbed component
//////////////////////////////////////////////////////////////////////////////
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


tabsContainer.addEventListener('click', function (e) {

    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;
    //Active tab
    tabs.forEach(function (tab) {
        tab.classList.remove('operations__tab--active');
    })
    clicked.classList.add('operations__tab--active');

    //Active content area

    tabsContent.forEach(function (tab) {
        tab.classList.remove('operations__content--active');
    });

    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});


//Menu fade animation
//////////////////////////////////////////////////////////////////////////////
const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {

        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {

            if (el !== link) {
                el.style.opacity = this;
                logo.style.opacity = this;
            }
        })
    }


}

//Passing 'argument' into handler
const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));



//Sticky navigation

// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords);

// window.addEventListener('scroll', function (e) {

//     if (window.scrollY > initialCoords.top) nav.classList.add('sticky');

//     else nav.classList.remove('sticky');
// });


//Sticky navigation: Intersection Observer API
//////////////////////////////////////////////////////////////////////////////
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stikyNav = function (entries, observe) {

    const [entry] = entries;


    if (!entry.isIntersecting) nav.classList.add('sticky');

    else nav.classList.remove('sticky');

}

const obsHeader = new IntersectionObserver(stikyNav, { root: null, threshold: 0, rootMargin: `${navHeight}px` });

obsHeader.observe(header);

//Revealing Elements on scroll
//////////////////////////////////////////////////////////////////////////////

const section = document.querySelectorAll('.section');

const secCallback = function (entries, observer) {

    const [entry] = entries;

    if (entry.isIntersecting) entry.target.classList.remove('section--hidden');

    observeSection.unobserve(entry.target);
};

const secOptions = {
    root: null,
    threshold: 0.15,
}


const observeSection = new IntersectionObserver(secCallback, secOptions);

section.forEach(function (e) {
    observeSection.observe(e);
    // e.classList.add('section--hidden');
});


//Lazy loading Images
//////////////////////////////////////////////////////////////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observe) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    //Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });

    imgObserver.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, { root: null, threshold: 0.08 });

imgTargets.forEach(img => imgObserver.observe(img));


//Building a slider
//////////////////////////////////////////////////////////////////////////////

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currentSlide = 0;
const maxSlide = slides.length - 1;


const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
}

goToSlide(0);

//Next slide

const nextSlide = function () {
    if (currentSlide === maxSlide) {
        currentSlide = 0;
    }
    else {
        currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
}

//Previous slide
const prevSlide = function () {

    if (currentSlide === 0) {
        currentSlide = maxSlide;
    }
    else {
        currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
}

btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        activateDot(currentSlide);
    }

    if (e.key === 'ArrowRight') {
        nextSlide();
        activateDot(currentSlide);
    }
})

//Dots form the slide
//////////////////////////////////////////////////////////////////////////////
const dotsContainer = document.querySelector('.dots');

const createDots = function () {

    slides.forEach(function (_, i) {

        dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)

    });

}

createDots();


const activateDot = function (slide) {

    document.querySelectorAll('.dots__dot').forEach(function (dot) {
        dot.classList.remove('dots__dot--active');
    });

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

activateDot(0);

dotsContainer.addEventListener('click', function (e) {

    if (e.target.classList.contains('dots__dot')) {

        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDot(slide);
    }

});


//////////////////////////////////////////////////////////////////
///Smooth scrolling
//////////////////////////////////////////////////////////////////




btnScrollTo.addEventListener('click', function (e) {

    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    // console.log(e.target.getBoundingClientRect());

    console.log(`Current scroll position: (X/Y)`, window.pageXOffset, window.pageYOffset);

    console.log('height/width of viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

    // scrolling

    window.scrollTo({
        left: s1coords.left + window.pageXOffset,
        top: s1coords.top + window.pageYOffset,
        behavior: 'smooth',
    });

    section1.scrollIntoView({ behavior: 'smooth' });
});


