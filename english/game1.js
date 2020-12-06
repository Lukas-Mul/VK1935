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
const MAX_QUESTIONS = 10;
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
const hiddenLast = document.querySelectorAll(".hiddenLast");


// VARIABLES
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questionIndex = 0;

// PARTIES
let agr = 0;
let csl = 0;
let csns = 0;
let cssd = 0;
let ksc = 0;
let nof = 0;
let ns = 0;
let sdp = 0;

// OTAZKY - TEXT
let questions = [
{
  question: "Do you agree with the current direction of the country after the economic crisis?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 1,
},
{
  question: "The parliamentary democracy and the President as the head of the state are the best solution.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 2,
},
{
  question:
    "Would you vote for a party that wants to turn to France, Romania and Great Britain rather than Germany, Italy and the Soviet Union in foreign policy? ",
  choice1: "Ano",
  choice2: "Ne",
  answer: 3,
},
{
  question:
    "Would you vote for a party that uses foreign funding for its political programme?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 4,
},
{
  question:
    "The winning party must be international and have support abroad.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 5,
},
{
  question:
    "The ruling party can intervene in the economy and, as part of the central management of the state, make binding rules on what, for whom, and at what price the producers should manufacture. Is this right?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 6,
},
{
  question:
    "The winning party should be willing to work closely with other parties if this would improve the political situation in the country.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 7,
},
{
  question: "Which campaign slogan do you like best? ",
  choice1: "Let the rich pay.",
  choice2: "They promise nothing – just purification.",
  choice3: "For agriculture – for the Czechoslovakian nation.",
  choice4: "More work, rights and bread.",
  choice5: "Work and save up.",
  answer: 8,
},
{
  question: "The best way to reach out to voters is:",
  choice1: "Pompous meetings and marches.",
  choice2: "Intimidation of opposing candidates.",
  choice3: "Leaflet and newspaper campaign and public meetings.",
  answer: 9,
},
{
  question: "Nejlepší cesta, jak oslovit voliče, je:",
  choice1: "Velikášská setkání a pochody ",
  choice2: "Zastrašování protikandidátů",
  choice3: "Letáková a novinová kampaň a manifestační setkání",
  answer: 9,
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
availableQuestions = [...questions];
console.log(questions[0]);
// zobrazit prvni vysvetlivku na prvni otazce
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
createButton1();

// zobrazi tlacitko zpet na vysvetlivce
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
createButton2();

// FUNKCE GETNEWQUESTION:
getNewQuestion();
};

//FUNKCE getNewQuestion
getNewQuestion = () => {
//  if (availableQuestions.length === 0) {
// }

questionCounter++
// Update the progress bar
progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

question.classList.add("slide");
// question.classList.remove("goAway");

// prida tridu slide, diky ktere text otazek slidne doleva
function slideAway(){
  answerContainer.addEventListener("mousedown", function(){
    question.classList.remove("slide");
  })
}
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
        currentQuestion.answer == 7 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.remove("hidden");
      }
    });
  }
  removeClassHidden();

  // Odstrani posledni dve odpovedi v posledni otazce, ktere tam jsou navic
  function removeClassHiddenLast() {
    hiddenLast.forEach(function (item) {
      if (
        currentQuestion.answer == 8 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4 || selectedAnswer == 5)
      ) {
        item.classList.add("hideLastTwoAnswers");
      }
    });
  }
  removeClassHiddenLast();

  // Obstaraji okryti a zakryti html divu tak, aby byla videt posledni vysledkova stranka
  function removeClassHidden2() {
    const hiddenContainer2 = document.querySelectorAll(".hidden2");
    hiddenContainer2.forEach(function (item) {
      if (
        currentQuestion.answer == 9 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4 || selectedAnswer == 5)
      ) {
        item.classList.remove("hidden2");
      }
    });
  }
  removeClassHidden2();

  function addClassHidden3() {
    const hiddenContainer3 = document.querySelectorAll(".hidden3");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 9 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3)
      ) {
        item.classList.add("hidden2");
      }
    });
  }
  addClassHidden3();

  function addClassLastQuestion() {
    const hiddenContainer3 = document.querySelectorAll("#last-answer");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 7 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container");
      }
    });
  }
  addClassLastQuestion();

  function addClassLastQuestion1() {
    const hiddenContainer3 = document.querySelectorAll(".question-container");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 7 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container1");
      }
    });
  }
  addClassLastQuestion1();

  function addClassLastAnswer() {
    const hiddenContainer4 = document.querySelectorAll(".choice-text");
    hiddenContainer4.forEach(function (item) {
      if (
        currentQuestion.answer == 7 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-text");
      }
    });
  }
