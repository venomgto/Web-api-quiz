var myQuestions = [
    {
        question: "What is HTML?",
        answers: {
            a: 'Hyper talk text',
            b: 'Hyper Markup Langauge',
            c: 'Hyper math language'
        },
        correctAnswer: 'b'
    },
    {
        question: "What does CSS stand for?",
        answers: {
            a: 'Cascade separtion sensation',
            b: 'Consequence style shelf',
            c: 'Cascading style sheet'
        },
        correctAnswer: 'c'
    },
    {
        question: "What does JS stand for?",
        answers: {
            a: 'Hyper mark up language',
            b: 'Javascript',
            c: 'Justice system'
        },
        correctAnswer: 'b'
    },
    {
        question: "What is the correct tag for paragraph in HTML?",
        answers: {
            a: '<script>',
            b: '<img>',
            c: '<p>'
        },
        correctAnswer: 'c'
    },
    {
        question: "How can we change the background in a css file?",
        answers: {
            a: 'border: none',
            b: 'background-color: #06AED5',
            c: 'align-items: center'
        },
        correctAnswer: 'b'
    }
]

// FIGURING OUT THE SORTED LEADERBOARD STUFF
// ----------------------------------------------
leaderboard_data = [
    { initials: "VP", score: 20 },
    { initials: "GW", score: 27 },
    { initials: "AA", score: 11 },
    { initials: "BT", score: 23 }
];

// In here we give the comparator function
leaderboard_data.sort((subm1, subm2) => {
    return -(subm1.score - subm2.score);
});

console.log(leaderboard_data);

// "abc".compareTo("xyz"); // Return a negative number if "abc" < "xyz"
// Return 0 if they are equal
// Return a positive number if "abc" > "xyz"
// compareTo kinda returns "abc" - "xyz" as a number somehow.
//
// "abc" - "xyz" < 0  ===> "abc" < "xyz"
// "abc" - "xyz" = 0  ===> "abc" = "xyz"
// "abc" - "xyz" > 0  ===> "abc" > "xyz"
// {initials: VP, score: 13}



// ----------------------------------------------
// FIGURING OUT THE SORTED LEADERBOARD STUFF


// References to sections
var questdiv = document.getElementById("questdiv");
let preamble = document.getElementById("preamble");

var choice_a = document.getElementById("choice_a");
var choice_b = document.getElementById("choice_b");
var choice_c = document.getElementById("choice_c");
var timer_elem = document.getElementById("timer");
let indicator_elem = document.getElementById("correctness_indicator");

var questiontext = document.getElementById("questiontext")
document.getElementById("start").addEventListener("click", start_quiz);

let view_highscores_button = document.getElementById("view_highscore");
view_highscores_button.addEventListener("click", () => {
    highscores_section.classList.remove("hidden");
    preamble.classList.add("hidden");
    stop_quiz();
    initials_section.classList.add("hidden");
    populate_highscores_html();
});

// Initials section of the HTML
let initials_section = document.getElementById("initials_prompt");
let initials_final_score = document.getElementById("final_score");
let initials_textfield = document.getElementById("initials_field");
let submit_initials_button = document.getElementById("submit_initials");
submit_initials_button.addEventListener("click", submit_initials);

// Highscores section of the HTML
let highscores_section = document.getElementById("highscores_section");
let highscore_list = document.getElementById("highscore_list");
let highscores_go_back_button = document.getElementById("go_back_button");
let clear_highscores_button = document.getElementById("clear_highscores_button");
highscores_go_back_button.addEventListener("click", () => {
    highscores_section.classList.add("hidden");
    preamble.classList.remove("hidden");
    time_left = 50;
    curr_question_idx = 0;
});
clear_highscores_button.addEventListener("click", () => {
    leaderboard_data = [];
    populate_highscores_html();
});

let curr_question_idx = 0;
// let time_left = 75;
let time_left = 50; // DEBUG: To see end of quiz quickly
let dectime_interv_id = undefined;

function submit_initials() {
    userInitials = initials_textfield.value;
    console.log(`The user ${userInitials} submitted with a final score of ${time_left}`);

    leaderboard_data.push({ initials: userInitials, score: time_left });
    sort_leaderboard();

    // Hide initials section, and reveal highscores section.
    highscores_section.classList.remove("hidden");
    initials_section.classList.add("hidden");

    // TODO: Write a function for populating the highscores in the view.
    // and then invoke that function here.
    // TODO: Make the leaderboard buttons do something.
    // TODO: Only show the view high score button at appropriate times.
    populate_highscores_html();
}

