/**
 * HamZabaan local curriculum — the SOURCE OF TRUTH for the AI tutor.
 *
 * The tutor is only allowed to teach from this data. The /api/tutor context
 * builder embeds exactly one of these entries into the lesson context that is
 * sent to Grok; anything outside it must be politely redirected.
 *
 * To expand the curriculum, add entries here (or split this file into
 * per-subject modules later). Never generate curriculum content with the AI.
 */

import { getTopic } from "./subjects";

export interface CurriculumTopic {
  subjectId: string;
  topicId: string;
  /** Core explanation of the topic — what the tutor teaches from. */
  explanation: string;
  keyConcepts: string[];
  learningObjectives: string[];
  commonMisconceptions: string[];
  /** Practice questions the tutor may ask (it can rephrase/simplify them). */
  sampleQuestions: string[];
  studySummary?: string;
  keyTakeaways?: string[];
  importantTerms?: string[];
  teachingSequence?: string[];
}

export const CURRICULUM: CurriculumTopic[] = [
  /* ------------------------------ Mathematics ------------------------------ */
  {
    subjectId: "maths",
    topicId: "fractions",
    explanation:
      "A fraction shows a part of a whole. When one naan is divided into 2 equal pieces, each piece is 1/2 (one half). The top number (numerator) tells how many parts we have; the bottom number (denominator) tells how many equal parts the whole is divided into. Fractions with the same denominator are added by adding only the numerators (1/4 + 2/4 = 3/4). To compare fractions with the same denominator, the bigger numerator is the bigger fraction; with the same numerator, the SMALLER denominator is the bigger fraction because the pieces are larger.",
    keyConcepts: ["numerator", "denominator", "half, quarter, third", "equivalent fractions", "adding fractions with same denominator", "comparing fractions"],
    learningObjectives: [
      "Explain what a fraction means using a real object (naan, pizza, chocolate)",
      "Identify the numerator and denominator",
      "Add two fractions that have the same denominator",
      "Compare two simple fractions and say which is bigger",
    ],
    commonMisconceptions: [
      "Thinking 1/8 is bigger than 1/4 because 8 is bigger than 4",
      "Adding both numerators and denominators (1/4 + 1/4 = 2/8)",
      "Thinking the parts do not need to be equal",
    ],
    sampleQuestions: [
      "If a naan is cut into 4 equal pieces and you eat 1 piece, what fraction did you eat?",
      "Which is bigger: 1/2 or 1/4? Why?",
      "What is 1/5 + 2/5?",
      "In the fraction 3/7, which number is the denominator and what does it tell us?",
    ],
  },
  {
    subjectId: "maths",
    topicId: "algebra-basics",
    explanation:
      "Algebra uses letters (variables) like x to stand for unknown numbers. An equation is a balance: whatever you do to one side you must do to the other. To solve x + 3 = 7, subtract 3 from both sides to get x = 4. To solve 2x = 10, divide both sides by 2 to get x = 5. Think of a variable as a closed box with a hidden number inside — solving the equation opens the box.",
    keyConcepts: ["variable", "constant", "equation", "balancing both sides", "solving for x", "substitution"],
    learningObjectives: [
      "Explain what a variable is in simple words",
      "Solve one-step equations like x + 5 = 12 and 3x = 12",
      "Check an answer by substituting it back into the equation",
    ],
    commonMisconceptions: [
      "Thinking x always equals the same number in every problem",
      "Moving a number to the other side without changing its sign",
      "Thinking 2x means 2 + x instead of 2 times x",
    ],
    sampleQuestions: [
      "If x + 4 = 9, what is x?",
      "A box has some mangoes. After adding 3 more there are 10. Write this as an equation and solve it.",
      "If 5x = 20, what is x?",
      "What does the letter x mean in an equation?",
    ],
  },
  {
    subjectId: "maths",
    topicId: "percentages",
    explanation:
      "Percent means 'out of 100'. 50% means 50 out of 100, which is the same as 1/2. To find a percentage of a number, multiply the number by the percent and divide by 100: 20% of 500 rupees = (20 × 500) ÷ 100 = 100 rupees. Percentages are used everywhere in Pakistan: exam marks, shop discounts, mobile battery, and Zakat (2.5%). A discount of 25% on a 400-rupee shirt saves 100 rupees, so you pay 300.",
    keyConcepts: ["percent = out of 100", "converting between fractions and percentages", "finding percent of a quantity", "discount", "increase and decrease"],
    learningObjectives: [
      "Explain what percent means",
      "Convert simple fractions (1/2, 1/4, 3/4) into percentages",
      "Calculate a percentage of an amount, e.g. 10% of 250 rupees",
      "Solve a simple real-life discount problem",
    ],
    commonMisconceptions: [
      "Thinking 50% of 80 is 50",
      "Believing a 50% discount followed by another 50% discount makes it free",
      "Confusing percentage points with the actual amount",
    ],
    sampleQuestions: [
      "What is 50% of 60?",
      "A 200-rupee toy has a 25% discount. How many rupees do you save?",
      "You scored 45 out of 50 in a test. What percentage is that?",
      "Which is more: 1/4 of 100 or 20% of 100?",
    ],
  },
  {
    subjectId: "maths",
    topicId: "geometry",
    explanation:
      "Geometry studies shapes, angles and sizes. An angle is measured in degrees: a right angle is 90° (like the corner of a book), a straight line is 180°. Angles inside every triangle always add up to 180°. Perimeter is the distance all the way around a shape (add all sides). Area is the space inside a shape: for a rectangle, area = length × width. A cricket ground boundary is like a perimeter; the grass inside is like the area.",
    keyConcepts: ["angle (acute, right, obtuse)", "triangle angle sum = 180°", "perimeter", "area of rectangle and square", "sides and corners of common shapes"],
    learningObjectives: [
      "Identify right, acute and obtuse angles",
      "Use the fact that triangle angles add up to 180°",
      "Calculate the perimeter of a rectangle",
      "Calculate the area of a rectangle using length × width",
    ],
    commonMisconceptions: [
      "Confusing area with perimeter",
      "Thinking a bigger perimeter always means a bigger area",
      "Thinking all triangles have a right angle",
    ],
    sampleQuestions: [
      "A rectangle is 5 m long and 3 m wide. What is its area? What is its perimeter?",
      "Two angles of a triangle are 60° and 70°. What is the third angle?",
      "Is a 120° angle acute, right, or obtuse?",
      "What is the difference between area and perimeter?",
    ],
  },
  {
    subjectId: "maths",
    topicId: "tables",
    explanation:
      "Multiplication is repeated addition: 3 × 4 means 3 groups of 4 (4 + 4 + 4 = 12). Times tables help us multiply fast without counting. Useful tricks: any number × 10 just adds a zero (7 × 10 = 70); × 5 answers always end in 0 or 5; × 9 trick — the digits of the answer add up to 9 (9 × 4 = 36, and 3 + 6 = 9). Order does not matter: 6 × 7 = 7 × 6 = 42.",
    keyConcepts: ["multiplication as repeated addition", "times tables 2–12", "×10 and ×5 patterns", "×9 finger/digit trick", "order does not change the answer (commutative)"],
    learningObjectives: [
      "Explain multiplication as repeated addition",
      "Recall tables of 2, 5 and 10 quickly",
      "Use a pattern trick for the 9 times table",
      "Solve small real-life multiplication problems",
    ],
    commonMisconceptions: [
      "Thinking 6 × 7 and 7 × 6 can give different answers",
      "Thinking any number × 0 equals the number itself",
      "Adding instead of multiplying",
    ],
    sampleQuestions: [
      "One rickshaw carries 3 passengers. How many passengers can 6 rickshaws carry?",
      "What is 7 × 8?",
      "What is 9 × 6? Check it with the digit trick.",
      "What is 12 × 0?",
    ],
  },

  /* -------------------------------- Science -------------------------------- */
  {
    subjectId: "science",
    topicId: "photosynthesis",
    explanation:
      "Photosynthesis is how green plants make their own food. The leaves take in carbon dioxide from the air, the roots absorb water from the soil, and chlorophyll (the green colour in leaves) captures sunlight. Using this light energy, the plant turns water and carbon dioxide into glucose (its food) and releases oxygen for us to breathe. The word equation is: carbon dioxide + water --sunlight--> glucose + oxygen. This mostly happens during the day, because sunlight is needed.",
    keyConcepts: ["chlorophyll", "carbon dioxide", "water from roots", "sunlight energy", "glucose", "oxygen release", "word equation of photosynthesis"],
    learningObjectives: [
      "Name the things a plant needs for photosynthesis",
      "Explain the job of chlorophyll and sunlight",
      "State what the plant makes (glucose) and what it releases (oxygen)",
      "Say the word equation of photosynthesis",
    ],
    commonMisconceptions: [
      "Thinking plants get their food from the soil",
      "Thinking plants breathe exactly like humans",
      "Thinking photosynthesis happens at night too",
    ],
    sampleQuestions: [
      "What gas do plants take in for photosynthesis, and what gas do they give out?",
      "Why are leaves green, and how does that colour help the plant?",
      "What three things does a plant need to make its food?",
      "Why can't photosynthesis happen in a completely dark room?",
    ],
  },
  {
    subjectId: "science",
    topicId: "water-cycle",
    explanation:
      "The water cycle is how water moves between the earth and the sky, again and again. 1) Evaporation: the sun heats water in rivers, lakes and the sea, turning it into invisible water vapour that rises up. 2) Condensation: high in the sky the vapour cools and turns into tiny droplets that form clouds. 3) Precipitation: when the droplets become heavy, they fall as rain (or snow on mountains like in Murree). 4) Collection: rainwater gathers back into rivers like the Indus, lakes and the sea — and the cycle starts again.",
    keyConcepts: ["evaporation", "condensation", "precipitation", "collection", "water vapour", "clouds", "the sun as the energy source"],
    learningObjectives: [
      "Name the four stages of the water cycle in order",
      "Explain evaporation and condensation in simple words",
      "Explain how clouds form and why rain falls",
      "Say what powers the whole water cycle (the sun)",
    ],
    commonMisconceptions: [
      "Thinking clouds are made of smoke or cotton",
      "Thinking water disappears forever when a puddle dries",
      "Thinking rain comes directly from the sea without evaporation",
    ],
    sampleQuestions: [
      "What happens to water in a puddle on a hot sunny day?",
      "How does a cloud form in the sky?",
      "What are the four stages of the water cycle, in order?",
      "Where does the energy for the water cycle come from?",
    ],
  },
  {
    subjectId: "science",
    topicId: "solar-system",
    explanation:
      "The solar system is the sun and everything that orbits (goes around) it. The sun is a star at the centre — a huge ball of hot glowing gas that gives us light and heat. Eight planets orbit the sun in this order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Earth is the third planet and the only one known to have life, because it has water and air. The moon is not a planet — it orbits Earth and takes about a month for one round. Earth spins on its axis (one spin = one day and night) and orbits the sun (one full orbit = one year, about 365 days). Jupiter is the biggest planet; Saturn is famous for its beautiful rings.",
    keyConcepts: ["the sun is a star", "eight planets and their order", "orbit", "Earth's spin = day and night", "Earth's orbit = one year", "the moon orbits Earth", "why Earth has life"],
    learningObjectives: [
      "Name the eight planets in order from the sun",
      "Explain the difference between a star, a planet and a moon",
      "Explain what causes day and night",
      "Say how long Earth takes to orbit the sun",
    ],
    commonMisconceptions: [
      "Thinking the sun orbits the Earth",
      "Thinking the moon is a planet or makes its own light",
      "Thinking day and night are caused by the sun switching off",
      "Thinking all planets can support life",
    ],
    sampleQuestions: [
      "Which planet do we live on, and what number is it from the sun?",
      "Why do we have day and night?",
      "How much time does the Earth take to complete one orbit of the sun?",
      "Is the moon a planet? Why or why not?",
    ],
  },
  {
    subjectId: "science",
    topicId: "human-body",
    explanation:
      "Our body has systems where organs work together like a team. The heart is a muscle that pumps blood through the whole body about 70–80 times a minute; blood carries oxygen and food to every part. The lungs take in oxygen when we breathe in and remove carbon dioxide when we breathe out. Digestion starts in the mouth where teeth cut food and saliva softens it; the stomach churns the food with juices; the small intestine absorbs the nutrients into the blood. The brain controls everything — thinking, moving, and even breathing while we sleep.",
    keyConcepts: ["heart pumps blood", "blood carries oxygen and nutrients", "lungs and breathing", "digestion: mouth → stomach → small intestine", "the brain controls the body"],
    learningObjectives: [
      "Explain the job of the heart and what blood carries",
      "Explain what the lungs do when we breathe in and out",
      "Describe the journey of food through the body in order",
      "Name the organ that controls the whole body",
    ],
    commonMisconceptions: [
      "Thinking the heart is where feelings are made",
      "Thinking food and air go down the same pipe",
      "Thinking digestion happens only in the stomach",
    ],
    sampleQuestions: [
      "What is the job of the heart?",
      "Which gas do we breathe in, and which do we breathe out?",
      "Where does digestion of food begin?",
      "Which organ works as the control room of the body?",
    ],
  },
  {
    subjectId: "science",
    topicId: "electricity",
    explanation:
      "Electricity is the flow of tiny charges called electrons through a wire — like water flowing through a pipe. A circuit is the complete loop the current travels: battery → wire → bulb → back to the battery. If the loop is broken anywhere (a switch turned off), the current stops and the bulb goes off. Conductors like copper and iron let current pass easily; insulators like rubber, plastic and dry wood block it — that is why wires are covered in plastic. Safety rules: never touch switches with wet hands, never put fingers or metal objects in sockets, and stay away from fallen wires.",
    keyConcepts: ["current is flow of charge", "circuit (complete loop)", "switch opens/closes the circuit", "conductors", "insulators", "electrical safety"],
    learningObjectives: [
      "Explain what an electric circuit is",
      "Explain why a bulb goes off when the switch is off",
      "Sort common materials into conductors and insulators",
      "State three electricity safety rules",
    ],
    commonMisconceptions: [
      "Thinking current gets used up completely by the bulb",
      "Thinking electricity flows even in a broken circuit",
      "Thinking all metals are dangerous and all plastics are safe in every situation",
    ],
    sampleQuestions: [
      "Why does the bulb turn off when you switch off the switch?",
      "Is a plastic ruler a conductor or an insulator?",
      "Why are electric wires covered with plastic?",
      "Name two conductors and two insulators.",
    ],
  },

  /* -------------------------------- English -------------------------------- */
  {
    subjectId: "english",
    topicId: "parts-of-speech",
    explanation:
      "Parts of speech are the types of words in a sentence. A noun names a person, place or thing (Ali, Lahore, book). A verb shows an action or state (run, eat, is). An adjective describes a noun (a RED kite, a TALL boy). An adverb describes a verb — how, when or where something happens (he runs QUICKLY). Example: 'Ali (noun) quickly (adverb) ate (verb) the hot (adjective) samosa (noun).'",
    keyConcepts: ["noun", "verb", "adjective", "adverb", "identifying word types inside a sentence"],
    learningObjectives: [
      "Define noun, verb, adjective and adverb with examples",
      "Find the noun and verb in a simple sentence",
      "Tell the difference between an adjective and an adverb",
    ],
    commonMisconceptions: [
      "Thinking a word is always the same part of speech in every sentence",
      "Confusing adjectives with adverbs",
      "Thinking only action words like 'run' are verbs, forgetting 'is/are/was'",
    ],
    sampleQuestions: [
      "In the sentence 'The little cat drinks milk', which word is the noun and which is the verb?",
      "What kind of word is 'beautiful'?",
      "Make one sentence that has a noun, a verb and an adjective.",
      "What is the difference between 'quick' and 'quickly'?",
    ],
  },
  {
    subjectId: "english",
    topicId: "tenses",
    explanation:
      "Tenses tell us WHEN an action happens. Present tense: it happens now or daily — 'I play cricket every day.' Past tense: it already happened — 'I played cricket yesterday.' Future tense: it will happen — 'I will play cricket tomorrow.' Regular verbs make the past by adding -ed (play → played); irregular verbs change completely (go → went, eat → ate). Time words are clues: yesterday = past, every day = present, tomorrow = future.",
    keyConcepts: ["present tense", "past tense", "future tense (will)", "regular -ed verbs", "irregular verbs (go/went, eat/ate)", "time clue words"],
    learningObjectives: [
      "Identify whether a sentence is past, present or future",
      "Change a simple sentence from present to past",
      "Use 'will' to make a future sentence",
      "Recall the past forms of common irregular verbs",
    ],
    commonMisconceptions: [
      "Adding -ed to every verb (goed, eated)",
      "Using 'will' together with a past form (will went)",
      "Thinking tense does not change the verb's form",
    ],
    sampleQuestions: [
      "Change to past tense: 'I eat a mango.'",
      "Is this sentence past, present or future: 'We will visit Karachi tomorrow'?",
      "What is the past form of 'go'?",
      "Make a future-tense sentence about your school.",
    ],
  },
  {
    subjectId: "english",
    topicId: "sentence-making",
    explanation:
      "A sentence is a group of words that gives a complete idea. Every sentence starts with a capital letter and ends with a full stop (.), question mark (?) or exclamation mark (!). The usual English order is Subject + Verb + Object: 'Sana (subject) reads (verb) a book (object).' A sentence must have at least a subject and a verb — 'Because I was late' is not a complete sentence, but 'I was late' is. Longer sentences join ideas with words like 'and', 'but' and 'because'.",
    keyConcepts: ["complete thought", "capital letter and end punctuation", "subject + verb + object order", "joining words (and, but, because)"],
    learningObjectives: [
      "Say what makes a group of words a complete sentence",
      "Arrange jumbled words into a correct sentence",
      "Use correct capital letters and end punctuation",
      "Join two short sentences with 'and', 'but' or 'because'",
    ],
    commonMisconceptions: [
      "Thinking any group of words is a sentence",
      "Using Urdu word order (subject-object-verb) in English sentences",
      "Forgetting the capital letter or full stop",
    ],
    sampleQuestions: [
      "Arrange into a sentence: 'school / goes / Ahmed / to'",
      "Is 'Running very fast' a complete sentence? Why or why not?",
      "Join these with 'because': 'I stayed home. It was raining.'",
      "Fix this sentence: 'ali plays cricket'",
    ],
  },
  {
    subjectId: "english",
    topicId: "vocabulary",
    explanation:
      "Vocabulary means the words you know and use. Everyday English words appear all around us in Pakistan — at home (kitchen, water, breakfast), at school (teacher, homework, exam), in the bazaar (price, cheap, expensive) and while travelling (bus stop, ticket, left, right). Learning opposites (big/small, hot/cold) and word families (teach → teacher, play → player) grows vocabulary quickly. Using a new word in your own sentence is the best way to remember it.",
    keyConcepts: ["everyday words for home, school, bazaar and travel", "opposites (antonyms)", "similar words (synonyms)", "word families", "using new words in sentences"],
    learningObjectives: [
      "Name common English words for everyday things",
      "Give the opposite of common words",
      "Build a word family from a base word",
      "Use a new word correctly in your own sentence",
    ],
    commonMisconceptions: [
      "Memorising word lists without ever using the words",
      "Thinking one Urdu word always maps to exactly one English word",
      "Confusing similar-sounding words (quiet/quite)",
    ],
    sampleQuestions: [
      "What is the opposite of 'expensive'?",
      "Name three English words you would use in the kitchen.",
      "Make a sentence with the word 'journey'.",
      "'Teach' becomes 'teacher'. What does 'drive' become?",
    ],
  },

  /* ---------------------------- Pakistan Studies ---------------------------- */
  {
    subjectId: "pak-studies",
    topicId: "independence",
    explanation:
      "The Independence Movement is the struggle through which Pakistan was created on 14 August 1947. After the War of Independence in 1857, Muslims of the subcontinent worked to protect their rights under British rule. Sir Syed Ahmad Khan encouraged modern education (Aligarh Movement). The All-India Muslim League was founded in 1906 to represent Muslims. In 1930 Allama Iqbal presented the idea of a separate homeland, and on 23 March 1940 the Lahore Resolution (Pakistan Resolution) formally demanded it. Under the leadership of Quaid-e-Azam Muhammad Ali Jinnah, this struggle succeeded and Pakistan appeared on the world map in 1947.",
    keyConcepts: ["War of Independence 1857", "Sir Syed Ahmad Khan and Aligarh Movement", "Muslim League 1906", "Allama Iqbal's idea 1930", "Lahore Resolution 23 March 1940", "Independence 14 August 1947"],
    learningObjectives: [
      "Place the key events of the movement in the correct order",
      "Explain the importance of the Lahore Resolution",
      "Name the leaders who guided the movement",
      "State when and how Pakistan was created",
    ],
    commonMisconceptions: [
      "Confusing 23 March (Lahore Resolution) with 14 August (Independence Day)",
      "Thinking Pakistan was created suddenly without a long struggle",
      "Mixing up the roles of different leaders",
    ],
    sampleQuestions: [
      "What happened on 23 March 1940?",
      "When did Pakistan become independent?",
      "Who presented the idea of a separate homeland in 1930?",
      "Why was the All-India Muslim League formed?",
    ],
  },
  {
    subjectId: "pak-studies",
    topicId: "quaid-e-azam",
    explanation:
      "Quaid-e-Azam Muhammad Ali Jinnah is the founder of Pakistan. He was born in Karachi on 25 December 1876. He became a famous lawyer and later the leader of the All-India Muslim League. Through his honesty, hard work and powerful arguments, he won a separate homeland for the Muslims of the subcontinent without an armed war. He became Pakistan's first Governor-General in 1947. His motto for the nation was 'Unity, Faith, Discipline' (Ittehad, Yaqeen, Tanzeem). He passed away on 11 September 1948 and his mausoleum (Mazar-e-Quaid) is in Karachi.",
    keyConcepts: ["born 25 December 1876 in Karachi", "lawyer and Muslim League leader", "founder of Pakistan", "first Governor-General", "Unity, Faith, Discipline", "died 11 September 1948"],
    learningObjectives: [
      "State when and where Quaid-e-Azam was born",
      "Describe his role in the creation of Pakistan",
      "Recall his motto: Unity, Faith, Discipline",
      "Name the position he held after independence",
    ],
    commonMisconceptions: [
      "Confusing Quaid-e-Azam's birthday with Independence Day",
      "Thinking he was Pakistan's first Prime Minister (he was Governor-General; Liaquat Ali Khan was PM)",
      "Mixing up his motto's three words",
    ],
    sampleQuestions: [
      "When and where was Quaid-e-Azam born?",
      "What are the three words of Quaid-e-Azam's motto?",
      "What position did Quaid-e-Azam hold after Pakistan was created?",
      "Why is Quaid-e-Azam called the founder of Pakistan?",
    ],
  },
  {
    subjectId: "pak-studies",
    topicId: "geography",
    explanation:
      "Pakistan has four provinces — Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan — plus Islamabad (the capital) and the northern areas of Gilgit-Baltistan and Azad Kashmir. In the north are the world's great mountain ranges: the Karakoram, Himalayas and Hindu Kush; K2, the world's second-highest mountain (8,611 m), is in Pakistan. The mighty Indus River flows from the north through the whole country to the Arabian Sea, watering our fields. Balochistan is the largest province by area; Punjab has the most people. The south has the hot Thar desert and the coastline near Karachi and Gwadar.",
    keyConcepts: ["four provinces + Islamabad", "K2 and the northern mountain ranges", "Indus River system", "Arabian Sea coastline", "Thar desert", "largest province (area) vs most populated"],
    learningObjectives: [
      "Name the four provinces and the capital of Pakistan",
      "Locate Pakistan's main mountains, river and sea",
      "State which province is largest by area and which has the most people",
      "Explain why the Indus River is important",
    ],
    commonMisconceptions: [
      "Thinking Karachi or Lahore is the capital of Pakistan",
      "Thinking Mount Everest is in Pakistan (K2 is)",
      "Confusing the largest province by area (Balochistan) with the most populated (Punjab)",
    ],
    sampleQuestions: [
      "Name the four provinces of Pakistan.",
      "What is the capital city of Pakistan?",
      "Which is the highest mountain in Pakistan and how high is it?",
      "Which river is called the lifeline of Pakistan? Why?",
    ],
  },
  {
    subjectId: "pak-studies",
    topicId: "national-symbols",
    explanation:
      "National symbols represent Pakistan's identity. The flag is dark green with a white stripe, a white crescent and a five-pointed star: green stands for the Muslim majority, white for minorities, the crescent for progress and the star for light and knowledge. The national anthem 'Pak Sarzamin' was written by Hafeez Jalandhari and composed by Ahmed G. Chagla. Allama Muhammad Iqbal is the national poet. Other symbols: national language — Urdu; national animal — Markhor; national bird — Chukar partridge; national flower — Jasmine (Chambeli); national sport — field hockey; national tree — Deodar; national mosque — Faisal Mosque in Islamabad.",
    keyConcepts: ["flag colours and their meaning", "national anthem and its writer", "Allama Iqbal — national poet", "Markhor, Chukar, Jasmine", "Urdu — national language", "field hockey — national sport"],
    learningObjectives: [
      "Describe the parts of the national flag and their meaning",
      "Name the writer of the national anthem and the national poet",
      "Recall the national animal, bird, flower and sport",
      "Explain why national symbols are important",
    ],
    commonMisconceptions: [
      "Thinking cricket is the national sport (it is field hockey)",
      "Thinking the white stripe has no meaning",
      "Confusing the anthem's writer with the national poet",
    ],
    sampleQuestions: [
      "What do the green and white colours of our flag stand for?",
      "Who wrote the national anthem of Pakistan?",
      "What is the national animal of Pakistan?",
      "Which sport is the national sport of Pakistan?",
    ],
  },

  /* -------------------------------- Islamiat -------------------------------- */
  {
    subjectId: "islamiat",
    topicId: "pillars",
    explanation:
      "Islam stands on five pillars. 1) Shahadah: declaring that there is no god but Allah and Muhammad ﷺ is His Messenger — this is the door to Islam. 2) Salah: praying five times a day (Fajr, Zuhr, Asr, Maghrib, Isha). 3) Zakat: giving 2.5% of saved wealth to the poor once a year, if you have enough savings. 4) Sawm: fasting in the month of Ramadan from dawn (Sehri) to sunset (Iftar). 5) Hajj: the pilgrimage to Makkah once in a lifetime for those who can afford it and are healthy. Together the pillars build faith, discipline, kindness and unity.",
    keyConcepts: ["Shahadah", "Salah — five daily prayers", "Zakat — 2.5% for the poor", "Sawm — fasting in Ramadan", "Hajj — pilgrimage to Makkah"],
    learningObjectives: [
      "Name the five pillars of Islam in order",
      "State how many times a day Muslims pray and name the prayers",
      "Explain who gives Zakat and who receives it",
      "Say in which month Muslims fast and when Hajj is performed",
    ],
    commonMisconceptions: [
      "Thinking Zakat is any small charity (it is a fixed yearly duty on savings)",
      "Thinking fasting means no food for the whole day and night",
      "Thinking Hajj is compulsory for everyone regardless of means",
    ],
    sampleQuestions: [
      "What are the five pillars of Islam?",
      "How many times a day do Muslims pray? Name the prayers.",
      "In which month do Muslims fast?",
      "What is Zakat and who should receive it?",
    ],
  },
  {
    subjectId: "islamiat",
    topicId: "akhlaq",
    explanation:
      "Akhlaq means good character and manners. Islam teaches honesty (sach bolna) — the Prophet ﷺ was called As-Sadiq (the truthful) and Al-Amin (the trustworthy) even before prophethood. Respect for parents, teachers and elders is a duty; kindness to the young, to neighbours and to animals is rewarded. Islam teaches us to keep promises, return what we borrow, avoid backbiting and lying, share with the needy, and greet others with Salam and a smile — the Prophet ﷺ said smiling at your brother is charity (sadaqah).",
    keyConcepts: ["honesty (As-Sadiq, Al-Amin)", "respect for parents and elders", "kindness to neighbours and animals", "keeping promises", "avoiding lying and backbiting", "Salam and smiling as sadaqah"],
    learningObjectives: [
      "Explain why honesty is central in Islam",
      "Give examples of respecting parents and elders in daily life",
      "Describe kind behaviour towards neighbours and animals",
      "Name the two titles of the Prophet ﷺ that show his truthfulness",
    ],
    commonMisconceptions: [
      "Thinking good akhlaq is only for adults",
      "Thinking small lies are acceptable",
      "Thinking worship matters but manners do not",
    ],
    sampleQuestions: [
      "What two titles did the people of Makkah give the Prophet ﷺ for his character?",
      "How can a student show respect to parents and teachers?",
      "Why is backbiting harmful?",
      "Give one example of kindness to animals.",
    ],
  },
  {
    subjectId: "islamiat",
    topicId: "seerat",
    explanation:
      "Seerat-un-Nabi ﷺ is the life story of the Prophet Muhammad ﷺ. He was born in Makkah in 571 CE in the Year of the Elephant. His father Abdullah passed away before his birth and his mother Amina in his childhood; his grandfather Abdul Muttalib and then his uncle Abu Talib raised him. He was famous for honesty as a trader. At age 40, he received the first revelation in the Cave of Hira through the angel Jibreel (AS). After 13 years of preaching in Makkah, he migrated to Madinah in 622 CE (the Hijrah — the start of the Islamic calendar). He built the Muslim community in Madinah, conquered Makkah peacefully in 630 CE, and passed away in Madinah in 632 CE.",
    keyConcepts: ["born 571 CE in Makkah", "known as Sadiq and Amin", "first revelation at 40 in Cave of Hira", "Hijrah to Madinah 622 CE", "peaceful conquest of Makkah", "passed away 632 CE in Madinah"],
    learningObjectives: [
      "State when and where the Prophet ﷺ was born",
      "Describe the first revelation in the Cave of Hira",
      "Explain what the Hijrah is and why it matters",
      "Put the key events of the Seerat in order",
    ],
    commonMisconceptions: [
      "Confusing Makkah events with Madinah events",
      "Thinking the Islamic calendar starts from the Prophet's ﷺ birth (it starts from the Hijrah)",
      "Mixing up the ages and dates of key events",
    ],
    sampleQuestions: [
      "Where and in which year was the Prophet Muhammad ﷺ born?",
      "What happened in the Cave of Hira?",
      "What is the Hijrah, and which calendar begins from it?",
      "In which city did the Prophet ﷺ pass away?",
    ],
  },
  {
    subjectId: "islamiat",
    topicId: "dua",
    explanation:
      "Duas are short supplications Muslims recite in daily life to remember Allah. Before eating we say 'Bismillah' (in the name of Allah); after eating, 'Alhamdulillah' (all praise is for Allah). Before sleeping: 'Allahumma bismika amutu wa ahya' (O Allah, in Your name I die and live). On waking: 'Alhamdulillahil-lazi ahyana...' thanking Allah for the new day. When starting any good work we say Bismillah; when entering the home we greet with Salam. Saying 'JazakAllah' thanks a person, and 'InshaAllah' means 'if Allah wills' for future plans. Duas keep our hearts connected to Allah throughout the day.",
    keyConcepts: ["Bismillah before eating/starting", "Alhamdulillah after eating", "sleeping and waking duas", "Salam when entering home", "InshaAllah and JazakAllah", "meaning matters, not just words"],
    learningObjectives: [
      "Recite the duas for eating, sleeping and waking",
      "Say the meaning of Bismillah and Alhamdulillah",
      "Know when to say InshaAllah and JazakAllah",
      "Explain why we recite duas daily",
    ],
    commonMisconceptions: [
      "Reciting duas without knowing their meanings",
      "Thinking duas are only for the mosque or special days",
      "Confusing which dua belongs to which occasion",
    ],
    sampleQuestions: [
      "What do we say before we start eating, and what does it mean?",
      "What is the dua after finishing a meal?",
      "When do we say 'InshaAllah'?",
      "Why should we learn the meanings of the duas we recite?",
    ],
  },

  /* ---------------------------- Computer Science ---------------------------- */
  {
    subjectId: "computer",
    topicId: "computer-parts",
    explanation:
      "A computer has hardware (parts you can touch) and software (programs you cannot touch). Input devices send information INTO the computer: keyboard, mouse, microphone, scanner. Output devices bring information OUT: monitor, printer, speakers. The CPU (Central Processing Unit) is the brain — it does all the thinking and calculations. Memory stores data: RAM is fast temporary memory that clears when power goes off; the hard disk / storage keeps files permanently. Software examples: Windows, games, MS Word — instructions that tell the hardware what to do.",
    keyConcepts: ["hardware vs software", "input devices", "output devices", "CPU — the brain", "RAM vs permanent storage"],
    learningObjectives: [
      "Sort devices into input and output",
      "Explain the difference between hardware and software",
      "Describe the job of the CPU",
      "Tell the difference between RAM and hard-disk storage",
    ],
    commonMisconceptions: [
      "Thinking the monitor or the CPU box is 'the whole computer'",
      "Calling software something you can touch",
      "Thinking files saved on the hard disk disappear when the computer turns off (that is RAM)",
    ],
    sampleQuestions: [
      "Is a keyboard an input device or an output device?",
      "Which part of the computer is called its brain?",
      "What is the difference between hardware and software? Give one example of each.",
      "What happens to data in RAM when the computer is switched off?",
    ],
  },
  {
    subjectId: "computer",
    topicId: "internet-safety",
    explanation:
      "The internet is useful but must be used safely. A strong password is long, mixes letters, numbers and symbols, and is never shared with anyone except parents — not even best friends. Personal information (full name, home address, school name, phone number, photos) should never be shared with strangers online. Not everyone online is who they claim to be — never agree to meet an online stranger. Beware of suspicious links and 'free prize' messages: they can be phishing (tricks to steal information). If anything online feels wrong, scary or too good to be true, stop and tell a parent or teacher immediately.",
    keyConcepts: ["strong passwords", "keeping personal information private", "online strangers", "phishing and fake prize links", "telling a trusted adult"],
    learningObjectives: [
      "Describe what makes a password strong",
      "List the personal details that must stay private online",
      "Recognise a suspicious message or link",
      "Say what to do when something online feels wrong",
    ],
    commonMisconceptions: [
      "Thinking a pet's name or '123456' is a fine password",
      "Believing online friends are always real friends",
      "Thinking free-prize messages are genuine",
    ],
    sampleQuestions: [
      "Which password is stronger: 'ali123' or 'Gr8!Lahore#77'? Why?",
      "Name three personal details you should never share online.",
      "You get a message saying you won a free phone — what should you do?",
      "Who should you tell if something online scares you?",
    ],
  },
  {
    subjectId: "computer",
    topicId: "coding-basics",
    explanation:
      "A program is a list of step-by-step instructions a computer follows exactly — like a recipe for biryani. This step-by-step plan is called an algorithm. Computers cannot guess: instructions must be clear and in the correct order. A sequence runs steps one after another. A loop repeats steps (write 'I love Pakistan' 10 times = one instruction in a loop). A condition makes decisions with if/else: IF it is raining, take an umbrella, ELSE wear a cap. Programmers write these instructions in programming languages, and finding and fixing mistakes in a program is called debugging.",
    keyConcepts: ["program = step-by-step instructions", "algorithm", "sequence", "loop (repeat)", "condition (if/else)", "debugging"],
    learningObjectives: [
      "Explain what a program and an algorithm are in simple words",
      "Write the steps of a daily task as an algorithm",
      "Explain what a loop does with an example",
      "Explain an if/else decision with a real-life example",
    ],
    commonMisconceptions: [
      "Thinking computers understand vague instructions like humans do",
      "Thinking the order of steps does not matter",
      "Thinking coding is only for adults or geniuses",
    ],
    sampleQuestions: [
      "What is an algorithm? Give an example from daily life.",
      "You must write your name 100 times on screen. Which idea saves you effort: sequence or loop?",
      "Make an if/else rule for: carrying an umbrella.",
      "What do we call finding and fixing mistakes in a program?",
    ],
  },
  {
    subjectId: "computer",
    topicId: "data-types",
    explanation:
      "Data is information stored in a computer: text, numbers, pictures, sound and video. Different kinds of files hold different data — .txt/.docx for text, .jpg/.png for pictures, .mp3 for sound, .mp4 for video. Files are kept organised inside folders, like school copies kept in different bags. Storage size is measured in bytes: KB (kilobyte) < MB (megabyte) < GB (gigabyte) — a photo may be a few MB while a movie can be more than 1 GB. Data can be stored on the computer's own disk, on USB drives or memory cards, or online in 'the cloud' (storage you reach through the internet).",
    keyConcepts: ["types of data: text, number, image, audio, video", "file types (.docx, .jpg, .mp3, .mp4)", "files and folders", "KB < MB < GB", "USB and cloud storage"],
    learningObjectives: [
      "Name the main kinds of data with examples",
      "Match common file types to their data kind",
      "Order KB, MB and GB from smallest to biggest",
      "Explain what folders and cloud storage are for",
    ],
    commonMisconceptions: [
      "Thinking a KB is bigger than a GB",
      "Thinking deleting a file's icon always removes it everywhere (copies may exist)",
      "Thinking the cloud is literally in the sky",
    ],
    sampleQuestions: [
      "Which is bigger: 500 KB or 2 MB?",
      "What kind of data does a .jpg file usually hold?",
      "Why do we keep files inside folders?",
      "What does storing a file 'in the cloud' mean?",
    ],
  },
];

