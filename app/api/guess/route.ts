import { GEMINI_API_BASE, GEMINI_MODEL, GUESS_TIMEOUT_MS } from "@/lib/constants";
import { checkGuess } from "@/lib/scoring";

export async function POST(request: Request) {
  try {
    const { image, topic } = (await request.json()) as {
      image?: string;
      topic?: string;
    };

    if (!image || !topic) {
      return Response.json({ error: "Missing image or topic" }, { status: 400 });
    }

    // Mock mode for development
    const isMock =
      process.env.NEXT_PUBLIC_MOCK_GUESS === "true" ||
      !process.env.GEMINI_API_KEY;

    if (isMock) {
      const mockCorrect = Math.random() > 0.5;
      const guesses = mockCorrect
        ? [topic]
        : ["cat", "dog", "house", "tree", "car", "bird"];
      const mockGuess = mockCorrect
        ? topic
        : guesses[Math.floor(Math.random() * guesses.length)];
      const correct = mockGuess === topic;

      return Response.json({
        guess: mockGuess,
        correct,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY!;
    const rawBase64 = image.replace(/^data:image\/\w+;base64,/, "");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GUESS_TIMEOUT_MS);

    const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: "You are playing Pictionary. Look at this drawing and guess what single word or short phrase it represents. Only respond with your best guess as a single word or short phrase, nothing else. Do not add periods, explanations, or extra text.",
            },
            {
              inlineData: {
                mimeType: "image/png",
                data: rawBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 50,
        topP: 0.95,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini API error:", response.status, text);
      return Response.json(
        { guess: "API error", correct: false, error: text },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
    };

    const candidate = data.candidates?.[0];
    if (!candidate || candidate.finishReason === "SAFETY") {
      return Response.json({
        guess: "Could not guess",
        correct: false,
      });
    }

    const rawGuess =
      candidate.content?.parts?.[0]?.text ?? "Could not guess";
    const correct = checkGuess(rawGuess, topic);

    return Response.json({ guess: rawGuess, correct });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return Response.json(
        { guess: "Timeout", correct: false, error: "Request timed out" },
        { status: 504 }
      );
    }
    console.error("Guess API error:", error);
    return Response.json(
      { guess: "Error", correct: false, error: String(error) },
      { status: 500 }
    );
  }
}
