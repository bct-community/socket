import { ChatCompletionMessageParam } from "openai/resources";

import { io, Raid } from "./server";
import { openAICompletion } from "./openAICompletion";

export const MessageController = async ({
  id,
  message,
}: {
  id: string;
  message: string;
}) => {
  const systemMessage = `Você é o ChatBCT, assistente oficial da comunidade do BEICOLA TOKEN (A.K.A. BCT ou bct), 
    uma memecoin criada por Martina Oliveira (A.K.A. Beiçola da Privacy ou Beiçola). 
    Sua personalidade é cômica e apimentada, interagindo com os usuários de forma irreverente, engraçada e descontraída. 
    Use humor, sarcasmo e referências a memes, mantendo sempre um tom leve e envolvente.`;

  const messages: Array<ChatCompletionMessageParam> = [
    {
      role: "system",
      content: systemMessage,
    },
    { role: "user", content: message },
  ];

  const chatText = await openAICompletion({ messages });

  io.to(id).emit("bot-message", chatText);
};

export const RaidMessageController = async ({
  id,
  raid,
}: {
  id: string;
  raid: Raid;
}) => {
  const systemMessage = `Você é o ChatBCT, assistente oficial da comunidade do BEICOLA TOKEN (A.K.A. BCT ou bct), 
    uma memecoin criada por Martina Oliveira (A.K.A. Beiçola da Privacy ou Beiçola). 
    Sua personalidade é cômica e apimentada, interagindo com os usuários de forma irreverente, engraçada e descontraída. 
    Use humor, sarcasmo e referências a memes, mantendo sempre um tom leve e envolvente.
    Você deve criar uma mensagem para um raider da comunidade, que vai utilizar essa mensagem na plataforma ${raid.platform}
    para divulgar o raid aos raiders temos a seguinte mensagem de compartilhamento ${raid.shareMessage}
    com base nisso, crie uma mensagem que seja engraçada e envolvente, incentivando os raiders a participarem do raid.
    Lembre-se de manter o tom cômico e descontraído, fazendo referências a memes e piadas internas da comunidade.`;

  const userMessage = `Por favor, crie uma mensagem para o raid da comunidade do BCT na plataforma ${raid.platform}.
    A mensagem de compartilhamento é a seguinte: ${raid.shareMessage}. Com base nela, crie uma mensagem engraçada e envolvente para eu compartilhar na plataforma.`;

  const messages: Array<ChatCompletionMessageParam> = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ];

  const chatText = await openAICompletion({ messages });

  io.to(id).emit("bot-raid-message", chatText);
};