function populate_highscores_html() {

    // for(INITIALIZE; CONDITION; ITERATION)
    // - The INITIALIZE part only executes once when the loop starts.
    // - The CONDITION part is checked in order to decide if the loop should do another iteration.
    // - The ITERATION part runs after each time the loop runs.
    // The word "iteration" makes one cycle of the loop.

    // i = 0
    // i < 10 ???
    // Yes, so we do another iteration.
    // console.log(0);
    // body finished. Do ITERATION.
    // i++ ... i = 1
    // i < 10 ???
    // Yes, so we do another iteration.
    // console.log(1);
    // body finished. Do ITERATION.
    // i++ ... i = 2
    // i < 10 ???
    // Yes...
    // console.log(9);
    // body finished
    // i++ ... i = 10
    // i < 10 ???
    // No, so the loop stop running.
    // for (let i = 0; i < 10; i++) {
    //     console.log(i);
    // }

    highscore_list.innerHTML = '';
    for (let i = 0; i < leaderboard_data.length; i++) {
        leaderboard_entry = leaderboard_data[i];
        entry_initials = leaderboard_entry.initials;
        entry_score = leaderboard_entry.score;

        let entry_elem = document.createElement("li");
        entry_elem.innerText = `${entry_initials}: ${entry_score}`;

        highscore_list.appendChild(entry_elem);
    }
}

function sort_leaderboard() {
    leaderboard_data.sort((subm1, subm2) => {
        return -(subm1.score - subm2.score);
    });
}

function decrement_timer() {
    time_left -= 1;
    timer_elem.textContent = "Time: " + time_left;
    if (time_left <= 0) {
        stop_quiz();
    }
}

function start_quiz() {
    questdiv.classList.remove("hidden");
    show_questions_and_choices();
    dectime_interv_id = setInterval(decrement_timer, 1000);
}

function show_questions_and_choices() {
    questiontext.textContent = myQuestions[curr_question_idx].question;
    choice_a.textContent = myQuestions[curr_question_idx].answers.a;
    choice_b.textContent = myQuestions[curr_question_idx].answers.b;
    choice_c.textContent = myQuestions[curr_question_idx].answers.c;
}

function choiceClicked() {
    choiceStr = this.id;
    choice = choiceStr[choiceStr.length - 1];
    console.log(`User selected choice ${choice}`);

    correct_choice = myQuestions[curr_question_idx].correctAnswer;
    if (choice == correct_choice) {
        indicator_elem.textContent = "Correct!";
    }
    else {
        indicator_elem.textContent = "Incorrect!";

        time_left -= 10;
        if (time_left <= 0) {
            stop_quiz();
            return;
        }
    }
    if (curr_question_idx == 0) {
        indicator_elem.classList.remove("hidden");
    }

    curr_question_idx += 1;
    if (curr_question_idx < myQuestions.length) {
        show_questions_and_choices();
    }
    else {
        stop_quiz();
    }
}

function stop_quiz() {
    clearInterval(dectime_interv_id);
    if (time_left < 0) {
        time_left = 0;
    }
    questdiv.classList.add("hidden");
    preamble.classList.add("hidden");
    timer_elem.textContent = "";

    initials_section.classList.remove("hidden");
    initials_final_score.textContent = time_left;
}

choice_a.addEventListener("click", choiceClicked);
choice_b.addEventListener("click", choiceClicked);
choice_c.addEventListener("click", choiceClicked);



// function sayHello() {
//     console.log(`Hello ${Math.random()}`);
// }

// setInterval(sayHello, 1000);

//function generateQuiz(questions, quizContainer, resultsContainer, submitButton) {
   // function showQuestions(questions, quizContainer) {
       // var output = [];
       // var answers;

      //  for (var i = 0; i < questions.length; i++) {
           // answers = [];

           // for (letter in questions[i].answers) {
               // answers.push('<label>' +

               //     '</label>'
             //   );
          //  }
       // }
   // }
   // functionshowResults(questions, quizContainer, resultsContainer) {

  //  }
   // showQuestions(questions, quizContainer);

  //  submitButton.onClick = function () {
       // showResults(questions, quizContainer, resultContainer);
  //  }
//}