addClassLastAnswer();

  function addClassLastText() {
    const hiddenContainer5 = document.querySelectorAll(".choice-container");
    hiddenContainer5.forEach(function (item) {
      if (
        currentQuestion.answer == 7 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-answer");
      }
    });
  }
  addClassLastText();

  // VYTVORIT VYSVETLIVKU cislo 1 - Button 1
  // function createButton1 (){
  //   let button1 = document.createElement("button")
  //   button1.className = "button1";
  //   button1.innerText = "ZJISTIT VÍC"
  //   questionContainer.appendChild(button1)
  //   button1.addEventListener("click", function(){
  //     // add class hidden na overlay element, takze kliknutim se tam ten overlay element zobrazi a udela vsechno ostatni tmavym
  //     overlay.classList.remove("hidden11");
  //     explanation1Flex.classList.add("translate");
      
  //   })
  // }

  // VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

  // function createButton2 (){
  //   const button2 = document.createElement("button")
  //   button2.className = "button2";
  //   button2.innerText = "ZPĚT"
  //   explanation1Flex.appendChild(button2)
  //   button2.addEventListener("click", function(){
  //     overlay.classList.add("hidden11");
  //     explanation1Flex.classList.remove("translate");
  //   })
  // }

  // SKRYT BUTTON1
  function hideButton1(){
    let oznaceniButton1 = document.querySelector(".button1");
      oznaceniButton1.classList.add("hideButton1");;
  }

// VYTVORIT VYSVETLIVKU CISLO 2 - Button 3
// function createButton3 (){
//   let button3 = document.createElement("button")
//   button3.className = "button3";
//   button3.innerText = "ZJISTIT VÍC"
//   questionContainer.appendChild(button3)
//   button3.addEventListener("click", function(){
//     overlay.classList.remove("hidden11");
//     explanation2Flex.classList.add("translate");

  
//   })
// }

// VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2
// function createButton4 (){
//   const button4 = document.createElement("button")
//   button4.className = "button4";
//   button4.innerText = "ZPĚT"
//   explanation2Flex.appendChild(button4)
//   button4.addEventListener("click", function(){
//     explanation2Flex.classList.remove("translate");
//     overlay.classList.add("hidden11");
//   })
// }

// SKRYT BUTTON3
// function hideButton3(){
//   let oznaceniButton3 = document.querySelector(".button3");
//     oznaceniButton3.classList.add("hideButton3");;
// }


