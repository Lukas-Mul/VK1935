const timeoutSign = document.querySelector(".timeoutSign");

// IDLE TIMEOUT - na nabidku, jestli bude pokracovat
(function() {
  const idleDurationSecs = 110;
  let redirectUrl = '../index.html';  // Redirect idle users to this URL
  let idleTimeout;
  let resetIdleTimeout = function() {
    if(idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function(){
      // location.href = redirectUrl
      overlay2.classList.remove("hideOverlay2");
      timeoutSign.classList.remove("hideTimeoutSign");
      let timeleft = 9;
      let downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.querySelector(".timer").innerHTML = "";
        } else {
        document.querySelector(".timer").innerHTML = timeleft;
        }
        timeleft -= 1;
      }, 1000);
    }, idleDurationSecs * 1000);
  };
  resetIdleTimeout();
  ['click', 'touchstart', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdleTimeout, false)
  });
})();

// IDLE TIMEOUT - na presmerovani na zacatek
(function() {
  const idleDurationSecs = 120;
  let redirectUrl = '../index.html';  // Redirect idle users to this URL
  let idleTimeout;
  let resetIdleTimeout = function() {
    if(idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function(){
      location.href = redirectUrl
      // timeoutSign.classList.remove("hideTimeoutSign");
    }, idleDurationSecs * 1000);
  };
  resetIdleTimeout();
  ['click', 'touchstart', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdleTimeout, false)
  });
})();


let strany = 0;
const allDivs = document.querySelectorAll(".parties-container div");


//CONSTANTS
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const party = document.querySelectorAll(".parties-text");
const questionContainer = document.querySelector(".question-container");
const containerIntro = document.querySelector(".container-intro");
const explanation1 = document.querySelector("#explanation1");
const explanation2 = document.querySelector("#explanation2");
const explanation1Flex = document.getElementById("explanation1-flex");
const explanation2Flex = document.getElementById('explanation2-flex');
const MAX_QUESTIONS = 12;
const progressBarFull = document.getElementById('progressBarFull');
const overlay = document.getElementById("overlay");
const overlay2 = document.getElementById("overlay2");
const restartDiv = document.querySelector(".restartDiv");
const continueDiv = document.querySelector(".continue");
const changingPartiesDiv = document.querySelector(".changingTextParties");
const partiesContainerDiv = document.querySelector(".parties-container");
const lastResetButtonDiv = document.querySelector(".lastResetButtonDiv");

const chosenAnswer = document.querySelectorAll(".choice-container");
const answerContainer = document.querySelector(".answer-container")


// VARIABLES
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questionIndex = 0;

// PARTIES
let cssd = 0;
let agr = 0;
let kler = 0;
let mladStar = 0;
let cstpd = 0;

