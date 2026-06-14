(function() {
  // --- STATE ---
  let state = {
    userName: "",
    selectedCategory: "all",
    selectedDifficulty: "all",
    quizQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: [], // Array of { question, userAnswer, isCorrect }
    quizStartTime: 0,
    questionStartTime: 0,
    timerInterval: null,
    timerSecondsLeft: 30,
    soundMuted: false,
    theme: "dark"
  };

  // Timer settings
  const SECONDS_PER_QUESTION = 30;

  // Category labels mapping
  const CATEGORY_MAP = {
    all: "Mixed Trivia",
    webdev: "Web Dev",
    science: "Science & Tech",
    culture: "Pop Culture",
    general: "General Trivia"
  };

  // --- DOM ELEMENTS ---
  const el = {
    welcomeScreen: document.getElementById('welcome-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),
    leaderboardScreen: document.getElementById('leaderboard-screen'),
    
    toggleSoundBtn: document.getElementById('toggle-sound-btn'),
    toggleThemeBtn: document.getElementById('toggle-theme-btn'),
    
    usernameInput: document.getElementById('username-input'),
    categoryGrid: document.getElementById('category-grid'),
    categoryCards: document.querySelectorAll('.category-card'),
    difficultySelector: document.getElementById('difficulty-selector'),
    difficultyOptions: document.querySelectorAll('.difficulty-option'),
    startQuizBtn: document.getElementById('start-quiz-btn'),
    viewLeaderboardHomeBtn: document.getElementById('view-leaderboard-home-btn'),
    
    questionCounter: document.getElementById('question-counter'),
    categoryBadge: document.getElementById('category-badge'),
    timerContainer: document.getElementById('timer-container'),
    timerSeconds: document.getElementById('timer-seconds'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedbackCard: document.getElementById('feedback-card'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackExplanation: document.getElementById('feedback-explanation'),
    quitQuizBtn: document.getElementById('quit-quiz-btn'),
    submitAnswerBtn: document.getElementById('submit-answer-btn'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    
    resultsScore: document.getElementById('results-score'),
    scoreCircleProgress: document.getElementById('score-circle-progress'),
    resultsHeadline: document.getElementById('results-headline'),
    resultsMessage: document.getElementById('results-message'),
    statAccuracy: document.getElementById('stat-accuracy'),
    statTime: document.getElementById('stat-time'),
    statDifficulty: document.getElementById('stat-difficulty'),
    tryAgainBtn: document.getElementById('try-again-btn'),
    viewLeaderboardResultsBtn: document.getElementById('view-leaderboard-results-btn'),
    reviewList: document.getElementById('review-list'),
    
    leaderboardTbody: document.getElementById('leaderboard-tbody'),
    noScores: document.getElementById('no-scores'),
    clearScoresBtn: document.getElementById('clear-scores-btn'),
    leaderboardBackBtn: document.getElementById('leaderboard-back-btn')
  };

  // --- INITIALIZATION ---
  function init() {
    loadSettings();
    setupEventListeners();
    initWelcomeForm();
  }

  // --- SETTINGS (THEME & AUDIO) ---
  function loadSettings() {
    // Theme setup
    const savedTheme = localStorage.getItem('brainiac_theme') || 'dark';
    setTheme(savedTheme);

    // Audio setup
    const savedMuted = localStorage.getItem('brainiac_muted') === 'true';
    setMutedState(savedMuted);
  }

  function setTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('brainiac_theme', themeName);
    el.toggleThemeBtn.textContent = themeName === 'dark' ? '🌙' : '☀️';
  }

  function setMutedState(muted) {
    state.soundMuted = muted;
    localStorage.setItem('brainiac_muted', muted);
    window.QuizSound.setMuted(muted);
    el.toggleSoundBtn.textContent = muted ? '🔇' : '🔊';
  }

  // --- LISTENERS ---
  function setupEventListeners() {
    // Theme & Sound Toggle
    el.toggleThemeBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      setTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    el.toggleSoundBtn.addEventListener('click', () => {
      setMutedState(!state.soundMuted);
      window.QuizSound.playClick();
    });

    // Welcome Settings - Category Selection
    el.categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        window.QuizSound.playClick();
        el.categoryCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selectedCategory = card.dataset.category;
      });
    });

    // Welcome Settings - Difficulty Selection
    el.difficultyOptions.forEach(option => {
      option.addEventListener('click', () => {
        window.QuizSound.playClick();
        el.difficultyOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        state.selectedDifficulty = option.dataset.value;
      });
    });

    // Start Button
    el.startQuizBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      validateAndStartQuiz();
    });

    // Quit Button
    el.quitQuizBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      if (confirm("Are you sure you want to quit the current quiz? Your progress will be lost.")) {
        resetToWelcome();
      }
    });

    // Submit & Next Buttons
    el.submitAnswerBtn.addEventListener('click', () => {
      submitAnswer();
    });

    el.nextQuestionBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      advanceQuestion();
    });

    // Results Actions
    el.tryAgainBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      resetToWelcome();
    });

    el.viewLeaderboardResultsBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      showScreen(el.leaderboardScreen);
      loadLeaderboard();
    });

    // Leaderboard Screen Navigation
    el.viewLeaderboardHomeBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      showScreen(el.leaderboardScreen);
      loadLeaderboard();
    });

    el.leaderboardBackBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      showScreen(el.welcomeScreen);
    });

    el.clearScoresBtn.addEventListener('click', () => {
      window.QuizSound.playClick();
      if (confirm("Are you sure you want to clear all high scores? This action cannot be undone.")) {
        localStorage.removeItem('brainiac_leaderboard');
        loadLeaderboard();
      }
    });
  }

  // --- WELCOME VALIDATION & CONFIG ---
  function initWelcomeForm() {
    // Fill in stored username if available
    const savedName = localStorage.getItem('brainiac_username');
    if (savedName) {
      el.usernameInput.value = savedName;
    }
  }

  function validateAndStartQuiz() {
    const name = el.usernameInput.value.trim();
    if (!name) {
      // Shake animation effect
      el.usernameInput.focus();
      el.usernameInput.style.borderColor = 'var(--color-error)';
      el.usernameInput.style.boxShadow = '0 0 0 3px var(--color-error-border)';
      setTimeout(() => {
        el.usernameInput.style.borderColor = '';
        el.usernameInput.style.boxShadow = '';
      }, 1500);
      return;
    }

    // Save user name
    state.userName = name;
    localStorage.setItem('brainiac_username', name);

    // Select questions
    setupQuestions();
  }

  function setupQuestions() {
    // 1. Filter questions
    let pool = window.QUIZ_QUESTIONS || [];
    
    if (state.selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === state.selectedCategory);
    }
    
    if (state.selectedDifficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === state.selectedDifficulty);
    }

    // Fallback if no questions matched the criteria
    if (pool.length === 0) {
      pool = window.QUIZ_QUESTIONS.filter(q => q.category === state.selectedCategory) || window.QUIZ_QUESTIONS;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // Pick maximum 10 questions
    state.quizQuestions = shuffled.slice(0, 10);
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.userAnswers = [];
    state.quizStartTime = Date.now();

    // Transition to Gameplay Screen
    showScreen(el.quizScreen);
    renderActiveQuestion();
  }

  // --- ACTIVE GAMEPLAY ---
  function renderActiveQuestion() {
    const currentQ = state.quizQuestions[state.currentQuestionIndex];
    if (!currentQ) return;

    // Reset feedback and action buttons
    el.feedbackCard.className = "feedback-card";
    el.feedbackCard.style.display = "none";
    el.submitAnswerBtn.style.display = "inline-flex";
    el.submitAnswerBtn.disabled = false;
    el.nextQuestionBtn.style.display = "none";

    // Update progress elements
    const totalQ = state.quizQuestions.length;
    el.questionCounter.textContent = `Question ${state.currentQuestionIndex + 1} of ${totalQ}`;
    
    // Category Badge
    el.categoryBadge.textContent = CATEGORY_MAP[currentQ.category] || "Trivia";
    
    // Progress bar fill width
    const percentage = ((state.currentQuestionIndex) / totalQ) * 100;
    el.progressBarFill.style.width = `${percentage}%`;

    // Inject question text
    el.questionText.textContent = currentQ.question;

    // Render options depending on question type
    el.optionsContainer.innerHTML = "";
    el.optionsContainer.className = `options-container ${currentQ.type}`;

    if (currentQ.type === 'single-select') {
      renderSingleSelect(currentQ);
    } else if (currentQ.type === 'multi-select') {
      renderMultiSelect(currentQ);
    } else if (currentQ.type === 'fill-blank') {
      renderFillBlank(currentQ);
    } else if (currentQ.type === 'reorder') {
      renderReorder(currentQ);
    }

    // Reset and Start timer
    state.questionStartTime = Date.now();
    startTimer();
  }

  function renderSingleSelect(q) {
    q.options.forEach((option, idx) => {
      const optionEl = document.createElement('div');
      optionEl.className = "option-item";
      optionEl.tabIndex = 0;
      optionEl.dataset.index = idx;
      optionEl.innerHTML = `
        <span class="option-marker">${String.fromCharCode(65 + idx)}</span>
        <span class="option-text">${escapeHTML(option)}</span>
      `;
      
      const selectHandler = () => {
        if (el.submitAnswerBtn.style.display === "none") return; // Quiz already submitted
        window.QuizSound.playClick();
        el.optionsContainer.querySelectorAll('.option-item').forEach(item => {
          item.classList.remove('selected');
        });
        optionEl.classList.add('selected');
      };

      optionEl.addEventListener('click', selectHandler);
      optionEl.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectHandler();
        }
      });

      el.optionsContainer.appendChild(optionEl);
    });
  }

  function renderMultiSelect(q) {
    q.options.forEach((option, idx) => {
      const optionEl = document.createElement('div');
      optionEl.className = "option-item";
      optionEl.tabIndex = 0;
      optionEl.dataset.index = idx;
      optionEl.innerHTML = `
        <span class="option-marker">☐</span>
        <span class="option-text">${escapeHTML(option)}</span>
      `;

      const selectHandler = () => {
        if (el.submitAnswerBtn.style.display === "none") return; // Quiz already submitted
        window.QuizSound.playClick();
        optionEl.classList.toggle('selected');
        const marker = optionEl.querySelector('.option-marker');
        marker.textContent = optionEl.classList.contains('selected') ? '☑' : '☐';
      };

      optionEl.addEventListener('click', selectHandler);
      optionEl.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectHandler();
        }
      });

      el.optionsContainer.appendChild(optionEl);
    });
  }

  function renderFillBlank(q) {
    const fillContainer = document.createElement('div');
    fillContainer.className = "fill-blank-container";
    fillContainer.innerHTML = `
      <input type="text" id="fill-blank-input" class="input-text" placeholder="Type your answer here..." autocomplete="off">
    `;
    el.optionsContainer.appendChild(fillContainer);

    const input = document.getElementById('fill-blank-input');
    input.focus();

    // Submit on Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitAnswer();
      }
    });
  }

  function renderReorder(q) {
    const listEl = document.createElement('div');
    listEl.className = "reorder-list";
    listEl.id = "reorder-items-list";

    // Scramble the items initially (ensure it's not identical to the correct list)
    let scrambled = [...q.items];
    let attempts = 0;
    while (attempts < 10) {
      scrambled.sort(() => Math.random() - 0.5);
      // Check if it matches the correct one
      const matches = scrambled.every((val, index) => val === q.correct[index]);
      if (!matches) break;
      attempts++;
    }

    scrambled.forEach((item, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = "reorder-item";
      itemEl.draggable = true;
      itemEl.dataset.value = item;
      itemEl.innerHTML = `
        <div class="reorder-content">
          <span class="reorder-index">${idx + 1}</span>
          <span class="reorder-text">${escapeHTML(item)}</span>
        </div>
        <div class="reorder-right-controls">
          <div class="reorder-controls">
            <button type="button" class="reorder-control-btn btn-up" title="Move Up">▲</button>
            <button type="button" class="reorder-control-btn btn-down" title="Move Down">▼</button>
          </div>
          <span class="reorder-handle">☰</span>
        </div>
      `;
      listEl.appendChild(itemEl);
    });

    el.optionsContainer.appendChild(listEl);
    setupReorderLogic(listEl);
  }

  function setupReorderLogic(container) {
    let draggingItem = null;

    // Drag and drop events
    container.addEventListener('dragstart', (e) => {
      if (el.submitAnswerBtn.style.display === "none") return;
      const target = e.target.closest('.reorder-item');
      if (target) {
        draggingItem = target;
        target.classList.add('dragging');
      }
    });

    container.addEventListener('dragend', (e) => {
      const target = e.target.closest('.reorder-item');
      if (target) {
        target.classList.remove('dragging');
        draggingItem = null;
        updateReorderIndexes(container);
      }
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (el.submitAnswerBtn.style.display === "none") return;
      const dragOverItem = e.target.closest('.reorder-item');
      if (!dragOverItem || dragOverItem === draggingItem) return;

      const rect = dragOverItem.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
      container.insertBefore(draggingItem, next ? dragOverItem.nextSibling : dragOverItem);
    });

    // Keyboard Shift Controls
    container.addEventListener('click', (e) => {
      if (el.submitAnswerBtn.style.display === "none") return;

      const btnUp = e.target.closest('.btn-up');
      const btnDown = e.target.closest('.btn-down');
      
      if (btnUp) {
        window.QuizSound.playClick();
        const item = btnUp.closest('.reorder-item');
        const prev = item.previousElementSibling;
        if (prev && prev.classList.contains('reorder-item')) {
          container.insertBefore(item, prev);
          updateReorderIndexes(container);
        }
      }

      if (btnDown) {
        window.QuizSound.playClick();
        const item = btnDown.closest('.reorder-item');
        const next = item.nextElementSibling;
        if (next && next.classList.contains('reorder-item')) {
          container.insertBefore(next, item);
          updateReorderIndexes(container);
        }
      }
    });
  }

  function updateReorderIndexes(container) {
    const items = container.querySelectorAll('.reorder-item');
    items.forEach((item, index) => {
      item.querySelector('.reorder-index').textContent = index + 1;
    });
  }

  // --- TIMER HANDLING ---
  function startTimer() {
    clearInterval(state.timerInterval);
    state.timerSecondsLeft = SECONDS_PER_QUESTION;
    el.timerSeconds.textContent = state.timerSecondsLeft;
    el.timerContainer.classList.remove('timer-warning');

    state.timerInterval = setInterval(() => {
      state.timerSecondsLeft--;
      el.timerSeconds.textContent = state.timerSecondsLeft;

      if (state.timerSecondsLeft <= 5) {
        el.timerContainer.classList.add('timer-warning');
        window.QuizSound.playTimerTick();
      }

      if (state.timerSecondsLeft <= 0) {
        clearInterval(state.timerInterval);
        submitAnswer(true); // Forced submission on timeout
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(state.timerInterval);
  }

  // --- SUBMITTING & CHECKING ANSWERS ---
  function submitAnswer(isTimeout = false) {
    stopTimer();
    const currentQ = state.quizQuestions[state.currentQuestionIndex];
    if (!currentQ) return;

    let userVal = null;
    let isCorrect = false;

    // Disable submission
    el.submitAnswerBtn.disabled = true;

    // Gather answer based on question type
    if (currentQ.type === 'single-select') {
      const selectedItem = el.optionsContainer.querySelector('.option-item.selected');
      userVal = selectedItem ? parseInt(selectedItem.dataset.index) : null;
      isCorrect = (userVal === currentQ.correct);
      
      // Paint UI indicators
      el.optionsContainer.querySelectorAll('.option-item').forEach(item => {
        const idx = parseInt(item.dataset.index);
        if (idx === currentQ.correct) {
          item.classList.add('is-correct');
        } else if (idx === userVal) {
          item.classList.add('is-incorrect');
        }
      });
    } 
    
    else if (currentQ.type === 'multi-select') {
      const selectedItems = el.optionsContainer.querySelectorAll('.option-item.selected');
      userVal = Array.from(selectedItems).map(item => parseInt(item.dataset.index));
      
      // Check correctness: must match correct array exactly
      const correctArr = currentQ.correct;
      isCorrect = (correctArr.length === userVal.length) && 
                  correctArr.every(val => userVal.includes(val));

      el.optionsContainer.querySelectorAll('.option-item').forEach(item => {
        const idx = parseInt(item.dataset.index);
        const correctMarker = item.querySelector('.option-marker');
        
        if (correctArr.includes(idx)) {
          item.classList.add('is-correct');
          correctMarker.textContent = '☑';
        } else if (userVal.includes(idx)) {
          item.classList.add('is-incorrect');
          correctMarker.textContent = '☒';
        }
      });
    } 
    
    else if (currentQ.type === 'fill-blank') {
      const input = document.getElementById('fill-blank-input');
      userVal = input ? input.value.trim() : "";
      input.disabled = true;
      
      isCorrect = currentQ.correct.includes(userVal.toLowerCase());
      
      if (isCorrect) {
        input.classList.add('is-correct');
        input.style.borderColor = 'var(--color-success)';
        input.style.boxShadow = '0 0 0 3px var(--color-success-border)';
      } else {
        input.classList.add('is-incorrect');
        input.style.borderColor = 'var(--color-error)';
        input.style.boxShadow = '0 0 0 3px var(--color-error-border)';
      }
    } 
    
    else if (currentQ.type === 'reorder') {
      const items = el.optionsContainer.querySelectorAll('.reorder-item');
      userVal = Array.from(items).map(item => item.dataset.value);
      isCorrect = userVal.every((val, index) => val === currentQ.correct[index]);

      items.forEach((item, index) => {
        const correctValue = currentQ.correct[index];
        const currentValue = item.dataset.value;
        const handle = item.querySelector('.reorder-handle');
        if (handle) handle.style.display = "none";
        
        if (currentValue === correctValue) {
          item.classList.add('is-correct');
          item.style.borderColor = 'var(--color-success)';
        } else {
          item.classList.add('is-incorrect');
          item.style.borderColor = 'var(--color-error)';
        }
      });
      // Disable control buttons
      el.optionsContainer.querySelectorAll('.reorder-control-btn').forEach(btn => btn.disabled = true);
    }

    // Save score
    if (isCorrect) {
      state.score++;
    }

    // Register User Answer entry
    state.userAnswers.push({
      question: currentQ,
      userAnswer: userVal,
      isCorrect: isCorrect,
      timeTaken: SECONDS_PER_QUESTION - state.timerSecondsLeft
    });

    // Display feedback card
    showAnswerFeedback(isCorrect, currentQ, isTimeout);

    // Switch action buttons
    el.submitAnswerBtn.style.display = "none";
    el.nextQuestionBtn.style.display = "inline-flex";
  }

  function showAnswerFeedback(isCorrect, question, isTimeout) {
    el.feedbackCard.className = `feedback-card show ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isTimeout) {
      el.feedbackIcon.textContent = "⏰";
      el.feedbackTitle.textContent = "Time's Up!";
      window.QuizSound.playIncorrect();
    } else if (isCorrect) {
      el.feedbackIcon.textContent = "🎉";
      el.feedbackTitle.textContent = "Correct!";
      window.QuizSound.playCorrect();
    } else {
      el.feedbackIcon.textContent = "❌";
      el.feedbackTitle.textContent = "Incorrect!";
      window.QuizSound.playIncorrect();
    }

    // Construct response description
    let ansStr = "";
    if (question.type === 'single-select') {
      ansStr = `Correct answer: <strong>${escapeHTML(question.options[question.correct])}</strong>`;
    } else if (question.type === 'multi-select') {
      const corrects = question.correct.map(idx => question.options[idx]).join(', ');
      ansStr = `Correct answers: <strong>${escapeHTML(corrects)}</strong>`;
    } else if (question.type === 'fill-blank') {
      ansStr = `Acceptable answers: <strong>${escapeHTML(question.correct.join(' / '))}</strong>`;
    } else if (question.type === 'reorder') {
      ansStr = `Correct sequence:<br><ol style="padding-left:1.25rem; margin-top:0.35rem;">` + 
               question.correct.map(item => `<li>${escapeHTML(item)}</li>`).join('') + 
               `</ol>`;
    }

    el.feedbackExplanation.innerHTML = `
      <div style="margin-bottom: 0.5rem;">${ansStr}</div>
      <div>${escapeHTML(question.explanation)}</div>
    `;
  }

  function advanceQuestion() {
    state.currentQuestionIndex++;
    if (state.currentQuestionIndex < state.quizQuestions.length) {
      renderActiveQuestion();
    } else {
      showResultsScreen();
    }
  }

  // --- SHOW END RESULTS ---
  function showResultsScreen() {
    stopTimer();
    showScreen(el.resultsScreen);
    
    const totalQ = state.quizQuestions.length;
    const scoreVal = state.score;
    const accuracy = totalQ > 0 ? Math.round((scoreVal / totalQ) * 100) : 0;
    
    // Set score numbers
    el.resultsScore.textContent = `${scoreVal}/${totalQ}`;

    // Choose feedback context based on success
    let headline = "Keep Practicing! 📚";
    let msg = "Don't discourage yourself, review the answers below to reinforce your knowledge and try again.";
    
    if (accuracy === 100) {
      headline = "Perfect Score! 🏆";
      msg = "Magnificent! You conquered every single question correctly. You are an absolute master!";
    } else if (accuracy >= 80) {
      headline = "Amazing Job! 🌟";
      msg = "Terrific work! You have a brilliant grasp of this material. Exceptional score!";
    } else if (accuracy >= 50) {
      headline = "Good Effort! 🧠";
      msg = "Nicely done! You got a solid number of answers right. Keep learning to achieve a high score.";
    }

    el.resultsHeadline.textContent = headline;
    el.resultsMessage.textContent = msg;

    // Stat cards values
    el.statAccuracy.textContent = `${accuracy}%`;
    
    // Time calculation
    const totalTimeSec = Math.round((Date.now() - state.quizStartTime) / 1000);
    const m = Math.floor(totalTimeSec / 60);
    const s = totalTimeSec % 60;
    el.statTime.textContent = m > 0 ? `${m}m ${s}s` : `${s}s`;

    // Difficulty labels
    el.statDifficulty.textContent = state.selectedDifficulty === 'all' ? 'Mixed' : capitalize(state.selectedDifficulty);

    // Trigger Circle progress animation
    const progressCircle = el.scoreCircleProgress;
    progressCircle.style.strokeDashoffset = "440"; // Reset first
    
    setTimeout(() => {
      const circumference = 440;
      const offset = circumference - (circumference * (scoreVal / totalQ));
      progressCircle.style.strokeDashoffset = offset;
    }, 150);

    // Trigger celebration effects for good scores
    if (accuracy >= 70) {
      window.QuizSound.playVictory();
      const conf = new window.ConfettiEffect('confetti-canvas');
      conf.start(3500);
    } else {
      window.QuizSound.playCorrect(); // Standard finish chime
    }

    // Save to leaderboard storage
    saveQuizScore(scoreVal, totalQ, accuracy, totalTimeSec);

    // Render Review Accordions
    renderReviewAccordion();
  }

  function saveQuizScore(scoreVal, totalQ, accuracy, timeTakenSec) {
    const list = JSON.parse(localStorage.getItem('brainiac_leaderboard')) || [];
    
    const m = Math.floor(timeTakenSec / 60);
    const s = timeTakenSec % 60;
    const formattedTime = m > 0 ? `${m}m ${s}s` : `${s}s`;

    const entry = {
      name: state.userName,
      category: CATEGORY_MAP[state.selectedCategory] || "Trivia",
      score: `${scoreVal}/${totalQ}`,
      accuracy: accuracy,
      time: formattedTime,
      timeSeconds: timeTakenSec,
      timestamp: Date.now()
    };

    list.push(entry);
    
    // Sort logic: Higher accuracy first, then lesser timeTaken, then newest
    list.sort((a, b) => {
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      return a.timeSeconds - b.timeSeconds;
    });

    // Store top 10
    const topTen = list.slice(0, 10);
    localStorage.setItem('brainiac_leaderboard', JSON.stringify(topTen));
  }

  function renderReviewAccordion() {
    el.reviewList.innerHTML = "";
    
    state.userAnswers.forEach((entry, idx) => {
      const q = entry.question;
      const reviewCard = document.createElement('div');
      reviewCard.className = `review-item ${entry.isCorrect ? 'is-correct' : 'is-incorrect'}`;
      
      // Stringify answers nicely
      let userAnsText = "";
      let correctAnsText = "";

      if (q.type === 'single-select') {
        userAnsText = entry.userAnswer !== null ? q.options[entry.userAnswer] : "No Answer";
        correctAnsText = q.options[q.correct];
      } else if (q.type === 'multi-select') {
        userAnsText = entry.userAnswer && entry.userAnswer.length > 0 
                      ? entry.userAnswer.map(i => q.options[i]).join(', ') 
                      : "No Answer";
        correctAnsText = q.correct.map(i => q.options[i]).join(', ');
      } else if (q.type === 'fill-blank') {
        userAnsText = entry.userAnswer || "No Answer";
        correctAnsText = q.correct.join(' / ');
      } else if (q.type === 'reorder') {
        userAnsText = entry.userAnswer ? entry.userAnswer.join(' ➔ ') : "No Answer";
        correctAnsText = q.correct.join(' ➔ ');
      }

      reviewCard.innerHTML = `
        <h4 class="review-question">${idx + 1}. ${escapeHTML(q.question)}</h4>
        <div class="review-answers-grid">
          <div class="review-answer-box">
            <div class="review-answer-label">Your Response</div>
            <div class="review-answer-text" style="color: ${entry.isCorrect ? 'var(--color-success)' : 'var(--color-error)'}">
              ${escapeHTML(userAnsText)}
            </div>
          </div>
          <div class="review-answer-box">
            <div class="review-answer-label">Correct Answer</div>
            <div class="review-answer-text" style="color: var(--color-success)">
              ${escapeHTML(correctAnsText)}
            </div>
          </div>
        </div>
        <p class="review-explanation">${escapeHTML(q.explanation)}</p>
      `;

      el.reviewList.appendChild(reviewCard);
    });
  }

  // --- LEADERBOARD LOGIC ---
  function loadLeaderboard() {
    el.leaderboardTbody.innerHTML = "";
    const list = JSON.parse(localStorage.getItem('brainiac_leaderboard')) || [];

    if (list.length === 0) {
      el.noScores.style.display = "block";
      return;
    }
    
    el.noScores.style.display = "none";

    list.forEach((entry, index) => {
      const tr = document.createElement('tr');
      
      // Formatting Ranks
      let rankBadge = "";
      if (index === 0) rankBadge = `<span class="rank-badge rank-1">🥇</span>`;
      else if (index === 1) rankBadge = `<span class="rank-badge rank-2">🥈</span>`;
      else if (index === 2) rankBadge = `<span class="rank-badge rank-3">🥉</span>`;
      else rankBadge = `<span class="rank-badge rank-other">${index + 1}</span>`;

      tr.innerHTML = `
        <td>${rankBadge}</td>
        <td><strong>${escapeHTML(entry.name)}</strong></td>
        <td>${escapeHTML(entry.category)}</td>
        <td><span style="color: var(--color-secondary); font-weight:700;">${escapeHTML(entry.score)}</span></td>
        <td>${escapeHTML(entry.time)}</td>
      `;
      el.leaderboardTbody.appendChild(tr);
    });
  }

  // --- HELPERS ---
  function showScreen(targetScreen) {
    // Hide all
    const screens = [el.welcomeScreen, el.quizScreen, el.resultsScreen, el.leaderboardScreen];
    screens.forEach(s => {
      s.classList.remove('active');
    });

    // Make target block-visible, then activate after browser paints to trigger slide/fade transition
    targetScreen.classList.add('active');
  }

  function resetToWelcome() {
    stopTimer();
    showScreen(el.welcomeScreen);
    el.progressBarFill.style.width = "0%";
    initWelcomeForm();
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Load app on document load
  document.addEventListener('DOMContentLoaded', init);
})();
