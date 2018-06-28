$(document).ready(function() {

  $(function () {
    $('.date').datepicker({
      todayHighlight: true,
      multidate: true,
      format: 'yyyy/mm/dd',
      startDate: '+0d',
      closeOnSelect: false
    });
    $( ".selector" ).datepicker({
      showOn: "button",
    });

  });


    $('.start').timepicker({
      'timeFormat': 'HH:mm:ss'
    });
    $('.end').timepicker({
      'timeFormat': 'HH:mm:ss'
    });




});
