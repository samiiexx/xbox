// Navigation Menu Toggler
// var header = document.querySelector(".js-header");
// var hamburgerMenu = document.querySelector(".hamburger-menu");

// hamburgerMenu.addEventListener("click", function () {
//     header.classList.toggle("menu-open");
// });
var tl = gsap.timeline();
$(".btn-s").on("click", function () {
    tl.add("start")
        .to(
            ".console-s",
            {
                x: -510,
                scale: 1.25,
            },
            "start"
        )
        .to(
            ".console-x",
            {
                x: 710,
                y: -50,
                scale: 0.3,
            },
            "start"
        )
        .to(
            ".tri",
            {
                rotate: 35,
            },
            "start"
        )
        .to(
            ".subtitle-x",
            0.3,
            {
                opacity: 0,
                delay: -1,
            },
            "start"
        )
        .to(
            ".subtitle-s",
            0.5,
            {
                delay: -1,
                opacity: 1,
            },
            "start"
        )
        .to(
            ".price-x",
            0.3,
            {
                opacity: 0,
            },
            "start"
        )
        .to(
            ".price-s",
            0.5,
            {
                opacity: 1,
            },
            "start"
        );
    // .to(
    //     ".tri-green",
    //     1,
    //     {
    //         rotate: 360,
    //     },
    //     "start"
    // )
});
// JQuery Scripts
// $(document).ready(function () {
//     //GSAP Animations
//     var tl = gsap.timeline();
//     $(".series-s-btn").on("click", function () {
//         tl.add("start")
//             .to(
//                 ".console-s",
//                 {
//                     x: -710,
//                     scale: 1.5,
//                 },
//                 "start"
//             )
//             .to(
//                 ".console-x",
//                 {
//                     x: 710,
//                     y: -50,
//                     scale: 0.3,
//                 },
//                 "start"
//             )
//             .to(
//                 ".tri-green",
//                 1,
//                 {
//                     rotate: 360,
//                 },
//                 "start"
//             )
//             .to(
//                 ".x-text",
//                 0.3,
//                 {
//                     opacity: 0,
//                     delay: -1,
//                 },
//                 "start"
//             )
//             .to(
//                 ".s-text",
//                 0.5,
//                 {
//                     delay: -1,
//                     opacity: 1,
//                 },
//                 "start"
//             )
//             .to(
//                 ".price-x",
//                 0.3,
//                 {
//                     opacity: 0,
//                 },
//                 "start"
//             )
//             .to(
//                 ".price-s",
//                 0.5,
//                 {
//                     opacity: 1,
//                 },
//                 "start"
//             );
//     });

//     // $(".series-x-grp").on("click", function () {
//     //     var tl = gsap.timeline();
//     //     tl.to(".tri-gray", 1, {
//     //         rotation: "-45deg",
//     //         opacity: 0,
//     //     })
//     //         .to(".tri-green", 2, {
//     //             opacity: 1,
//     //             y: 160,
//     //             x: 50,
//     //             delay: -3,
//     //         })
//     //         .to(".console-s", 2, {
//     //             x: 0,
//     //             y: 10,
//     //             scale: 1.3,
//     //             opacity: 1,
//     //             delay: -2,
//     //         })
//     //         .to(".console-x", 2, {
//     //             opacity: 1,
//     //             scale: 0.7,
//     //             x: 10,
//     //             y: 0,
//     //             delay: -2,
//     //         })
//     //         .to(".x-text", 0.3, {
//     //             opacity: 0,
//     //             delay: -1,
//     //         })
//     //         .to(".s-text", 0.5, {
//     //             opacity: 1,
//     //             delay: -1,
//     //         })
//     //         .to(".price-x", 0.3, {
//     //             opacity: 0,
//     //             delay: -1,
//     //         })
//     //         .to(".price-s", 0.5, {
//     //             y: -29,
//     //             opacity: 1,
//     //             delay: -1,
//     //         });
//     // });
// });
