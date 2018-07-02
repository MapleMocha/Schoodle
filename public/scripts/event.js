
$(document).ready(function() {

  //helper function to create warning message if username and email not submitted properly
  function warning(message) {
    const $newMessage = $(`<p class='warning'>${message}</p>`)
    $newMessage.appendTo($('.warningMessage')).fadeOut(5000);
  }

  console.log($('#isLoggedIn').html())

  //helper function to copy invite link to clipboard
  function copyLink(toCopy) {
    const newElement = document.createElement('textarea');

    newElement.value = toCopy;
    document.body.appendChild(newElement);

    newElement.select();
    document.execCommand('copy');
    document.body.removeChild(newElement);
  };
  if($('#isLoggedIn').html() === 'true') {

      const uniqueUrl = window.location;

      $('.jumbotron').append(`<br />
                              <h4>Invite attendees with this link extension:</h4>
                              <h4>${uniqueUrl}   <i class="far fa-copy"></i><h4>

                              <form  class='emailTheLink' method='POST' action="mailto:?&body=Hey!%20Youve%20been%20invited%20to%20submit%20youre%20availability%20for%3A%20${$('.eventDescript').html()}by%3A%20${$('.adminName').html()}%0D%0A%0D%0AFollow%20the%20link%20below%3A%20%0D%0A${uniqueUrl}">
                                <button type='submit'>Email The Link!</button><h4>
                              </form>

                              <div class="fb-share-button" data-href="https://www.buzzfeed.com/quizzes" data-layout="button" data-size="large" data-mobile-iframe="false"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Flocalhost%3A8080%2Fevents%2Fj99nsgu06ko&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div>

                              `)

      // $('.jumbotron').children('form').removeClass('emailTheLink')
      // $('.jumbotron').children('form').removeClass('emailTheLink')

      $('.far.fa-copy').on('click', (event) => {
        copyLink(uniqueUrl);
      });
    // }

  } else {
    $('.jumbotron').children('form').removeClass('emailTheAdmin')
  }


  let clicked = false;
  let chosen = [];
  let email;
  let username;
  let $buttonChoice = $('.btn-choice');

  $('#vote').on('click', (event) => {

    if(!clicked){


      username = $('.new-user .name .usernameInput').val()
      email = $('.new-user .name .emailInput').val()

      if(username && email){

          $('#vote').html('Edit Choice')
          clicked = true;

          const submitChoice = function(){

            let $rowToSubmit = $('.new-user .name')
            let $usernameSubmission = $(`<td class='user-column new-name'>${username}</td><p class='new-email'>${email}</p>`)

            $rowToSubmit.replaceWith($usernameSubmission);

            let $yesBlocks = $('.new-user .check')
            $yesBlocks.parent().addClass('check')
                               .append(`<i class="fas fa-check-circle fa-2x"></i>`)


            let $noBlocks = $('.new-user .exer')
            $noBlocks.parent().addClass('ex')
                              .append(`<i class="far fa-times-circle fa-2x"></i>`)

            $('.btn-choice').removeClass('ex')
                            .removeClass('check')
                            .addClass('ids')
                            .children().remove()
          }

          submitChoice();

          let newUser = {
            name: username,
            email: email,
            eventId: $('#eventId').html(),
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

      $('#vote').html('Vote')

      const $inputFields = $('.new-user .user-column')

      let delUser = {
        name: username,
        email: email,
        eventId: $('#eventId').html(),
      }

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

      chosen = []

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

  }

  });


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
                .removeClass('exer')
                .addClass('check btn-choice')
                .append($check);

      let $dateId = $tableSpot.siblings().addClass('.chosen')
      chosen.push($dateId.html());
    }

  });


});
