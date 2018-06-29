
$(document).ready(function() {
  console.log("TEST")

  const $selection = $('.btn-choice')

  $selection.on('click', (event) => {
    event.stopPropagation();
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

  const $submitChoices = $('#vote')
  let clicked = false;

  $submitChoices.on('click', (event) => {

    console.log("HERE");
    if(!clicked){

    clicked = true;

    const $rowToSubmit = $('.new-user .name')

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

    clicked = false



    // $('.new-user').replaceWith(`<tr class='new-user'>
    //   <td class='name'>
    //     <form>
    //       <input class='usernameInput' type='username' placeholder='Your name'/>
    //       <input class='emailInput'type='email' placeholder='myEmail@Nielemma.com'/>
    //     </form>
    //   </td>
    //
    //   <% for(let i = 0; i < columnCount; i++) { %>
    //         <td><button class='btn-choice'>choose</button></td>
    //    <% }  %>
    //
    // </tr>`)

  }

  });

// <td class='check'><i class="fas fa-check-circle fa-2x"></i></td>
//
// <td class='ex'><i class="far fa-times-circle fa-2x"></i></td>


  // <tr class='new-user'>
  //   <td>
  //     <form>
  //       <input type='username' placeholder='Your name'/>
  //       <input type='email' placeholder='myEmail@Nielemma.com'/>
  //     </form>
  //   </td>
  //
  //   <% for(let i = 0; i < columnCount; i++) { %>
  //         <td><button class='btn-choice'>choose</button></td>
  //    <% }  %>
  //
  // </tr>

});
