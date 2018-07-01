
$(document).ready(function() {

  //helper function to create warning message if username and email not submitted properly
  function warning(message) {
    const $newMessage = $(`<p class='warning'>${message}</p>`)
    $newMessage.appendTo($('.warningMessage')).fadeOut(4500);
  }


  const $submitChoices = $('#vote')
  let clicked = false;
  const $rowToSubmit = $('.new-user .name')
  let chosen = [];
  let email;
  let username;
  let $buttonChoice = $('.btn-choice');

  $('#vote').on('click', (event) => {

    if(!clicked){


      username = $('.new-user .name .usernameInput').val()
      email = $('.new-user .name .emailInput').val()

      if(username && email){

          clicked = true;

          const submitChoice = function(){
            let $usernameSubmission = $(`<td class='user-column new-name'>${username}</td><p class='new-email'>${email}</p>`)

            $rowToSubmit.replaceWith($usernameSubmission);

            // const $buttonChoice = $('.choiceRow')
            // const$yesChoice = $('.choiceRow, .check').children('button')
            //   $buttonChoice.append(`<i class="fas fa-check-circle fa-2x"></i>`)
            //
            // const$noChoice = $('.choiceRow, .ex').children('button')
            //   $buttonChoice.append(`<i class="fas fa-check-circle fa-2x"></i>`)
            //   $buttonChoice.addClass('ex')

            let $yesBlocks = $('.new-user .check')
            $yesBlocks.parent().addClass('check')
                               .append(`<i class="fas fa-check-circle fa-2x"></i>`)
            // $yesBlocks.siblings().addClass('chosen')
            // chosen = $('.chosen').toArray();
            // $yesBlocks.append(`<i class="fas fa-check-circle fa-2x"></i>`)


            let $noBlocks = $('.new-user .exer')
            $noBlocks.parent().addClass('ex')
                              .append(`<i class="far fa-times-circle fa-2x"></i>`)

            $('.btn-choice').removeClass('ex')
                            .removeClass('check')
                            .addClass('ids')
                            .children().remove()

            // if(!($('.btn-choice').hasClass('.exer'))){
            //   console.log('TEST')
            //   $('.btn-choice').addClass('exer')
            //                   .append('choose');
            // }
          }

          submitChoice();



          let newUser = {
            name: username,
            email: email,
            eventId: $('h3').html(),
            dateOptionsId: chosen
          }

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
      } else if((!email) && username){
        warning('Need to enter an email :)')
      } else if(email && (!username)){
        warning('Need to enter a username :)')
      } else {
        warning('Need to enter an email and username :)')
      }

    } else {

      clicked = false;

      const $inputFields = $('.new-user .user-column')

      // const username = $('.new-name').html()
      // const email = $('.new-email').html()

      let delUser = {
        name: username,
        email: email,
        eventId: $('h3').html(),
      }
      console.log('delUser: ', delUser)

      $.ajax({
        url: '/events/:id/edit',
        method: 'POST',
        data: delUser,
        success: function (poll) {
          console.log('success')
        },
        error: function(err){
          console.log('error: ', err)

        }
      });




      $inputFields.replaceWith(`<td class='name'>
          <form>
            <input class='usernameInput' type='username' value='${username}'/>
            <input class='emailInput'type='email' value='${email}'/>
          </form>
        </td>`)


      $choices = $('.choiceRow')
      $choices.children('.fas.fa-check-circle.fa-2x').remove()
      $choices.children('.far.fa-times-circle.fa-2x').remove()
      if($choices.hasClass('check')){
        $choices.children('.btn-choice').html('choose')
      }
      $choices.removeClass('check')
              .removeClass('ex')
              .addClass('choiceRow')
      $('.chosen').addClass('check')
      $choices.children().removeClass('.chosen')

      $('.btn-choice').removeClass('ids check')
                      .addClass('exer')
                      // .remove('choose')
                      // .append('choose');

      // $buttonChoice = $('.btn-choice');
      // .append(`<button class='btn-choice'>choose</button>`)

  }

  });

  // const $selection = $('.btn-choice')

  $('.btn-choice').on('click', (event) => {
    let $check = $(`<i class="fas fa-check-circle fa-2x"></i>`)
    let $tableSpot = $(event.currentTarget);
    if ($tableSpot.hasClass('check')){
      $tableSpot.empty()
                .removeClass('check')
                .addClass('exer btn-choice')
                .append('choose');
      let $dateId = $tableSpot.siblings().removeClass('.chosen')

    } else {
      $tableSpot.empty()
                // .removeClass('ex')
                .removeClass('exer')
                .addClass('check btn-choice')
                .append($check);

      let $dateId = $tableSpot.siblings().addClass('.chosen')
      chosen.push($dateId.html());
    }

  });

});




