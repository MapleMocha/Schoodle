$(document).ready(function() {

// Grabs the login button and clicking it opens up the login modal popup.
const $login = $('.loginButton');
$login.on('click', function () {
  $('.bg-modal-login').css({display: 'flex'});
});

// Grabs the signup button and clicking it opens up the signup modal popup.
const $signup = $('.signupButton');
$signup.on('click', function () {
  $('.bg-modal-signup').css({display: 'flex'});
});

// Grabs the logout button and clicking it clears the session and redirects the user to the home page.
const $logout = $('.logoutButton');
$logout.on('click', function () {
  $.ajax({
    type: "POST",
    url: "/logout",
    success: window.location.href = "/"
  });
});

// Closes any modal popup.
const $close = $('.close');
$close.on('click', function () {
  $('.bg-modal-login').css({display: 'none'});
  $('.bg-modal-signup').css({display: 'none'});
});

});
