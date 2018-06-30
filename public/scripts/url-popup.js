$(document).ready(function() {

  // const generateShortUrl = function(){
  //   const uniqueKey = Math.random().toString(36).replace('0.','').split('').slice(0,12).join('');
  //   return uniqueKey;
  // }
  //
  // const $create = $('.button');
  // $create.on('click', function () {
  //   // const newUrl = generateShortUrl();
  //
  //   // knex('event').where({
  //   //       id: something
  //   //     })
  //   //     .insert({
  //   //       uniqueUrl: newUrl
  //   //     })
  //   //     .then (function () {
  //         // $('.bg-modal-login').css({display: 'flex'});
  //         // $('.URL').append(`<p>http://localhost:8080/events/${newUrl}</p>`)
  //         // $('.movePage').attr('action', `events/${newUrl}`)
  //
  //       // })
  //
  //
  //
  // });

  const $close = $('.close');
  $close.on('click', function () {
    $('.bg-modal-login').css({display: 'none'});
    $('.bg-modal-signup').css({display: 'none'});
  });

});
