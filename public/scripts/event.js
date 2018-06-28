
$(document).ready(function() {
  console.log("TEST")

  const $selection = $('.btn-choice')

  $selection.on('click', (event) => {
    event.stopPropagation();
    console.log("HERE");
    console.log(event.currentTarget);
    const $check = $(`<i class="fas fa-check-circle fa-2x"></i>`)
    const $tableSpot = $(event.currentTarget);
    if ($tableSpot.hasClass('check')){
      $tableSpot.empty()
                .addClass('btn-choice')
                .removeClass('check')
                .append('choose');
    } else {
      $tableSpot.empty()
                .addClass('check btn-choice')
                .append($check);
    }

  });

});