///
//
//
//
// $(document).ready(function() {
//
//   //helper function to create warning message if username and email not submitted properly
//   function warning(message) {
//     const $newMessage = $(`<p class='warning'>${message}</p>`)
//     $newMessage.appendTo($('.warningMessage')).fadeOut(4500);
//   }
//
//
//   const $submitChoices = $('#vote')
//   let clicked = false;
//   const $rowToSubmit = $('.new-user .name')
//   let chosen = [];
//   let email;
//   let username;
//   let $buttonChoice = $('.btn-choice');
//
//   $('#vote').on('click', (event) => {
//
//     if(!clicked){
//
//
//       username = $('.new-user .name .usernameInput').val()
//       email = $('.new-user .name .emailInput').val()
//
//       if(username && email){
//
//           clicked = true;
//
//           const submitChoice = function(){
//             let $usernameSubmission = $(`<td class='user-column new-name'>${username}</td><p class='new-email'>${email}</p>`)
//
//             $rowToSubmit.replaceWith($usernameSubmission);
//
//             // const $buttonChoice = $('.choiceRow')
//             // const$yesChoice = $('.choiceRow, .check').children('button')
//             //   $buttonChoice.append(`<i class="fas fa-check-circle fa-2x"></i>`)
//             //
//             // const$noChoice = $('.choiceRow, .ex').children('button')
//             //   $buttonChoice.append(`<i class="fas fa-check-circle fa-2x"></i>`)
//             //   $buttonChoice.addClass('ex')
//
//             let $yesBlocks = $('.new-user .check')
//             $yesBlocks.parent().addClass('check')
//             // $yesBlocks.siblings().addClass('chosen')
//             // chosen = $('.chosen').toArray();
//             $yesBlocks.replaceWith(`<i class="fas fa-check-circle fa-2x"></i>`)
//
//             let $noBlocks = $('.new-user .btn-choice')
//             $noBlocks.parent().addClass('ex')
//             $noBlocks.replaceWith(`<i class="far fa-times-circle fa-2x"></i>`)
//
//             $('.btn-choice').addClass('ids')
//           }
//           submitChoice();
//
//
//
//           let newUser = {
//             name: username,
//             email: email,
//             eventId: $('h3').html(),
//             dateOptionsId: chosen
//           }
//
//           $.ajax({
//             url: '/events/:id',
//             method: 'POST',
//             data: newUser,
//             success: function (poll) {
//               console.log('success')
//             },
//             error: function(err){
//               console.log('error: ', err)
//             }
//
//           });
//       } else if((!email) && username){
//         warning('Need to enter an email :)')
//       } else if(email && (!username)){
//         warning('Need to enter a username :)')
//       } else {
//         warning('Need to enter an email and username :)')
//       }
//
//     } else {
//
//       clicked = false;
//
//       const $inputFields = $('.new-user .user-column')
//
//       // const username = $('.new-name').html()
//       // const email = $('.new-email').html()
//
//       let delUser = {
//         name: username,
//         email: email,
//         eventId: $('h3').html(),
//       }
//       console.log('delUser: ', delUser)
//
//       $.ajax({
//         url: '/events/:id/edit',
//         method: 'POST',
//         data: delUser,
//         success: function (poll) {
//           console.log('success')
//         },
//         error: function(err){
//           console.log('error: ', err)
//         }
//       });
//
//
//       $inputFields.replaceWith(`<td class='name'>
//           <form>
//             <input class='usernameInput' type='username' value='${username}'/>
//             <input class='emailInput'type='email' value='${email}'/>
//           </form>
//         </td>`)
//
//       $choices = $('.choiceRow')
//       $choices.children('.fas.fa-check-circle.fa-2x').remove()
//       $choices.children('.far.fa-times-circle.fa-2x').remove()
//       $choices.append(`<button class='btn-choice'>choose</button>`)
//               .removeClass('check')
//               .removeClass('ex')
//               .addClass('choiceRow')
//
//       $buttonChoice = $('.btn-choice');
//
//   }
//
//   });
//
//   // const $selection = $('.btn-choice')
//
//   $buttonChoice.on('click', (event) => {
//     let $check = $(`<i class="fas fa-check-circle fa-2x"></i>`)
//     let $tableSpot = $(event.currentTarget);
//     if ($tableSpot.hasClass('check')){
//       $tableSpot.empty()
//       .addClass('btn-choice')
//       .removeClass('check')
//       .append('choose');
//     } else {
//       $tableSpot.empty()
//       .addClass('check btn-choice')
//       .append($check);
//
//       let $dateId = $tableSpot.siblings().addClass('.chosen')
//       chosen.push($dateId.html());
//     }
//
//   });
//
// });
