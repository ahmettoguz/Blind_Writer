lineAnimationDuration = 2000;
currentlineHeight = 58;
compositionArray = [];
currentWordIndex = 0;
correctSpelledCount = 0;
misSpelledCount = 0;
timer = 60;
correctSpelledLetterCount = 0;
misSpelledLetterCount = 0;
second = 1000;
language = "TR";
languageClicked = false;

function initializeAll() {
  create_Composition_Array();
  create_Append_Rows();

  // set first span background color gray
  $(`span#word-${currentWordIndex}`).css("background-color", "#DDDDDD");
  timer = 60;
}

function shiftParagraph() {
  $("#paragraphContainer").animate(
    { scrollTop: `${currentlineHeight}px` },
    lineAnimationDuration
  );
  currentlineHeight += 58;
}

function create_Composition_Array() {
  compositionArrayTR = compositionParagraphTR.split(" ");

  //   then replace characters one by one
  for (let i = 0; i < compositionArrayTR.length; i++) {
    compositionArrayTR[i] = compositionArrayTR[i]
      .replace(/[.,"“”\/#!$%\^&\*;:{}=\-_`~()\d]/gi, "")
      .toLowerCase();
  }

  compositionParagraphTR = "";

  compositionArrayEN = compositionParagraphEN.split(" ");

  //   then replace characters one by one
  for (let i = 0; i < compositionArrayEN.length; i++) {
    compositionArrayEN[i] = compositionArrayEN[i]
      .replace(/[.,"“”\/#!$%\^&\*;:{}=\-_`~()\d]/gi, "")
      .toLowerCase();
  }

  compositionParagraphEN = "";
}

function getRandomWord() {
  if (language == "TR") {
    randomIndex = Math.floor(Math.random() * compositionArrayTR.length);
    return compositionArrayTR[randomIndex];
  } else {
    randomIndex = Math.floor(Math.random() * compositionArrayEN.length);
    return compositionArrayEN[randomIndex];
  }
  // return "a";
}

function create_Append_Rows() {
  // clear paragraph
  $("#paragraphContainer").html("");

  // getting word and appending to the container while character length reach the specified character number
  for (let i = 0; i < 400; i++) {
    let word = getRandomWord();
    word = `<span class="wordBox" id = "word-${i}">${word}</span>`;
    $("#paragraphContainer").append(word);
  }
}

function resetAllAtTheEnd() {
  currentWordIndex = 0;

  // shift to start
  currentlineHeight = 58;
  $("#paragraphContainer").animate(
    { scrollTop: `${0}px` },
    lineAnimationDuration
  );

  // create paragraph again
  create_Append_Rows();

  // set first span background color gray
  $(`span#word-${currentWordIndex}`).css("background-color", "#DDDDDD");

  // set time
  if (typeof activationInterval != "undefined") {
    clearInterval(activationInterval);
    delete activationInterval;
  }
  timer = 60;
  $("#timeDisplay").text("1:00");

  // clear input area
  $("#typeBox").val("");
  $("#typeBox").blur();

  //clear correct and incorrect results and fadeout
  $("#inCorrectCountDiv").fadeOut(2000, function () {
    misSpelledCount = 0;
    misSpelledLetterCount = 0;
    $(".warningIcon + i").html("&nbsp; " + misSpelledCount);
  });
  $("#correctCountDivContainer ").fadeOut(2000, function () {
    correctSpelledCount = 0;
    correctSpelledLetterCount = 0;
    $(".checkIcon + i").html("&nbsp; " + correctSpelledCount);
  });

  // show results
  if (languageClicked == false) $("#resultInfoContainer").slideDown(700);
}

function displayResults() {
  $("#resultWpm").text(
    Math.round((correctSpelledLetterCount + correctSpelledCount) / 5) + " WPM"
  );
  $("#correctWordSpan").text(correctSpelledCount);
  $("#inCorrectWordSpan").text(misSpelledCount);
  $("#correctLetterSpan").text(correctSpelledLetterCount + correctSpelledCount);
  $("#inCorrectLetterSpan").text(misSpelledLetterCount);
}

function countdown_Time() {
  timer--;
  // Icon Operation
  if ($("#timeIcon").hasClass("timeRotate")) {
    $("#timeIcon").removeClass("timeRotate");
    $("#timeIcon").removeClass("fa-hourglass-end");
    $("#timeIcon").addClass("fa-hourglass-half");
  } else if ($("#timeIcon").hasClass("fa-hourglass-half")) {
    $("#timeIcon").removeClass("fa-hourglass-half");
    $("#timeIcon").addClass("fa-hourglass-end");
  } else if ($("#timeIcon").hasClass("fa-hourglass-end")) {
    $("#timeIcon").removeClass("fa-hourglass-half");
    $("#timeIcon").addClass("timeRotate");
  }

  $("#timeDisplay").text("0:" + timer);
  if (timer == 0) {
    displayResults();
    resetAllAtTheEnd();
  }
}

function activateTyping() {
  activationInterval = setInterval(countdown_Time, second);
}

function changeLanguage() {
  if (language == "TR") language = "EN";
  else language = "TR";

  languageClicked = true;
  resetAllAtTheEnd();
  languageClicked = false;
}

function refresh() {
  languageClicked = true;

  resetAllAtTheEnd();
  languageClicked = false;
}

// tab click to auto focus
$("body").keydown(function (e) {
  if (e.which == 9) {
    $("#typeBox").focus();
    e.preventDefault();
  }
});

// key event to get pressed keys and check if its displayed or not
function keyActionEvent(event) {
  // start timer
  if (typeof activationInterval == "undefined") {
    activateTyping();
  }

  // remove bottom information part
  $("#resultInfoContainer").slideUp(500);

  // I will show letters while writing and if it is blank I will pass to new word
  if (event.originalEvent.data == " ") {
    // before comparing word check there is a word
    if ($("#typeBox").val().slice(0, -1) != "") {
      // compare words
      if (
        $(`#word-${currentWordIndex}`).text() ==
        $("#typeBox").val().slice(0, -1)
      ) {
        // update correct word and letter data
        correctSpelledCount++;
        correctSpelledLetterCount += $(`#word-${currentWordIndex}`).text()
          .length;
        $("#correctCountDivContainer").fadeIn();
        $(".checkIcon + i").html("&nbsp; " + correctSpelledCount);

        // clear the past word color
        $(`span#word-${currentWordIndex}`).css("background-color", "white");
        $(`span#word-${currentWordIndex}`).css("color", "lightseagreen");
      } else {
        // update correct word and letter data
        misSpelledCount++;
        misSpelledLetterCount += $(`#word-${currentWordIndex}`).text().length;
        $("#inCorrectCountDiv").fadeIn();
        $(".warningIcon + i").html("&nbsp; " + misSpelledCount);
        $(".warningIcon").css("animation-play-state", "running");
        setTimeout(function () {
          $(".warningIcon").css("animation-play-state", "paused");
        }, 500);

        // clear the past word color
        $(`span#word-${currentWordIndex}`).css("background-color", "white");
        $(`span#word-${currentWordIndex}`).css("color", "red");
      }

      // make gray next word
      $(`span#word-${currentWordIndex + 1}`).css("background-color", "#DDDD");

      // clear typeBox for new word
      $("#typeBox").val("");

      // check if this word was the end of the line and shift paragraph
      let pos1 = $(`#word-${currentWordIndex}`).position();
      let pos2 = $(`#word-${currentWordIndex + 1}`).position();

      if (pos2 != undefined) {
        if (pos1.top != pos2.top) {
          shiftParagraph();
        }
      }

      currentWordIndex++;
    } else {
      $("#typeBox").val("");
    }
  } else {
    //check  match condition if wrong letter is pressed make div's color red
    if (
      $("#typeBox").val() !=
      $(`#word-${currentWordIndex}`)
        .text()
        .substring(0, $("#typeBox").val().length)
    ) {
      $(`span#word-${currentWordIndex}`).css("background-color", "red");
    } else {
      $(`span#word-${currentWordIndex}`).css("background-color", "#DDDDDD");
    }
  }
}
