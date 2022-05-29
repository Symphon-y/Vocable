$(document).ready(function(){

  // Grab Already Existing HTML Elements
  var $body = $('body');
  var $app = $('#app');
  $app.html('');

  // SHOW A LOADING SPINNER HERE
  var $loadingContainer = $('<div class="loading-container"></div>')
  var $loading = $('<div class="loading"></div>')
  var $loadingText = $('<div id="loading-text">loading</div>')

  $loadingContainer.appendTo($body)
  $loading.appendTo($loadingContainer)
  $loadingText.appendTo($loadingContainer)

  $.get("http://localhost:3000/test", function(data, status){
    $loadingContainer.addClass('animate__animated animate__fadeOut')
    $loadingContainer.remove();

    var wordOfTheDay;
    var wordId;
    var storedWord = window.localStorage.getItem('Word ID');
    var gameState = window.localStorage.getItem('Game State')
    const endingPopup = function() {
      getStats();
      $popup.appendTo($body);
      $popupContent.appendTo($popup);
      $(".popup-overlay, .popup-content").addClass("animate__animated animate__fadeIn active");
    };

    //console.log(data)
    wordOfTheDay = data.word;
    wordId = data._id
    if (wordId !== storedWord){
      console.log('this is in the get request to the server')
      for (var i = 0; i <= 6; i++){
        localStorage.removeItem(`Guess ${i}`);
        localStorage.removeItem(`Evaluation Guess ${i}`);
      }
      localStorage.removeItem('Game State');
    } else {
      if (gameState === 'WINNER' || gameState === 'LOSER') {
        setTimeout(() => {
          endingPopup()
        }, 750)
      }
    }
    window.localStorage.setItem('Word ID', wordId);

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





  // Create New HTML Elements
  var $header = $('<div id="header"></div>')
  var $title = $('<h1 class="title">Vocable</h1>')
  var $gameContainer = $('<div class="game_container"></div>')
  var $keyboardContainer = $('<div id="kb_container"></div>')
  var $popup = $('<div class="popup-overlay"></div>')
  var $popupContent = $('<div class="popup-content"></div>')
  var $popupTitle = $('<h1 class="popup_title">STATISTICS</h1>')
  var $popupStats = $('<div class="popup_statistics"></div>')

  var $popupGuessTitle = $('<h1 class="guess_distro_title">GUESS DISTRIBUTION</h1>')
  var $popupGuessGraph = $('<div class="guess_chart_container"></div>')
  var $countdownShareContainer = $('<div class="countdown_share_container"></div>')
  var $popupFooter = $('<div class="popup_footer"></div>')
  var $coffee = $('<a href="https://www.buymeacoffee.com/RhysCreates"><img class="coffee" src="Assets/BuyMeACoffee.jpeg"></a>')

  var getStats = function (){
    // Stats
    var $gamesPlayed = $(`<div class="stat_container games_played">${window.localStorage.getItem('Games Played')}</div>`)
    var $gamesPlayedLabel = $(`<div class="games_played_label label">Games Played</div>`)
    var $winPerc = $(`<div class="stat_container win_perc">${window.localStorage.getItem('Win Percentage')}%</div>`)
    var $winPercLabel = $(`<div class="win_perc_label label">Win Percentage</div>`)
    var $currentStreak = $(`<div class="stat_container current_streak">${window.localStorage.getItem('Current Streak')}</div>`)
    var $currentStreakLabel = $(`<div class="current_streak_label label">Current Streak</div>`)
    var $longestStreak = $(`<div class="stat_container longest_streak">${window.localStorage.getItem('Longest Streak')}</div>`)
    var $longestStreakLabel = $(`<div class="longest_streak_label label">Longest Streak</div>`)

    // Graph Labels
    var $graphLabelOne = $('<div class = "graph_label label_one">1: </div>')
    var $graphLabelTwo = $('<div class = "graph_label label_two">2: </div>')
    var $graphLabelThree = $('<div class = "graph_label label_three">3: </div>')
    var $graphLabelFour = $('<div class = "graph_label label_four">4: </div>')
    var $graphLabelFive = $('<div class = "graph_label label_five">5: </div>')
    var $graphLabelSix = $('<div class = "graph_label label_six">6: </div>')

    // Append elements
    $gamesPlayed.appendTo($popupStats);
    $winPerc.appendTo($popupStats);
    $currentStreak.appendTo($popupStats);
    $longestStreak.appendTo($popupStats);
    $gamesPlayedLabel.appendTo($gamesPlayed);
    $winPercLabel.appendTo($winPerc);
    $currentStreakLabel.appendTo($currentStreak);
    $longestStreakLabel.appendTo($longestStreak);

    $graphLabelOne.appendTo($popupGuessGraph)
    $graphLabelTwo.appendTo($popupGuessGraph)
    $graphLabelThree.appendTo($popupGuessGraph)
    $graphLabelFour.appendTo($popupGuessGraph)
    $graphLabelFive.appendTo($popupGuessGraph)
    $graphLabelSix.appendTo($popupGuessGraph)

    if (!window.localStorage.getItem('Winning Guess Row 1')){
      window.localStorage.setItem('Winning Guess Row 1', 0)
    }
    if (!window.localStorage.getItem('Winning Guess Row 2')){
      window.localStorage.setItem('Winning Guess Row 2', 0)
    }
    if (!window.localStorage.getItem('Winning Guess Row 3')){
      window.localStorage.setItem('Winning Guess Row 3', 0)
    }
    if (!window.localStorage.getItem('Winning Guess Row 4')){
      window.localStorage.setItem('Winning Guess Row 4', 0)
    }
    if (!window.localStorage.getItem('Winning Guess Row 5')){
      window.localStorage.setItem('Winning Guess Row 5', 0)
    }
    if (!window.localStorage.getItem('Winning Guess Row 6')){
      window.localStorage.setItem('Winning Guess Row 6', 0)
    }

    var rowOne = Number(window.localStorage.getItem('Winning Guess Row 1'))
    var rowTwo = Number(window.localStorage.getItem('Winning Guess Row 2'))
    var rowThree = Number(window.localStorage.getItem('Winning Guess Row 3'))
    var rowFour = Number(window.localStorage.getItem('Winning Guess Row 4'))
    var rowFive = Number(window.localStorage.getItem('Winning Guess Row 5'))
    var rowSix = Number(window.localStorage.getItem('Winning Guess Row 6'))

    var graphArray = [rowOne, rowTwo, rowThree, rowFour, rowFive, rowSix];
    var totalWins = function (array){
      var total = 0;
      for (var i = 0; i < array.length; i++){
        total+= Number(array[i]);
      }
      return total;
    };

    var makeGraph = function (row, guesses) {
      var width = (guesses / totalWins(graphArray) * 100)

      var $bar = $(`<div class"graph_bar row${row} style="width: ${width}%;"></div>`)
      var $numGuess = $(`<div class"num_guess" style="background-color: #548d4e; margin-left: .25rem; padding-right: .25rem; Text-align: end;">${guesses}</div>`)

      if (row === 1){
        $bar.appendTo($graphLabelOne);
        $numGuess.appendTo($bar);
      }
      if (row === 2){
        $bar.appendTo($graphLabelTwo);
        $numGuess.appendTo($bar);
      }
      if (row === 3){
        $bar.appendTo($graphLabelThree);
        $numGuess.appendTo($bar);
      }
      if (row === 4){
        $bar.appendTo($graphLabelFour);
        $numGuess.appendTo($bar);
      }
      if (row === 5){
        $bar.appendTo($graphLabelFive);
        $numGuess.appendTo($bar);
      }
      if (row === 6){
        $bar.appendTo($graphLabelSix);
        $numGuess.appendTo($bar);
      }
    }

    for (var i = 1; i <=6; i++) {
      makeGraph(i, graphArray[i-1])
    }

    var $timerLabel = $('<h1 id="timer_label">NEXT VOCABLE</h1>')
    var $timerContainer = $('<div class="timer_container"></div>')
    var $countdown = $('<div id="timer"></div>')
    var $shareContainer =  $('<div class="share_container"></div>')
    var $share = $('<button id="share">SHARE</button>')


    $timerContainer.appendTo($countdownShareContainer);
    $timerLabel.appendTo($timerContainer);
    $countdown.appendTo($timerContainer);
    $shareContainer.appendTo($countdownShareContainer);
    $share.appendTo($shareContainer);
    $coffee.appendTo($popupFooter);


    // Countdown Timer
    setInterval(function(){
      var toDate=new Date();
      var tomorrow=new Date();
      tomorrow.setHours(24,0,0,0);
      var diffMS=tomorrow.getTime()/1000-toDate.getTime()/1000;
      var diffHr=Math.floor(diffMS/3600);
      diffMS=diffMS-diffHr*3600;
      var diffMi=Math.floor(diffMS/60);
      diffMS=diffMS-diffMi*60;
      var diffS=Math.floor(diffMS);
      var result=((diffHr<10)?"0"+diffHr:diffHr);
      result+=":"+((diffMi<10)?"0"+diffMi:diffMi);
      result+=":"+((diffS<10)?"0"+diffS:diffS);

      $('#timer').text(result);
      $('#timer').addClass('animate__animated animate__fadeIn')
    }, 1000);

  }


  // Add HTML Elements To The DOM
  $header.prependTo($body);
  $app.appendTo($body);
  $gameContainer.appendTo($app);
  $title.prependTo($header);
  $keyboardContainer.appendTo($app);
  $popupTitle.appendTo($popupContent);
  $popupStats.appendTo($popupContent);
  $popupGuessTitle.appendTo($popupContent);
  $popupGuessGraph.appendTo($popupContent);
  $countdownShareContainer.appendTo($popupContent);
  $popupFooter.appendTo($popupContent);




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
  var previousGuesses = [];
  var keyHistory = '';




  // init func
  const getPreviousGuesses = function (){
  // iterate number of guesses
    for (var i = 1; i <= 6; i++){
      // if guess number exists
      if (window.localStorage.getItem(`Guess ${currentGameRow}`)){
        // push guess value to an array
        var previousGuess = window.localStorage.getItem(`Guess ${currentGameRow}`)
        previousGuesses.push(previousGuess)
        currentGameRow++
      }
    }
  }
  var initiateCurrentTile = '1';
  var initiateCurrentRow = '1';
  var presentArray = [];
  var correctArray = [];

  const initiateBoard = function (){


    const previousKeyboardEvals = function () {
      var presentArrayUniq = uniq(presentArray)
      var correctArrayUniw = uniq(correctArray)
      for (var i = 0; i < previousGuesses.length; i ++){
        for (var j = 0; j < previousGuesses[i].length; j++){
          var keebbtn = previousGuesses[i][j].toLowerCase();
          $(`.kb_btn.${keebbtn}`).removeClass('passive');
          $(`.kb_btn.${keebbtn}`).addClass('incorrect');
        }
      }

      for (var x = 0; x < presentArrayUniq.length; x ++){
        var kbBtnValue = presentArrayUniq[x].toLowerCase();
        if (kbBtnValue.length > 0){
          $(`.kb_btn.${kbBtnValue}`).removeClass('incorrect');
          $(`.kb_btn.${kbBtnValue}`).addClass('present');
          $(`.kb_btn.${kbBtnValue}`).addClass('animate__animated animate__flipInY');
        }
      }
      for (var k = 0; k < correctArrayUniw.length; k ++){
        var keebVal = correctArrayUniw[k].toLowerCase();
        if (keebVal.length > 0){
          $(`.kb_btn.${keebVal}`).removeClass('incorrect');
          $(`.kb_btn.${keebVal}`).removeClass('present');
          $(`.kb_btn.${keebVal}`).addClass('correct');
          $(`.kb_btn.${keebVal}`).addClass('animate__animated animate__flipInY');
        }
      }
    }
    if (wordId === storedWord){
    var wordOfTheDayArray = Array.from(wordOfTheDay);
    //if (window.localStorage.getItem('Evaluation Guess 1')){
      forEach(previousGuesses, function (value, index) {
        forEach(value, function (letter, innerIndex) {
          var oldGuessToUpper = letter.toUpperCase();
          $(`.game_tile_r${initiateCurrentRow}t${initiateCurrentTile}`).text(oldGuessToUpper);
          var previousEvaluations = window.localStorage.getItem(`Evaluation Guess ${initiateCurrentRow}`);
          var evalArray = previousEvaluations.split(',')
          for (var i = 0; i <= evalArray.length; i++){
            if (evalArray[i] === 'present'){
              $(`.game_tile_r${initiateCurrentRow}t${i+1}`).addClass('present')
              $(`.game_tile_r${initiateCurrentRow}t${i+1}`).addClass('animate__animated animate__flipInY')
              presentArray.push($(`.game_tile_r${initiateCurrentRow}t${i+1}`).text());
            } else if (evalArray[i] === 'correct'){
              $(`.game_tile_r${initiateCurrentRow}t${i+1}`).addClass('correct')
              $(`.game_tile_r${initiateCurrentRow}t${i+1}`).addClass('animate__animated animate__flipInY')
              correctArray.push($(`.game_tile_r${initiateCurrentRow}t${i+1}`).text());
            }
          }

          initiateCurrentTile++
        })

        initiateCurrentTile = '1'
        initiateCurrentRow++
        previousKeyboardEvals();
      })
    }
  }

  getPreviousGuesses();


  gameboard(wordOfTheDay);

  const checkGuess = function () {
    if ((currentGameTile-1) < wordOfTheDay.length){
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
        submissionArray.push($(this).text().toLowerCase());
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
          console.log(res)
          if (res.result === false){
            alert('Sorry, this doesnt look like a word to me')
            $(`.game_row.r${currentGameRow}`).addClass('animate__animated animate__shakeX')
            setTimeout(() => {
              $(`.game_row.r${currentGameRow}`).removeClass('animate__animated animate__shakeX');
            }, "500")
          } else {
            var wordOfTheDayArray = Array.from(wordOfTheDay);
            var resReqArray = Array.from(res.word)
            window.localStorage.setItem(`Guess ${currentGameRow}`, submissionArray[0])
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

                  if (wordOfTheDay[i] === res.word[i]){
                    var kbBtn = res.word[i].toLowerCase();
                    $(`.game_tile_r${currentGameRow}t${i+1}`).removeClass('present')
                    $(`.game_tile_r${currentGameRow}t${i+1}`).addClass('correct')
                    $(`.kb_btn.${kbBtn}`).removeClass('incorrect');
                    $(`.kb_btn.${kbBtn}`).removeClass('present');
                    $(`.kb_btn.${kbBtn}`).addClass('correct');
                  }
                }
              })
            })
            var evaluation = [];
            var correctGuess = false;

            for (var i = 0; i < wordOfTheDay.length; i++){
                if ($(`.game_tile_r${currentGameRow}t${i+1}`).hasClass('present')){
                  evaluation.push('present')
                } else if ($(`.game_tile_r${currentGameRow}t${i+1}`).hasClass('correct')){
                  evaluation.push('correct')
                } else {
                  evaluation.push('incorrect')
                }
            }
            for (var j = 0; j < evaluation.length; j++){
              if (evaluation[j] === 'correct'){
                correctGuess = true;
              } else if (evaluation[j] !== 'correct'){
                correctGuess = false;
                break;
              }
            }

            window.localStorage.setItem(`Evaluation Guess ${currentGameRow}`, evaluation)
            if (correctGuess === true) {
              window.localStorage.setItem(`Game State`, 'WINNER')
              var gameComplete = 1;
              var previousGamesComplete = Number(window.localStorage.getItem('Games Played'))
              var totalGamesComplete = gameComplete + previousGamesComplete;


              var gamesWon = 1;
              var previousGamesWon = Number(window.localStorage.getItem('Games Won'))
              var totalGamesWon = gameComplete + previousGamesWon;

              var gameStreak = Number(window.localStorage.getItem("Current Streak"))
              var currentStreak = gameStreak + gamesWon;

              var longestStreak = Number(window.localStorage.getItem('Longest Streak'))
              if (!window.localStorage.getItem(`Winning Guess Row ${currentGameRow}`)){
                window.localStorage.setItem(`Winning Guess Row ${currentGameRow}`, 1)
              } else {
                var newWinningGuessRow = Number(window.localStorage.getItem(`Winning Guess Row ${currentGameRow}`)) + 1;
                window.localStorage.setItem(`Winning Guess Row ${currentGameRow}`, newWinningGuessRow)
              }

              if (currentStreak > longestStreak){
                window.localStorage.setItem('Longest Streak', currentStreak)
              }



              window.localStorage.setItem('Games Played', totalGamesComplete)
              window.localStorage.setItem('Games Won', totalGamesWon)
              window.localStorage.setItem('Current Streak', currentStreak);
              var winPercentage = (Number(window.localStorage.getItem('Games Won')) / Number(window.localStorage.getItem('Games Played'))) * 100;
              window.localStorage.setItem('Win Percentage', winPercentage)

              setTimeout(() => {
                endingPopup()
              }, 750)

            } else if (correctGuess === false && currentGameRow === 6) {
              var gameComplete = 1;
              var previousGamesComplete = Number(window.localStorage.getItem('Games Played'))
              var newTotal = gameComplete + previousGamesComplete;
              window.localStorage.setItem('Current Streak', 0)

              if (!window.localStorage.getItem('Games Won')){
                window.localStorage.setItem('Games Won', 0)
              }
              if (!window.localStorage.getItem('Longest Streak')){
                window.localStorage.setItem('Longest Streak', 0)
              }

              window.localStorage.setItem('Games Played', newTotal)
              var winPercentage = (Number(window.localStorage.getItem('Games Won')) / Number(window.localStorage.getItem('Games Played'))) * 100;
              window.localStorage.setItem('Win Percentage', winPercentage)
              window.localStorage.setItem(`Game State`, 'LOSER')

              setTimeout(() => {
                endingPopup()
              }, 750)

            }
          console.log(evaluation)
          console.log(res)
          currentGameRow++
          currentGameTile = 1;
          }
        }
      });
    }
  }


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
      checkGuess();
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

  // Enter Key Pressed | Virtual
  $('.kb_entr').click(function() {
    checkGuess();
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
    initiateBoard();
  }

console.log(currentGameRow)
  });
});