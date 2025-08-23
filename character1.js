let questions = [
    {
    question: "What motivates you most in fitness?",
    options: [
      {text: "Personal growth", weight: {Explorer: 40, Fighter: 35, Connector: 15, Nurturer: 10}},
      {text: "Strength & Confidence", weight: {Explorer: 25, Fighter: 40, Connector: 20, Nurturer: 15}},
      {text: "Fun & Variety", weight: {Explorer: 30, Fighter: 20, Connector: 25, Nurturer: 25}},
      {text: "Community connection", weight: {Explorer: 12, Fighter: 17, Connector: 46, Nurturer: 25}},
      {text: "Stress relief", weight: {Explorer: 18, Fighter: 13, Connector: 19, Nurturer: 50}}
    ]
  },
    {
    question: "What you preferred workout vibe?",
    options: [
      {text: "Solo & Intense", weight: {Explorer: 33, Fighter: 41, Connector: 16, Nurturer: 10}},
      {text: "Structured & Goal-focused", weight: {Explorer: 38, Fighter: 36, Connector: 16, Nurturer: 10}},
      {text: "Flexible & Adaptable", weight: {Explorer: 28, Fighter: 21, Connector: 26, Nurturer: 25}},
      {text: "Group & Social", weight: {Explorer: 13, Fighter: 16, Connector: 46, Nurturer: 25}},
      {text: "Gentle & Supportive", weight: {Explorer: 13, Fighter: 11, Connector: 21, Nurturer: 55}}
    ]
  },
    {
    question: "How do you recharge mentally?",
    options: [
      {text: "Outdoor adventures", weight: {Explorer: 45, Fighter: 27, Connector: 20, Nurturer: 8}},
      {text: "Meditation & Reflection", weight: {Explorer: 20, Fighter: 32, Connector: 15, Nurturer: 33}},
      {text: "Creative hobbies", weight: {Explorer: 30, Fighter: 27, Connector: 25, Nurturer: 18}},
      {text: "Socializing", weight: {Explorer: 15, Fighter: 22, Connector: 45, Nurturer: 18}},
      {text: "Helping others", weight: {Explorer: 15, Fighter: 17, Connector: 20, Nurturer: 48}}
    ]
  },
    {
    question: "What's your natural vibe?",
    options: [
      {text: "The Trailblazer - I lead the way", weight: {Explorer: 42, Fighter: 24, Connector: 21, Nurturer: 13}},
      {text: "The Challenger - I push boundaries", weight: {Explorer: 27, Fighter: 44, Connector: 16, Nurturer: 13}},
      {text: "The Creative - I think outside the box", weight: {Explorer: 32, Fighter: 24, Connector: 21, Nurturer: 23}},
      {text: "The Connector - I bring people together", weight: {Explorer: 12, Fighter: 19, Connector: 46, Nurturer: 23}},
      {text: "The Supporter - I lift others up", weight: {Explorer: 12, Fighter: 14, Connector: 21, Nurturer: 53}}
    ]
  },
];

const personalityData = {
    Explorer: {
        img: "assets/pics/Hiking 1.png",
        quote: "Offline vibes, ready to manifest growth!",
        title: "The Exlorer",
        description: "You thrive on new experiences and pushing your boundaries. Your main character energy is about discovering what your body and mind can achieve.",
        strengths: ["Adventurous", "Open-minded", "Growth-focused"],
        workoutStyle: "Varied routines, outdoor activities, functional fitness",
        bestMatch: "Connector or Nurturer"
    },
    Fighter: {
        img: "assets/pics/Superwoman.png",
        quote: "No yikes, just growth and determination!",
        title: "The Fighter",
        description: "You're driven by challenge and competition. Your energy transforms obstacles into opportunities for strength building.",
        strengths: ["Determined", "Goal-oriented", "Resilient"],
        workoutStyle: "High-intensity training, strength building, competitive sports",
        bestMatch: "Connector or Nurturer"
    },
    Connector: {
        img: "assets/pics/Football Team.png",
        quote: "Main character energy through community!",
        title: "The Connector",
        description: "Your superpower is bringing people together. You believe fitness is better when shared with others who inspire and motivate.",
        strengths: ["Social", "Motivating", "Inclusive"],
        workoutStyle: "Group classes, partner workouts, team sports",
        bestMatch: "Explorer or Fighter"
    },
    Nurturer: {
        img: "assets/pics/Yoga.png",
        quote: "Flight to better health, lifting others up!",
        title: "The Nurturer",
        description: "You find fulfillment in supporting others' journeys. Your gentle strength creates safe spaces for growth and healing.",
        strengths: ["Supportive", "Empathetic", "Patient"],
        workoutStyle: "Mindful movement, yoga, rehabilitation-focused training",
        bestMatch: "Explorer or Fighter"
    }
}

