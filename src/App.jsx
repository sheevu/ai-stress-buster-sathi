import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Flame,
  Frown,
  GraduationCap,
  Heart,
  House,
  Meh,
  Moon,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  Send,
  Smile,
  Sparkles,
  Sun,
  Timer,
  User,
  Users,
  Wind,
} from "lucide-react";

const UI = {
  bg: "linear-gradient(135deg, #0f172a 0%, #1f1147 45%, #0b2239 100%)",
  card: "rgba(255,255,255,0.08)",
  cardSoft: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.14)",
  text: "#f8fafc",
  muted: "rgba(226,232,240,0.72)",
  saffron: "#ff9933",
  indiaGreen: "#138808",
  cyan: "#22d3ee",
  violet: "#a78bfa",
  rose: "#fb7185",
};

const ROLE_OPTIONS = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "parent", label: "Parent", icon: Users },
  { id: "homemaker", label: "Homemaker", icon: House },
  { id: "other", label: "Other", icon: User },
];

const EMOTION_OPTIONS = [
  { id: "calm", label: "Calm", icon: Smile, color: "#34d399" },
  { id: "mixed", label: "Mixed", icon: Meh, color: "#fbbf24" },
  { id: "drained", label: "Drained", icon: Frown, color: "#fb7185" },
  { id: "overloaded", label: "Overloaded", icon: Flame, color: "#f97316" },
];

const SUPPORT_MODES = [
  {
    id: "vent",
    title: "Dil Se Baat",
    subtitle: "Safe emotional release",
    icon: Heart,
    accent: "linear-gradient(135deg,#fb7185,#f97316)",
  },
  {
    id: "cbt",
    title: "Thought Reframe",
    subtitle: "Psychology-based reframing",
    icon: Brain,
    accent: "linear-gradient(135deg,#22d3ee,#3b82f6)",
  },
  {
    id: "family",
    title: "Family Dynamics",
    subtitle: "Indian family conversation scripts",
    icon: Users,
    accent: "linear-gradient(135deg,#ff9933,#facc15)",
  },
  {
    id: "spiritual",
    title: "Tradition + Grounding",
    subtitle: "Breathwork + Indian wisdom",
    icon: Sparkles,
    accent: "linear-gradient(135deg,#a78bfa,#ec4899)",
  },
  {
    id: "ayurveda",
    title: "Ayurveda + Yoga",
    subtitle: "Healing through natural balance",
    icon: Wind,
    accent: "linear-gradient(135deg,#10b981,#059669)",
  },
  {
    id: "action",
    title: "Practical Plan",
    subtitle: "Personalized next 24-hour plan",
    icon: ChevronRight,
    accent: "linear-gradient(135deg,#34d399,#22c55e)",
  },
];

const CONCERN_PATTERNS = [
  { id: "academic", keys: ["exam", "study", "jee", "neet", "college", "marks", "result", "padhai"] },
  { id: "career", keys: ["job", "office", "boss", "salary", "interview", "career", "kaam", "startup"] },
  { id: "family", keys: ["family", "parents", "mummy", "papa", "ghar", "shaadi", "relatives", "sasural"] },
  { id: "relationship", keys: ["breakup", "relationship", "love", "boyfriend", "girlfriend", "heart", "dil"] },
  { id: "anxiety", keys: ["anxiety", "stress", "panic", "nervous", "ghabrahat", "darr", "worried"] },
  { id: "sadness", keys: ["sad", "lonely", "alone", "depressed", "udaas", "hopeless", "empty"] },
  { id: "finance", keys: ["money", "loan", "debt", "finance", "karz", "paise", "expenses"] },
];

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "self harm",
  "jaan dena",
  "marna chahta",
  "khud ko nuksan",
];

const WISDOM = {
  academic: [
    {
      text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
      source: "Bhagavad Gita",
      insight: "Effort discipline reduces result anxiety and improves clarity.",
    },
    {
      text: "संगच्छध्वं संवदध्वं",
      source: "Vedic teaching",
      insight: "Study support systems and peer discussion reduce isolation stress.",
    },
  ],
  career: [
    {
      text: "योगः कर्मसु कौशलम्",
      source: "Bhagavad Gita",
      insight: "Excellence grows from consistent skillful action, not panic.",
    },
    {
      text: "धैर्य और पुरुषार्थ साथ हों तो मार्ग बनता है।",
      source: "Ramayana insight",
      insight: "Career uncertainty stabilizes with steady effort + values.",
    },
  ],
  family: [
    {
      text: "क्षमा वीरस्य भूषणम्",
      source: "Dharma tradition",
      insight: "Boundaries with respect keep relationships strong.",
    },
    {
      text: "मर्यादा और संवाद से ही संबंध टिकते हैं।",
      source: "Ramayana insight",
      insight: "Firm but respectful communication protects family harmony.",
    },
  ],
  relationship: [
    {
      text: "स्थितप्रज्ञता से भावनाओं का संतुलन संभव है।",
      source: "Bhagavad Gita insight",
      insight: "Emotional steadiness helps after heartbreak and conflict.",
    },
    {
      text: "करुणा और धैर्य से रिश्ते फिर से समझे जा सकते हैं।",
      source: "Ramayana insight",
      insight: "Compassion plus boundaries enables healthier connection.",
    },
  ],
  anxiety: [
    {
      text: "ॐ शान्तिः शान्तिः शान्तिः",
      source: "Vedic mantra tradition",
      insight: "Breath-paced chanting settles body and mind rhythms.",
    },
    {
      text: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते",
      source: "Bhagavad Gita",
      insight: "Naming thoughts clearly lowers fear intensity.",
    },
  ],
  sadness: [
    {
      text: "मन के हारे हार है, मन के जीते जीत",
      source: "Bhakti wisdom tradition",
      insight: "Naming your emotion is already a healing move.",
    },
    {
      text: "आशा और कर्म साथ रहें तो मन फिर उठता है।",
      source: "Ramayana insight",
      insight: "Tiny daily actions rebuild meaning during low phases.",
    },
  ],
  finance: [
    {
      text: "श्रम, सत्य, और संकल्प — ये तीन तुमसे कोई नहीं छीन सकता।",
      source: "Dharma-aligned wisdom",
      insight: "Financial stress needs structure, not shame.",
    },
    {
      text: "अर्थ का नियमन, धर्म का पालन, और संयम।",
      source: "Vedic life-principle",
      insight: "Budget + restraint + values reduce money panic.",
    },
  ],
  general: [
    {
      text: "तुम खुद अपने भाग्य के निर्माता हो।",
      source: "Indian spiritual wisdom",
      insight: "You still have agency in the next small decision.",
    },
  ],
};

const SCRIPTURE_SOLUTIONS = {
  academic: [
    "Bhagavad Gita path: focus on daily karma blocks, not rank obsession.",
    "Vedic path: study in sangha mode, ask for help early.",
    "Ramayana path: consistency with maryada (routine discipline) wins long journeys.",
  ],
  career: [
    "Bhagavad Gita path: do skillful action daily without over-attachment to outcome.",
    "Vedic path: align work with svadharma strengths and honest effort.",
    "Ramayana path: move with patience, duty, and integrity under pressure.",
  ],
  family: [
    "Bhagavad Gita path: calm mind before difficult conversations.",
    "Vedic path: 'samvad' first, argument later.",
    "Ramayana path: protect respect while stating clear boundaries.",
  ],
  relationship: [
    "Bhagavad Gita path: emotional balance before decision-making.",
    "Vedic path: truth + compassion in communication.",
    "Ramayana path: self-respect and dignity must stay intact in love.",
  ],
  anxiety: [
    "Bhagavad Gita path: observe thoughts, don't obey every fear-thought.",
    "Vedic path: use mantra-paced breath to regulate the nervous system.",
    "Ramayana path: courage grows when one step is taken despite fear.",
  ],
  sadness: [
    "Bhagavad Gita path: action can continue even when mood is low.",
    "Vedic path: morning sunlight + breath + prayer creates stability.",
    "Ramayana path: hope is rebuilt through seva and purposeful routine.",
  ],
  finance: [
    "Bhagavad Gita path: steady effort over shame and self-blame.",
    "Vedic path: artha with discipline and restraint.",
    "Ramayana path: family welfare planning with transparent communication.",
  ],
  general: [
    "Bhagavad Gita path: do the next right action now.",
    "Vedic path: align breath, speech, and thought before reacting.",
    "Ramayana path: hold dharma and patience in difficult moments.",
  ],
};