const DEEP_CURRICULUM: Record<string, Partial<CurriculumTopic>> = {
  "science/plant-structure": { studySummary: "Plants are organised organs: roots absorb water and minerals, stems support and transport, leaves exchange gases and make food, and flowers support reproduction.", keyConcepts: ["root system and root hairs", "xylem and phloem", "stem vascular bundles", "leaf epidermis and mesophyll", "stomata and guard cells", "flower reproductive parts"], importantTerms: ["root cap", "root hairs", "xylem", "phloem", "palisade mesophyll", "spongy mesophyll", "stomata", "guard cells", "anther", "stigma", "ovary", "ovules"], keyTakeaways: ["Root hairs increase surface area so a root can absorb water and mineral ions efficiently.", "Xylem transports water and minerals upward; phloem transports sugars made in leaves to other parts.", "Palisade mesophyll cells contain many chloroplasts, while spongy mesophyll has air spaces for gas exchange.", "Stomata are controlled by guard cells and allow carbon dioxide in while oxygen and water vapour move out.", "A flower's anther makes pollen; stigma, style, ovary and ovules are involved in reproduction."], teachingSequence: ["Plant organs and their linked functions", "Root regions and absorption", "Stem support and vascular transport", "Leaf layers and photosynthesis", "Stomata and gas exchange", "Flower parts and reproduction", "Apply structure to function"] },
  "science/photosynthesis": { studySummary: "Photosynthesis is a chemical process in chloroplasts: light energy absorbed by chlorophyll helps convert carbon dioxide and water into glucose, releasing oxygen.", keyConcepts: ["chloroplasts and chlorophyll", "stomata and carbon dioxide", "xylem water transport", "glucose uses and transport", "oxygen as a product", "word and balanced equations"], importantTerms: ["chloroplast", "chlorophyll", "stomata", "xylem", "phloem", "glucose", "carbon dioxide", "oxygen"], keyTakeaways: ["Chlorophyll absorbs light energy inside chloroplasts; it does not create sunlight.", "Carbon dioxide enters mainly through stomata, while water reaches leaves through xylem.", "Glucose can be used in respiration, stored as starch, or transported in phloem.", "Oxygen is released as a product of photosynthesis, not used as an input."], teachingSequence: ["Purpose and location of photosynthesis", "Inputs and how they reach a leaf", "Chlorophyll and light energy", "Products and their uses", "Equation and gas-exchange application"] },
  "science/human-digestive-system": { studySummary: "The digestive system breaks food into small soluble molecules, absorbs nutrients into the blood, and removes undigested waste.", keyConcepts: ["mechanical and chemical digestion", "enzymes", "peristalsis", "small intestine absorption", "villi", "large intestine water absorption"], importantTerms: ["incisors", "molars", "saliva", "enzyme", "oesophagus", "peristalsis", "stomach", "small intestine", "villi", "large intestine"], keyTakeaways: ["Digestion begins in the mouth: teeth mechanically break food while saliva begins chemical digestion.", "Peristalsis pushes food through the alimentary canal using wave-like muscle contractions.", "Most nutrient absorption happens in the small intestine; villi provide a large surface area.", "The large intestine mainly absorbs water from undigested material."], teachingSequence: ["Route of food through the body", "Mechanical versus chemical digestion", "Enzymes and the stomach", "Small intestine and villi", "Large intestine and egestion", "Apply nutrient absorption"] },
  "science/human-respiratory-system": { studySummary: "The respiratory system moves air into the lungs and exchanges oxygen and carbon dioxide between the alveoli and the blood.", keyConcepts: ["air pathway", "diaphragm movement", "alveoli", "gas exchange", "oxygen transport"], importantTerms: ["trachea", "bronchi", "bronchioles", "alveoli", "diaphragm", "diffusion", "capillaries"], keyTakeaways: ["Air travels through the trachea, bronchi and bronchioles to alveoli.", "The diaphragm contracts to increase chest volume during inhalation.", "Alveoli have thin walls and a large surface area, allowing gases to diffuse efficiently.", "Oxygen enters the blood while carbon dioxide leaves it at the alveoli."], teachingSequence: ["Air pathway", "Breathing movements", "Alveoli structure", "Gas exchange by diffusion", "Link to circulation"] },
  "science/motion": { studySummary: "Motion describes a change in position relative to a reference point; it can be measured using distance, displacement, time and speed.", keyConcepts: ["reference point", "distance", "displacement", "speed", "distance-time graph"], importantTerms: ["motion", "reference point", "distance", "displacement", "speed", "scalar", "vector"], keyTakeaways: ["Distance is total path travelled, while displacement includes straight-line change in position and direction.", "Speed is calculated as distance divided by time.", "A steeper distance-time graph shows greater speed; a horizontal line shows no motion."], teachingSequence: ["Reference points", "Distance and displacement", "Calculating speed", "Reading distance-time graphs", "Compare real journeys"] },
  "science/force": { studySummary: "A force is a push or pull that can change an object's motion, direction, shape, or speed; balanced forces do not change motion.", keyConcepts: ["contact and non-contact forces", "balanced forces", "unbalanced forces", "resultant force", "friction"], importantTerms: ["force", "newton", "resultant force", "friction", "gravity", "magnetic force"], keyTakeaways: ["Forces are measured in newtons (N).", "Balanced forces have zero resultant force, so motion does not change.", "An unbalanced force changes speed or direction.", "Friction opposes motion and can be useful or unwanted."], teachingSequence: ["Effects and units of force", "Contact and non-contact forces", "Balanced versus unbalanced forces", "Friction and real-life applications"] },
  "science/electricity": { studySummary: "Electric current is the movement of charge through a complete circuit; components work only when the path is closed.", keyConcepts: ["current and charge", "closed circuit", "cell and voltage", "series circuit", "conductors and insulators", "electrical safety"], importantTerms: ["current", "electron", "circuit", "cell", "switch", "conductor", "insulator", "series circuit"], keyTakeaways: ["A cell provides energy that pushes charge around a complete circuit.", "Opening a switch breaks the path, so current stops everywhere in a simple series circuit.", "Copper conducts well; plastic insulation reduces the risk of electric shock.", "Current is not used up by a bulb; energy is transferred by the circuit."], teachingSequence: ["Charge and current", "Build a closed circuit", "Switches and series circuits", "Conductors versus insulators", "Safety and troubleshooting"] },
  "science/atoms-and-molecules": { studySummary: "All matter is made of atoms; atoms join in fixed arrangements to form molecules and compounds.", keyConcepts: ["atom", "molecule", "element", "compound", "chemical formula"], importantTerms: ["atom", "molecule", "element", "compound", "chemical bond", "formula"], keyTakeaways: ["An element contains one type of atom.", "A molecule contains two or more atoms joined together.", "A compound contains atoms of different elements chemically joined in a fixed ratio.", "A formula such as H₂O shows the types and number of atoms in a molecule."], teachingSequence: ["Particle model of matter", "Atoms and elements", "Molecules and compounds", "Reading simple formulae", "Compare mixtures and compounds"] },
  "computer/computer-networks": { studySummary: "A computer network connects devices so they can share data, resources and services using agreed communication rules.", keyConcepts: ["LAN and WAN", "router", "server and client", "data packets", "network safety"], importantTerms: ["network", "LAN", "WAN", "router", "server", "client", "packet", "IP address"], keyTakeaways: ["A LAN covers a small area such as a school; a WAN connects networks across large distances.", "Routers direct data packets between networks.", "Clients request services; servers provide shared files, websites or other services.", "Networks need strong passwords and safe sharing practices."], teachingSequence: ["Why networks exist", "LAN versus WAN", "Clients, servers and routers", "Packets and addresses", "Safe network use"] },
  "computer/programming-basics": { studySummary: "Programming is writing precise algorithms in a language a computer can execute; programs use sequence, selection and repetition to solve problems.", keyConcepts: ["algorithm", "sequence", "variable", "condition", "loop", "debugging"], importantTerms: ["program", "algorithm", "syntax", "variable", "condition", "loop", "debugging"], keyTakeaways: ["An algorithm is an ordered, unambiguous method for solving a problem.", "Sequence runs instructions in order; conditions choose between paths; loops repeat steps.", "Variables store values that can change while a program runs.", "Debugging means locating, understanding and correcting errors."], teachingSequence: ["Algorithms and precise instructions", "Sequence", "Variables and data", "Conditions", "Loops", "Debugging a simple program"] },
  "computer/variables": { studySummary: "A variable is a named storage location whose value can be used and changed while a program runs.", keyConcepts: ["variable name", "assignment", "value", "updating a variable"], importantTerms: ["variable", "value", "assignment", "identifier"], keyTakeaways: ["Variables store values so programs can use information later.", "Assignment gives a value to a variable; updating replaces its current value.", "Clear variable names make programs easier to read and debug."], teachingSequence: ["Why programs need stored data", "Names and values", "Assignment", "Updating values", "Trace a simple program"] },
  "computer/conditions": { studySummary: "Conditions allow a program to choose different actions by testing whether an expression is true or false.", keyConcepts: ["Boolean result", "if", "else", "comparison", "branching"], importantTerms: ["condition", "Boolean", "if", "else", "comparison operator"], keyTakeaways: ["A condition produces true or false.", "An if statement runs code only when its condition is true.", "Else provides an alternative path when the condition is false."], teachingSequence: ["True and false decisions", "Comparisons", "If branches", "Else branches", "Predict program output"] },
  "computer/loops": { studySummary: "Loops repeat instructions efficiently when a task must happen several times or until a condition changes.", keyConcepts: ["repetition", "counter", "loop condition", "infinite loop"], importantTerms: ["loop", "iteration", "counter", "condition", "infinite loop"], keyTakeaways: ["A loop avoids writing the same instruction repeatedly.", "Each repeat is an iteration.", "A loop needs a stopping condition or changing counter to avoid running forever."], teachingSequence: ["Repeated tasks", "Iterations", "Counters", "Stopping conditions", "Spot an infinite loop"] },
  "maths/algebraic-expressions": { studySummary: "Algebraic expressions combine variables, constants and operations to represent quantities and relationships.", keyConcepts: ["variable", "constant", "coefficient", "like terms", "simplification"], importantTerms: ["expression", "variable", "constant", "coefficient", "like terms"], keyTakeaways: ["A variable represents a quantity that can change or be unknown.", "A coefficient multiplies a variable, so 3x means 3 × x.", "Only like terms can be combined when simplifying."], teachingSequence: ["Variables and constants", "Translating words into expressions", "Coefficients", "Like terms", "Simplifying and checking"] },
  "maths/linear-equations": { studySummary: "A linear equation states that two expressions are equal; solving finds the value that keeps both sides balanced.", keyConcepts: ["equation", "inverse operation", "balance", "solution", "substitution check"], importantTerms: ["equation", "variable", "inverse operation", "solution", "substitution"], keyTakeaways: ["An equation is like a balance: an operation on one side must also be done on the other.", "Inverse operations undo each other, such as adding/subtracting or multiplying/dividing.", "Substitution checks whether a proposed solution makes both sides equal."], teachingSequence: ["Balance idea", "One-step equations", "Two-step equations", "Checking by substitution", "Word-problem application"] },
  "maths/lines-and-angles": { studySummary: "Geometry describes relationships between lines and angles; angle rules allow unknown measures to be calculated logically.", keyConcepts: ["line relationships", "complementary angles", "supplementary angles", "vertically opposite angles", "parallel lines"], importantTerms: ["acute", "obtuse", "complementary", "supplementary", "transversal", "vertically opposite"], keyTakeaways: ["Angles on a straight line add to 180°.", "Angles around a point add to 360°.", "Vertically opposite angles are equal.", "Parallel lines cut by a transversal create equal corresponding and alternate angles."], teachingSequence: ["Types of angles", "Straight line and around-a-point rules", "Vertically opposite angles", "Parallel-line relationships", "Solve a diagram"] },
  "maths/probability": { studySummary: "Probability measures how likely an event is, from impossible to certain, and can be expressed as a fraction, decimal or percentage.", keyConcepts: ["outcomes", "sample space", "favourable outcomes", "probability scale", "experimental probability"], importantTerms: ["probability", "outcome", "sample space", "event", "favourable outcome"], keyTakeaways: ["Probability is the number of favourable outcomes divided by total equally likely outcomes.", "A probability of 0 means impossible; 1 means certain.", "Experimental results can differ from theoretical probability, especially in a small number of trials."], teachingSequence: ["Likelihood scale", "Outcomes and sample spaces", "Calculate simple probability", "Theoretical versus experimental probability", "Apply to a real event"] },
  "computer/artificial-intelligence": { studySummary: "Artificial intelligence uses computer systems to perform tasks such as recognising patterns, making predictions or generating content from data and rules.", keyConcepts: ["data and patterns", "training examples", "prediction", "bias", "human oversight"], importantTerms: ["artificial intelligence", "model", "data", "training", "pattern", "bias", "prediction"], keyTakeaways: ["AI systems find patterns in data; they do not understand exactly like a human.", "Machine-learning models learn from examples, so poor or biased data can lead to unfair results.", "AI predictions can be useful but should be checked by people, especially in important decisions.", "Responsible AI includes privacy, fairness and safe use."], teachingSequence: ["What AI can and cannot do", "Data and pattern recognition", "Training and prediction", "Bias and limitations", "Responsible use"] },
};

