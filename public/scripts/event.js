
$(document).ready(function() {
  console.log("TEST")


  const $submitChoices = $('#vote')
  let clicked = false;
  const $rowToSubmit = $('.new-user .name')

  $('#vote').on('click', (event) => {

    console.log("HERE");
    if(!clicked){

      clicked = true;


      const $username = $('.new-user .name .usernameInput')

      const $usernameSubmission = $(`<td class='user-column'>${$username.val()}</td>`)

      $rowToSubmit.replaceWith($usernameSubmission);

      const $yesBlocks = $('.new-user .check')
      $yesBlocks.parent().addClass('check')
      $yesBlocks.replaceWith(`<i class="fas fa-check-circle fa-2x"></i>`)

      const $noBlocks = $('.new-user .btn-choice')
      $noBlocks.parent().addClass('ex')
      $noBlocks.replaceWith(`<i class="far fa-times-circle fa-2x"></i>`)

    } else {

      clicked = false;

      const $inputFields = $('.new-user .user-column')

      $inputFields.replaceWith(`<td class='name'>
          <form>
            <input class='usernameInput' type='username' placeholder='${$inputFields.text()}'/>
            <input class='emailInput'type='email' placeholder='myEmail@Nielemma.com'/>
          </form>
        </td>`)

      $potentialYes = $('.new-user .check')
      $potentialYes.replaceWith(`<td><button class='btn-choice check'><i class="fas fa-check-circle fa-2x"></i></button></td>`)

      $potentialNo = $('.new-user .ex')
      $potentialNo.replaceWith(`<td><button class='btn-choice'>choose</button></td>`)

  }

  });

  // let $selection = $('.btn-choice')

  $('.btn-choice').on('click', (event) => {
    console.log('attempt')
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
