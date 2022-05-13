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

  // Create New HTML Elements
  var $header = $('<div id="header"></div>')
  var $title = $('<h1 class="title">Vocable</h1>')
  var $gameContainer = $('<div class="game_container"></div>')
  var $keyboardContainer = $('<div id="kb_container"></div>')

  // Add HTML Elements To The DOM
  $header.prependTo($body);
  $app.appendTo($body);
  $gameContainer.appendTo($app);
  $title.prependTo($header);
  $keyboardContainer.appendTo($app);

  // Keyboard Data
  function getLetterElement(letter) {
    var className =
      letter === 'DELETE'
      ? 'kb_dlt'
      : letter === 'ENTER'
      ? 'kb_entr'
      : `kb_btn ${letter.toLowerCase()}`;
    return $(`<button class="${className}">${letter}</button>`);
  }

  var keyboardChars = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
  ];

  // Set the containers for each row
  var $keyboardTopRow = $('<div class="kb_row_top kb"></div>')
  var $keyboardMiddleRow = $('<div class="kb_row_mid kb"></div>')
  var $keyboardBottomRow = $('<div class="kb_row_bottom kb"></div>')

  var rowContainers = [$keyboardTopRow, $keyboardMiddleRow, $keyboardBottomRow];

  // For each ROW of the keyboard
  keyboardChars.forEach(function(row, rowIndex) {
    // For each LETTER in the ROW
    row.forEach(function(letter) {
      var $element = getLetterElement(letter); // Generate the button

      // Add the element to the row
      $element.appendTo(rowContainers[rowIndex])
    })
  })

  // Add each row to the larger keyboard container
  rowContainers.forEach(function(row) {
    row.appendTo($keyboardContainer);
  })

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