// FUNKCE countPoints - Pocitani bodu
  function countPoints() {
     // OTAZKA 1
    if (currentQuestion.answer == 1 && selectedAnswer == 1) {
      agr++;
      csl++;
      csns++;
      cssd++;
      hideButton1()
    }
    if (currentQuestion.answer == 1 && selectedAnswer == 2) {
      ksc++;
      nof++;
      ns++;
      sdp++;
      hideButton1()
    }
    // OTAZKA 2
    if (currentQuestion.answer == 2 && selectedAnswer == 1) {
      agr++;
      csl++;
      csns++;
      cssd++;

    }
    if (currentQuestion.answer == 2 && selectedAnswer == 2) {
      ksc++;
      nof++;
      ns++;
      sdp++;
    }
    // OTAZKA 3
    if (currentQuestion.answer == 3 && selectedAnswer == 1) {
      agr++;
      csl++;
      csns++;
      cssd++;
    }
    if (currentQuestion.answer == 3 && selectedAnswer == 2) {
      ksc++;
      nof++;
      ns++;
      sdp++;
    }
    // OTAZKA 4
    if (currentQuestion.answer == 4 && selectedAnswer == 1) {
      ksc++;
      nof++;
      sdp++;
    }
    if (currentQuestion.answer == 4 && selectedAnswer == 2) {
      agr++;
      csl++;
      csns++;
      cssd++;
      ns++
    }
    // OTAZKA 5
    if (currentQuestion.answer == 5 && selectedAnswer == 1) {
      ksc++;
      nof++;
      sdp++;
    }
    if (currentQuestion.answer == 5 && selectedAnswer == 2) {
      agr++;
      csl++;
      csns++;
      cssd++;
      ns++
    }
    // OTAZKA 6
    if (currentQuestion.answer == 6 && selectedAnswer == 1) {
      ksc++;
      nof++;
      sdp++;
      
    }
    if (currentQuestion.answer == 6 && selectedAnswer == 2) {
      agr++;
      csl++;
      csns++;
      cssd++;
      ns++      
    }
    // OTAZKA 7
    if (currentQuestion.answer == 7 && selectedAnswer == 1) {
      agr++;
      csl++;
      csns++;
      cssd++;
 
    }
    if (currentQuestion.answer == 7 && selectedAnswer == 2) {
      ksc++;
      nof++;
      sdp++;
    }

    // OTAZKA 8
    if (currentQuestion.answer == 8 && selectedAnswer == 1) {
      ksc++
    }
    if (currentQuestion.answer == 8 && selectedAnswer == 2) {
      nof++
    }
    if (currentQuestion.answer == 8 && selectedAnswer == 3) {
      agr++
    }
    if (currentQuestion.answer == 8 && selectedAnswer == 4) {
      sdp++
    }
    if (currentQuestion.answer == 8 && selectedAnswer == 4) {
      ns++
    }
    
    // OTAZKA 9
    if (currentQuestion.answer == 9 && selectedAnswer == 1) {
      sdp++;
    }
    if (currentQuestion.answer == 9 && selectedAnswer == 1) {
      nof++;
    }
    if (currentQuestion.answer == 9 && selectedAnswer == 1) {
      agr++;
      csl++;
      csns++;
      cssd++;
      ns++;
    }
  }
  countPoints();

  // ARRAY OBJEKT VYSLEDKY TEXT
  let strany = [
      {
      text:"AGRARIANS",
      cislo: 1,
      strana: Math.floor((agr / 9) * 100),      
      },
  {
      text:
        "SOCIAL DEMOCRATS",
      cislo: 2,
      strana: Math.floor((cssd / 9) * 100),
  },
  {
      text:
        "NATIONAL SOCIALISTS",
      cislo: 3,
      strana: Math.floor((csns / 9) * 100),
  },
  {
      text:
        "PEOPLE'S PARTY",
      cislo: 4,
      strana: Math.floor((csl / 9) * 100),
  },
  {
      text:
        "NATIONAL UNIFICATION",
      cislo: 5,
      strana: Math.floor((ns / 9) * 100),
    },
  {
      text:
        "HENLEIN'S PARTY",
      cislo: 5,
      strana: Math.floor((sdp / 9) * 100),
    },
  {
      text:
        "CZECH FASCISTS",
      cislo: 5,
      strana: Math.floor((nof / 9) * 100),
    },
  {
      text:
        "CZECHOSLOVAK COMMUNISTS",
      cislo: 5,
      strana: Math.floor((ksc / 9) * 100),
    },
  ];


  // Preradi objekt strany od nejvetsiho po nejmensi pocet bodu
  const stranySorted = strany.sort((a, b) => parseFloat(b.strana) - parseFloat(a.strana));
  console.log(stranySorted);


// VEZME OBJEKT "stranySorted" A HODI HO DO DIVU
stranySorted.forEach(function(obj, index, arr) {
    allDivs[index].innerHTML = obj.strana + "% " + obj.text;
  });  

