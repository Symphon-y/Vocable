$(document).ready(function(){

  // Get Word of The Day
  var wordOfTheDay;

  $.get("http://localhost:3000/test", function(data, status){
    console.log(data)
    wordOfTheDay = data.word;
    gameboard(wordOfTheDay);
    console.log('The Word of the Day is... ' + wordOfTheDay)
    console.log('Word of the day length = ' + wordOfTheDay.length)
  });

  // Helper Functions
  forEach = function(collection, iterator) {
    var objKeys = [];

    if (collection[0] !== undefined) {
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else {
      for (var key in collection) {
        if (key) {
          objKeys.push(key);
        }
      }
      for (var i = 0; i < objKeys.length; i++) {
        iterator(collection[objKeys[i]], objKeys[i], collection);
      }
    }

  };


  // Grab Already Existing HTML Elements
  var $body = $('body');
  var $app = $('#app');
  $app.html('');

  // Create New HTML Elements | Structural
  var $header = $('<div id="header"></div>')
  var $title = $('<h1 class="title">Vocable</h1>')
  var $gameContainer = $('<div class="game_container"></div>')

  // Create New HTML Elements | Virtual Keyboard
  var $keyboardContainer = $('<div id="kb_container"></div>')
  var $keyboardTopRow = $('<div class="kb_row_top kb"></div>')
  var $keyboardMiddleRow = $('<div class="kb_row_mid kb"></div>')
  var $keyboardBottomRow = $('<div class="kb_row_bottom kb"></div>')
  var $button_Q = $('<button class="kb_btn q">Q</button>')
  var $button_W = $('<button class="kb_btn w">W</button>')
  var $button_E = $('<button class="kb_btn e">E</button>')
  var $button_R = $('<button class="kb_btn r">R</button>')
  var $button_T = $('<button class="kb_btn t">T</button>')
  var $button_Y = $('<button class="kb_btn y">Y</button>')
  var $button_U = $('<button class="kb_btn u">U</button>')
  var $button_I = $('<button class="kb_btn i">I</button>')
  var $button_O = $('<button class="kb_btn o">O</button>')
  var $button_P = $('<button class="kb_btn p">P</button>')
  var $button_A = $('<button class="kb_btn a">A</button>')
  var $button_S = $('<button class="kb_btn s">S</button>')
  var $button_D = $('<button class="kb_btn d">D</button>')
  var $button_F = $('<button class="kb_btn f">F</button>')
  var $button_G = $('<button class="kb_btn g">G</button>')
  var $button_H = $('<button class="kb_btn h">H</button>')
  var $button_J = $('<button class="kb_btn j">J</button>')
  var $button_K = $('<button class="kb_btn k">K</button>')
  var $button_L = $('<button class="kb_btn l">L</button>')
  var $button_Z = $('<button class="kb_btn z">Z</button>')
  var $button_X = $('<button class="kb_btn x">X</button>')
  var $button_C = $('<button class="kb_btn c">C</button>')
  var $button_V = $('<button class="kb_btn v">V</button>')
  var $button_B = $('<button class="kb_btn b">B</button>')
  var $button_N = $('<button class="kb_btn n">N</button>')
  var $button_M = $('<button class="kb_btn m">M</button>')
  var $button_ENTR = $('<button class="kb_entr">ENTER</button>')
  var $button_DLT = $('<button class="kb_dlt">DELETE</button>')

  // Add HTML Elements To The DOM
  $header.prependTo($body);
  $app.appendTo($body);
  $gameContainer.appendTo($app);
  $title.prependTo($header);
  $keyboardContainer.appendTo($app);
  $keyboardTopRow.appendTo($keyboardContainer);
  $keyboardMiddleRow.appendTo($keyboardContainer);
  $keyboardBottomRow.appendTo($keyboardContainer);
  $button_Q.appendTo($keyboardTopRow)
  $button_W.appendTo($keyboardTopRow)
  $button_E.appendTo($keyboardTopRow)
  $button_R.appendTo($keyboardTopRow)
  $button_T.appendTo($keyboardTopRow)
  $button_Y.appendTo($keyboardTopRow)
  $button_U.appendTo($keyboardTopRow)
  $button_I.appendTo($keyboardTopRow)
  $button_O.appendTo($keyboardTopRow)
  $button_P.appendTo($keyboardTopRow)
  $button_A.appendTo($keyboardMiddleRow)
  $button_S.appendTo($keyboardMiddleRow)
  $button_D.appendTo($keyboardMiddleRow)
  $button_F.appendTo($keyboardMiddleRow)
  $button_G.appendTo($keyboardMiddleRow)
  $button_H.appendTo($keyboardMiddleRow)
  $button_J.appendTo($keyboardMiddleRow)
  $button_K.appendTo($keyboardMiddleRow)
  $button_L.appendTo($keyboardMiddleRow)
  $button_ENTR.appendTo($keyboardBottomRow)
  $button_Z.appendTo($keyboardBottomRow)
  $button_X.appendTo($keyboardBottomRow)
  $button_C.appendTo($keyboardBottomRow)
  $button_V.appendTo($keyboardBottomRow)
  $button_B.appendTo($keyboardBottomRow)
  $button_N.appendTo($keyboardBottomRow)
  $button_M.appendTo($keyboardBottomRow)
  $button_DLT.appendTo($keyboardBottomRow)

  var currentGameRow = '1';
  var currentGameTile = '1';

  // Keyboard Event Listeners
  $('.kb_btn').click(function() {
    var buttonText = $(this).text();
    var currentTile = $(`.game_tile_r${currentGameRow}t${currentGameTile}`);

        if ((currentTile).hasClass('active')){
          console.log('continue');
        } else {
          $(currentTile).text(buttonText)
          $(currentTile).addClass('active')
          $(currentTile).addClass('animate__animated animate__pulse')
        }
        if (currentGameTile <= wordOfTheDay.length){
          currentGameTile++;
        }
  });

  $('.kb_entr').click(function() {

    if ((currentGameTile-1)< wordOfTheDay.length){
      var remainingLetters = (wordOfTheDay.length - (currentGameTile-1))
      alert(`Slow down there cowboy, you still need to enter ${remainingLetters} more letters...`)
    }
    if (currentGameTile-1 === wordOfTheDay.length) {
      var submissionArray = [];
      $(`.r${currentGameRow}`).each(function (value, index) {
        submissionArray.push($(this).text())
      })

      var submission = JSON.stringify(submissionArray)
      var dRes;
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/submittedword",
        data: submission,
        contentType: "application/json",
        dataType: "json",
        success: function (res){
          if (res.result_msg === 'Entry word not found'){
            alert('Sorry, this doesnt look like a word to me')
          }
          var wordOfTheDayArray = Array.from(wordOfTheDay);
          var resReqArray = Array.from(res.request)
          forEach(wordOfTheDayArray, function (value, index){
            forEach(resReqArray, function (innerValue, innerIndex) {
              if (value === innerValue) {
                $(`.game_tile_r${currentGameRow}t${innerIndex + 1}`).addClass('present')
                $(`.game_tile_r${currentGameRow}t${innerIndex + 1}`).addClass('animate__flipInY')
              }
              for (var i = 0; i < wordOfTheDay.length; i++){
                if (wordOfTheDay[i] === res.request[i]){
                  $(`.game_tile_r${currentGameRow}t${i+1}`).removeClass('present')
                  $(`.game_tile_r${currentGameRow}t${i+1}`).addClass('correct')
                }
              }
            })
          })
          console.log(res)
          currentGameRow++
          currentGameTile = 1;
        }
      });
    }

  });

  $('.kb_dlt').click(function() {

    if (currentGameTile > 1){
      currentGameTile--;
    }

    var currentTile = $(`.game_tile_r${currentGameRow}t${currentGameTile}`);

    if ((currentTile).hasClass('active')){
      $(currentTile).text('')
      $(currentTile).removeClass('active')
      $(currentTile).removeClass('animate__animated')
      $(currentTile).removeClass('animate__pulse')
    } else {
      console.log('continue');

    }

  });

  // Make Game Board
  async function gameboard(word) {
    var boardWidth = (word.length)
    var guessCounter = '1'
    while (guessCounter <= 6) {
      var UniqueClass = '1'
      var $gameRow = $(`<div class="game_row r${guessCounter}"></div>`)
      while (UniqueClass <= word.length){
        var $gameTile = $(`<div class="game_tile game_tile_r${guessCounter}t${UniqueClass}"></div>`)
        $gameTile.appendTo($gameRow);
        UniqueClass++
      }
      $gameRow.appendTo($gameContainer);
      guessCounter++
    }
  }
});