// OTAZKY - TEXT
let questions = [
{
  question:
    "The introduction of universal suffrage means that all men over the age of 24 can vote and men over the age of 30 can be elected to the Parliament. The restriction <br>of the right to vote by property and origin is also lifted. <br>Do you agree with this development?",
  choice1: "Yes",
  choice2: "No",
  answer: 1,
},
{
  question:
    "Part of the society believes that the right to vote should also apply to women. <br>Do you agree with this opinion?",
  choice1: "Yes",
  choice2: "No",
  answer: 2,
},
{
  question:
    "It is necessary to strive for the greatest possible national independence within <br>the monarchy. The most important agenda must be the defence of national interests.",
  choice1: "Yes",
  choice2: "No",
  answer: 3,
},
{
  question:
    "After many years of passivity, Czech politicians are finally represented <br>in the Austrian government and have the opportunity to cooperate with Vienna <br>at the governmental level. <br>In your opinion, should we continue to strengthen political relations and direct our ministers to Vienna?",
  choice1: "Yes",
  choice2: "No",
  answer: 4,
},
{
  question:
    "Czech politics should follow the path of a single national ballot. The newly created constituencies must favour the Czech populations.",
  choice1: "Yes",
  choice2: "No",
  answer: 5,
},
{
  question:
    "Economic interests are key to Czech politics. It is necessary to strive for the greatest possible autonomy in the field of industrial and rural development.",
  choice1: "Yes",
  choice2: "No",
  answer: 6,
},
{
  question:
    "Karel Kramář is the greatest personality of Czech politics, a defender of Slavism, and a capable leader! He should become the leader of the nation.",
  choice1: "Yes",
  choice2: "No",
  answer: 7,
},
{
  question:
    "T. G. Masaryk, a candidate for the Parliament and a professor at the University <br>of Prague, wrote: “An interest in Slovakia must be an important part of the Czech parties’ programme.” <br>Do you share this opinion?",
  choice1: "Yes",
  choice2: "No",
  answer: 8,
},
{
  question:
    "In international politics, Austria-Hungary focuses on Germany and Italy, while <br>the Slavic nations sympathize with the East. <br>Should Czech politics support Russia?",
  choice1: "Yes",
  choice2: "No",
  answer: 9,
},
{
  question:
    "Times are changing and bringing problems that the Austrian government is unable to solve. Therefore, it is necessary to change the political approach – less negotiation, more pressure!",
  choice1: "Yes",
  choice2: "No",
  answer: 10,
},
{
  question: "Which statement do you identify with?",
  choice1:
    "„We want to provide for the persons unable to work <br>by introducing an old-age and disability pension, and a pension for widows and orphans.“",
  choice2: "„Let’s fight for the equality of nations and equality in our nation!”  ",
  choice3: "„Send many true guardians of the soil and fighters for its security at all times to Vienna!”",
  choice4:
    "„We want strong carte blanche politics, politics willing to support any government that is just to us, but politics determined to fight every government which would not fulfil the obligations of the state towards the Czech nation.“",
  choice5: "„Education must be based on tradition, values, and love for one’s country.”",
  answer: 11,
},
{
  question: "Which statement do you identify with?",
  choice1:
    "„We want to provide for the persons unable to work by introducing an old-age and disability pension, and a pension for widows and orphans.“",
  choice2: "„Let’s fight for the equality of nations and equality in our nation!”  ",
  choice3: "„Send many true guardians of the soil and fighters for its security at all times to Vienna!”",
  choice4:
    "„We want strong carte blanche politics, politics willing to support any government that is just to us, but politics determined to fight every government which would not fulfil the obligations of the state towards the Czech nation.“",
  choice5: "„Education must be based on tradition, values, and love for one’s country.”",
  answer: 11,
},
];

// RESETBUTTON vpravo nahore
const resetButton = document.createElement("button")
resetButton.className = "resetButton";
resetButton.innerText = "< RESTART";
questionContainer.appendChild(resetButton);
resetButton.addEventListener("click", function() {
    return window.location.assign("../index.html");
});

// RESETBUTTONDIV v oznamovacim okne
const resetButtonDiv = document.createElement("button")
resetButtonDiv.className = "resetButtonDiv";
resetButtonDiv.innerText = " < RESTART";
restartDiv.appendChild(resetButtonDiv);
resetButtonDiv.addEventListener("click", function() {
    return window.location.assign("../index.html");
});

// RESETBUTTON na posledni strance
const resetButtonLast = document.createElement("button")
resetButtonLast.className = "lastResetButton";
resetButtonLast.innerText = "< RESTART";
lastResetButtonDiv.appendChild(resetButtonLast);
lastResetButtonDiv.addEventListener("click", function() {
    return window.location.assign("../index.html");
});

// TLACITKO "ANO", PRO POKRACOVANI PO NECINNOSTI
const continueButton = document.createElement("button")
continueButton.className = "continueButton";
continueButton.innerText = "YES";
continueDiv.appendChild(continueButton);
continueButton.addEventListener("click", function() {
  timeoutSign.classList.add("hideTimeoutSign");
  overlay2.classList.add("hideOverlay2");
});



// FUNKCE STARTGAME
startGame = () => {
questionCounter = 1;
score = 0;
availableQuestions = [...questions];
getNewQuestion();
};

