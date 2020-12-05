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
  question: "Souhlasíte s dosavadním směřováním země po hospodářské krizi?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 1,
},
{
  question: "Nejlepší řešení je parlamentní demokracie a prezident v čele státu.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 2,
},
{
  question:
    "Volil byste stranu, která se chce v zahraniční politice obracet spíš na Francii, Rumunsko a Velkou Británii než na Německo, Itálii a Sovětský svaz?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 3,
},
{
  question:
    "Volil byste stranu, která využívá zahraniční financování pro svůj politický program? ",
  choice1: "Ano",
  choice2: "Ne",
  answer: 4,
},
{
  question:
    "Vítězná strana musí mít nadnárodní charakter a podporu v zahraničí.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 5,
},
{
  question:
    "Vládnoucí strana může zasahovat do ekonomiky a v rámci centrálního řízení státu závazně stanovovat výrobcům, co, pro koho a za jakou cenu mají vyrábět. Je to správné?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 6,
},
{
  question:
    "Vítězná strana by měla být ochotná úzce spolupracovat s jinými stranami, pokud by to vedlo ke zlepšení politické situace v zemi. ",
  choice1: "Ano",
  choice2: "Ne",
  answer: 7,
},
{
  question: "Které volební heslo je vám nejbližší?",
  choice1: "Ať platí bohatí.",
  choice2: "Nic neslibují – jen očistu.",
  choice3: "V zájmu zemědělství – v zájmu československého národa.",
  choice4: "Více práce, práv a chleba.",
  choice5: "Pracovat a šetřit.",
  answer: 8,
},
{
  question: "Nejlepší cesta, jak oslovit voliče, je:",
  choice1: "Velikášská setkání a pochody ",
  choice2: "Zastrašování protikandidátů",
  choice3: "Letáková a novinová kampaň a manifestační setkání",
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
continueButton.innerText = "ANO";
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
  button1.innerText = "ZJISTIT VÍC"
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
  button2.innerText = "ZPĚT"
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
      text:"AGRÁRNÍCI",
      cislo: 1,
      strana: Math.floor((agr / 9) * 100),      
      },
  {
      text:
        "SOCIÁLNÍ DEMOKRACIE",
      cislo: 2,
      strana: Math.floor((cssd / 9) * 100),
  },
  {
      text:
        "NÁRODNÍ SOCIALISTÉ",
      cislo: 3,
      strana: Math.floor((csns / 9) * 100),
  },
  {
      text:
        "LIDOVCI",
      cislo: 4,
      strana: Math.floor((csl / 9) * 100),
  },
  {
      text:
        "NÁRODNÍ SJEDNOCENÍ",
      cislo: 5,
      strana: Math.floor((ns / 9) * 100),
    },
  {
      text:
        "HENLEINOVCI",
      cislo: 5,
      strana: Math.floor((sdp / 9) * 100),
    },
  {
      text:
        "ČEŠTÍ FAŠISTÉ",
      cislo: 5,
      strana: Math.floor((nof / 9) * 100),
    },
  {
      text:
        "ČESKOSLOVENŠTÍ KOMUNISTÉ",
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
  if(allDivs[0].innerHTML.indexOf("AGRÁRNÍCI") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Agrárníci</p><br><p>Republikánská strana zemědělského a malorolnického lidu byla založena roku 1899. Primárně se soustředila na potřeby venkovských obyvatel. Za nejznámější osobnost strany je považován Antonín Švehla, jeden z hlavních představitelů domácího odboje. Strana měla velmi hustou organizační síť a volby roku 1935 byly jejím vrcholem. <br><br>Agrárníci sice nevyhráli, ale získali 45 mandátů, což stačilo k tomu, aby měli ve vládě i nadále hlavní slovo. Vliv strany však pomalu slábl, programově nedokázala reagovat na probíhající urbanizaci. Nakonec v roce 1938 zanikla a po druhé světové válce již nebyla obnovena.</p>";
    partiesContainerDiv.style.backgroundImage = "url(../img/Agrarnici.jpg)";
  } 
  if(allDivs[0].innerHTML.indexOf("SOCIÁLNÍ DEMOKRACIE") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Sociální demokracie</p><br> <p>Tradice organizované sociální demokracie začala v roce 1878, ale Československá sociálně demokratická strana dělnická (ČSDSD) vznikla až v prosinci 1918. Byla jednou z nejsilnějších politických stran první republiky, roku 1921 však několik poslanců odešlo do nově vzniklé KSČ. V meziválečném období spolupracovala s německými i rakouskými stranami, a to díky svému levicovému smýšlení ohledně národnostních menšin. Internacionální pojetí politického programu jí umožnilo navázat kontakty v zahraničí.";
    partiesContainerDiv.style.backgroundImage = "url(../img/CSSD.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("NÁRODNÍ SOCIALISTÉ") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Národní socialisté</p><br>Československá strana národně socialistická vznikla v roce 1897, ale tento název přijala až roku 1926. Měla vlastní odbory, které jí v meziválečných letech pomáhaly upevňovat politickou moc. Patřila mezi strany tzv. Pětky, která držela hlavní politickou moc. Členy této strany byl například druhý prezident Československa Edvard Beneš anebo Milada Horáková a Václav Klofáč. V rámci politického spektra šlo o stranu středovou, která prosazovala národní socialismus a zasazovala se o obranu republiky.";
    partiesContainerDiv.style.backgroundImage = "url(../img/CSNS.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("LIDOVCI") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Lidovci</p><br>Československá strana lidová vznikla v lednu 1919 sloučením několika katolických stran. Od začátku cílila na všechny vrstvy obyvatel a díky svému širokému záběru měla i navzdory slabším volebním výsledkům úspěch. Podílela se na všech vládách první republiky. Kromě tisku, kterým disponovala téměř každá strana, vznikl i tělovýchovný spolek Orel. Ten zdatně sekundoval známějšímu Sokolu. Vůdčí osobností strany byl její zakladatel Msgre. Jan Šrámek.";
    partiesContainerDiv.style.backgroundImage = "url(../img/CSL.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("NÁRODNÍ SJEDNOCENÍ") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Národní sjednocení</p><br>Národní sjednocení vzniklo jako mladé politické uskupení v roce 1934 na základě poptávky. Vyznačovalo se silným českým nacionalismem, který měl být protiváhou německému nacionalismu. Strana byla jedním z nejhlasitějších kritiků nejen vládnoucích tradičních stran, ale i prezidenta Edvarda Beneše. Ve volbách získala 5,5 % hlasů, což stačilo na 17 mandátů. Vnitřní neshody ve straně vedly v roce 1938 k jejímu sloučení do Strany národní jednoty.";
    partiesContainerDiv.style.backgroundImage = "url(../img/NS.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("HENLEINOVCI") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Henleinovci</p><br><p>Sudetoněmecká strana neboli SDP vznikla roku 1933. Byla to reakce na dopady Velké hospodářské krize, která dramaticky zasáhla pohraniční oblasti. Zakladatel a předseda strany, Konrad Henlein, cílil na české Němce. Sjednotit německé politické strany nedokázal, jeho voličská základna však výrazně rostla, což vedlo k vítězství strany ve volbách roku 1935. <br><br>Strana nezískala největší počet mandátů a nebyla ani pověřená sestavením vlády, její popularita ale nadále stoupala. SDP začala stupňovat své požadavky v otázkách národnostních menšin, a to zejména českých Němců. Zásadní měrou tak přispěla k politické krizi, která vyústila zánikem první republiky.</p> ";
    partiesContainerDiv.style.backgroundImage = "url(../img/SDP.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("ČEŠTÍ FAŠISTÉ") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Čeští fašisté</p><br><p>Národní obec fašistická byla největším meziválečným uskupením českých fašistů, formovaným od počátku 20. let. Strana vznikla sloučením několika menších fašistických organizací, které pojil odpor vůči komunistům. Zpočátku se vymezovala vůči Německu, ale svoje stanovisko změnila koncem 30. let v naději, že získá větší politickou moc. Jejím vrcholem byly volby roku 1935, kdy získala šest mandátů. Výrazných úspěchů se kvůli stranickým rozporům nikdy nedočkala. Ikonou strany byla jedna z největších osobností československých legií, Rudolf Gejdl (známější pod jménem Radola Gajda). Strana zanikla roku 1939.</p> ";
    partiesContainerDiv.style.backgroundImage = "url(../img/NOF.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("ČESKOSLOVENŠTÍ KOMUNISTÉ") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Českoslovenští komunisté</p><br><p>Komunistická strana Československa vznikla v roce 1921. Její zakládající členy tvořili převážně bývalí politici ČSSD. Poměrně rychle se zvládla usadit na politické scéně a ve volbách roku 1925 skončila na druhém místě. Ze své podstaty byla nadnárodní a do velké míry řízena Sovětským svazem. Internacionalizace vyvrcholila v roce 1929 vnitrostranickým pučem mladých radikálních komunistů, v jejichž čele stál Klement Gottwald.<br>Během 30. let se straně dařilo udržet podporu zhruba 10 % oprávněných voličů, ale do vlády se nedostala. V roce 1938 byla zakázána a po útoku třetí říše na Sovětský svaz přešla řada jejích členů do odboje.</p>";
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
    if(selectedDiv.innerHTML.indexOf("AGRÁRNÍCI") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Agrárníci</p><br><p>Republikánská strana zemědělského a malorolnického lidu byla založena roku 1899. Primárně se soustředila na potřeby venkovských obyvatel. Za nejznámější osobnost strany je považován Antonín Švehla, jeden z hlavních představitelů domácího odboje. Strana měla velmi hustou organizační síť a volby roku 1935 byly jejím vrcholem. <br><br>Agrárníci sice nevyhráli, ale získali 45 mandátů, což stačilo k tomu, aby měli ve vládě i nadále hlavní slovo. Vliv strany však pomalu slábl, programově nedokázala reagovat na probíhající urbanizaci. Nakonec v roce 1938 zanikla a po druhé světové válce již nebyla obnovena.</p>";
      partiesContainerDiv.style.backgroundImage = "url(../img/Agrarnici.jpg)";
    } 
    if(selectedDiv.innerHTML.indexOf("SOCIÁLNÍ DEMOKRACIE") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Sociální demokracie</p><br> <p>Tradice organizované sociální demokracie začala v roce 1878, ale Československá sociálně demokratická strana dělnická (ČSDSD) vznikla až v prosinci 1918. Byla jednou z nejsilnějších politických stran první republiky, roku 1921 však několik poslanců odešlo do nově vzniklé KSČ. V meziválečném období spolupracovala s německými i rakouskými stranami, a to díky svému levicovému smýšlení ohledně národnostních menšin. Internacionální pojetí politického programu jí umožnilo navázat kontakty v zahraničí.";
      partiesContainerDiv.style.backgroundImage = "url(../img/CSSD.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("NÁRODNÍ SOCIALISTÉ") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Národní socialisté</p><br>Československá strana národně socialistická vznikla v roce 1897, ale tento název přijala až roku 1926. Měla vlastní odbory, které jí v meziválečných letech pomáhaly upevňovat politickou moc. Patřila mezi strany tzv. Pětky, která držela hlavní politickou moc. Členy této strany byl například druhý prezident Československa Edvard Beneš anebo Milada Horáková a Václav Klofáč. V rámci politického spektra šlo o stranu středovou, která prosazovala národní socialismus a zasazovala se o obranu republiky.";
      partiesContainerDiv.style.backgroundImage = "url(../img/CSNS.jpg)"
  
    }
    if(selectedDiv.innerHTML.indexOf("LIDOVCI") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Lidovci</p><br>Československá strana lidová vznikla v lednu 1919 sloučením několika katolických stran. Od začátku cílila na všechny vrstvy obyvatel a díky svému širokému záběru měla i navzdory slabším volebním výsledkům úspěch. Podílela se na všech vládách první republiky. Kromě tisku, kterým disponovala téměř každá strana, vznikl i tělovýchovný spolek Orel. Ten zdatně sekundoval známějšímu Sokolu. Vůdčí osobností strany byl její zakladatel Msgre. Jan Šrámek.";
      partiesContainerDiv.style.backgroundImage = "url(../img/CSL.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("NÁRODNÍ SJEDNOCENÍ") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Národní sjednocení</p><br>Národní sjednocení vzniklo jako mladé politické uskupení v roce 1934 na základě poptávky. Vyznačovalo se silným českým nacionalismem, který měl být protiváhou německému nacionalismu. Strana byla jedním z nejhlasitějších kritiků nejen vládnoucích tradičních stran, ale i prezidenta Edvarda Beneše. Ve volbách získala 5,5 % hlasů, což stačilo na 17 mandátů. Vnitřní neshody ve straně vedly v roce 1938 k jejímu sloučení do Strany národní jednoty.";
      partiesContainerDiv.style.backgroundImage = "url(../img/NS.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("HENLEINOVCI") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Henleinovci</p><br><p>Sudetoněmecká strana neboli SDP vznikla roku 1933. Byla to reakce na dopady Velké hospodářské krize, která dramaticky zasáhla pohraniční oblasti. Zakladatel a předseda strany, Konrad Henlein, cílil na české Němce. Sjednotit německé politické strany nedokázal, jeho voličská základna však výrazně rostla, což vedlo k vítězství strany ve volbách roku 1935. <br><br>Strana nezískala největší počet mandátů a nebyla ani pověřená sestavením vlády, její popularita ale nadále stoupala. SDP začala stupňovat své požadavky v otázkách národnostních menšin, a to zejména českých Němců. Zásadní měrou tak přispěla k politické krizi, která vyústila zánikem první republiky.</p> ";
      partiesContainerDiv.style.backgroundImage = "url(../img/SDP.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("ČEŠTÍ FAŠISTÉ") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Čeští fašisté</p><br><p>Národní obec fašistická byla největším meziválečným uskupením českých fašistů, formovaným od počátku 20. let. Strana vznikla sloučením několika menších fašistických organizací, které pojil odpor vůči komunistům. Zpočátku se vymezovala vůči Německu, ale svoje stanovisko změnila koncem 30. let v naději, že získá větší politickou moc. Jejím vrcholem byly volby roku 1935, kdy získala šest mandátů. Výrazných úspěchů se kvůli stranickým rozporům nikdy nedočkala. Ikonou strany byla jedna z největších osobností československých legií, Rudolf Gejdl (známější pod jménem Radola Gajda). Strana zanikla roku 1939.</p> ";
      partiesContainerDiv.style.backgroundImage = "url(../img/NOF.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("ČESKOSLOVENŠTÍ KOMUNISTÉ") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Českoslovenští komunisté</p><br><p>Komunistická strana Československa vznikla v roce 1921. Její zakládající členy tvořili převážně bývalí politici ČSSD. Poměrně rychle se zvládla usadit na politické scéně a ve volbách roku 1925 skončila na druhém místě. Ze své podstaty byla nadnárodní a do velké míry řízena Sovětským svazem. Internacionalizace vyvrcholila v roce 1929 vnitrostranickým pučem mladých radikálních komunistů, v jejichž čele stál Klement Gottwald.<br>Během 30. let se straně dařilo udržet podporu zhruba 10 % oprávněných voličů, ale do vlády se nedostala. V roce 1938 byla zakázána a po útoku třetí říše na Sovětský svaz přešla řada jejích členů do odboje.</p>";
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


