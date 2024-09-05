// select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultContainer = document.querySelector(".results");
let countdownSpan = document.querySelector(".countdown");

// set options
let CurrentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        
     if(this.readyState === 4 && this.status === 200) {
        //    console.log(this.responseText);

           let questionsObject = JSON.parse(this.responseText);
        //    console.log(questionsObject);
              
              let qCount = questionsObject.length;

               // create bullets + set Questions Set
               createBullets(qCount);

               // Add Questions Data
               addQuestionsData(questionsObject[CurrentIndex],qCount);

               // start countdown
               countdown(5,qCount)


            submitButton.onclick =  () => {
                
                // get Right Answer
                let rightAnswer = questionsObject[CurrentIndex].right_answer;

                // increase index
                CurrentIndex++;

                // check Answer
                checkAnswer(rightAnswer,qCount);

                // Remove previous question
                quizArea.innerHTML = "";
                answerArea.innerHTML = ``;

                // Add Questions Data
                addQuestionsData(questionsObject[CurrentIndex],qCount);

                // handle bullets class
                handleBullets();

               // start countdown
               clearInterval(countdownInterval);
               countdown(5,qCount);

                // show results
                showResults(qCount);


            }

        }
    }
    myRequest.open("GET","html_questions.json",true);
    myRequest.send();
    
}
getQuestions();

function createBullets(num) {

    countSpan.innerHTML = num;

    // create Spans
    for(let i=0;i<num;i++) {

        // create span
        let bullet = document.createElement("span");

        // check if its first Span
        if(i === 0) {
            bullet.className ="on"
        }

        // Append Bullets To Main Bullet Container
        bulletSpanContainer.appendChild(bullet);

    }
    
}

function addQuestionsData(obj,count) {

    if(CurrentIndex < count) {

    // create H2 question Title
    let qTitle = document.createElement("h2");

    // create Question Text
    let qText = document.createTextNode(obj["title"]);

    // Append Text To H2
    qTitle.appendChild(qText);

    // Append H2 To Main div
    quizArea.appendChild(qTitle);

    // Create the Answers
    for(let i=1;i<=4;i++) {

        // create Main Answer Div
        let mainDiv = document.createElement("div");

        // Add class To main Div
        mainDiv.className = "answer";

        // create Radio input
        let radioInput = document.createElement("input");

        // Add type + Id + data-attribute
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        if(i === 1) {
            radioInput.checked = true;
        }

        // create label
        let label = document.createElement("label");

        // Add for attribute
        label.htmlFor = `answer_${i}`;

        // create label text
        let labelText = document.createTextNode(obj[`answer_${i}`]);

        // Add the text to label
        label.appendChild(labelText);

        // Add input + label to main Div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(label);

        // add main Div To parent
        answerArea.appendChild(mainDiv);


    }
}
}

function checkAnswer(rAnswer,count) {

    let answers = document.getElementsByName("question");

    let chosenAnswer;
    for(let i=0;i<answers.length;i++) {

        if(answers[i].checked) {

            chosenAnswer = answers[i].dataset.answer;

        }
    }

    if(chosenAnswer === rAnswer) {
        rightAnswers++;
        console.log(rightAnswers);

    }
    
}

function handleBullets() {

    let bulletsSpans = document.querySelectorAll(".bullets .spans span ");
    let arrayOfSpans = Array.from(bulletsSpans);

    arrayOfSpans.forEach((span,index) => {

        if(CurrentIndex === index ) {
            span.className = "on"
        }
    })
    
}

function showResults(count) {

    // let results;

    if(CurrentIndex === count ) {

        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();


        if(rightAnswers > (count / 2) && rightAnswers < count) {

            resultContainer.innerHTML = `<span class="good">Good</span> , ${rightAnswers} from ${count}`

        }
        else if(rightAnswers === (count)) {

            resultContainer.innerHTML = `<span class="perfect">Perfect</span> , All Answers are Perfect`;

        }
        else  {

            resultContainer.innerHTML = `<span class="bad">Bad</span> , ${rightAnswers} from ${count}`

        }

    }
    
}

function countdown(duration,count) {

    if(CurrentIndex < count ) {
        let minutes,seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            countdownSpan.innerHTML = `${minutes} : ${seconds}`;

            if(--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        },1000);
    }
   
}
