//FUNKCE getNewQuestion
getNewQuestion = () => {

questionCounter++
// Update the progress bar
progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // vytvori u divu question dalsi tridu "slide", ktera zajistuje animaci
  question.classList.add("slide");
  // odstrani tridu slide, kdyz se klikne na odpoved
  function slideAway(){
    answerContainer.addEventListener("mousedown", function(){
      question.classList.remove("slide");
    })
  }
  // spusteni funkce slideAway
  slideAway();



currentQuestion = availableQuestions[0];
question.innerHTML = currentQuestion.question; //ta question na leve strane znaci ten div s tou otazkou. priradim k ni innerText, ktery si js najde tak, ze pujde podle currentQuestion a vezme si property question z te currentQuestion.
choices.forEach((choice) => {
  const number = choice.dataset["number"]; //tohle vezme to cislo z toho datasetu v html
  choice.innerHTML = currentQuestion["choice" + number]; //tomu parametru choice to priradi innerText, ktery je v currentQuestion["choice" + number]. Tohle znamena vlastne choice1, choice2 apod.
});
availableQuestions.splice(questionIndex, 1); //Tohle vyhodi tu otazku, ktera byla pouzita z obehu
acceptingAnswers = true; //tohle umozni odpovidat na otazky az tehdy, kdyz bylo vsechno nacteno (proto je na zacatku dana hodnota false)
};


// DOSTAT NOVOU OTAZKU A POCITANI BODU
choices.forEach((choice) => {
choice.addEventListener("click", (e) => {
  //kdyz kliknou na tu odpoved, tak tohle mi da reference na to, na co vlastne klikli
  if (!acceptingAnswers) return; //jestli jeste neakceptujeme odpoved, tak to budeme ignorovat

  acceptingAnswers = false; // tohle vytvori male zpozdeni, nechceme, aby na to hned kliknuli
  const selectedChoice = e.target; //timhle vyselektuju volbu, na kterou klikli
  const selectedAnswer = selectedChoice.dataset["number"]; //timhle vyselektuju odpoved, kterou ta zvolena odpoved ma

  // FUNKCE removeClassHidden - odstrani class hidden
  function removeClassHidden() {
    const hiddenContainer = document.querySelectorAll(".hidden");
    hiddenContainer.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.remove("hidden");
      }
    });
  }

  function removeClassHidden2() {
    const hiddenContainer2 = document.querySelectorAll(".hidden2");
    hiddenContainer2.forEach(function (item) {
      if (
        currentQuestion.answer == 11 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4 || selectedAnswer == 5)
      ) {
        item.classList.remove("hidden2");
      }
    });
  }

  function addClassHidden3() {
    const hiddenContainer3 = document.querySelectorAll(".hidden3");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 11 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4 || selectedAnswer == 5)
      ) {
        item.classList.add("hidden2");
      }
    });
  }

  function addClassLastQuestion() {
    const hiddenContainer3 = document.querySelectorAll("#last-answer");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container");
      }
    });
  }

  function addClassLastQuestion1() {
    const hiddenContainer3 = document.querySelectorAll(".question-container");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container1");
      }
    });
  }

  function addClassLastAnswer() {
    const hiddenContainer4 = document.querySelectorAll(".choice-text");
    hiddenContainer4.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-text");
      }
    });
  }

  function addClassLastText() {
    const hiddenContainer5 = document.querySelectorAll(".choice-container");
    hiddenContainer5.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-answer");
      }
    });
  }

  // VYTVORIT VYSVETLIVKU cislo 1 - Button 1

  function createButton1 (){
    let button1 = document.createElement("button")
    button1.className = "button1";
    button1.innerText = "MORE INFO"
    questionContainer.appendChild(button1)
    button1.addEventListener("click", function(){
      // add class hidden na overlay element, takze kliknutim se tam ten overlay element zobrazi a udela vsechno ostatni tmavym
      overlay.classList.remove("hidden11");
      explanation1Flex.classList.add("translate");
      
    })
  }

  // VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

  function createButton2 (){
    const button2 = document.createElement("button")
    button2.className = "button2";
    button2.innerText = "BACK"
    explanation1Flex.appendChild(button2)
    button2.addEventListener("click", function(){
      overlay.classList.add("hidden11");
      explanation1Flex.classList.remove("translate");


    })
  }

  // SKRYT BUTTON1
  function hideButton1(){
    let oznaceniButton1 = document.querySelector(".button1");
      oznaceniButton1.classList.add("hideButton1");;
  }

