import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getChatRoomMessages(chatRoomId) {
    const messages = await prisma.message.findMany({
        where: {
        chatRoomId: chatRoomId,
        },
    });
    return messages;
}

async function setChatRoomUsers(chatRoomId, userId, content) {
  const message =await prisma?.message.create({
    data: {
      chatRoomId: chatRoomId,
      userId: userId,
      content: content,
    },
  });
  
}

export { getChatRoomMessages, setChatRoomUsers };