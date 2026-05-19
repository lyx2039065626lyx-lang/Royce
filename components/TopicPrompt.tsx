"use client";

interface TopicPromptProps {
  topic: string | null;
  visible: boolean;
}

export default function TopicPrompt({ topic, visible }: TopicPromptProps) {
  if (!visible || !topic) {
    return (
      <div className="text-center py-4">
        <span className="text-gray-300 text-lg font-light">
          Waiting for topic...
        </span>
      </div>
    );
  }

  return (
    <div className="text-center py-4 animate-fade-in">
      <span className="text-xs font-bold text-gray-300 uppercase tracking-widest block mb-1">
        Draw
      </span>
      <span className="text-4xl font-black text-black tracking-tight">
        {topic}
      </span>
    </div>
  );
}