// VYTVORIT VYSVETLIVKU CISLO 2 - Button 3
function createButton3 (){
  let button3 = document.createElement("button")
  button3.className = "button3";
  button3.innerText = "MORE INFO"
  questionContainer.appendChild(button3)
  button3.addEventListener("click", function(){
    overlay.classList.remove("hidden11");
    explanation2Flex.classList.add("translate");

  
  })
}

// VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

function createButton4 (){
  const button4 = document.createElement("button")
  button4.className = "button4";
  button4.innerText = "BACK"
  explanation2Flex.appendChild(button4)
  button4.addEventListener("click", function(){
    explanation2Flex.classList.remove("translate");
    overlay.classList.add("hidden11");
  })
}

// SKRYT BUTTON1
function hideButton3(){
  let oznaceniButton3 = document.querySelector(".button3");
    oznaceniButton3.classList.add("hideButton3");;
}

// FUNKCE countPoints - Pocitani bodu
  function countPoints() {
    // OTAZKA 0
    if (currentQuestion.answer == 0 && selectedAnswer == 1) {
      return window.location.assign("./zena.html");
          }
    if (currentQuestion.answer == 0 && selectedAnswer == 2) {
      return window.location.assign("./muz.html");
    }
    // OTAZKA 1
    if (currentQuestion.answer == 1 && selectedAnswer == 1) {
      cssd++;
      agr++;
      cstpd++;
      mladStar++;
      createButton1 ()
      createButton2 ()
    }
    if (currentQuestion.answer == 1 && selectedAnswer == 2) {
      kler++;
      createButton1 ()
      createButton2 ()
    }
    // OTAZKA 2
    if (currentQuestion.answer == 2 && selectedAnswer == 1) {
      cstpd++;
      cssd++;
     hideButton1()

    }
    if (currentQuestion.answer == 2 && selectedAnswer == 2) {
      kler++;
      agr++;
      mladStar++;
      hideButton1()
    }
    // OTAZKA 3
    if (currentQuestion.answer == 3 && selectedAnswer == 1) {
      cstpd++;
      mladStar++;
    }
    if (currentQuestion.answer == 3 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
    }
    // OTAZKA 4
    if (currentQuestion.answer == 4 && selectedAnswer == 1) {
      agr++;
      mladStar++;
      kler++;
    }
    if (currentQuestion.answer == 4 && selectedAnswer == 2) {
      cssd++;
      cstpd++;
    }
    // OTAZKA 5
    if (currentQuestion.answer == 5 && selectedAnswer == 1) {
      mladStar++;
    }
    if (currentQuestion.answer == 5 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
    }
    // OTAZKA 6
    if (currentQuestion.answer == 6 && selectedAnswer == 1) {
      agr++;
      createButton3 ()
      createButton4 ()
    }
    if (currentQuestion.answer == 6 && selectedAnswer == 2) {
      kler++;
      cssd++;
      cstpd++;
      mladStar++;
      createButton3 ()
      createButton4 ()
    }
    // OTAZKA 7
    if (currentQuestion.answer == 7 && selectedAnswer == 1) {
      mladStar++;
      hideButton3()
    }
    if (currentQuestion.answer == 7 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
      hideButton3()
    }
    // OTAZKA 8
    if (currentQuestion.answer == 8 && selectedAnswer == 1) {
    }
    if (currentQuestion.answer == 8 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
      mladStar++;
    }
    // OTAZKA 9
    if (currentQuestion.answer == 9 && selectedAnswer == 1) {
      mladStar++;
    }
    if (currentQuestion.answer == 9 && selectedAnswer == 2) {
      kler++;
      cssd++;
      agr++;
      cstpd++;
    }
    // OTAZKA 10
    if (currentQuestion.answer == 10 && selectedAnswer == 1) {
      cssd++;
      agr++;
      cstpd++;
      addClassLastQuestion();
      removeClassHidden();
      addClassLastAnswer();
      addClassLastText();
      addClassLastQuestion1();
    }
    if (currentQuestion.answer == 10 && selectedAnswer == 2) {
      kler++;
      mladStar++;
      addClassLastQuestion();
      removeClassHidden();
      addClassLastAnswer();
      addClassLastText();
      addClassLastQuestion1();
    }
    // OTAZKA 11
    if (currentQuestion.answer == 11 && selectedAnswer == 1) {
      cssd++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 2) {
      cstpd++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 3) {
      agr++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 4) {
      mladStar++;
      removeClassHidden2();
      addClassHidden3();
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 5) {
      kler++;
      removeClassHidden2();
      addClassHidden3();
    }
  }
  countPoints();

  // ARRAY OBJEKT VYSLEDKY TEXT
  let strany = [
      {
      text:"CLERICAL PARTIES",
      cislo: 1,
      strana: Math.floor((kler / 11) * 100),      
      },
  {
      text:
        "YOUNG CZECHS",
      cislo: 2,
      strana: Math.floor((mladStar / 11) * 100),
  },
  {
      text:
        "SOCIAL DEMOCRATS",
      cislo: 3,
      strana: Math.floor((cssd / 11) * 100),
  },
  {
      text:
        "AGRARIANS",
      cislo: 4,
      strana: Math.floor((agr / 11) * 100),
  },
  {
      text:
        "CONSTITUTIONALIST BLOC",
      cislo: 5,
      strana: Math.floor((cstpd / 11) * 100),
    }
  ];


  // Preradi objekt strany od nejvetsiho po nejmensi pocet bodu
  const stranySorted = strany.sort((a, b) => parseFloat(b.strana) - parseFloat(a.strana));


