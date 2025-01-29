import { gsap } from "gsap"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

// GSAP
const testimonial = document.querySelector('.testimonial');
const sectionstart = document.querySelector('#section-start');
const section0 = document.querySelector('#section-0');
const section1 = document.querySelector('#section-1');
const section2 = document.querySelector('#section-2');
const section3 = document.querySelector('#section-3');
const section4 = document.querySelector('#section-4');
const final = document.querySelector('.final');
const end = document.querySelector('.end');

gsap.fromTo(
    testimonial, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: testimonial,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    sectionstart, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: sectionstart,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    section0, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: section0,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    section1, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: section1,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    section2, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: section2,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    section3, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: section3,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    section4, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: section4,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    final, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: final,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)
gsap.fromTo(
    end, 
    {
        opacity: 0,
    },
    {
        opacity: 1,
        scrollTrigger: 
        {
            trigger: end,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1
        },
    }
)






const elementsToAnimate = document.querySelectorAll(".testimonial-betroffene, .testimonial-angehoerige, .testimonial-fachpersonal, .perspektive, .infopage , .text");

elementsToAnimate.forEach((element) => {
    gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 50
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: "top 95%",
                end: "bottom center",
                toggleActions: "play none none reverse",
                scrub: 1
            }
        }
    );
});