const CASE_EXAMPLES = {
  academic: {
    scenario: "A 2nd-year student was panicking before mock tests and avoiding revision.",
    resolution: [
      "Shifted from all-day panic study to 3 focused blocks of 45 minutes.",
      "Shared one honest daily update with family to reduce pressure build-up.",
      "Used one breath cycle before each test and anxiety reduced within 10 days.",
    ],
  },
  career: {
    scenario: "A software professional felt stuck after repeated interview rejections.",
    resolution: [
      "Converted fear into a 14-day skill sprint and one mock interview daily.",
      "Stopped comparison scrolling and tracked only controllable tasks.",
      "Sent 5 high-quality applications with tailored role stories and got callbacks.",
    ],
  },
  family: {
    scenario: "A young adult faced daily conflict with parents around career choices.",
    resolution: [
      "Started conversations only after calm-down breathing, not during arguments.",
      "Used one boundary line: 'Mujhe support chahiye, pressure nahi.'",
      "Set a weekly family check-in and reduced emotional escalation.",
    ],
  },
  relationship: {
    scenario: "After breakup, a user kept checking old chats and felt emotionally drained.",
    resolution: [
      "Set a 48-hour no-contact and no-trigger routine.",
      "Rebuilt routine with sleep, movement, and one trusted friend conversation.",
      "Converted pain journal into clarity: non-negotiables for future relationships.",
    ],
  },
  anxiety: {
    scenario: "A user had evening anxiety spikes with racing thoughts and shallow breathing.",
    resolution: [
      "Used 4-4-6 breathing for 5 cycles at the first sign of panic.",
      "Applied 5-4-3-2-1 grounding and lowered fear intensity quickly.",
      "Reduced caffeine after 4 PM and improved night calm in one week.",
    ],
  },
  sadness: {
    scenario: "A user felt low every morning and disconnected from motivation.",
    resolution: [
      "Added a non-negotiable 15-minute sunlight walk.",
      "Picked one small task daily to rebuild completion confidence.",
      "Scheduled two supportive human check-ins every week.",
    ],
  },
  finance: {
    scenario: "A family earner felt trapped by loan pressure and guilt.",
    resolution: [
      "Separated fixed vs variable costs and created a 30-day visibility sheet.",
      "Negotiated one repayment timeline instead of avoiding calls.",
      "Started one side-skill hour daily for medium-term income stability.",
    ],
  },
  general: {
    scenario: "A user felt overwhelmed by too many unresolved issues at once.",
    resolution: [
      "Picked one emotional and one practical problem only for this week.",
      "Used guided breathing before making decisions.",
      "Followed a small daily completion ritual to regain control.",
    ],
  },
};


const AYURVEDIC_YOGA_RECOMMENDATIONS = {
  academic: {
    dosha: "Vata imbalance (scattered focus, anxiety)",
    yoga: ["Child's Pose (Balasana) - 5 min for grounding", "Seated Forward Bend (Paschimottanasana) - 3 min", "Legs Up the Wall (Viparita Karani) - 5 min before study"],
    pranayama: ["Nadi Shodhana (Alternate Nostril) - 5 min to balance hemispheres", "Bhramari (Bee Breath) - 2 min to calm racing thoughts"],
    diet: "Warm, oily foods. Sesame oil massage on scalp. Avoid cold drinks.",
    routine: "Study during Brahma Muhurta (4-6 AM). Oil massage before bed.",
  },
  career: {
    dosha: "Pitta imbalance (frustration, burnout)",
    yoga: ["Warrior I & II (Virabhadrasana) - build steady confidence", "Cobra Pose (Bhujangasana) - 2 min to open chest", "Cat-Cow (Marjaryasana-Bitilasana) - 3 min for flexibility"],
    pranayama: ["Sitali Pranayama (Cooling Breath) - 3 min to reduce heat", "Ujjayi Breath (Ocean Breath) - 5 min for focus"],
    diet: "Cooling foods: coconut, cucumber, ghee, milk. Avoid spicy food.",
    routine: "Evening yoga 6-7 PM. Abhyanga (oil massage) with cooling oils.",
  },
  family: {
    dosha: "Vata + Pitta imbalance (emotional volatility)",
    yoga: ["Supported Fish Pose - opens heart for compassion", "Reclined Butterfly (Supta Baddha Konasana) - 5 min", "Mountain Pose (Tadasana) - grounding before conversations"],
    pranayama: ["Samavṛtti Pranayama (Box Breathing) - 4-4-4-4 for stability", "Anuloma Viloma with longer exhales - calms nervous system"],
    diet: "Warm, grounding foods. Ghee, sesame oil, warm spices.",
    routine: "Practice yoga 7-8 AM or 6-7 PM. Daily oil massage.",
  },
  relationship: {
    dosha: "Kapha imbalance (lethargy, attachment)",
    yoga: ["Sun Salutation (Surya Namaskar) - 5 rounds to energize", "Warrior III (Virabhadrasana III) - balance pose", "Backbends (Urdhva Mukha Svanasana) - 2 min to open heart"],
    pranayama: ["Kapalabhati (Skull Shining Breath) - 2 min to energize", "Bhastrika (Bellows Breath) - 3 min for activation"],
    diet: "Light, warming foods. Reduce heavy dairy. Ginger, turmeric, honey.",
    routine: "Morning yoga 5-6 AM. Walking after meals.",
  },
  anxiety: {
    dosha: "Vata aggravation (nervousness, racing mind)",
    yoga: ["Child's Pose - 10 min for deep rest", "Supported Shoulder Stand (Salamba Sarvangasana) - 3-5 min", "Corpse Pose (Shavasana) - 15 min minimum"],
    pranayama: ["Extended Exhale (4-4-8 ratio) - calms nervous system", "Bhramari Bee Breath - 5 min daily"],
    diet: "Sesame oil massage. Warm milk with ashwagandha. Avoid stimulants.",
    routine: "Bedtime yoga 9-10 PM. Abhyanga before sleep.",
  },
  sadness: {
    dosha: "Kapha excess (heaviness, low motivation)",
    yoga: ["Sun Salutation - 10 rounds energizing flow", "Standing poses (Warrior, Triangle) - activate solar plexus", "Chest openers - Camel Pose (Ustrasana)"],
    pranayama: ["Breath of Joy (Hari Om) - energizing chant + breath", "Kapalabhati - 2-3 rounds for activation"],
    diet: "Warm, stimulating foods. Ginger tea, turmeric milk, light meals.",
    routine: "Morning sunlight + yoga 6-7 AM. Avoid sleeping excessively.",
  },
  finance: {
    dosha: "Vata + anxiety (worried, scattered decisions)",
    yoga: ["Grounding poses: Mountain, Warrior I, Tree Pose", "Hip openers (Pigeon Pose) - releases stored anxiety", "Forward Folds - calming poses"],
    pranayama: ["Nadi Shodhana (10 min) - clarity for decisions", "Extended Exhale breathing - stability"],
    diet: "Warm, nourishing foods. Root vegetables, ghee, whole grains.",
    routine: "Yoga 30 min before financial planning. Evening oil massage.",
  },
  general: {
    dosha: "Mixed imbalance (general stress)",
    yoga: ["Gentle Hatha flow - 20 min", "Balance poses for focus", "Restorative yoga - 15 min minimum"],
    pranayama: ["Box Breathing (4-4-4-4) - 5 min anytime", "Alternate Nostril Breathing - 5-10 min"],
    diet: "Balanced meals. Seasonal foods. Warm, cooked meals.",
    routine: "Daily yoga 20-30 min. Consistent sleep schedule.",
  },
};

const YOGA_ASANAS = {
  quick_energy: [
    { name: "Sun Salutation", duration: "5 min", reps: "5-10", benefit: "Energy, focus, spine health" },
    { name: "Mountain Pose", duration: "1 min", reps: "3 holds", benefit: "Grounding, posture, confidence" },
    { name: "Warrior I", duration: "1 min each side", reps: "3 holds", benefit: "Strength, stability, courage" },
    { name: "Tree Pose", duration: "1 min each side", reps: "3 holds", benefit: "Balance, focus, grounding" },
  ],
  calming: [
    { name: "Child's Pose", duration: "5-10 min", reps: "1 hold", benefit: "Anxiety relief, calming" },
    { name: "Cat-Cow", duration: "3 min", reps: "10-15 rounds", benefit: "Spinal flexibility, nervous system calm" },
    { name: "Supported Fish Pose", duration: "5 min", reps: "1 hold", benefit: "Chest opening, anxiety relief" },
    { name: "Legs Up the Wall", duration: "10 min", reps: "1 hold", benefit: "Deep rest, nervous system reset" },
  ],
  energizing: [
    { name: "Downward Dog", duration: "2 min", reps: "3 holds", benefit: "Energy, circulation, strength" },
    { name: "Plank Pose", duration: "1 min", reps: "3 holds", benefit: "Core strength, confidence" },
    { name: "Cobra/Upward Dog", duration: "1 min each", reps: "5 rounds", benefit: "Heart opening, energy boost" },
    { name: "Camel Pose", duration: "1-2 min", reps: "3 rounds", benefit: "Chest opening, mood elevation" },
  ],
};

