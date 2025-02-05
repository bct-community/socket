import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

import { env } from "./config";

const client = new OpenAI();

export const openAICompletion = async ({
  messages,
}: {
  messages: Array<ChatCompletionMessageParam>;
}) => {
  const response = await client.chat.completions.create({
    messages,
    model: env.OPENAI_MODEL,
    max_tokens: 200,
    temperature: 0.1,
  });

  const chatText = response.choices[0].message.content;

  return chatText;
};
