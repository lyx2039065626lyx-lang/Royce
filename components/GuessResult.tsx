"use client";

interface GuessResultProps {
  guess: string;
  topic: string;
  correct: boolean;
  score: number;
}

export default function GuessResult({
  guess,
  topic,
  correct,
  score,
}: GuessResultProps) {
  return (
    <div className="animate-slide-in">
      <div
        className={`px-6 py-4 border text-center ${
          correct
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        {correct ? (
          <>
            <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
              Correct
            </div>
            <div className="text-black font-bold text-lg">
              AI guessed: &ldquo;{guess}&rdquo;
            </div>
            <div className="text-black font-black text-2xl mt-1 tabular-nums">
              +{score}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              Not Quite
            </div>
            <div className="text-gray-700 font-medium">
              AI guessed: &ldquo;{guess}&rdquo;
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Topic was: &ldquo;{topic}&rdquo;
            </div>
          </>
        )}
      </div>
    </div>
  );
}