const PRANAYAMA_TECHNIQUES = {
  nadi_shodhana: {
    name: "Nadi Shodhana (Alternate Nostril Breathing)",
    duration: "5-10 min",
    benefits: "Mental clarity, balance, anxiety relief",
    steps: [
      "Sit upright. Use Vishnu Mudra (thumb and two fingers to close nostrils).",
      "Close right nostril, inhale left for 4 counts.",
      "Close left nostril, exhale right for 4 counts.",
      "Inhale right for 4 counts, exhale left for 4 counts.",
      "Continue for 10 cycles.",
    ],
    best_for: ["Academic stress", "Decision-making", "Mental clarity"],
  },
  box_breathing: {
    name: "Box Breathing (Sama Vritti)",
    duration: "5 min",
    benefits: "Stress relief, emotional regulation, focus",
    steps: [
      "Sit comfortably. Inhale for 4 counts.",
      "Hold for 4 counts.",
      "Exhale for 4 counts.",
      "Hold for 4 counts.",
      "Repeat 10-15 cycles.",
    ],
    best_for: ["Anxiety", "Panic attacks", "Emotional overwhelm"],
  },
  extended_exhale: {
    name: "Extended Exhale Breathing",
    duration: "3-5 min",
    benefits: "Nervous system calming, anxiety reduction",
    steps: [
      "Sit comfortably. Inhale for 4 counts.",
      "Exhale for 8 counts (twice as long as inhale).",
      "Repeat for 10-20 cycles.",
      "Focus on the longer exhale.",
    ],
    best_for: ["Anxiety", "Sleep issues", "Emotional intensity"],
  },
  bhramari: {
    name: "Bhramari (Bee Breath)",
    duration: "2-3 min",
    benefits: "Mental clarity, throat chakra healing, anxiety relief",
    steps: [
      "Sit upright. Close ears with thumbs (Shanmukhi Mudra).",
      "Inhale deeply through nose.",
      "Exhale while making 'mmmmm' humming sound.",
      "Feel vibration in head and throat.",
      "Repeat 10-15 cycles.",
    ],
    best_for: ["Racing thoughts", "Anxiety", "Sleep issues"],
  },
  kapalabhati: {
    name: "Kapalabhati (Skull Shining Breath)",
    duration: "2-3 min",
    benefits: "Energy boost, mental clarity, toxin release",
    steps: [
      "Sit upright. Inhale through both nostrils.",
      "Forcefully exhale through nose (quick bursts).",
      "Let inhale happen passively.",
      "Do 20-30 rapid exhales in one round.",
      "Rest and repeat 2-3 rounds.",
    ],
    best_for: ["Low energy", "Depression", "Mental fog"],
  },
  sitali: {
    name: "Sitali Pranayama (Cooling Breath)",
    duration: "3-5 min",
    benefits: "Cooling, anger management, stress relief",
    steps: [
      "Sit upright. Curl tongue into a tube shape.",
      "Inhale slowly through curled tongue.",
      "Close mouth, exhale through nose.",
      "Repeat 10-15 cycles.",
      "(If can't curl tongue, inhale through teeth instead.)",
    ],
    best_for: ["Anger", "Frustration", "Overheating"],
  },
};

const DOSHA_RECOMMENDATIONS = {
  vata: {
    description: "Air element - Mobile, creative, anxious, scattered",
    imbalance_signs: "Anxiety, insomnia, scattered focus, indecision, dry skin",
    daily_routine: [
      "Wake 6 AM, early bed (10 PM)",
      "Warm breakfast. Avoid skipping meals.",
      "Oil massage (abhyanga) 3x week",
      "Warm, oily foods with healthy fats",
      "Afternoon meditation/grounding",
    ],
    yoga: "Grounding poses: Mountain, Warrior, Child's Pose",
    food: "Sesame oil, ghee, warm milk, root vegetables, warm spices",
    avoid: "Cold drinks, dry foods, irregular meals, excessive activity",
  },
  pitta: {
    description: "Fire element - Ambitious, sharp, irritable, competitive",
    imbalance_signs: "Anger, burnout, inflammation, criticism, frustration",
    daily_routine: [
      "Wake 6 AM, sleep 10:30 PM",
      "Avoid skipping lunch (main meal)",
      "Cooling practices and meditation",
      "Evening yoga for activation",
      "Adequate rest - don't overwork",
    ],
    yoga: "Cooling poses: Child's Pose, Supported Fish, Forward Folds",
    food: "Coconut oil, ghee, cooling spices, fresh vegetables, milk",
    avoid: "Spicy food, excessive exercise, hot environments, excess coffee",
  },
  kapha: {
    description: "Water/Earth element - Stable, heavy, sluggish, attached",
    imbalance_signs: "Low motivation, heaviness, lethargy, attachment, excess weight",
    daily_routine: [
      "Wake 5-6 AM (early)",
      "Light breakfast or skip",
      "Daily exercise/movement",
      "Stimulating practices",
      "Variety in routine",
    ],
    yoga: "Energizing: Sun Salutation, Standing poses, Backbends",
    food: "Mustard oil, light spices, ginger, turmeric, bitter greens",
    avoid: "Heavy foods, dairy excess, sleeping too much, sedentary lifestyle",
  },
};

const AYURVEDIC_LIFESTYLE_TIPS = {
  morning_routine: [
    "Wake before sunrise (Brahma Muhurta) for clarity",
    "Tongue scraping (copper) - removes toxins",
    "Oil pulling (10 min) - oral health + detox",
    "Warm water with lemon or honey - digestive fire",
    "Yoga/stretch - 15-20 min for flexibility",
    "Meditation - 5-10 min for mental clarity",
    "Healthy breakfast within 1 hour of waking",
  ],
  evening_routine: [
    "Sunset walk - balance circadian rhythm",
    "Abhyanga (oil massage) 2-3x per week",
    "Warm bath or shower",
    "Light dinner 2-3 hours before bed",
    "Gentle yoga or stretch - 10-15 min",
    "Sleep by 10 PM for best rest",
    "Avoid screens 1 hour before bed",
  ],
  seasonal_adjustments: [
    "Spring (Kapha season): More exercise, warm spices, reduce dairy",
    "Summer (Pitta season): Cooling foods, evening yoga, rest midday",
    "Fall/Winter (Vata season): Warm foods, oil massage, grounding practices",
  ],
  seasonal_foods: {
    spring: "Bitter greens, asparagus, light grains, warming spices",
    summer: "Coconut, cucumber, fresh fruits, cooling herbs",
    fall_winter: "Root vegetables, whole grains, sesame, ghee, nuts",
  },
};

const PRACTICAL_STEPS = {
  academic: ["Make a 90-minute focused study block for one subject.", "Use Pomodoro 25-5 for the next two sessions.", "Send one doubt/question to teacher or friend today.", "Sit in Child's Pose 5 min before studying to focus.", "Practice Nadi Shodhana 5 min to balance left-right brain."],
  career: ["Write top 3 skills you can monetize right now.", "Apply to at least 2 roles with custom CV bullets.", "Schedule a 20-min learning sprint for one growth skill.", "Do 5 rounds of Sun Salutation for energy.", "Practice cooling breath (Sitali) before meetings."],
  family: ["Use one calm boundary sentence: 'Mujhe 20 min chahiye, fir baat karte hain.'", "Discuss one issue at a time, not past incidents.", "Ask one supportive family member to mediate.", "Do 10 min of grounding yoga before conversations.", "Practice Box Breathing before difficult talks."],
  relationship: ["Do a 24-hour social media detox from trigger profiles.", "Journal: what hurt, what you need, what you learned.", "Plan one grounding activity outside home today.", "10 min of calming Child's Pose and forward folds.", "Take an oil massage (abhyanga) for self-care."],
  anxiety: ["Try 4-4-6 breathing for 3 cycles.", "Do 5-4-3-2-1 grounding with your senses.", "Cut caffeine after 4 PM for the next 3 days.", "Practice Bhramari (Bee Breath) for 5 cycles.", "Do 15 min of Legs Up the Wall (Viparita Karani)."],
  sadness: ["Take a 15-minute sunlight walk.", "Message one trusted person: 'Can we talk for 10 mins?'", "Write one page: 'What do I need right now?'", "Do 10 rounds of Sun Salutation to energize.", "Drink turmeric milk (golden milk) at bedtime."],
  finance: ["List fixed and variable expenses separately.", "Pick one cost to reduce this week by 10-15%.", "Identify one side-skill learning source (free).", "Practice grounding poses (Mountain, Tree) 10 min.", "Do Nadi Shodhana for clarity on financial decisions."],
  general: ["Drink water and take 10 slow breaths.", "Write your top worry and one controllable action.", "Choose one tiny task and finish it in 20 minutes.", "Sit in Lotus or cross-legged for 5 min meditation.", "Oil massage on hands and feet for 10 min."],
};

const ROLE_BOOST = {
  student: "Use short study sprints and protect sleep before exams.",
  professional: "Block one no-meeting focus window in your calendar.",
  parent: "Co-regulation works: calm voice first, then problem-solving.",
  homemaker: "Your care work is real work. Include one self-slot daily.",
  other: "Choose consistency over intensity for this week.",
};