// VEZME OBJEKT "stranySorted" A HODI HO DO DIVU
  const allDivs = document.querySelectorAll(".parties-container div");
  stranySorted.forEach(function(obj, index, arr) {
      allDivs[index].innerHTML = obj.strana + "% " + obj.text;
    });  

function firstPartyToSee(){
  if(allDivs[0].innerHTML.indexOf("CLERICAL PARTIES") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Clerical Parties</p><br><p>The clerical or Catholic parties were formed at the end of the 19th century. <br>There were two main discourses among them: the Catholic-National and the Christian-Social one. </p><br><p>In 1897, the Catholic-Social parties merged into the National Catholic Party <br>of the Kingdom of Bohemia. The National Catholic Party sought peaceful cooperation between the Slavic nations living in the Habsburg Monarchy without being dominated by the German-speaking elites. However, it remained loyal to the monarchy.</p><br><p>The Christian Social Party was founded in 1894. It developed in a more civic direction.</p><br><p>Both discourses were very conservative in their actions; they rejected the women’s movements and held the view that society is based on status. They saw both socialism and liberalism as systemic evil.</p>";
    partiesContainerDiv.style.backgroundImage = "url(../img/Klerikalove.jpg";
  } 
  if(allDivs[0].innerHTML.indexOf("YOUNG CZECHS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Young Czechs (for our calculator, we connected them with Old Czechs)</p><br> <p>The National Liberal Party, in short, Young Czechs, was a political party operating <br>in the Czech part of Austria-Hungary. It was established at the end of 1874 after long disputes in the National Party. The programme of the Young Czechs was nationalist and liberal. At the turn of the 19th and 20th centuries, the party held a dominant position in the Czech political spectrum. Karel Kramář, Alois Rašín and Miroslav Tyrš were among the party’s important members.</p><br><p>Old Czechs</p>The National Party, or Old Czechs, was the first political party in the Czech lands. <br>It was founded in 1848 by a civil initiative and brought together various political and ideological groups. Initially, it included the Young Czechs, who, however, separated after long disputes in 1874. <br>The influence of the National Party on political events – despite several years of being represented in the Imperial Council – was declining ever since.";
    partiesContainerDiv.style.backgroundImage = "url(../img/MladStar.jpg";

  }
  if(allDivs[0].innerHTML.indexOf("SOCIAL DEMOCRATS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Social Democrats</p><br>The Social Democratic Czechoslavonic Workers’ Party was founded in 1893 by gaining independence from the Austrian Socialists. It was represented in the Imperial Council since 1897. At the same time, the social democratic representatives decided on a statement that lead to the establishment of the Democratic Czechoslavonic Workers’ Party. The party advocated for an eight-hour workday, a fair wage <br>and universal suffrage. In the 1907 elections, they ran outside the Austrian Social Democracy for the first time. At the time, voters were divided into several groups (curia) and the weight of individual votes varied. Thus, although at first, it seemed that Social Democracy would win the Czech lands, after the conversion according to curia it ended second. <br>During the First World War, the party was initially loyal to Austria-Hungary, but towards the end of the war, its left wing took part in anti-war demonstrations.";
    partiesContainerDiv.style.backgroundImage = "url(../img/SocDem.jpg";

  }
  if(allDivs[0].innerHTML.indexOf("AGRARIANS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Agrarians</p><br>The Czech Agrarian Party, one of the most important parties of the First Republic period, was founded in 1899. Its founding fathers included Karel Prášek and Stanislav Kubr. Agrarians supported national traditions, and their goal was to weaken centralism and expand the powers of the assemblies of the Bohemian Crown. Their programme included the supervision of agricultural cartels, the recognition of Czech state law, and the protection of Austrian agriculture. They focused on the basic needs of the rural population and defended the interests of farmers – sometimes too ruthlessly. Before the outbreak of the First World War, Agrarians were the second strongest party.";
    partiesContainerDiv.style.backgroundImage = "url(../img/Agrarnici.jpg";

  }
  if(allDivs[0].innerHTML.indexOf("CONSTITUTIONALIST BLOC") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Constitutionalist Bloc</p><br><p>In response to the lack of national parties, four schools of thought gradually appeared at the Nymburk congress of the Young Bohemians in 1894:</p><br><p>1) The Constitutionalist Right, which emphasized historical state law. It was headed by Alois Rašín, the future Minister of Finance of the First Republic. </p><br><p>2) The Radical Progressive Party, originally the Constitutionalist Left, which advocated for the idea of natural law. It was founded in 1897 by the Hajn brothers.</p><br><p>3) The Party of Progressive Socialists, founded in 1896 by progressive workers <br>and anarchists.</p><br><p>4)The Czech Constitutionalist Party, which advocated for universal suffrage <br>and the independence of Czech lands from the beginning. </p><br><p>Before the elections, there were strong anti-clerical feelings in the Czech lands; this led to the unification of national social, radically progressive, and constitutionalist representatives. The Alliance of Czech Constitutionalist Democracy was established. Karel Baxa, Václav Klofáč and Václav Hajn were among those who joined the Imperial Council as members of this Constitutionalist Bloc. A year later, the Czech Constitutionalist Party merged with the Radical Progressive Party, which led <br>to the establishment of the Czech Constitutionalist Party.</p> ";
    partiesContainerDiv.style.backgroundImage = "url(../img/Cstpd.jpg";

  }
}
firstPartyToSee();

