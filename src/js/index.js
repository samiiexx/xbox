// Navigation Menu Toggler
var header = document.querySelector(".js-header");
var hamburgerMenu = document.querySelector(".hamburger-menu");

hamburgerMenu.addEventListener("click", function () {
    header.classList.toggle("menu-open");
});

// JQuery Scripts
$(document).ready(function () {
    // Footer year
    var year = new Date().getFullYear();
    $("#footer-year").text(year);

    // Whatsapp Button
    // $(function () {
    //     $("#whatsapp-btn").floatingWhatsApp({
    //         position: "right",
    //         autoOpenTimeout: 0,
    //         size: "50px",
    //         phone: "+447471115127",
    //         showPopup: true,
    //         showOnIE: false,
    //         headerTitle: "Welcome!",
    //         popupMessage: "Hi there, how can we help you?",
    //         message: "I'd like more information about your...",
    //         // buttonImage: '<img src="../images/wa-icon.png" />',
    //         // backgroundColor: 'rgba(0,0,0,0)'
    //     });

    //     $("#whatsapp-btn").css({
    //         color: "#565655",
    //     });

    //     $(".floating-wpp-head").css({
    //         "font-size": "1.35rem",
    //         "font-weight": "700",
    //     });
    // });

    // Request Details
    // $(".product-cta").click(function (e) {
    //     e.preventDefault();
    //     var parent = $(this).parent();
    //     var title = parent.find(".product-title").text();
    //     var subtitle = parent.find(".product-subtitle").text();
    //     var list = [];
    //     var specs = parent
    //         .find(".product-specs")
    //         .children()
    //         .each(function (i, li) {
    //             list.push(
    //                 $(li)
    //                     .text()
    //                     .replace(/\s{2,}/g, "")
    //             );
    //         });
    //     specs = list.join(", ") + ".";

    //     var message = "Hello,\r\n\r\n";
    //     message +=
    //         "Could I get more details about the following product? \r\n\r\n";
    //     message += "Name: " + title + " (" + subtitle + ")\r\n";
    //     message += "Specification: " + specs;
    //     // console.log(message);
    //     localStorage.setItem("requestDetails", message);
    //     window.location.replace("contact.html");
    // });

    // Request details prepopulate
    // if (typeof localStorage.getItem("requestDetails")) {
    //     var message = localStorage.getItem("requestDetails");
    //     $("#contact-form #message").text(message);
    // }

    // Contact form validate and submit

    $("#contact-form").validate({
        rules: {
            fname: {
                required: true,
                minlength: 2,
            },
            lname: {
                required: true,
                minlength: 2,
            },
            email: {
                required: true,
                email: true,
            },
            phone: {
                required: true,
                phone: "phone",
            },
            message: {
                required: true,
                minlength: 25,
                maxlength: 7000,
            },
        },
        messages: {
            fname: {
                required: "Please provide your first name",
                minlength: "Please provide a valid name",
            },
            lname: {
                required: "Please provide your last name",
                minlength: "Please provide a valid name",
            },
            email: {
                required: "Please provide your email address",
                email: "Please provide a valid email address",
            },
            phone: {
                required: "Please provide your phone number",
                phone: "Please provide a valid phone number",
            },
            message: {
                required: "A message is required",
                minlength: "Please enter at least 25 characters",
                maxlength: "Too long! Max 7000 characters",
            },
        },
        submitHandler: function (form) {
            // Prepare data for submission
            var formData = $("#contact-form"),
                url = formData.attr("action"),
                type = formData.attr("method"),
                data = {};

            formData.find("[name]").each(function (index, value) {
                var input = $(this),
                    name = input.attr("name"),
                    value = input.val();

                data[name] = value;
            });

            // Ajax submission
            $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: "json",
                success: function (response) {
                    // console.log('server response');
                    // console.log(response);
                    if ("error" in response) {
                        $("#form-message").html(response.error);
                        $("#form-message").removeClass("success-message");
                        $("#form-message").addClass("error-message");
                        $("html, body").animate(
                            {
                                scrollTop: $("#scroll").offset().top,
                            },
                            500
                        );
                    } else {
                        $("#form-message").html(response.success);
                        $("#form-message").removeClass("error-message");
                        $("#form-message").addClass("success-message");
                        $("#contact-form")[0].reset();
                        $("html, body").animate(
                            {
                                scrollTop: $("#scroll").offset().top,
                            },
                            500
                        );
                    }
                },
            });
            return false;
        },
    });

    $.validator.addMethod(
        "phone",
        function (value, element) {
            var re = new RegExp("[0-9-()s]+");
            return this.optional(element) || re.test(value);
        },
        "Invalid phone number"
    );
});
