const QUIZ_QUESTIONS = [
  // WEB DEVELOPMENT CATEGORY
  {
    id: "webdev-1",
    category: "webdev",
    difficulty: "easy",
    type: "single-select",
    question: "Which HTML5 element is used to embed independent, self-contained content, such as a blog post or news article?",
    options: [
      "<section>",
      "<article>",
      "<div>",
      "<aside>"
    ],
    correct: 1, // <article>
    explanation: "The <article> element represents a complete, self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable."
  },
  {
    id: "webdev-2",
    category: "webdev",
    difficulty: "medium",
    type: "multi-select",
    question: "Which of the following are valid ways to declare variables in modern JavaScript? (Select all that apply)",
    options: [
      "let x = 10;",
      "variable x = 10;",
      "const x = 10;",
      "define x = 10;"
    ],
    correct: [0, 2], // let and const
    explanation: "Modern JavaScript uses 'let' (for block-scoped reassignable variables) and 'const' (for block-scoped constants). 'var' is the older way, while 'variable' and 'define' are invalid keywords."
  },
  {
    id: "webdev-3",
    category: "webdev",
    difficulty: "easy",
    type: "fill-blank",
    question: "What does CSS stand for? (Do not include punctuation)",
    correct: ["cascading style sheets", "cascading style sheet"],
    explanation: "CSS stands for Cascading Style Sheets. It describes how HTML elements are to be displayed on screens, paper, or in other media."
  },
  {
    id: "webdev-4",
    category: "webdev",
    difficulty: "hard",
    type: "reorder",
    question: "Arrange these CSS layouts and alignment technologies in the chronological order of their introduction (from oldest to newest):",
    items: [
      "Table Layouts",
      "CSS Floats (Float/Clear)",
      "CSS Flexbox",
      "CSS Grid"
    ],
    correct: ["Table Layouts", "CSS Floats (Float/Clear)", "CSS Flexbox", "CSS Grid"],
    explanation: "Web layout evolved from using HTML Tables in the 1990s, to CSS Floats in the early 2000s, Flexbox in 2009 (standardized around 2012), and CSS Grid in 2017."
  },

  // SCIENCE & TECH CATEGORY
  {
    id: "science-1",
    category: "science",
    difficulty: "easy",
    type: "single-select",
    question: "Which planet in our solar system is known as the 'Red Planet'?",
    options: [
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn"
    ],
    correct: 1, // Mars
    explanation: "Mars is known as the Red Planet because iron minerals in its soil oxidize, or rust, causing the soil and atmosphere to look red."
  },
  {
    id: "science-2",
    category: "science",
    difficulty: "medium",
    type: "multi-select",
    question: "Which of the following subatomic particles are found in the nucleus of a standard atom? (Select all that apply)",
    options: [
      "Protons",
      "Electrons",
      "Neutrons",
      "Photons"
    ],
    correct: [0, 2], // Protons and Neutrons
    explanation: "The nucleus of an atom contains protons (positively charged) and neutrons (neutral). Electrons orbit around the nucleus, while photons are particles of light."
  },
  {
    id: "science-3",
    category: "science",
    difficulty: "medium",
    type: "fill-blank",
    question: "What is the name of the first artificial satellite launched into Earth orbit by the Soviet Union in 1957?",
    correct: ["sputnik", "sputnik 1", "sputnik-1"],
    explanation: "Sputnik 1 was the first artificial Earth satellite. It was launched by the Soviet Union on October 4, 1957, triggering the Space Race."
  },
  {
    id: "science-4",
    category: "science",
    difficulty: "hard",
    type: "reorder",
    question: "Arrange these computer storage technologies from SMALLEST storage capacity to LARGEST typical storage capacity:",
    items: [
      "3.5-inch Floppy Disk",
      "Compact Disc (CD-ROM)",
      "Single-Layer DVD",
      "Standard Blu-ray Disc"
    ],
    correct: ["3.5-inch Floppy Disk", "Compact Disc (CD-ROM)", "Single-Layer DVD", "Standard Blu-ray Disc"],
    explanation: "A standard 3.5\" floppy disk holds 1.44 MB. A CD-ROM holds about 700 MB. A single-layer DVD holds 4.7 GB. A standard Blu-ray holds 25 GB."
  },

  // ART & POP CULTURE
  {
    id: "culture-1",
    category: "culture",
    difficulty: "easy",
    type: "single-select",
    question: "Who painted the famous artwork 'The Starry Night'?",
    options: [
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Vincent van Gogh",
      "Claude Monet"
    ],
    correct: 2, // Vincent van Gogh
    explanation: "Vincent van Gogh painted 'The Starry Night' in June 1889 while staying at the Saint-Paul-de-Mausole asylum in France."
  },
  {
    id: "culture-2",
    category: "culture",
    difficulty: "medium",
    type: "multi-select",
    question: "Which of the following movies won the Academy Award for Best Picture? (Select all that apply)",
    options: [
      "Titanic (1997)",
      "Inception (2010)",
      "Parasite (2019)",
      "The Dark Knight (2008)"
    ],
    correct: [0, 2], // Titanic and Parasite
    explanation: "Titanic won Best Picture in 1997 and Parasite made history by winning in 2019. Inception and The Dark Knight were nominated for or won other technical awards but did not win Best Picture."
  },
  {
    id: "culture-3",
    category: "culture",
    difficulty: "hard",
    type: "fill-blank",
    question: "What is the name of the fictional wizarding school attended by Harry Potter?",
    correct: ["hogwarts", "hogwarts school of witchcraft and wizardry"],
    explanation: "Harry Potter attended Hogwarts School of Witchcraft and Wizardry, a British wizarding school located in the Highlands of Scotland."
  },
  {
    id: "culture-4",
    category: "culture",
    difficulty: "medium",
    type: "reorder",
    question: "Sort these legendary musical artists by the number of Grammy Awards won in their careers (from LEAST to MOST):",
    items: [
      "The Beatles",
      "Michael Jackson",
      "Stevie Wonder",
      "Beyoncé"
    ],
    correct: ["The Beatles", "Michael Jackson", "Stevie Wonder", "Beyoncé"],
    explanation: "The Beatles won 7 competitive Grammy Awards. Michael Jackson won 13. Stevie Wonder won 25. Beyoncé holds the record with 32 Grammy Awards."
  },

  // GENERAL TRIVIA
  {
    id: "general-1",
    category: "general",
    difficulty: "easy",
    type: "single-select",
    question: "Which ocean is the largest on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    correct: 3, // Pacific Ocean
    explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions. It extends from the Arctic Ocean in the north to the Southern Ocean in the south."
  },
  {
    id: "general-2",
    category: "general",
    difficulty: "medium",
    type: "multi-select",
    question: "Which of the following countries share a land border with Germany? (Select all that apply)",
    options: [
      "France",
      "Italy",
      "Poland",
      "United Kingdom"
    ],
    correct: [0, 2], // France and Poland
    explanation: "Germany shares its border with 9 countries: Denmark, Poland, Czech Republic, Austria, Switzerland, France, Luxembourg, Belgium, and the Netherlands. Italy is separated by Switzerland/Austria, and the UK is an island nation."
  },
  {
    id: "general-3",
    category: "general",
    difficulty: "easy",
    type: "fill-blank",
    question: "What is the capital city of Japan?",
    correct: ["tokyo"],
    explanation: "Tokyo is the capital and most populous prefecture of Japan, located at the head of Tokyo Bay."
  },
  {
    id: "general-4",
    category: "general",
    difficulty: "hard",
    type: "reorder",
    question: "Arrange these historical empires in order of their peak chronological start date (from oldest to newest):",
    items: [
      "Egyptian Empire",
      "Roman Empire",
      "Mongol Empire",
      "British Empire"
    ],
    correct: ["Egyptian Empire", "Roman Empire", "Mongol Empire", "British Empire"],
    explanation: "The Egyptian New Kingdom flourished around 1550–1077 BCE. The Roman Empire began in 27 BCE. The Mongol Empire arose in 1206 CE. The British Empire rose to its peak in the 19th and early 20th centuries CE."
  }
];

// If using ES Modules or node exports, we can export it. 
// For standard browser script injection, we attach it to the window scope or declare it globally.
window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
