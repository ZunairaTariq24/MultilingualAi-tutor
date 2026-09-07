import type { Subject, SubjectCategory, Topic } from "./types";

const topic = (id: string, name: string, emoji: string, description: string, subtopics?: string[]): Topic => ({
  id, name, nameUr: name, emoji, description, subtopics,
});

const category = (id: string, name: string, emoji: string, topics: Topic[]): SubjectCategory => ({
  id, name, nameUr: name, emoji, topics,
});

function subject(id: string, name: string, nameUr: string, emoji: string, color: string, categories: SubjectCategory[]): Subject {
  return { id, name, nameUr, emoji, color, categories, topics: categories.flatMap((item) => item.topics) };
}

export const SUBJECTS: Subject[] = [
  subject("maths", "Mathematics", "ریاضی", "📐", "from-sky-500 to-blue-600", [
    category("numbers", "Numbers", "🔢", [
      topic("number-systems", "Number Systems", "🔢", "Understand how different kinds of numbers are organized."),
      topic("natural-numbers", "Natural Numbers", "1️⃣", "Counting numbers and their everyday uses."),
      topic("whole-numbers", "Whole Numbers", "0️⃣", "Numbers including zero, with no fractions or decimals."),
      topic("integers", "Integers", "➕", "Positive numbers, negative numbers, and zero."),
      topic("fractions", "Fractions", "🍕", "Parts of a whole, adding and comparing fractions."),
      topic("decimals", "Decimals", "🔟", "Tenths, hundredths, and decimal calculations."),
      topic("rational-numbers", "Rational Numbers", "➗", "Numbers that can be written as a fraction."),
      topic("ratio-and-proportion", "Ratio and Proportion", "⚖️", "Compare quantities and solve equivalent ratios."),
      topic("percentages", "Percentages", "💯", "Percentages, discounts, and exam marks."),
      topic("profit-and-loss", "Profit and Loss", "💸", "Find profit, loss, cost price, and selling price."),
    ]),
    category("algebra", "Algebra", "🧮", [
      topic("algebraic-expressions", "Algebraic Expressions", "🧮", "Use variables, constants, and operations in expressions."),
      topic("simplification", "Simplification", "✂️", "Simplify numerical and algebraic expressions step by step."),
      topic("linear-equations", "Linear Equations", "➗", "Solve one-variable equations by keeping both sides balanced."),
      topic("word-problems", "Word Problems", "📝", "Turn real-life situations into mathematical steps."),
      topic("patterns-and-sequences", "Patterns and Sequences", "🔁", "Find rules in number patterns and sequences."),
    ]),
    category("geometry", "Geometry", "📐", [
      topic("lines-and-angles", "Lines and Angles", "📏", "Identify lines, rays, and the angles they form."),
      topic("triangles", "Triangles", "🔺", "Classify triangles and use their angle properties."),
      topic("quadrilaterals", "Quadrilaterals", "▭", "Explore squares, rectangles, parallelograms, and more."),
      topic("polygons", "Polygons", "⬡", "Recognize closed shapes with many straight sides."),
      topic("circles", "Circles", "⭕", "Learn the parts and basic properties of a circle."),
      topic("coordinate-geometry", "Coordinate Geometry", "📍", "Plot and read points on a coordinate grid."),
    ]),
    category("measurement", "Measurement", "📏", [
      topic("perimeter", "Perimeter", "🧵", "Measure the distance around a shape."),
      topic("area", "Area", "⬜", "Measure the space inside a flat shape."),
      topic("volume", "Volume", "🧊", "Measure the space inside a solid object."),
      topic("surface-area", "Surface Area", "📦", "Find the total area of a solid object's outer faces."),
    ]),
    category("data-and-probability", "Data & Probability", "📊", [
      topic("sets", "Sets", "🧺", "Group objects or numbers using clear rules."),
      topic("data-handling", "Data Handling", "📊", "Collect, organize, and display data."),
      topic("statistics", "Statistics", "📈", "Use data to describe and compare information."),
      topic("mean", "Mean", "➗", "Find the average of a group of values."),
      topic("median", "Median", "↔️", "Find the middle value in ordered data."),
      topic("mode", "Mode", "🔂", "Find the value that occurs most often."),
      topic("probability", "Probability", "🎲", "Describe how likely an event is to happen."),
    ]),
  ]),
  subject("science", "Science", "سائنس", "🔬", "from-emerald-500 to-teal-600", [
    category("biology", "Biology", "🌿", [
      topic("cell-and-cell-structure", "Cell and Cell Structure", "🔬", "Learn about the basic units that make living things."), topic("classification-of-living-things", "Classification of Living Things", "🦠", "Group living things by their shared features."), topic("plant-structure", "Plant Structure", "🌱", "Understand the jobs of roots, stems, leaves, and flowers."), topic("photosynthesis", "Photosynthesis", "☀️", "How plants make food using sunlight."), topic("respiration", "Respiration", "🫁", "How living things release energy from food."), topic("reproduction-in-plants", "Reproduction in Plants", "🌼", "How plants make seeds and new plants."), topic("human-digestive-system", "Human Digestive System", "🍽️", "Follow food through the body and learn how nutrients are absorbed."), topic("human-respiratory-system", "Human Respiratory System", "🫁", "Learn how lungs exchange oxygen and carbon dioxide."), topic("circulatory-system", "Circulatory System", "🫀", "Understand how the heart and blood move materials around the body."), topic("excretory-system", "Excretory System", "💧", "Learn how the body removes wastes."), topic("nervous-system", "Nervous System", "🧠", "Explore how the brain, nerves, and senses work together."), topic("skeletal-and-muscular-system", "Skeletal and Muscular System", "🦴", "Learn how bones and muscles support movement."), topic("microorganisms", "Microorganisms", "🦠", "Discover tiny living things and their uses."), topic("diseases-and-prevention", "Diseases and Prevention", "🩺", "Learn basic disease prevention and healthy habits."), topic("food-and-nutrition", "Food and Nutrition", "🥗", "Understand nutrients and a balanced diet."), topic("ecosystems", "Ecosystems", "🌍", "Study how living and non-living things interact."), topic("food-chains", "Food Chains", "🔗", "Trace how energy moves between living things."), topic("food-webs", "Food Webs", "🕸️", "Connect several food chains in one ecosystem."), topic("adaptation", "Adaptation", "🦎", "Learn how organisms survive in their habitats."), topic("environment-and-pollution", "Environment and Pollution", "♻️", "Explore pollution, its effects, and practical solutions."),
    ]),
    category("physics", "Physics", "⚙️", [
      topic("measurement", "Measurement", "📐", "Use standard units and measuring instruments."), topic("physical-quantities", "Physical Quantities", "⚖️", "Describe measurable properties such as length, mass, and time."), topic("motion", "Motion", "🏃", "Describe how an object's position changes."), topic("distance-and-displacement", "Distance and Displacement", "↔️", "Compare total path length with change in position."), topic("speed", "Speed", "🚲", "Relate distance travelled to time taken."), topic("force", "Force", "💪", "Explore pushes, pulls, and their effects."), topic("friction", "Friction", "🛞", "Understand the force that resists motion."), topic("work", "Work", "🧰", "Learn when force causes work in science."), topic("energy", "Energy", "⚡", "Explore forms and transfers of energy."), topic("power", "Power", "🔋", "Compare how quickly work is done."), topic("gravity", "Gravity", "🍎", "Understand the force that pulls objects toward Earth."), topic("pressure", "Pressure", "📌", "Relate force to the area it acts upon."), topic("heat", "Heat", "🔥", "Learn how thermal energy moves."), topic("temperature", "Temperature", "🌡️", "Measure how hot or cold something is."), topic("states-of-matter", "States of Matter", "🧊", "Compare solids, liquids, and gases."), topic("light", "Light", "💡", "Explore how light travels and helps us see."), topic("reflection", "Reflection", "🪞", "Learn how light bounces from surfaces."), topic("refraction", "Refraction", "🌈", "Learn why light bends in different materials."), topic("sound", "Sound", "🔊", "Explore how vibrations make sound."), topic("waves", "Waves", "〰️", "Describe waves as a way energy travels."), topic("electricity", "Electricity", "⚡", "Learn about electric current and safe use."), topic("electric-circuits", "Electric Circuits", "🔌", "Build the idea of a complete path for electric current."), topic("conductors-and-insulators", "Conductors and Insulators", "🧤", "Compare materials that let electricity pass with those that do not."), topic("magnetism", "Magnetism", "🧲", "Explore magnets and magnetic forces."), topic("simple-machines", "Simple Machines", "⚙️", "Learn how simple tools make work easier."),
    ]),
    category("chemistry", "Chemistry", "🧪", [
      topic("matter", "Matter", "🧪", "Understand that matter has mass and takes up space."), topic("chemical-states-of-matter", "States of Matter", "🧊", "Explore changes between solids, liquids, and gases in chemistry."), topic("physical-and-chemical-changes", "Physical and Chemical Changes", "🔄", "Tell reversible physical changes from new-substance chemical changes."), topic("elements", "Elements", "🧱", "Learn about substances made of one kind of atom."), topic("compounds", "Compounds", "🔗", "Learn how elements combine in fixed ratios."), topic("mixtures", "Mixtures", "🥣", "Explore substances combined without chemical bonding."), topic("atoms-and-molecules", "Atoms and Molecules", "⚛️", "Understand tiny particles that make matter."), topic("atomic-structure", "Atomic Structure", "⚛️", "Learn the basic parts of an atom."), topic("periodic-table", "Periodic Table", "🗂️", "Use the table that organizes elements."), topic("metals-and-non-metals", "Metals and Non-metals", "🔩", "Compare common properties of metals and non-metals."), topic("acids-and-bases", "Acids and Bases", "🧫", "Identify basic properties and safe everyday examples."), topic("salts", "Salts", "🧂", "Learn how salts can form through neutralization."), topic("solutions", "Solutions", "🥛", "Understand solutes, solvents, and dissolved mixtures."), topic("separation-of-mixtures", "Separation of Mixtures", "🧺", "Use filtration, evaporation, and other methods."), topic("chemical-reactions", "Chemical Reactions", "💥", "Recognize signs that new substances have formed."), topic("air", "Air", "🌬️", "Explore the gases in air and why they matter."), topic("water", "Water", "💧", "Learn key properties and uses of water."), topic("carbon-and-its-compounds", "Carbon and Its Compounds", "🖊️", "Explore carbon in everyday materials and fuels."), topic("fuels", "Fuels", "⛽", "Learn how fuels release useful energy."), topic("environmental-chemistry", "Environmental Chemistry", "🌱", "Connect chemistry to air, water, and pollution."),
    ]),
    category("earth-and-space-science", "Earth & Space Science", "🌎", [
      topic("earth-and-its-structure", "Earth and Its Structure", "🌍", "Learn about Earth's layers and surface."), topic("rocks-and-minerals", "Rocks and Minerals", "🪨", "Identify common rocks, minerals, and how they form."), topic("soil", "Soil", "🟫", "Explore soil layers, composition, and importance."), topic("water-cycle", "Water Cycle", "💧", "Follow water through evaporation, condensation, and precipitation."), topic("weather", "Weather", "🌦️", "Observe daily atmospheric conditions."), topic("climate", "Climate", "🌤️", "Compare long-term weather patterns in different places."), topic("atmosphere", "Atmosphere", "☁️", "Learn about the protective layers of gases around Earth."), topic("natural-resources", "Natural Resources", "🌳", "Explore useful materials provided by nature."), topic("renewable-and-non-renewable-resources", "Renewable and Non-renewable Resources", "♻️", "Compare resources that can and cannot be replaced quickly."), topic("solar-system", "Solar System", "🪐", "Explore the sun, planets, and their orbits."), topic("sun-moon-and-stars", "Sun, Moon and Stars", "🌙", "Compare objects seen in the sky."), topic("earth-sun-and-moon", "Earth, Sun and Moon", "🌞", "Learn how their movements affect life on Earth."), topic("eclipses", "Eclipses", "🌘", "Understand solar and lunar eclipses."), topic("space-exploration", "Space Exploration", "🚀", "Discover how people and robots explore space."), topic("natural-disasters", "Natural Disasters", "🌪️", "Learn about hazards and safe preparation."),
    ]),
  ]),
  subject("computer", "Computer Science", "کمپیوٹر سائنس", "💻", "from-slate-600 to-slate-800", [
    category("computer-fundamentals", "Computer Fundamentals", "🖥️", [
      topic("introduction-to-computers", "Introduction to Computers", "💻", "Understand what computers do and where we use them."), topic("computer-hardware", "Computer Hardware", "🖥️", "Learn about the physical parts of a computer."), topic("computer-software", "Computer Software", "📀", "Learn about programs that tell computers what to do."), topic("input-devices", "Input Devices", "⌨️", "Explore devices used to enter information."), topic("output-devices", "Output Devices", "🖨️", "Explore devices that present computer results."), topic("memory", "Memory", "🧠", "Understand working memory and computer memory."), topic("storage", "Storage", "💾", "Learn where files and data are kept."), topic("operating-systems", "Operating Systems", "⚙️", "Learn how an operating system manages a computer."), topic("files-and-folders", "Files and Folders", "📁", "Organize digital work safely and clearly."),
    ]),
    category("internet-and-digital-literacy", "Internet & Digital Literacy", "🌐", [
      topic("internet", "Internet", "🌐", "Understand how the internet connects people and information."), topic("web-and-websites", "Web and Websites", "🕸️", "Learn how websites and web pages are used."), topic("computer-networks", "Computer Networks", "🔗", "Explore how devices communicate with each other."), topic("cyber-safety", "Cyber Safety", "🔐", "Use passwords, privacy, and safe online habits."), topic("digital-citizenship", "Digital Citizenship", "🤝", "Use technology responsibly and respectfully."),
    ]),
    category("problem-solving", "Problem Solving", "🧩", [
      topic("algorithms", "Algorithms", "🪜", "Write clear, ordered instructions to solve a problem."), topic("flowcharts", "Flowcharts", "🔀", "Use symbols and arrows to show a process."), topic("problem-solving", "Problem Solving", "🧩", "Break a problem into manageable steps."),
    ]),
    category("programming", "Programming", "👩‍💻", [
      topic("programming-basics", "Programming Basics", "👩‍💻", "Learn how programs follow instructions."), topic("variables", "Variables", "📦", "Store information using named containers."), topic("data-types", "Data Types", "🔤", "Recognize text, numbers, and true/false values."), topic("conditions", "Conditions", "❓", "Make choices in a program using if and else."), topic("loops", "Loops", "🔁", "Repeat instructions efficiently."), topic("functions", "Functions", "🧰", "Group reusable instructions into named blocks."), topic("debugging", "Debugging", "🐞", "Find and fix mistakes in a program."),
    ]),
    category("data", "Data", "🗃️", [
      topic("databases", "Databases", "🗃️", "Organize related data for easy searching and use."), topic("information-and-data", "Information and Data", "📊", "Tell raw data apart from meaningful information."),
    ]),
    category("ai-and-emerging-technology", "AI & Emerging Technology", "🤖", [
      topic("artificial-intelligence", "Artificial Intelligence", "🤖", "Learn what AI is and where it is used."), topic("machine-learning-basics", "Machine Learning Basics", "📚", "Explore how systems learn patterns from examples."), topic("robotics", "Robotics", "🦾", "Discover how robots sense, decide, and act."), topic("emerging-technologies", "Emerging Technologies", "🚀", "Discuss new technologies and their possible impact."),
    ]),
  ]),
];

export function getSubject(id: string | null | undefined): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getTopic(subjectId: string | null | undefined, topicId: string | null | undefined): Topic | undefined {
  return getSubject(subjectId)?.topics.find((t) => t.id === topicId);
}