const QUICK_PROMPTS = {
  vent: [
    "Mujhe bas suno, advice nahi chahiye abhi.",
    "Aaj sab kuch heavy lag raha hai.",
    "Main overthink kar raha/rahi hoon.",
  ],
  cbt: [
    "Meri negative thought ko reframe karne mein help karo.",
    "Worst-case thinking chal rahi hai.",
    "Confidence build karna hai.",
  ],
  family: [
    "Parents se calmly kaise baat karun?",
    "Boundary set karni hai bina ladai ke.",
    "Family pressure handle karna hai.",
  ],
  spiritual: [
    "Ek chhota grounding ritual suggest karo.",
    "Aaj ke liye koi wisdom-based reflection do.",
    "Breathing + mantra style reset chahiye.",
  ],
  ayurveda: [
    "Mujhe yoga poses suggest karo anxiety ke liye.",
    "Kaunsi dosha imbalance ho sakti hai mujhmein?",
    "Best pranayama technique batao isse stress ke liye.",
    "Mere liye Ayurvedic daily routine suggest karo.",
    "Asana sequence banao 20 min mein.",
  ],
  action: [
    "Mere liye 24-hour action plan banao.",
    "Next 3 steps clear karo.",
    "Aaj raat tak kya complete karun?",
  ],
};

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function detectConcern(text) {
  const lower = text.toLowerCase();
  let winner = { id: "general", score: 0 };

  for (const pattern of CONCERN_PATTERNS) {
    let score = 0;
    for (const key of pattern.keys) {
      if (lower.includes(key)) {
        score += 1;
      }
    }
    if (score > winner.score) {
      winner = { id: pattern.id, score };
    }
  }

  return winner.id;
}

function hasCrisisSignal(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((key) => lower.includes(key));
}

function getMoodLabel(score) {
  if (score <= 3) return { text: "Low energy", color: "#fb7185" };
  if (score <= 6) return { text: "Wavy but manageable", color: "#fbbf24" };
  if (score <= 8) return { text: "Stable", color: "#34d399" };
  return { text: "Strong & grounded", color: "#22d3ee" };
}

function buildPlan(category, role, moodScore) {
  const steps = [...(PRACTICAL_STEPS[category] || PRACTICAL_STEPS.general)];
  const roleLine = ROLE_BOOST[role] || ROLE_BOOST.other;
  const moodLine = moodScore <= 4
    ? "Tonight focus only on recovery tasks, not perfection."
    : "Add one growth task after emotional reset.";

  return {
    title: `${category[0].toUpperCase() + category.slice(1)} Recovery Plan`,
    items: [...steps, roleLine, moodLine].map((text) => ({ text, done: false })),
  };
}

function buildInteractiveCaseText(category, name, language) {
  const example = CASE_EXAMPLES[category] || CASE_EXAMPLES.general;

  if (language === "hindi") {
    return (
      `समान परिस्थिति का उदाहरण:\n${example.scenario}\n\n` +
      `${name} के लिए समाधान मॉडल:\n` +
      `1. ${example.resolution[0]}\n` +
      `2. ${example.resolution[1]}\n` +
      `3. ${example.resolution[2]}`
    );
  }

  if (language === "english") {
    return (
      `Similar situation example:\n${example.scenario}\n\n` +
      `Resolution path for you, ${name}:\n` +
      `1. ${example.resolution[0]}\n` +
      `2. ${example.resolution[1]}\n` +
      `3. ${example.resolution[2]}`
    );
  }

  return (
    `Similar situation example:\n${example.scenario}\n\n` +
    `Aapke liye resolve path, ${name}:\n` +
    `1. ${example.resolution[0]}\n` +
    `2. ${example.resolution[1]}\n` +
    `3. ${example.resolution[2]}`
  );
}