function firstPartyToSee(){
  if(allDivs[0].innerHTML.indexOf("AGRARIANS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Agrarians</p><br><p>The Republican Party of Farmers and Peasants was founded in 1899. It primarily focused on the needs of the rural population. Antonín Švehla, one of the main representatives of the Czech resistance, is the most well-known personality <br>of the party. The party had a very dense organizational network, and it reached its peak in the 1935 elections – although the Agrarians didn’t win, they gained 45 seats, which was enough for them to continue being the main force in the Government. However, the influence of this party slowly diminished since it wasn’t able to address the ongoing urbanization in its programme. In 1938 it was dissolved and was not restored after the Second World War.</p>";
    partiesContainerDiv.style.backgroundImage = "url(../img/Agrarnici.jpg)";
  } 
  if(allDivs[0].innerHTML.indexOf("SOCIAL DEMOCRATS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Social Democrats</p><br> <p>The tradition of an organized social democratic movement started in 1878, but the Czechoslovak Social Democratic Worker’s Party (ČSDSD) was only founded <br>in December 1918. It was one of the strongest political parties in the First Republic; <br>in 1921, however, several representatives left for the newly formed Communist Party (KSČ).  Between the world wars, it cooperated with German and Austrian parties thanks to its left-wing ideas about national minorities. The international political programme made it possible to establish contacts abroad.";
    partiesContainerDiv.style.backgroundImage = "url(../img/CSSD.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("NATIONAL SOCIALISTS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>National Socialists</p><br>The Czechoslovak National Socialist Party was founded in 1897 but only got this name in 1926. It had its own unions which helped it consolidate its political power during the interwar period. It was one of the parties of the so-called Five, which held the most political power. Among the members of this party were, for example, <br>the second President of Czechoslovakia Edvard Beneš, Milada Horáková and Václav Klofáč. On the political spectrum, this was a centrist party, which promoted National Socialism and advocated for the defence of the Republic.";
    partiesContainerDiv.style.backgroundImage = "url(../img/CSNS.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("PEOPLE'S PARTY") !== -1) {
    changingPartiesDiv.innerHTML = "<p>People's Party</p><br>The Czechoslovak People’s Party was established in January 1919 by merging several Catholic parties. From the beginning, it targeted people from all social backgrounds and thanks to its broad scope was successful despite weak election results. <br>It participated in all the governments of the First Republic. In addition to its own newspaper, which was issued by almost every party, they founded the Orel gymnastic organization. It was a close second to the more famous Sokol. The leading figure <br>of the party was its founder, Msgr. Jan Šrámek. ";
    partiesContainerDiv.style.backgroundImage = "url(../img/CSL.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("NATIONAL UNIFICATION") !== -1) {
    changingPartiesDiv.innerHTML = "<p>National Unification</p><br>The National Unification was a young political group founded in 1934 “on popular demand”. It was characterized by strong Czech nationalism, which was <br>to be a counterweight to German nationalism. The party was among the loudest critics of the traditional ruling parties and of President Edvard Beneš. It gained 5.5 % of the vote in the elections, which was enough for 17 seats. Internal disagreements <br>in the party led to its merging into the Party of National Unity in 1938. ";
    partiesContainerDiv.style.backgroundImage = "url(../img/NS.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("HENLEIN'S PARTY") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Henlein's Party</p><br><p>The Sudeten German Party (SDP) was founded in 1933 in reaction to the effects of the Great Depression, which affected the borderland severely. The party’s founder <br>and chairman, Konrad Henlein, targeted the Czech Germans. He failed to unite German political parties, but his electorate grew significantly, leading to the party’s victory in the 1935 elections. The party didn’t win the largest number of seats <br>and was not tasked with forming a government, but its popularity continued to rise.  The SDP started escalating its demands regarding the issues of national minorities, especially the Czech Germans. In this way, it significantly contributed to the political crisis which resulted in the demise of the First Republic.</p> ";
    partiesContainerDiv.style.backgroundImage = "url(../img/SDP.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("CZECH FASCISTS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Czech Fascists</p><br><p>The National Fascist Community was the largest group of Czech fascists during the interwar period and started emerging during the early 1920s. The party was established by merging several smaller fascist organizations united by their hatred towards the communists.  At first, it was against Germany, but it changed its stance <br>at the end of the 1930s, hoping to gain more political power. Its biggest success came in the 1935 elections in which it won six seats. It never reached significant power due to internal disputes. The leader of the party was one of the greatest personalities <br>of the Czechoslovak legions, Rudolf Gejdl (better known as Radola Gajda). The party ceased to exist in 1939.</p> ";
    partiesContainerDiv.style.backgroundImage = "url(../img/NOF.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("CZECHOSLOVAK COMMUNISTS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Czechoslovak Communists</p><br><p>The Communist Party of Czechoslovakia was founded in 1921. Among its founding members were mostly social democratic politicians. The party managed to become part of the political scene relatively fast and finished second in the 1925 elections. <br>It was international by nature and to a great extent controlled by the Soviet Union. <br>Its internationalization culminated in 1929 with an internal coup made by young radical communists led by Klement Gottwald. During the 1930s, the party managed to maintain the support of about 10% of eligible voters but did not get into the government. It was banned in 1938, and after the Third Reich attacked the Soviet Union, many of its members joined the resistance.</p>";
    partiesContainerDiv.style.backgroundImage = "url(../img/KSC.jpg)";
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

  function changeBackground(){
    if(selectedDiv.innerHTML.indexOf("AGRARIANS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Agrarians</p><br><p>The Republican Party of Farmers and Peasants was founded in 1899. It primarily focused on the needs of the rural population. Antonín Švehla, one of the main representatives of the Czech resistance, is the most well-known personality <br>of the party. The party had a very dense organizational network, and it reached its peak in the 1935 elections – although the Agrarians didn’t win, they gained 45 seats, which was enough for them to continue being the main force in the Government. However, the influence of this party slowly diminished since it wasn’t able to address the ongoing urbanization in its programme. In 1938 it was dissolved and was not restored after the Second World War.</p>";
      partiesContainerDiv.style.backgroundImage = "url(../img/Agrarnici.jpg)";
    } 
    if(selectedDiv.innerHTML.indexOf("SOCIAL DEMOCRATS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Social Democrats</p><br> <p>The tradition of an organized social democratic movement started in 1878, but the Czechoslovak Social Democratic Worker’s Party (ČSDSD) was only founded <br>in December 1918. It was one of the strongest political parties in the First Republic; <br>in 1921, however, several representatives left for the newly formed Communist Party (KSČ).  Between the world wars, it cooperated with German and Austrian parties thanks to its left-wing ideas about national minorities. The international political programme made it possible to establish contacts abroad.";
      partiesContainerDiv.style.backgroundImage = "url(../img/CSSD.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("NATIONAL SOCIALISTS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>National Socialists</p><br>The Czechoslovak National Socialist Party was founded in 1897 but only got this name in 1926. It had its own unions which helped it consolidate its political power during the interwar period. It was one of the parties of the so-called Five, which held the most political power. Among the members of this party were, for example, <br>the second President of Czechoslovakia Edvard Beneš, Milada Horáková and Václav Klofáč. On the political spectrum, this was a centrist party, which promoted National Socialism and advocated for the defence of the Republic.";
      partiesContainerDiv.style.backgroundImage = "url(../img/CSNS.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("PEOPLE'S PARTY") !== -1) {
      changingPartiesDiv.innerHTML = "<p>People's Party</p><br>The Czechoslovak People’s Party was established in January 1919 by merging several Catholic parties. From the beginning, it targeted people from all social backgrounds and thanks to its broad scope was successful despite weak election results. <br>It participated in all the governments of the First Republic. In addition to its own newspaper, which was issued by almost every party, they founded the Orel gymnastic organization. It was a close second to the more famous Sokol. The leading figure <br>of the party was its founder, Msgr. Jan Šrámek. ";
      partiesContainerDiv.style.backgroundImage = "url(../img/CSL.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("NATIONAL UNIFICATION") !== -1) {
      changingPartiesDiv.innerHTML = "<p>National Unification</p><br>The National Unification was a young political group founded in 1934 “on popular demand”. It was characterized by strong Czech nationalism, which was <br>to be a counterweight to German nationalism. The party was among the loudest critics of the traditional ruling parties and of President Edvard Beneš. It gained 5.5 % of the vote in the elections, which was enough for 17 seats. Internal disagreements <br>in the party led to its merging into the Party of National Unity in 1938. ";
      partiesContainerDiv.style.backgroundImage = "url(../img/NS.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("HENLEIN'S PARTY") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Henlein's Party</p><br><p>The Sudeten German Party (SDP) was founded in 1933 in reaction to the effects of the Great Depression, which affected the borderland severely. The party’s founder <br>and chairman, Konrad Henlein, targeted the Czech Germans. He failed to unite German political parties, but his electorate grew significantly, leading to the party’s victory in the 1935 elections. The party didn’t win the largest number of seats <br>and was not tasked with forming a government, but its popularity continued to rise.  The SDP started escalating its demands regarding the issues of national minorities, especially the Czech Germans. In this way, it significantly contributed to the political crisis which resulted in the demise of the First Republic.</p> ";
      partiesContainerDiv.style.backgroundImage = "url(../img/SDP.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("CZECH FASCISTS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Czech Fascists</p><br><p>The National Fascist Community was the largest group of Czech fascists during the interwar period and started emerging during the early 1920s. The party was established by merging several smaller fascist organizations united by their hatred towards the communists. At first, it was against Germany, but it changed its stance <br>at the end of the 1930s, hoping to gain more political power. Its biggest success came in the 1935 elections in which it won six seats. It never reached significant power due to internal disputes. The leader of the party was one of the greatest personalities <br>of the Czechoslovak legions, Rudolf Gejdl (better known as Radola Gajda). The party ceased to exist in 1939.</p> ";
      partiesContainerDiv.style.backgroundImage = "url(../img/NOF.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("CZECHOSLOVAK COMMUNISTS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Czechoslovak Communists</p><br><p>The Communist Party of Czechoslovakia was founded in 1921. Among its founding members were mostly social democratic politicians. The party managed to become part of the political scene relatively fast and finished second in the 1925 elections. <br>It was international by nature and to a great extent controlled by the Soviet Union. <br>Its internationalization culminated in 1929 with an internal coup made by young radical communists led by Klement Gottwald. During the 1930s, the party managed to maintain the support of about 10% of eligible voters but did not get into the government. It was banned in 1938, and after the Third Reich attacked the Soviet Union, many of its members joined the resistance.</p>";
      partiesContainerDiv.style.backgroundImage = "url(../img/KSC.jpg)";
  
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


