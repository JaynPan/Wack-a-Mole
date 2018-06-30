// js document

const $holes = $('.hole');
const $missBoard = $('.miss');
const $scoreBoard = $('.score');
const $moles = $('.mole');
const $gameBoard = $('.game-zone');
const $resultTitle = $('#result-title');
const $intro = $('.intro');
const $resultBoard = $('.result');
const $chooseLevel = $('.chooseLevel');

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Introduction display hide
// Game display show
function choose() {
    $chooseLevel.slideDown(800);
    $intro.hide();
    $resultBoard.hide();
}
$('#quit').click(function(){
    $intro.fadeIn();
    $gameBoard.hide();
    $resultBoard.hide();
})
// count down 
// start game (game start from countdown 4, 3, 2, 1)
let countNumber = 4;
let gamestart = false;
let lastHoleNum;
let timeUp = false;
let score;
let sum = 0;
let miss = 0;
let timer = 60;
let peepmin;
let peepmax;

function countdownEasy(){

    panelSetting();

    let count1 = setInterval(function(){
        if(countNumber === 0 && gamestart ){
            $('#count').hide();
            clearInterval(count1);
            // count to zero and start the game
            startGameEasy();    
        }
        $('#count').html(countNumber--);
    },1000);
};
function countdownNor(){

    panelSetting();

    let count1 = setInterval(function(){
        if(countNumber === 0 && gamestart ){
            $('#count').hide();
            clearInterval(count1);
            // count to zero and start the game
            startGameNor();    
        }
        $('#count').html(countNumber--);
    },1000);
};
function countdownHard(){

    panelSetting();

    let count1 = setInterval(function(){
        if(countNumber === 0 && gamestart ){
            $('#count').hide();
            clearInterval(count1);
            // count to zero and start the game
            startGameHard();    
        }
        $('#count').html(countNumber--);
    },1000);
};
function panelSetting(){
    $gameBoard.slideDown(1500);
    $chooseLevel.hide();
    $resultBoard.hide();
    gamestart = true;
    $('#count').show();
}

function startGameEasy() {
    $scoreBoard.text(0);
    timeUp = false;
    score = 0;
    easy();
    peep();
    missScoring();
    timeLimit();
}
function startGameNor() {
    $scoreBoard.text(0);
    timeUp = false;
    score = 0;
    normal();
    peep();
    timeLimit();
}
function startGameHard() {
    $scoreBoard.text(0);
    timeUp = false;
    score = 0;
    hard();
    peep();
    timeLimit();
}

function easy() {
    peepmin = 3000;
    peepmax = 4000; 
}
function normal() {
    peepmin = 600;
    peepmax = 1200;
}
function hard() {
    peepmin = 400;
    peepmax = 800;
}

// generate random hole and hole will not repeat 
// return the value to peep()
function randomHole($holes) {
    let randomHoleNum = Math.floor(Math.random() * $holes.length);
    const hole = $($holes[randomHoleNum]);
    if(randomHoleNum === lastHoleNum) {
        console.log('Ah nah thats the same one bud');
        return randomHole($holes);
    }
    lastHoleNum = randomHoleNum;
    console.log(hole);
    return hole;
}

// recive the random hole value, set random peep time 
let time;
function peep() {
    time = randomTime(peepmin, peepmax);
    const hole = randomHole($holes);
    sum ++;
    console.log(sum);
    hole.addClass('up');
    // hole.children().addClass('missing');
    play_growl_sound();
    setTimeout(() => {  
        hole.removeClass('up');
        if(!timeUp) peep();
        // hole.children().on('transitionstart', function(){
        //     if(hole.children().hasClass('missing') && !timeUp){
        //         miss++; 
        //         $missBoard.text(miss);
        //     }
        //     hole.children().removeClass('missing')
        // });
    }, time);

}
function missScoring() {
    misstime = time + 3000; //3000 = transtion time 3s
    setTimeout(() => {
    miss = sum - score;
    $missBoard.text(miss);
    console.log(miss)
    if(!timeUp) missScoring();
    }, misstime);
};




// Game Time Duration

function timeLimit(){
    let tm = setInterval(counting, 1000);
    function counting(){
        timer--;
        if(timer == 0){
            clearInterval(tm);
            gamestart = false;
            reset();
        }
        $('.time').html(timer);
    }
}

// reset game 
function reset() {
    timeUp= true;
    timer = 15;
    score = 0;
    $scoreBoard.text(score);
    countNumber = 4;
    $('#count').html(countNumber);
    if(miss === 0){
        $resultTitle.text(`Congratulations! You Saved Will's Life`);
        play_cheer_sound();
    }else{
        $resultTitle.text(`${miss} Monsters Still Alive!! Will Had Been Killed`);
        play_loss_sound();
    };
    miss = 0;
    $missBoard.text(miss);
    $gameBoard.fadeOut(1000);
    $('.result').fadeIn(1500);  
}


// bonk the monsters
$moles.on('click', bonk);

function bonk(e) {
    if(!e.which) return; //cheaten!! score will not count
    score++;
    play_punch_sound();
    $(this).parent().removeClass('up');
    $(this).removeClass('missing');
    $(this).addClass('disabled'); //prevent double score
    $(this).css("background", "url(../images/demogorgon-dead.svg) bottom center no-repeat");
    $scoreBoard.text(score);
}
// Listen for when the moles...are finished animating down...
// ...If they have a disabled class...then remove it...
$moles.on('transitionend', function(){
    $(this).css("background", "url(../images/demogorgon.svg) bottom center no-repeat");
    $(this).removeClass('disabled');
})


// Sound Functions
function play_growl_sound() {
    $('#growl').get(0).play();
};
function play_cheer_sound() {
    $('#cheer').get(0).play();
}
function play_loss_sound() {
    $('#suspense').get(0).play();
}
function play_punch_sound() {
    $('#punch').get(0).play();
}
$('#volume-up').click(function(){
    $('#bg-music')[0].pause();
    $('#volume-up').hide();
    $('#volume-off').show();
});
$('#volume-off').click(function(){
    $('#bg-music')[0].play();
    $('#volume-off').hide();
    $('#volume-up').show();
});


// cursor animation
$gameBoard.click(function(){

    if($(this).hasClass('clicked')) return;

    $(this).addClass('clicked');
    setTimeout(() => {
        $(this).removeClass('clicked')
    }, 300);
});