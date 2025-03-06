import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

import { env } from "./config";
import { MessageController, RaidMessageController } from "./controllers";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { formatMsToTime } from "./utils";

// Limita cada IP a 5 mensagens a cada 12 horas
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 12 * 60 * 60,
});

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ["https://localhost:5173", "https://bct-community.netlify.app"],
};

app.use(cors(corsOptions));

export const io = new Server(server, {
  cors: { origin: corsOptions.origin },
});

export type Raid = {
  platform: string;
  shareMessage: string;
};

io.on("connection", (socket: Socket) => {
  socket.on("message", async (message: string) => {
    try {
      await rateLimiter.consume(socket.handshake.address);
      MessageController({ id: socket.id, message });
    } catch (error) {
      const rejRes = error as RateLimiterRes;

      const message = `Você atingiu o limite de mensagens. Tente novamente em ${formatMsToTime(
        { ms: rejRes.msBeforeNext }
      )}.`;

      const blockDate = new Date();

      const unblockDate = new Date(blockDate.getTime() + rejRes.msBeforeNext);

      const unblockDateFormatted = unblockDate.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });

      socket.emit("blocked", {
        message,
        unblockDateFormatted,
        unblockDate,
      });
    }
  });

  socket.on("raid-message", async (raid: Raid) => {
    try {
      await rateLimiter.consume(socket.handshake.address);
      RaidMessageController({ id: socket.id, raid });
    } catch (error) {
      const rejRes = error as RateLimiterRes;

      const message = `Você atingiu o limite de mensagens. Tente novamente em ${formatMsToTime(
        { ms: rejRes.msBeforeNext }
      )}.`;

      const blockDate = new Date();

      const unblockDate = new Date(blockDate.getTime() + rejRes.msBeforeNext);

      const unblockDateFormatted = unblockDate.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });

      socket.emit("blocked", {
        message,
        unblockDateFormatted,
        unblockDate,
      });
    }
  });
});

server.listen(env.PORT, () => {
  console.log(`[server] --> Running at http://localhost:${env.PORT}`);
});
