
$(document).ready(function() {
  console.log("TEST")


  const $submitChoices = $('#vote')
  let clicked = false;
  const $rowToSubmit = $('.new-user .name')
  let chosen = [];

  $('#vote').on('click', (event) => {

    console.log("HERE");
    if(!clicked){

      clicked = true;


      let $username = $('.new-user .name .usernameInput')
      let $email = $('.new-user .name .emailInput')

      const submitChoice = function(){
        let $usernameSubmission = $(`<td class='user-column'>${$username.val()}</td>`)

        $rowToSubmit.replaceWith($usernameSubmission);

        let $yesBlocks = $('.new-user .check')
        $yesBlocks.parent().addClass('check')
        // $yesBlocks.siblings().addClass('chosen')
        // chosen = $('.chosen').toArray();
        $yesBlocks.replaceWith(`<i class="fas fa-check-circle fa-2x"></i>`)

        let $noBlocks = $('.new-user .btn-choice')
        $noBlocks.parent().addClass('ex')
        $noBlocks.replaceWith(`<i class="far fa-times-circle fa-2x"></i>`)
      }
      submitChoice();


      console.log(chosen)
      console.log($email.html());
      // const $('emailInput')

      let newUser = {
        name: $username.val(),
        email: $email.val(),
        eventId: $('h3').html(),
        dateOptionsId: chosen
      }

      console.log(newUser)
      $.ajax({
        url: '/events/:id',
        method: 'POST',
        data: newUser,
        success: function (poll) {
          console.log('success')
        },
        error: function(err){
          console.log('error: ', err)
        }

      });

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
    let $check = $(`<i class="fas fa-check-circle fa-2x"></i>`)
    let $tableSpot = $(event.currentTarget);
    if ($tableSpot.hasClass('check')){
      $tableSpot.empty()
      .addClass('btn-choice')
      .removeClass('check')
      .append('choose');
    } else {
      $tableSpot.empty()
      .addClass('check btn-choice')
      .append($check);

      let $dateId = $tableSpot.siblings().addClass('.chosen')
      chosen.push($dateId.html());
      console.log('inside: ',chosen)
    }

  });

});
