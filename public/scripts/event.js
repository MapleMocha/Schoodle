
$(document).ready(function() {
  console.log("TEST")

  const $selection = $('.btn-choice')

  $selection.on('click', () => {
    console.log("HERE");
    const $tableSpot = $($selection.parent());
    //console.log($tableSpot)
    $tableSpot.addClass('check');
    const $check = $(`<i class="fas fa-check-circle fa-2x"></i>`)
    $check.appendTo('$tableSpot')

    $selection.remove();

  });

});
