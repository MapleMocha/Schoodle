$(document).ready(function() {


  let dates = [];

  function addDate(date) {
      if ($.inArray(date, dates) < 0)
          dates.push(date);
  }

  function removeDate(index) {
      dates.splice(index, 1);
  }

  // Adds a date if we don't have it yet, else remove it
  function addOrRemoveDate(date) {
      var index = $.inArray(date, dates);
      if (index >= 0)
          removeDate(index);
      else
          addDate(date);

  }

  // Takes a 1-digit number and inserts a zero before it
  function padNumber(number) {
      var ret = new String(number);
      if (ret.length == 1)
          ret = "0" + ret;
      return ret;
  }

  $(function () {
      $(".days").text("");
      $(".date").datepicker({
          showOn: "button",
          buttonText: "day",
          minDate: "dateToday",
          onSelect: function (dateText, inst) {
              addOrRemoveDate(dateText);
              appendNewRow();
              dates = [];
          },
          beforeShowDay: function (date) {
              var year = date.getFullYear();
              // months and days are inserted into the array in the form, e.g "01/01/2009", but here the format is "1/1/2009"
              var month = padNumber(date.getMonth() + 1);
              var day = padNumber(date.getDate());
              // This depends on the datepicker's date format
              var dateString = month + "/" + day + "/" + year;

              var gotDate = $.inArray(dateString, dates);
              if (gotDate >= 0) {
                  // Enable date so it can be deselected. Set style to be highlighted
                  return [true, "ui-state-highlight"];
              }
              // Dates not in the array are left enabled, but with no extra style
              return [true, ""];
          }
      });


  });

  // appends new date row to Dates/Times section on Create page
  function appendNewRow() {
    $('.days').append(`<div class='new-div'>${dates}<input type='text' autocomplete='off' class='start' name='start' style='width: 80px; margin-bottom: 5px'><input type='text' class='end' autocomplete='off' name='end' style='width: 80px; margin-bottom: 5px'><button class='delete'>delete</button></div>`);
    addStart();
    addEnd();
    $('.delete').on('click', function (event){
      $(event.target).parent().remove();
      console.log(event);
    })
  }


  // adds start time text box
  function addStart() {
    $('.start').timepicker({
      'timeFormat': 'HH:mm',
      'minTime': '08:00',
      'maxTime': '22:00'
    });
  }

  // adds end time text box
  function addEnd() {
    $('.end').timepicker({
      'timeFormat': 'HH:mm',
      'minTime': '08:00',
      'maxTime': '22:00'
    });
  }

});
