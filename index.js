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

  uniq = function(array, isSorted, iterator) {
    var outputArray = [];
    var arrayFromIterator = [];
    var nonUniqueIndexes = [];
    if (!iterator) {
      outputArray = Array.from(new Set(array));
      return outputArray;
    } else {
      _.each(array, function (item, index) {
        arrayFromIterator.push(iterator(item));
      });
      var currentIndex = 0;
      var loopIterator = 1;
      var booleanArray = ['t'];
      var uniqueChecker = function (array) {
        for ( var i = loopIterator; i < arrayFromIterator.length; i++) {
          var loopHolderArray = [];
          if (loopIterator !== undefined) {
            if (booleanArray.length < arrayFromIterator.length) {
              if (arrayFromIterator[currentIndex] === arrayFromIterator[i]) {
                booleanArray.push('x');
              } else {
                booleanArray.push('t');
              }
            }
            if (booleanArray.length === arrayFromIterator.length) {
              if (arrayFromIterator[currentIndex] === arrayFromIterator[loopIterator]) {
                booleanArray.splice(loopIterator, 1, 'x');
              }
            }
            for (var r = arrayFromIterator.length - 2; r > 0; r--) {
              var checkLastIndex = arrayFromIterator.length - 1;
              if (arrayFromIterator[checkLastIndex] === arrayFromIterator[r]) {
                booleanArray.splice(checkLastIndex, 1, 'x');
              }
            }
          }
        }
        currentIndex++;
        loopIterator++;
        if (currentIndex < arrayFromIterator.length) {
          uniqueChecker(arrayFromIterator);
        }
      };
      uniqueChecker(arrayFromIterator);
      _.each(array, function(item, index) {
        outputArray.push(item);
      });

      var destroyTheXs = function(array) {
        for (var d = 0; d < booleanArray.length; d++) {
          if (booleanArray[d] === 'x') {
            outputArray.splice(d, 1);
            booleanArray.splice(d, 1);
          }
        }
        for (var dd = 0; dd < booleanArray.length; dd++) {
          if (booleanArray[dd] === 'x') {
            destroyTheXs(booleanArray);
          }
        }
      };

      destroyTheXs(booleanArray);
      return outputArray;
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
    return $(`<button class="${className} passive">${letter}</button>`);
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

  var keyHistory = '';

  // Keyboard Event Listeners | Physical | Alphabetical
  $(document).keypress(function(e) {
    var currentTile = $(`.game_tile_r${currentGameRow}t${currentGameTile}`);
    var keyPress = String.fromCharCode(e.which);
    var keyToUpCase = keyPress.toUpperCase();
    var keyCodeToNum = Number(e.which)
    if (e.which >= 97 && e.which <= 122) {
      if ((currentTile).hasClass('active')){
        console.log('continue');
      } else {
        $(currentTile).text(keyToUpCase)
        $(currentTile).addClass('active')
        $(currentTile).addClass('animate__animated animate__pulse')
      }
      if (currentGameTile <= wordOfTheDay.length){
        currentGameTile++;
      }
    }
  });
  // Keyboard Event Listeners | Physical | Functional
  $(document).keydown(function(event){
    var letter = String.fromCharCode(event.which);

    if(event.keyCode === 46 || event.keyCode === 8){ // Delete Key Pressed
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
    }

    if(event.keyCode === 13){ // Enter Key Pressed
      if ((currentGameTile-1)< wordOfTheDay.length){
        var remainingLetters = (wordOfTheDay.length - (currentGameTile-1))
        $(`.game_row.r${currentGameRow}`).addClass('animate__animated animate__shakeX')

        alert(`Slow down there cowboy, you still need to enter ${remainingLetters} more letters...`)

        setTimeout(() => {
          $(`.game_row.r${currentGameRow}`).removeClass('animate__animated animate__shakeX');
        }, "500")
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
              $(`.game_row.r${currentGameRow}`).addClass('animate__animated animate__shakeX')
              setTimeout(() => {
                $(`.game_row.r${currentGameRow}`).removeClass('animate__animated animate__shakeX');
              }, "500")
            } else {
              var wordOfTheDayArray = Array.from(wordOfTheDay);
              var resReqArray = Array.from(res.request)
              for (var i = 0; i < resReqArray.length; i++) {
                var keebbtn = resReqArray[i].toLowerCase();
                $(`.kb_btn.${keebbtn}`).removeClass('passive');
                $(`.kb_btn.${keebbtn}`).addClass('incorrect');
              }
              forEach(wordOfTheDayArray, function (value, index){
                var uniqueCheck = [];
                forEach(resReqArray, function (innerValue, innerIndex) {
                  var kbBtnValue = innerValue.toLowerCase();
                 if (value === innerValue) {
                    if (uniqueCheck.length === 0) {
                      $(`.game_tile_r${currentGameRow}t${innerIndex + 1}`).addClass('present')
                      $(`.game_tile_r${currentGameRow}t${innerIndex + 1}`).addClass('animate__flipInY')
                      $(`.kb_btn.${kbBtnValue}`).removeClass('incorrect');
                      $(`.kb_btn.${kbBtnValue}`).addClass('present');
                      $(`.kb_btn.${kbBtnValue}`).addClass('animate__animated animate__flipInY');
                      uniqueCheck.push(value);
                    } else {
                      if (value === uniqueCheck[0]){
                        return;
                      }
                    }
                  }
                  for (var i = 0; i < wordOfTheDay.length; i++){

                    if (wordOfTheDay[i] === res.request[i]){
                      var kbBtn = res.request[i].toLowerCase();
                      $(`.game_tile_r${currentGameRow}t${i+1}`).removeClass('present')
                      $(`.game_tile_r${currentGameRow}t${i+1}`).addClass('correct')
                      $(`.kb_btn.${kbBtn}`).removeClass('incorrect');
                      $(`.kb_btn.${kbBtn}`).removeClass('present');
                      $(`.kb_btn.${kbBtn}`).addClass('correct');
                    }
                  }
                })
              })
            console.log(res)
            currentGameRow++
            currentGameTile = 1;
            }
          }
        });
      }
    }
 });

  // Keyboard Event Listeners | Virtual
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
      $(`.game_row.r${currentGameRow}`).addClass('animate__animated animate__shakeX')

      alert(`Slow down there cowboy, you still need to enter ${remainingLetters} more letters...`)

      setTimeout(() => {
        $(`.game_row.r${currentGameRow}`).removeClass('animate__animated animate__shakeX');
      }, "500")
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
              $(`.game_row.r${currentGameRow}`).addClass('animate__animated animate__shakeX')
              setTimeout(() => {
                $(`.game_row.r${currentGameRow}`).removeClass('animate__animated animate__shakeX');
              }, "500")
          } else {
            var wordOfTheDayArray = Array.from(wordOfTheDay);
            var resReqArray = Array.from(res.request)
            for (var i = 0; i < resReqArray.length; i++) {
              var keebbtn = resReqArray[i].toLowerCase();
              $(`.kb_btn.${keebbtn}`).removeClass('passive');
              $(`.kb_btn.${keebbtn}`).addClass('incorrect');
            }
            forEach(wordOfTheDayArray, function (value, index){
              var uniqueCheck = [];
              forEach(resReqArray, function (innerValue, innerIndex) {
                var kbBtnValue = innerValue.toLowerCase();
               if (value === innerValue) {
                  if (uniqueCheck.length === 0) {
                    $(`.game_tile_r${currentGameRow}t${innerIndex + 1}`).addClass('present')
                    $(`.game_tile_r${currentGameRow}t${innerIndex + 1}`).addClass('animate__flipInY')
                    $(`.kb_btn.${kbBtnValue}`).removeClass('incorrect');
                    $(`.kb_btn.${kbBtnValue}`).addClass('present');
                    $(`.kb_btn.${kbBtnValue}`).addClass('animate__animated animate__flipInY');
                    uniqueCheck.push(value);
                  } else {
                    if (value === uniqueCheck[0]){
                      return;
                    }
                  }
                }
                for (var i = 0; i < wordOfTheDay.length; i++){

                  if (wordOfTheDay[i] === res.request[i]){
                    var kbBtn = res.request[i].toLowerCase();
                    $(`.game_tile_r${currentGameRow}t${i+1}`).removeClass('present')
                    $(`.game_tile_r${currentGameRow}t${i+1}`).addClass('correct')
                    $(`.kb_btn.${kbBtn}`).removeClass('incorrect');
                    $(`.kb_btn.${kbBtn}`).removeClass('present');
                    $(`.kb_btn.${kbBtn}`).addClass('correct');
                  }
                }
              })
            })
            console.log(res)
            currentGameRow++
            currentGameTile = 1;
          }
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