function makeAssistantReply({ profile, message, mode, moodScore, emotion, historyLen }) {
  const category = detectConcern(`${profile.primaryConcern} ${message} ${emotion}`);
  const wisdom = pickRandom(WISDOM[category] || WISDOM.general);
  const plan = buildPlan(category, profile.role, moodScore);
  const crisis = hasCrisisSignal(message);
  const language = profile.language || "hinglish";
  const speak = (variants) => variants[language] || variants.hinglish;
  const scripturePath = SCRIPTURE_SOLUTIONS[category] || SCRIPTURE_SOLUTIONS.general;
  const caseText = buildInteractiveCaseText(category, profile.name, language);
  const choice = message.trim();

  if (crisis) {
    return {
      category: "urgent",
      wisdom,
      plan,
      text:
        `${profile.name}, ` +
        speak({
          hinglish: "aapne jo share kiya woh bahut important hai. Abhi sabse pehle safety matter karti hai.",
          hindi: "जो आपने साझा किया वह बहुत महत्वपूर्ण है। इस समय आपकी सुरक्षा सबसे पहले है।",
          english: "thank you for sharing this. Your safety matters most right now.",
        }) +
        "\n\n" +
        speak({
          hinglish: "Agar risk feel ho raha hai toh turant kisi trusted person ko call karein aur emergency services (112) contact karein.",
          hindi: "यदि जोखिम महसूस हो रहा है, तो तुरंत किसी भरोसेमंद व्यक्ति को कॉल करें और आपातकालीन सेवा (112) से संपर्क करें।",
          english: "Please contact a trusted person nearby and call emergency services (112) immediately if you feel at risk.",
        }) +
        "\n\n" +
        speak({
          hinglish: "Agar ho sake toh reply karein: 'I am safe right now'. Main aapke saath hoon.",
          hindi: "यदि संभव हो तो उत्तर दें: 'I am safe right now'। मैं आपके साथ हूँ।",
          english: "If possible, reply with: 'I am safe right now'. I can stay with you while you take that step.",
        }),
    };
  }

  if (choice === "1" || choice === "2" || choice === "3") {
    const optionReply = {
      "1": speak({
        hinglish: `${profile.name}, calm reset activated: 5 slow breaths lo, shoulders relax karo, aur 30 sec ke liye sirf exhale pe focus karo. Fir 1 line likho: "Abhi main kis cheez ko control kar sakta/sakti hoon?"`,
        hindi: `${profile.name}, शांत रीसेट सक्रिय: 5 धीमी श्वास लें, कंधे ढीले करें, और 30 सेकंड केवल श्वास छोड़ने पर ध्यान दें। फिर 1 पंक्ति लिखें: "अभी मैं किस चीज़ को नियंत्रित कर सकता/सकती हूँ?"`,
        english: `${profile.name}, calm reset activated: take 5 slow breaths, relax your shoulders, and focus on exhale for 30 seconds. Then write one line: "What can I control right now?"`,
      }),
      "2": speak({
        hinglish: `${profile.name}, conversation script ready: "Main aapse ladna nahi chahta/chahti. Mujhe support chahiye, pressure nahi. Chaliye ek workable plan banate hain." Is line ko calm tone me use karo.`,
        hindi: `${profile.name}, बातचीत स्क्रिप्ट तैयार: "मैं आपसे लड़ना नहीं चाहता/चाहती। मुझे सहयोग चाहिए, दबाव नहीं। आइए एक व्यावहारिक योजना बनाते हैं।" इसे शांत स्वर में उपयोग करें।`,
        english: `${profile.name}, conversation script ready: "I don't want conflict. I need support, not pressure. Let's create a workable plan together." Use this in a calm tone.`,
      }),
      "3": speak({
        hinglish: `${profile.name}, action step now: next 20 minutes ke liye ek single task choose karo aur timer lagao. Completion ke baad mujhe update bhejo: "Done 1/1".`,
        hindi: `${profile.name}, अब एक्शन स्टेप: अगले 20 मिनट के लिए एक ही कार्य चुनें और टाइमर लगाएँ। पूरा होने के बाद लिखें: "Done 1/1"।`,
        english: `${profile.name}, action step now: pick one single task for the next 20 minutes and set a timer. After completion, update me with: "Done 1/1".`,
      }),
    }[choice];

    return {
      category,
      wisdom,
      plan,
      text: `${optionReply}\n\n${speak({
        hinglish: "Agar helpful laga toh next me 1,2,3 me se doosra option bhi try kar sakte ho.",
        hindi: "यदि यह सहायक लगा हो, तो अगली बार 1,2,3 में से दूसरा विकल्प भी आज़मा सकते हैं।",
        english: "If this helps, you can also try another option (1,2,3) next.",
      })}`,
    };
  }

  const opener = {
    vent: speak({
      hinglish: `${profile.name}, main aapko dhyan se sun raha hoon. Jo aap feel kar rahe ho woh valid hai.`,
      hindi: `${profile.name}, मैं आपको ध्यान से सुन रहा हूँ। आपकी भावनाएँ बिल्कुल मान्य हैं।`,
      english: `${profile.name}, I hear you fully. What you are feeling is valid.`,
    }),
    cbt: speak({
      hinglish: `${profile.name}, chalo thought ko breakdown karte hain using a simple CBT style.`,
      hindi: `${profile.name}, आइए विचारों को एक सरल CBT तरीके से समझते हैं।`,
      english: `${profile.name}, let's break this down with a simple CBT frame.`,
    }),
    family: speak({
      hinglish: `${profile.name}, Indian family context complex hota hai. Respect aur boundary dono saath chal sakte hain.`,
      hindi: `${profile.name}, भारतीय पारिवारिक संदर्भ जटिल होता है। सम्मान और सीमाएँ साथ चल सकती हैं।`,
      english: `${profile.name}, Indian family dynamics can be complex. Respect and boundaries can coexist.`,
    }),
    spiritual: speak({
      hinglish: `${profile.name}, pehle body ko calm karte hain, phir mind clear hoga.`,
      hindi: `${profile.name}, पहले शरीर को शांत करते हैं, फिर मन स्पष्ट होगा।`,
      english: `${profile.name}, first we calm the body, then the mind becomes clearer.`,
    }),
    ayurveda: speak({
      hinglish: `${profile.name}, Ayurveda aur Yoga se aapka natural balance restore hoga. Let's find your healing rhythm.`,
      hindi: `${profile.name}, आयुर्वेद और योग से आपका प्राकृतिक संतुलन फिर से स्थापित होगा।`,
      english: `${profile.name}, through Ayurveda and Yoga, we'll restore your natural balance and healing rhythm.`,
    }),
    action: speak({
      hinglish: `${profile.name}, ab hum stress ko action mein convert karte hain.`,
      hindi: `${profile.name}, अब हम तनाव को कार्ययोजना में बदलते हैं।`,
      english: `${profile.name}, now we convert stress into action.`,
    }),
  }[mode];

  const modeBlock = {
    vent: speak({
      hinglish: "Aaj ke liye target sirf release hai, solve sab kuch ek saath nahi. 2 lines mein likho: 'Mujhe sabse zyada kis baat ka dard hai?'",
      hindi: "आज का लक्ष्य केवल भावनात्मक रिलीज़ है, सब कुछ एक साथ हल नहीं करना। दो पंक्तियों में लिखें: 'मुझे सबसे ज़्यादा किस बात का दर्द है?'",
      english: "Today's target is emotional release, not solving everything at once. Write in 2 lines: 'What hurts me most right now?'",
    }),
    cbt: speak({
      hinglish: "Pattern check: Thought -> Emotion -> Action. Ek negative thought pick karo, aur uske against 2 realistic facts likho.",
      hindi: "पैटर्न देखें: विचार -> भावना -> व्यवहार। एक नकारात्मक विचार चुनें और उसके खिलाफ 2 यथार्थवादी तथ्य लिखें।",
      english: "Pattern check: Thought -> Emotion -> Action. Pick one negative thought and write 2 realistic counter-facts.",
    }),
    family: speak({
      hinglish: "Conversation script try karo: 'Mujhe aapse support chahiye, pressure nahi. Main aapki izzat karta/karti hoon, par meri speed bhi important hai.'",
      hindi: "यह बातचीत वाक्य उपयोग करें: 'मुझे आपका सहयोग चाहिए, दबाव नहीं। मैं आपका सम्मान करता/करती हूँ, पर मेरी गति भी महत्वपूर्ण है।'",
      english: "Try this script: 'I need support, not pressure. I respect you, and my pace matters too.'",
    }),
    spiritual: speak({
      hinglish: "Try 3 rounds: inhale 4, hold 4, exhale 6. Exhale ke saath silently bolo: 'Main surakshit hoon, main sthir hoon.'",
      hindi: "3 राउंड करें: 4 गिनती में श्वास लें, 4 तक रोकें, 6 में छोड़ें। छोड़ते समय मन में कहें: 'मैं सुरक्षित हूँ, मैं स्थिर हूँ।'",
      english: "Try 3 rounds: inhale 4, hold 4, exhale 6. During exhale, repeat silently: 'I am safe, I am steady.'",
    }),
    ayurveda: speak({
      hinglish: `Try this: Find your dominant dosha (Vata-airy, Pitta-fiery, Kapha-heavy). Practice the specific yoga pose and pranayama for your type. For ${category} stress, grounding poses + Nadi Shodhana work best. Start 10 min daily for 7 days.`,
      hindi: `अपनी प्रमुख दोष को पहचानें (वात-हल्का, पित्त-तीव्र, कफ-भारी)। अपने प्रकार के लिए विशेष योग मुद्रा और प्राणायाम का अभ्यास करें।`,
      english: `Identify your dominant dosha (Vata-airy, Pitta-fiery, Kapha-heavy). Practice the specific yoga poses and pranayama for your type. For ${category} stress, grounding poses + Nadi Shodhana work best. Start 10 min daily for 7 days.`,
    }),
    action: speak({
      hinglish: "Agle 24 ghante ke liye sirf 3 outcomes pick karo: emotional reset, ek practical task, ek support connection.",
      hindi: "अगले 24 घंटों के लिए केवल 3 लक्ष्य चुनें: भावनात्मक रीसेट, एक व्यावहारिक कार्य, और एक सहायता संपर्क।",
      english: "For the next 24 hours, pick only 3 outcomes: emotional reset, one practical task, and one support connection.",
    }),
  }[mode];

  const personalized = profile.city.trim().length > 0
    ? speak({
      hinglish: `Aap ${profile.city} se ho, so local routine pressure aur social comparison dono impact kar sakte hain.`,
      hindi: `आप ${profile.city} से हैं, इसलिए स्थानीय दिनचर्या का दबाव और सामाजिक तुलना दोनों असर डाल सकते हैं।`,
      english: `You are in ${profile.city}, so local routine pressure and social comparison can both affect you.`,
    })
    : speak({
      hinglish: "Aapke routine aur expectations ka pressure milkar emotional overload create kar sakta hai.",
      hindi: "दिनचर्या और अपेक्षाओं का दबाव मिलकर भावनात्मक ओवरलोड बना सकता है।",
      english: "Routine pressure and expectations can combine into emotional overload.",
    });

  const scriptureBlock = `${speak({
    hinglish: "Hindu-text based guidance",
    hindi: "धार्मिक ग्रंथ-आधारित मार्गदर्शन",
    english: "Hindu-text based guidance",
  })}:\n- ${scripturePath[0]}\n- ${scripturePath[1]}\n- ${scripturePath[2]}`;

  const questionSet = [
    speak({
      hinglish: "Agar aaj ka din 5% better banana ho toh pehla step kya hoga?",
      hindi: "यदि आज का दिन 5% बेहतर बनाना हो, तो पहला कदम क्या होगा?",
      english: "If you had to make today 5% better, what would be your first step?",
    }),
    speak({
      hinglish: "Is issue mein sabse zyada trigger kaunsi situation karti hai?",
      hindi: "इस समस्या में आपको सबसे ज़्यादा कौन-सी परिस्थिति ट्रिगर करती है?",
      english: "Which situation triggers this issue the most for you?",
    }),
    speak({
      hinglish: "Kis ek insaan se baat karna aapko halka kar sakta hai?",
      hindi: "किस एक व्यक्ति से बात करने पर आपको हल्का महसूस होगा?",
      english: "Who is one person you could talk to that would make you feel lighter?",
    }),
  ];

  const question = questionSet[historyLen % questionSet.length];

  return {
    category,
    wisdom,
    plan,
    text:
      `${opener}\n\n` +
      `${modeBlock}\n\n` +
      `${personalized}\n\n` +
      `${scriptureBlock}\n\n` +
      `${caseText}\n\n` +
      `${speak({
        hinglish: `${profile.name}, ab interactive choice lo: 1 (calm reset), 2 (conversation script), 3 (action step).`,
        hindi: `${profile.name}, अब इंटरैक्टिव विकल्प चुनें: 1 (शांत रीसेट), 2 (बातचीत स्क्रिप्ट), 3 (एक्शन स्टेप)।`,
        english: `${profile.name}, choose an interactive option now: 1 (calm reset), 2 (conversation script), 3 (action step).`,
      })}\n\n` +
      `${speak({ hinglish: "Aaj ka focused question", hindi: "आज का फोकस प्रश्न", english: "Today's focus question" })}: ${question}`,
  };
}

