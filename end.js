const userNameText = document.getElementById('userName');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('score');

const highScore = JSON.parse(localStorage.getItem("highScore")) || [];
const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;



userNameText.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !userNameText;
});

saveHighScore = (e) => {
     console.log("===start save high scores ===")
    e.preventDefault();
    
    const score = {
        score: mostRecentScore,
        name: userNameText.value
    }
    
    highScore.push(score);
    highScore.sort( (a,b) => b.score - a.score);
    highScore.splice(5);
    console.log(highScore);
    
    localStorage.setItem('highScore', JSON.stringify(highScore));
    window.location.replace('index.html');
};



