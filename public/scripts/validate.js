
$(document).ready(function() {

  // assures all fields in Create Form are filled out before posting to db and redirecting to event page

  $("form").on("submit", function(event) {

    $(".title-alert").text("");
    $(".description-alert").text("");

    if ($('.title').val().length === 0) {
      event.preventDefault();
      $(".title-alert").append("Please give your event a title.")
    }

    if($(".description").val().length === 0) {
      event.preventDefault();
      $(".description-alert").append("Please provide a short description for your event.")
    }
  });
});
