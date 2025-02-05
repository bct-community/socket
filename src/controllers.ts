import { ChatCompletionMessageParam } from "openai/resources";

import { env } from "./config";
import { io } from "./server";
import { openAICompletion } from "./openAICompletion";

export const MessageController = async ({
  id,
  message,
}: {
  id: string;
  message: string;
}) => {
  const messages: Array<ChatCompletionMessageParam> = [
    { role: "system", content: env.OPENAI_SYSTEM_MESSAGE },
    { role: "user", content: message },
  ];

  const chatText = await openAICompletion({ messages });

  io.to(id).emit("bot-message", chatText);
};