function Onboarding({ onStart }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [language, setLanguage] = useState("hinglish");
  const [city, setCity] = useState("");
  const [primaryConcern, setPrimaryConcern] = useState("");
  const [emotion, setEmotion] = useState("mixed");
  const [moodScore, setMoodScore] = useState(5);
  const [error, setError] = useState("");

  const moodMeta = getMoodLabel(moodScore);

  const start = () => {
    if (!name.trim() || primaryConcern.trim().length < 12) {
      setError("Please enter your name and describe your concern in at least 12 characters.");
      return;
    }

    onStart({
      name: name.trim(),
      role,
      language,
      city: city.trim(),
      primaryConcern: primaryConcern.trim(),
      emotion,
      moodScore,
    });
  };

  return (
    <div className="page-shell">
      <div className="ambient" aria-hidden="true" />
      <div className="onboard-wrap">
        <div className="brand-row">
          <div className="brand-logo">🤝</div>
          <div>
            <h1>AI Sathi</h1>
            <p>Modern psychology + Indian context + non-judgmental support</p>
          </div>
        </div>

        <div className="tricolor" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="glass-card">
          <h2>Personalize your support space</h2>
          <p>Jitni personalization, utna better emotional guidance.</p>

          <div className="form-grid">
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Aisha / Rohan" />
            </label>

            <label>
              City (optional)
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: Pune" />
            </label>

            <label>
              Preferred style
              <div className="chip-row">
                {[
                  { id: "hinglish", label: "Hinglish" },
                  { id: "hindi", label: "Hindi" },
                  { id: "english", label: "English" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={language === item.id ? "chip active" : "chip"}
                    onClick={() => setLanguage(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </label>

            <label>
              Primary concern today
              <textarea
                rows={4}
                value={primaryConcern}
                onChange={(e) => setPrimaryConcern(e.target.value)}
                placeholder="What feels heavy right now? Career pressure, family expectations, anxiety, loneliness..."
              />
            </label>
          </div>

          <div className="selection-group">
            <p>Your role context</p>
            <div className="chip-row">
              {ROLE_OPTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={role === item.id ? "chip icon-chip active" : "chip icon-chip"}
                    onClick={() => setRole(item.id)}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="selection-group">
            <p>Current emotional state</p>
            <div className="chip-row">
              {EMOTION_OPTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={emotion === item.id ? "chip icon-chip active" : "chip icon-chip"}
                    onClick={() => setEmotion(item.id)}
                    style={emotion === item.id ? { borderColor: item.color } : undefined}
                  >
                    <Icon size={14} color={item.color} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="selection-group">
            <p>Mood energy: {moodScore}/10</p>
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
            />
            <small style={{ color: moodMeta.color }}>{moodMeta.text}</small>
          </div>

          {error ? <div className="error-box">{error}</div> : null}

          <button type="button" className="primary-btn" onClick={start}>
            Start my support session
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BreathingCoach({ profile }) {
  const [mode, setMode] = useState("breath");
  const [pace, setPace] = useState("balanced");
  const [targetCycles, setTargetCycles] = useState(6);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseLeft, setPhaseLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [cueOn, setCueOn] = useState(true);
  const [omVoiceOn, setOmVoiceOn] = useState(true);
  const language = profile?.language || "hinglish";
  const speak = (variants) => variants[language] || variants.hinglish;
  const omVoiceRef = useRef(null);

  const protocol = useMemo(() => {
    const breathPaces = {
      slow: { inhale: 5, hold: 5, exhale: 7, rest: 2 },
      balanced: { inhale: 4, hold: 4, exhale: 6, rest: 2 },
      active: { inhale: 3, hold: 2, exhale: 4, rest: 1 },
    };

    const omPaces = {
      slow: { inhale: 5, chant: 8, silence: 4 },
      balanced: { inhale: 4, chant: 7, silence: 3 },
      active: { inhale: 3, chant: 6, silence: 2 },
    };

    if (mode === "om") {
      const p = omPaces[pace];
      return {
        title: "OM Meditation Wizard",
        guidance: speak({
          hinglish: "Inhale soft, exhale pe long OM chant, then observe inner silence.",
          hindi: "धीमी श्वास लें, छोड़ते समय लंबा OM जप करें, फिर आंतरिक मौन देखें।",
          english: "Inhale softly, chant OM on exhale, then observe inner silence.",
        }),
        phases: [
          { label: "Inhale", seconds: p.inhale, color: "#22d3ee" },
          { label: "Chant OM", seconds: p.chant, color: "#a78bfa" },
          { label: "Silent Observe", seconds: p.silence, color: "#fbbf24" },
        ],
        scriptureNote: speak({
          hinglish: "Mandukya Upanishad insight: A-U-M + silence helps mind transition from noise to stillness.",
          hindi: "माण्डूक्य उपनिषद की दृष्टि: A-U-M और मौन से मन शोर से शांति की ओर जाता है।",
          english: "Mandukya Upanishad insight: A-U-M and silence move the mind from noise to stillness.",
        }),
      };
    }

    const p = breathPaces[pace];
    return {
      title: "Breath Cycle Wizard",
      guidance: speak({
        hinglish: "Follow nasal inhale, pause, long exhale, micro-rest. This is realistic nervous-system reset.",
        hindi: "नाक से श्वास लें, रुकें, लंबा श्वास छोड़ें, और संक्षिप्त विराम लें। यह तंत्रिका-तंत्र को स्थिर करता है।",
        english: "Use nasal inhale, pause, long exhale, and a micro-rest for realistic nervous-system regulation.",
      }),
      phases: [
        { label: "Inhale", seconds: p.inhale, color: "#22d3ee" },
        { label: "Hold", seconds: p.hold, color: "#fbbf24" },
        { label: "Exhale", seconds: p.exhale, color: "#34d399" },
        { label: "Rest", seconds: p.rest, color: "#fb7185" },
      ],
      scriptureNote: speak({
        hinglish: "Vedic pranayama principle: breath length controls mind speed.",
        hindi: "वैदिक प्राणायाम सिद्धांत: श्वास की लय मन की गति को नियंत्रित करती है।",
        english: "Vedic pranayama principle: breath rhythm regulates thought speed.",
      }),
    };
  }, [mode, pace, language]);

  const currentPhase = protocol.phases[phaseIndex] || protocol.phases[0];

  const playCue = () => {
    if (!cueOn || typeof window === "undefined") return;
    const AudioContextRef = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextRef) return;
    try {
      const ctx = new AudioContextRef();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = mode === "om" ? 432 : 528;
      gain.gain.value = 0.025;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.09);
      oscillator.onended = () => ctx.close();
    } catch {
      // Ignore browser audio restrictions.
    }
  };

  const playOmChantVoice = () => {
    if (!omVoiceOn || mode !== "om" || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(language === "hindi" ? "ओम्" : "Om");
      utter.rate = 0.45;
      utter.pitch = 0.8;
      utter.volume = 0.9;
      utter.lang = language === "hindi" ? "hi-IN" : "en-IN";
      const voices = synth.getVoices();
      const preferred =
        voices.find((v) => /hi-IN|en-IN/i.test(v.lang) && /india|hindi|female|male/i.test(v.name)) ||
        voices.find((v) => /hi-IN|en-IN/i.test(v.lang)) ||
        voices[0];
      if (preferred) {
        utter.voice = preferred;
      }
      omVoiceRef.current = utter;
      synth.speak(utter);
    } catch {
      // Ignore speech synthesis errors on unsupported browsers.
    }
  };

  useEffect(() => {
    setRunning(false);
    setPaused(false);
    setPhaseIndex(0);
    setPhaseLeft(protocol.phases[0].seconds);
    setCycleCount(0);
  }, [protocol]);

  useEffect(() => {
    if (!running || paused) return;
    const phase = protocol.phases[phaseIndex];
    if (mode === "om" && phase?.label === "Chant OM") {
      playOmChantVoice();
    }
  }, [running, paused, phaseIndex, mode, protocol, omVoiceOn, language]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!running || paused) return;

    const timer = setTimeout(() => {
      if (phaseLeft > 1) {
        setPhaseLeft((prev) => prev - 1);
        return;
      }

      const lastPhase = phaseIndex >= protocol.phases.length - 1;
      if (!lastPhase) {
        const nextPhase = phaseIndex + 1;
        setPhaseIndex(nextPhase);
        setPhaseLeft(protocol.phases[nextPhase].seconds);
        playCue();
        return;
      }

      const nextCycle = cycleCount + 1;
      if (nextCycle >= targetCycles) {
        setCycleCount(nextCycle);
        setRunning(false);
        setPaused(false);
        setPhaseIndex(0);
        setPhaseLeft(protocol.phases[0].seconds);
        playCue();
        return;
      }

      setCycleCount(nextCycle);
      setPhaseIndex(0);
      setPhaseLeft(protocol.phases[0].seconds);
      playCue();
    }, 1000);

    return () => clearTimeout(timer);
  }, [running, paused, phaseLeft, phaseIndex, cycleCount, targetCycles, protocol, cueOn, mode]);

  const completedUnits =
    cycleCount * protocol.phases.length +
    phaseIndex +
    (currentPhase.seconds - phaseLeft) / Math.max(currentPhase.seconds, 1);
  const totalUnits = Math.max(targetCycles * protocol.phases.length, 1);
  const progress = !running && cycleCount === 0 && phaseIndex === 0
    ? 0
    : Math.min(100, Math.round((completedUnits / totalUnits) * 100));
  const statusText = running ? (paused ? "Paused" : "In progress") : cycleCount >= targetCycles ? "Completed" : "Ready";

  const startSession = () => {
    setCycleCount(0);
    setPhaseIndex(0);
    setPhaseLeft(protocol.phases[0].seconds);
    setPaused(false);
    setRunning(true);
    playCue();
  };

  const resetSession = () => {
    setRunning(false);
    setPaused(false);
    setCycleCount(0);
    setPhaseIndex(0);
    setPhaseLeft(protocol.phases[0].seconds);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="panel breathing-panel">
      <div className="panel-title">
        <Wind size={16} />
        <span>{protocol.title}</span>
      </div>

      <p className="coach-intro">
        {speak({
          hinglish: `${profile?.name || "Friend"}, ${protocol.guidance}`,
          hindi: `${profile?.name || "मित्र"}, ${protocol.guidance}`,
          english: `${profile?.name || "Friend"}, ${protocol.guidance}`,
        })}
      </p>

      <div className="chip-row">
        <button type="button" className={mode === "breath" ? "chip active" : "chip"} onClick={() => setMode("breath")}>
          Breath
        </button>
        <button type="button" className={mode === "om" ? "chip active" : "chip"} onClick={() => setMode("om")}>
          OM Meditation
        </button>
      </div>

      <div className="chip-row">
        {["slow", "balanced", "active"].map((item) => (
          <button
            key={item}
            type="button"
            className={pace === item ? "chip active" : "chip"}
            onClick={() => setPace(item)}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      <label className="field-lite">
        Cycles: {targetCycles}
        <input
          type="range"
          min="3"
          max="12"
          value={targetCycles}
          onChange={(e) => setTargetCycles(Number(e.target.value))}
        />
      </label>

      <div className="breath-orb" style={{ borderColor: currentPhase.color }}>
        <p>{currentPhase.label}</p>
        <strong>{running ? phaseLeft : currentPhase.seconds}s</strong>
        <small>Cycle {Math.min(cycleCount + 1, targetCycles)}/{targetCycles}</small>
      </div>

      <div className="breath-meta">
        <span>
          <Timer size={13} /> {statusText} · {progress}%
        </span>
        <span>
          <Clock3 size={13} /> Phase {phaseIndex + 1}/{protocol.phases.length}
        </span>
      </div>

      <div className="wizard-actions">
        {!running ? (
          <button type="button" className="secondary-btn mini" onClick={startSession}>
            <Play size={14} /> Start
          </button>
        ) : (
          <button type="button" className="secondary-btn mini" onClick={() => setPaused((prev) => !prev)}>
            <Pause size={14} /> {paused ? "Resume" : "Pause"}
          </button>
        )}

        <button type="button" className="secondary-btn mini" onClick={resetSession}>
          <RotateCcw size={14} /> Reset
        </button>

        <button type="button" className="secondary-btn mini" onClick={() => setCueOn((prev) => !prev)}>
          <Bell size={14} /> Cue {cueOn ? "On" : "Off"}
        </button>

        <button type="button" className="secondary-btn mini" onClick={() => setOmVoiceOn((prev) => !prev)}>
          <Sparkles size={14} /> OM Voice {omVoiceOn ? "On" : "Off"}
        </button>
      </div>

      <div className="scripture-tip">{protocol.scriptureNote}</div>
    </div>
  );
}

function ActionBoard({ plan, setPlan }) {
  const completed = plan.items.filter((item) => item.done).length;
  const total = plan.items.length || 1;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="panel">
      <div className="panel-title">
        <NotebookPen size={16} />
        <span>{plan.title}</span>
      </div>

      <div className="progress-wrap" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <small>{progress}% complete</small>

      <div className="todo-list">
        {plan.items.map((item, idx) => (
          <button
            key={`${item.text}-${idx}`}
            type="button"
            className="todo-item"
            onClick={() => {
              setPlan((prev) => ({
                ...prev,
                items: prev.items.map((entry, entryIdx) =>
                  entryIdx === idx ? { ...entry, done: !entry.done } : entry
                ),
              }));
            }}
          >
            {item.done ? <CheckCircle2 size={15} color="#22c55e" /> : <Circle size={15} color="rgba(226,232,240,0.65)" />}
            <span style={item.done ? { textDecoration: "line-through", opacity: 0.7 } : undefined}>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatWorkspace({ profile, onRestart }) {
  const [activeMode, setActiveMode] = useState("vent");
  const [moodScore, setMoodScore] = useState(profile.moodScore);
  const [emotion, setEmotion] = useState(profile.emotion);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef(null);

  const initialReply = useMemo(
    () => makeAssistantReply({
      profile,
      message: profile.primaryConcern,
      mode: "vent",
      moodScore: profile.moodScore,
      emotion: profile.emotion,
      historyLen: 0,
    }),
    [profile]
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: initialReply.text,
      category: initialReply.category,
      wisdom: initialReply.wisdom,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [plan, setPlan] = useState(() => buildPlan(initialReply.category, profile.role, profile.moodScore));

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const moodMeta = getMoodLabel(moodScore);

  const sendMessage = (preset) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setLoading(true);

    setTimeout(() => {
      const reply = makeAssistantReply({
        profile,
        message: text,
        mode: activeMode,
        moodScore,
        emotion,
        historyLen: messages.length,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply.text,
          category: reply.category,
          wisdom: reply.wisdom,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      setPlan((prev) => {
        const fresh = reply.plan;
        const merged = fresh.items.map((newItem) => {
          const old = prev.items.find((item) => item.text === newItem.text);
          return old ? old : newItem;
        });
        return { ...fresh, items: merged };
      });

      setLoading(false);
    }, 700 + Math.random() * 400);
  };

  const prompts = QUICK_PROMPTS[activeMode];

  return (
    <div className="page-shell">
      <div className="ambient" aria-hidden="true" />

      <header className="top-header">
        <div className="brand-row compact">
          <div className="brand-logo">🤝</div>
          <div>
            <h1>AI Sathi</h1>
            <p>Personalized Indian emotional support</p>
          </div>
        </div>

        <div className="meta-row">
          <span className="meta-chip">{profile.name}</span>
          <span className="meta-chip">{ROLE_OPTIONS.find((r) => r.id === profile.role)?.label}</span>
          {profile.city ? <span className="meta-chip">{profile.city}</span> : null}
          <button type="button" className="meta-chip clickable" onClick={onRestart}>
            New Session
          </button>
        </div>
      </header>

      <main className="layout-grid">
        <section className="left-column">
          <div className="panel">
            <div className="panel-title">
              <Sun size={16} />
              <span>Live Check-in</span>
            </div>

            <label className="field-lite">
              Emotional energy: {moodScore}/10
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(Number(e.target.value))}
              />
            </label>

            <div className="mood-pill" style={{ borderColor: moodMeta.color }}>
              <Moon size={13} color={moodMeta.color} />
              {moodMeta.text}
            </div>

            <div className="chip-row">
              {EMOTION_OPTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={emotion === item.id ? "chip icon-chip active" : "chip icon-chip"}
                    onClick={() => setEmotion(item.id)}
                    style={emotion === item.id ? { borderColor: item.color } : undefined}
                  >
                    <Icon size={14} color={item.color} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <Bot size={16} />
              <span>Support Modes</span>
            </div>

            <div className="mode-list">
              {SUPPORT_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = mode.id === activeMode;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={isActive ? "mode-card active" : "mode-card"}
                    onClick={() => setActiveMode(mode.id)}
                    style={isActive ? { background: mode.accent } : undefined}
                  >
                    <Icon size={15} />
                    <div>
                      <strong>{mode.title}</strong>
                      <small>{mode.subtitle}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <BreathingCoach profile={profile} />
        </section>

        <section className="right-column">
          <div className="panel chat-panel">
            <div className="panel-title">
              <Heart size={16} />
              <span>Conversation</span>
            </div>

            <div className="quick-prompt-wrap">
              {prompts.map((prompt) => (
                <button key={prompt} type="button" className="chip" onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <div className="message-list">
              {messages.map((msg, idx) => (
                <div key={`${msg.time}-${idx}`} className={msg.role === "user" ? "message user" : "message assistant"}>
                  <div className="bubble">
                    <p>{msg.text}</p>
                    <small>{msg.time}</small>
                  </div>

                  {msg.role === "assistant" ? (
                    <div className="wisdom-box">
                      <strong>{msg.wisdom.source}</strong>
                      <p>"{msg.wisdom.text}"</p>
                      <small>{msg.wisdom.insight}</small>
                    </div>
                  ) : null}
                </div>
              ))}

              {loading ? (
                <div className="message assistant">
                  <div className="bubble typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : null}

              <div ref={listEndRef} />
            </div>

            <div className="composer">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type freely... what's on your mind right now?"
              />
              <button type="button" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                <Send size={16} />
              </button>
            </div>
          </div>

          <ActionBoard plan={plan} setPlan={setPlan} />

          <div className="safety-note">
            <Brain size={14} />
            This app supports emotional reflection and is not a replacement for emergency or clinical care.
            If you feel unsafe, contact local emergency support immediately.
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);

  return (
    <>
      <style>{`
        .page-shell { min-height: 100vh; background: ${UI.bg}; color: ${UI.text}; font-family: "Inter", "Manrope", system-ui, -apple-system, sans-serif; position: relative; overflow: hidden; padding-bottom: env(safe-area-inset-bottom); }
        .ambient { position: absolute; inset: 0; pointer-events: none; }
        .ambient::before, .ambient::after { content: ""; position: absolute; border-radius: 999px; filter: blur(70px); opacity: 0.22; animation: floaty 10s ease-in-out infinite; }
        .ambient::before { width: 220px; height: 220px; background: #22d3ee; top: -40px; left: -40px; }
        .ambient::after { width: 260px; height: 260px; background: #f97316; right: -60px; bottom: -80px; animation-delay: 2s; }

        .onboard-wrap { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 32px 16px 56px; }
        .brand-row { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
        .brand-row h1 { font-size: 1.35rem; margin: 0; letter-spacing: 0.02em; }
        .brand-row p { margin: 4px 0 0; color: ${UI.muted}; font-size: 0.9rem; }
        .brand-row.compact h1 { font-size: 1.05rem; }
        .brand-logo { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: linear-gradient(135deg, #ff9933, #a78bfa); box-shadow: 0 12px 28px rgba(0,0,0,0.28); }

        .tricolor { height: 4px; border-radius: 999px; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr 1fr; margin-bottom: 14px; }
        .tricolor span:nth-child(1) { background: ${UI.saffron}; }
        .tricolor span:nth-child(2) { background: #fff; }
        .tricolor span:nth-child(3) { background: ${UI.indiaGreen}; }

        .glass-card, .panel { background: ${UI.card}; border: 1px solid ${UI.border}; border-radius: 18px; backdrop-filter: blur(14px); box-shadow: 0 16px 34px rgba(0,0,0,0.22); }
        .glass-card { padding: 18px; }
        .glass-card h2 { margin: 0; font-size: 1.05rem; }
        .glass-card p { margin: 6px 0 14px; color: ${UI.muted}; font-size: 0.9rem; }

        .form-grid { display: grid; gap: 12px; }
        .form-grid label, .field-lite { display: grid; gap: 6px; color: ${UI.muted}; font-size: 0.82rem; }
        input, textarea { width: 100%; border: 1px solid rgba(226,232,240,0.2); background: rgba(15,23,42,0.65); border-radius: 12px; color: ${UI.text}; padding: 10px 12px; outline: none; font-size: 0.9rem; transition: border-color 0.2s ease; }
        input:focus, textarea:focus { border-color: rgba(34,211,238,0.7); }
        textarea { resize: vertical; min-height: 90px; }

        .chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { border: 1px solid rgba(226,232,240,0.24); background: rgba(15,23,42,0.62); color: ${UI.text}; border-radius: 999px; padding: 7px 12px; font-size: 0.78rem; cursor: pointer; }
        .chip:hover { border-color: rgba(167,139,250,0.7); }
        .chip.active { border-color: rgba(34,211,238,0.7); box-shadow: 0 0 0 1px rgba(34,211,238,0.35) inset; }
        .icon-chip { display: inline-flex; align-items: center; gap: 6px; }

        .selection-group { margin-top: 14px; display: grid; gap: 8px; }
        .selection-group p { margin: 0; color: ${UI.muted}; font-size: 0.82rem; }

        .error-box { margin-top: 12px; border: 1px solid rgba(251,113,133,0.6); background: rgba(127,29,29,0.3); color: #fecdd3; border-radius: 10px; padding: 8px 10px; font-size: 0.78rem; }

        .primary-btn, .secondary-btn { width: 100%; margin-top: 14px; border: 0; border-radius: 12px; padding: 11px 14px; color: #fff; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; cursor: pointer; }
        .primary-btn { background: linear-gradient(135deg,#ff9933,#a78bfa); }
        .secondary-btn { background: rgba(30,41,59,0.86); border: 1px solid rgba(226,232,240,0.2); }

        .top-header { position: relative; z-index: 1; padding: 14px 16px; display: flex; gap: 12px; justify-content: space-between; align-items: center; flex-wrap: wrap; border-bottom: 1px solid rgba(226,232,240,0.1); background: rgba(2,6,23,0.36); backdrop-filter: blur(8px); }
        .meta-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
        .meta-chip { border: 1px solid rgba(226,232,240,0.24); border-radius: 999px; padding: 5px 10px; font-size: 0.74rem; background: rgba(15,23,42,0.5); }
        .meta-chip.clickable { cursor: pointer; color: #bae6fd; }

        .layout-grid { position: relative; z-index: 1; display: grid; gap: 14px; padding: 16px; grid-template-columns: 1fr; }
        .left-column, .right-column { display: grid; gap: 14px; align-content: start; }

        .panel { padding: 14px; }
        .panel-title { display: inline-flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 650; margin-bottom: 10px; }

        .mood-pill { display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(226,232,240,0.28); border-radius: 999px; padding: 5px 10px; margin-top: 8px; font-size: 0.76rem; }

        .mode-list { display: grid; gap: 8px; }
        .mode-card { border: 1px solid rgba(226,232,240,0.2); background: rgba(15,23,42,0.55); color: ${UI.text}; border-radius: 12px; padding: 10px; display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: start; text-align: left; cursor: pointer; }
        .mode-card strong { font-size: 0.82rem; display: block; }
        .mode-card small { color: rgba(241,245,249,0.82); font-size: 0.72rem; }
        .mode-card.active { border-color: transparent; box-shadow: 0 8px 20px rgba(15,23,42,0.35); }

        .breathing-panel { text-align: center; }
        .coach-intro { margin: 2px 0 10px; color: ${UI.muted}; font-size: 0.78rem; line-height: 1.45; text-align: left; }
        .breath-orb { width: 124px; height: 124px; margin: 10px auto 10px; border-radius: 999px; border: 2px solid rgba(226,232,240,0.3); display: grid; place-content: center; gap: 2px; background: radial-gradient(circle at top, rgba(255,255,255,0.2), rgba(15,23,42,0.5)); animation: pulse 3s ease-in-out infinite; }
        .breath-orb p { margin: 0; font-size: 0.72rem; color: ${UI.muted}; }
        .breath-orb strong { font-size: 1.3rem; }
        .breath-orb small { font-size: 0.68rem; color: ${UI.muted}; }
        .breath-meta { display: flex; justify-content: center; margin-bottom: 8px; gap: 10px; flex-wrap: wrap; }
        .breath-meta span { display: inline-flex; align-items: center; gap: 6px; font-size: 0.72rem; color: ${UI.muted}; }
        .wizard-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 8px; }
        .secondary-btn.mini { margin-top: 0; font-size: 0.76rem; padding: 10px 8px; border-radius: 10px; min-height: 42px; }
        .scripture-tip { margin-top: 10px; border: 1px solid rgba(167,139,250,0.35); background: rgba(76,29,149,0.25); border-radius: 10px; padding: 8px 10px; color: ${UI.muted}; font-size: 0.74rem; line-height: 1.4; text-align: left; }

        .chat-panel { min-height: clamp(460px, 70vh, 640px); display: grid; grid-template-rows: auto auto 1fr auto; }
        .quick-prompt-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .message-list { overflow-y: auto; max-height: min(48vh, 460px); padding-right: 4px; display: grid; gap: 10px; }
        .message { display: grid; gap: 6px; }
        .message.user { justify-items: end; }
        .bubble { max-width: 92%; padding: 11px 12px; border-radius: 13px; border: 1px solid rgba(226,232,240,0.2); background: ${UI.cardSoft}; }
        .message.user .bubble { background: linear-gradient(135deg,rgba(34,211,238,0.2),rgba(167,139,250,0.18)); }
        .bubble p { margin: 0; white-space: pre-line; font-size: 0.88rem; line-height: 1.55; }
        .bubble small { display: block; margin-top: 5px; font-size: 0.68rem; color: ${UI.muted}; }

        .wisdom-box { border: 1px solid rgba(255,153,51,0.35); background: rgba(255,153,51,0.11); border-radius: 10px; padding: 9px 10px; }
        .wisdom-box strong { font-size: 0.72rem; color: #fde68a; }
        .wisdom-box p { margin: 4px 0; font-size: 0.8rem; }
        .wisdom-box small { color: ${UI.muted}; font-size: 0.72rem; }

        .bubble.typing { display: inline-flex; gap: 5px; align-items: center; width: fit-content; }
        .bubble.typing span { width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; animation: typing 1s infinite ease-in-out; }
        .bubble.typing span:nth-child(2) { animation-delay: 0.15s; }
        .bubble.typing span:nth-child(3) { animation-delay: 0.3s; }

        .composer { margin-top: 8px; display: grid; grid-template-columns: 1fr auto; gap: 8px; }
        .composer input { min-height: 44px; }
        .composer button { border: 0; border-radius: 10px; padding: 0 14px; min-width: 44px; min-height: 44px; background: linear-gradient(135deg,#ff9933,#a78bfa); color: #fff; cursor: pointer; }
        .composer button:disabled { opacity: 0.5; cursor: not-allowed; }

        .progress-wrap { height: 8px; border-radius: 999px; background: rgba(148,163,184,0.24); overflow: hidden; margin-bottom: 6px; }
        .progress-bar { height: 100%; background: linear-gradient(90deg,#22c55e,#22d3ee); }
        .todo-list { margin-top: 10px; display: grid; gap: 7px; }
        .todo-item { border: 1px solid rgba(226,232,240,0.18); background: rgba(15,23,42,0.55); color: ${UI.text}; border-radius: 10px; padding: 8px 9px; display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: start; text-align: left; cursor: pointer; }
        .todo-item span { font-size: 0.79rem; line-height: 1.35; }

        .safety-note { border: 1px solid rgba(34,211,238,0.35); background: rgba(8,47,73,0.4); border-radius: 12px; padding: 10px 12px; font-size: 0.76rem; color: ${UI.muted}; display: inline-flex; gap: 8px; align-items: center; }

        @media (max-width: 720px) {
          .onboard-wrap { padding: 20px 12px 42px; }
          .layout-grid { padding: 12px; gap: 12px; }
          .top-header { align-items: flex-start; }
          .meta-row { justify-content: flex-start; width: 100%; }
          .panel { padding: 12px; }
          .chat-panel { min-height: 66vh; }
          .message-list { max-height: 44vh; }
          .wizard-actions { grid-template-columns: 1fr; }
          .chip { min-height: 36px; }
          .meta-chip { min-height: 32px; display: inline-flex; align-items: center; }
        }

        @media (min-width: 960px) {
          .layout-grid { grid-template-columns: 340px minmax(0, 1fr); align-items: start; }
          .message-list { max-height: 52vh; }
        }

        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {profile ? <ChatWorkspace profile={profile} onRestart={() => setProfile(null)} /> : <Onboarding onStart={setProfile} />}
    </>
  );
}
