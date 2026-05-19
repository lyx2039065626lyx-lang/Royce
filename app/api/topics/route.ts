import { getRandomTopic } from "@/lib/topics";

export async function GET() {
  const data = getRandomTopic();
  return Response.json(data);
}