//Switch color of active link
party.forEach(function (item) {
  item.addEventListener("mousedown", function (e) {
    partiesContainerDiv.querySelector(".current").classList.remove("current");
    item.classList.add("current");
  });
});

function clickOnDiv(){
allDivs.forEach((something) => {
something.addEventListener("mousedown", (e) => {
  
  const selectedDiv = e.target; 
  // const selectedNumberDiv = selectedDiv.dataset["number"]; 

  function changeBackground(){
    if(selectedDiv.innerHTML.indexOf("CLERICAL PARTIES") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Clerical Parties</p><br><p>The clerical or Catholic parties were formed at the end of the 19th century. <br>There were two main discourses among them: the Catholic-National and the Christian-Social one. </p><br><p>In 1897, the Catholic-Social parties merged into the National Catholic Party <br>of the Kingdom of Bohemia. The National Catholic Party sought peaceful cooperation between the Slavic nations living in the Habsburg Monarchy without being dominated by the German-speaking elites. However, it remained loyal to the monarchy.</p><br><p>The Christian Social Party was founded in 1894. It developed in a more civic direction.</p><br><p>Both discourses were very conservative in their actions; they rejected the women’s movements and held the view that society is based on status. They saw both socialism and liberalism as systemic evil.</p>";
      partiesContainerDiv.style.backgroundImage = "url(../img/Klerikalove.jpg";
      // partiesContainerDiv.classList.add("backgroundImage");
    }
    if(selectedDiv.innerHTML.indexOf("YOUNG CZECHS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Young Czechs (for our calculator, we connected them with Old Czechs)</p><br> <p>The National Liberal Party, in short, Young Czechs, was a political party operating <br>in the Czech part of Austria-Hungary. It was established at the end of 1874 after long disputes in the National Party. The programme of the Young Czechs was nationalist and liberal. At the turn of the 19th and 20th centuries, the party held a dominant position in the Czech political spectrum. Karel Kramář, Alois Rašín and Miroslav Tyrš were among the party’s important members.</p><br><p>Old Czechs</p>The National Party, or Old Czechs, was the first political party in the Czech lands. <br>It was founded in 1848 by a civil initiative and brought together various political and ideological groups. Initially, it included the Young Czechs, who, however, separated after long disputes in 1874. <br>The influence of the National Party on political events – despite several years of being represented in the Imperial Council – was declining ever since.";
      partiesContainerDiv.style.backgroundImage = "url(../img/MladStar.jpg";
    }
    if(selectedDiv.innerHTML.indexOf("SOCIAL DEMOCRATS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Social Democrats</p><br>The Social Democratic Czechoslavonic Workers’ Party was founded in 1893 by gaining independence from the Austrian Socialists. It was represented in the Imperial Council since 1897. At the same time, the social democratic representatives decided on a statement that lead to the establishment of the Democratic Czechoslavonic Workers’ Party. The party advocated for an eight-hour workday, a fair wage <br>and universal suffrage. In the 1907 elections, they ran outside the Austrian Social Democracy for the first time. At the time, voters were divided into several groups (curia) and the weight of individual votes varied. Thus, although at first, it seemed that Social Democracy would win the Czech lands, after the conversion according to curia it ended second. <br>During the First World War, the party was initially loyal to Austria-Hungary, but towards the end of the war, its left wing took part in anti-war demonstrations.";
      partiesContainerDiv.style.backgroundImage = "url(../img/SocDem.jpg";
    }
    if(selectedDiv.innerHTML.indexOf("AGRARIANS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Agrarians</p><br>The Czech Agrarian Party, one of the most important parties of the First Republic period, was founded in 1899. Its founding fathers included Karel Prášek and Stanislav Kubr. Agrarians supported national traditions, and their goal was to weaken centralism and expand the powers of the assemblies of the Bohemian Crown. Their programme included the supervision of agricultural cartels, the recognition of Czech state law, and the protection of Austrian agriculture. They focused on the basic needs of the rural population and defended the interests of farmers – sometimes too ruthlessly. Before the outbreak of the First World War, Agrarians were the second strongest party.";
      partiesContainerDiv.style.backgroundImage = "url(../img/Agrarnici.jpg";
    }
    if(selectedDiv.innerHTML.indexOf("CONSTITUTIONALIST BLOC") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Constitutionalist Bloc</p><br><p>In response to the lack of national parties, four schools of thought gradually appeared at the Nymburk congress of the Young Bohemians in 1894:</p><br><p>1) The Constitutionalist Right, which emphasized historical state law. It was headed by Alois Rašín, the future Minister of Finance of the First Republic. </p><br><p>2) The Radical Progressive Party, originally the Constitutionalist Left, which advocated for the idea of natural law. It was founded in 1897 by the Hajn brothers.</p><br><p>3) The Party of Progressive Socialists, founded in 1896 by progressive workers <br>and anarchists.</p><br><p>4)The Czech Constitutionalist Party, which advocated for universal suffrage <br>and the independence of Czech lands from the beginning. </p><br><p>Before the elections, there were strong anti-clerical feelings in the Czech lands; this led to the unification of national social, radically progressive, and constitutionalist representatives. The Alliance of Czech Constitutionalist Democracy was established. Karel Baxa, Václav Klofáč and Václav Hajn were among those who joined the Imperial Council as members of this Constitutionalist Bloc. A year later, the Czech Constitutionalist Party merged with the Radical Progressive Party, which led <br>to the establishment of the Czech Constitutionalist Party.</p> ";
      partiesContainerDiv.style.backgroundImage = "url(../img/Cstpd.jpg";
    }
  }

  changeBackground();


 
})});
};
clickOnDiv();


getNewQuestion();
  
});
});

startGame();