export function getCurriculum(
  subjectId: string | null | undefined,
  topicId: string | null | undefined
): CurriculumTopic | undefined {
  const existing = CURRICULUM.find((c) => c.subjectId === subjectId && c.topicId === topicId);
  const deep = subjectId && topicId ? DEEP_CURRICULUM[`${subjectId}/${topicId}`] : undefined;
  if (existing) return deep ? { ...existing, ...deep } : existing;

  const topic = getTopic(subjectId, topicId);
  if (!topic || !subjectId || !topicId) return undefined;

  // Every catalogue topic has deterministic local lesson context. The detailed
  // entries above remain the source for their matching topics; this keeps a
  // newly added selectable topic from reaching the tutor without curriculum.
  const fallback = {
    subjectId,
    topicId,
    explanation: `${topic.name}: ${topic.description}`,
    keyConcepts: topic.subtopics?.length ? topic.subtopics : [topic.name],
    learningObjectives: [
      `Explain the main idea of ${topic.name} in simple words.`,
      `Use a familiar Grade 6–8 example related to ${topic.name}.`,
    ],
    commonMisconceptions: [
      `Confusing ${topic.name} with a related idea without explaining the difference.`,
    ],
    sampleQuestions: [
      `What is the main idea of ${topic.name}?`,
      `Can you give one everyday example of ${topic.name}?`,
    ],
  };
  return deep ? { ...fallback, ...deep } : fallback;
}
