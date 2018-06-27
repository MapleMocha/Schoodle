$(document).ready(function() {

  $.ajax({
    method: "GET",
    url: "/event/create"
  }).done((users) => {
    console.log('hello!');
    })



});
