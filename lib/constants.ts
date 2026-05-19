export const ROUNDS_PER_GAME = 5;
export const ROUND_TIME_SECONDS = 90;
export const TOPIC_REVEAL_DELAY_MS = 3000;
export const SCORED_DISPLAY_MS = 3000;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const MAX_UNDO_STEPS = 30;
export const BASE_SCORE = 1000;
export const MAX_TIME_BONUS = 500;
export const MAX_GAME_HISTORY = 20;
export const MAX_HIGH_SCORES = 10;

export const COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#0000FF",
  "#00FF00",
  "#FFFF00",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#8B4513",
  "#808080",
  "#00FFFF",
];

export const DEFAULT_BRUSH_SIZE = 4;
export const DEFAULT_BRUSH_COLOR = "#000000";
export const GEMINI_MODEL = "gemini-2.5-flash";
export const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";
export const GUESS_TIMEOUT_MS = 25000;

export const MOCK_TOPICS: Record<string, string[]> = {
  easy: [
    "cat","dog","house","tree","car","sun","moon","star","fish","bird",
    "apple","banana","flower","heart","smile","clock","book","chair",
    "table","hat","shoe","key","cup","ball","door","eye","hand","cloud",
    "mountain","boat",
  ],
  medium: [
    "bicycle","guitar","pizza","robot","rainbow","rocket","umbrella",
    "volcano","lighthouse","windmill","scissors","telescope","helicopter",
    "parachute","skateboard","snowman","sunflower","treasure","waterfall",
    "dinosaur","airplane","mushroom","castle","diamond","pirate","anchor",
    "wizard","dragon","crown","tornado",
  ],
  hard: [
    "photosynthesis","gravity","democracy","evolution","symphony","eclipse",
    "constellation","archipelago","renaissance","labyrinth","palindrome",
    "quarantine","silhouette","metropolis","origami","safari",
    "hieroglyphics","metamorphosis","kaleidoscope","acupuncture",
  ],
};