const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const next_btn = document.querySelector(".next_btn");
const bottom_ques_counter = document.querySelector(".total_que");
const time_line = document.querySelector("header .time_line");

const fireBtn = document.querySelector(".fire_btn");

fireBtn.addEventListener("mouseenter", () => {

    const rect = fireBtn.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth; // normalized x [0-1]
    const y = rect.top / window.innerHeight;

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: x, y: y },
    });
})

fireBtn.addEventListener("mouseleave", () => {
    confettiPlayed = false;
});

let que_count = 0;
let selectedAnswers = [];

// if startQuiz button clicked
window.onload = ()=>{
    info_box.classList.add("activeInfo");
}

// if exitQuiz button clicked
exit_btn.onclick = ()=>{
    window.location.href = "index.html";
}

let widthValue = 0;

const quit_quiz = result_box.querySelector(".buttons .quit");

// if continueQuiz button clicked
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(que_count);
    updateProgress(que_count);
};

// redirect to choose gym page
quit_quiz.onclick = () => {
    window.location.href = "registration.html";
};

// if Next Que button clicked
next_btn.onclick = () => {
    que_count++;
    if (que_count < questions.length) {
        showQuestions(que_count);
        updateProgress(que_count);
        next_btn.classList.remove("show"); // hide Next button properly
    } else {
        showResult();
    }
}

// getting questions and options from array
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = `<span>${questions[index].question}</span>`;
    que_text.innerHTML = que_tag;

    let option_tag = "";
    questions[index].options.forEach(option => {
        option_tag += `<div class="option"><span>${option.text}</span></div>`;
    });
    option_list.innerHTML = option_tag;

    // Reattach click events every time a question loads
    const options = option_list.querySelectorAll(".option");
    options.forEach(opt => {
        opt.onclick = () => optionSelected(opt);
    });

    // hide Next button until an option is selected
    next_btn.classList.remove("show");
}

// Progress Bar
function updateProgress(index) {
    let progress = (((index - 1) + 1) / questions.length) * 100;
    time_line.style.width = progress + "%";
    bottom_ques_counter.innerHTML = `<span>${index + 1} of ${questions.length}</span>`;
}

//if user clicked on option
function optionSelected(answerElem) {
    const allOptions = option_list.querySelectorAll(".option");
    allOptions.forEach(opt => opt.classList.remove("selected"));

    answerElem.classList.add("selected");

    const answerIndex = [...option_list.children].indexOf(answerElem);
    selectedAnswers[que_count] = questions[que_count].options[answerIndex];

    next_btn.classList.add("show");
}

function queCounter(index){
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}

// Map answers to character archetypes
function calculatePersonality() {
    let score = { Explorer: 0, Fighter: 0, Connector: 0, Nurturer: 0 };

    selectedAnswers.forEach(ans => {
        for (let key in ans.weight) {
            score[key] += ans.weight[key];
        }
    });

    // Find max score
    let maxScore = -Infinity;
    let personality = "";
    for (let key in score) {
        if (score[key] > maxScore) {
            maxScore = score[key];
            personality = key;
        }
    }
    return personality;
}

// Update showResult to include personality
function showResult() {
    const personality = calculatePersonality();
    const data = personalityData[personality];
    
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    
    const scoreText = result_box.querySelector(".score_text");
    scoreText.innerHTML = `
    <div class="personality-result">
        <img src="${data.img}" alt="${data.title}" class="personality-img">
        <h2 class="personality-title">${data.title}</h2>
        <p class="personality-quote">"${data.quote}"</p>
        <p class="personality-desc">${data.description}</p>
        <p class="personality-info"><strong>Your Strengths</strong></p>
        <ul class="personality-strengths">
            ${data.strengths.map(strength => `<li>${strength}</li>`).join("")}
        </ul>
        <p class="personality-info"><strong>Workout Style</strong></p>
        <p class="personality-info">${data.workoutStyle}</p>
        <p class="personality-match"><strong>Best Match:</strong> ${data.bestMatch}</p>
    </div>`;

    localStorage.setItem("userPersonality", personality);
}
