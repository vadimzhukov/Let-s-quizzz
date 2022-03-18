const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score');
const fullProgressBar = document.getElementById('fullProgressBar');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
    .then(res => {
        return res.json();
    })
    .then(loadedData => {

        questions = loadedData.results.map(loadedQuestion => {
            
            //Start formatting the required structure of question+choices objects
            
            let adoptedQuestion = {
                question: htmlDecode(loadedQuestion.question)
            }

            const answerNumber = (Math.floor(Math.random() * 3) + 1);

            adoptedQuestion.answer = answerNumber;
            //temp array to save answers for current question
            const answers = [...loadedQuestion.incorrect_answers.map(answer => htmlDecode(answer))];
            answers.splice((answerNumber - 1), 0, htmlDecode(loadedQuestion.correct_answer));

            answers.forEach((item, index) => {
                adoptedQuestion['choice' + (index + 1)] = item;
            });
            return adoptedQuestion;
        });
        startGame();
    }).catch(err => console.error("===ERROR===" + err));

   
//вариант с подгрузкой из файла    
//fetch('/questions.json')    
//    .then(res => {
//    console.log(res);
//    return res.json();
//}).then(loadedQuestionsArr => { 
//    console.log(loadedQuestionsArr);
//    questions = [...loadedQuestionsArr];
//    startGame();
//}).catch(err => {
//    console.error(err)
//});



//CONSTANTS//
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    
    loader.classList.add('hidden');
    game.classList.remove('hidden');
    
    getNewQuestion();
    
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        
        localStorage.setItem('score', score);
        //go to the end page
        return window.location.replace("./end.html");
    }
    questionCounter++;
    //question counter on heads-up display
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    
    //preogress bar drawing
    fullProgressBar.style.width = `${questionCounter/MAX_QUESTIONS*100}%`;
    

    const questionIndex = Math.floor(availableQuestions.length * Math.random());
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    
    choices.forEach( choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
    
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
    
        if(!acceptingAnswers) return;
        
        acceptingAnswers = false;
        
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        
        let classToApply = 'incorrect';
        if(selectedAnswer == currentQuestion['answer']) {
            classToApply = 'correct';
            score += CORRECT_BONUS;
            scoreText.innerText = score;
           
        }
        
        selectedChoice.classList.add(classToApply);
        
        
        setTimeout(() => {
            selectedChoice.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
        
        
        
            });
});
