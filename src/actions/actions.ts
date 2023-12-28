"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getChatRoomMessages(userEmail: string) {
  const prisma = new PrismaClient();

  const chatrooms = await prisma.chatRoom.findMany({
    where: {
      users: {
        some: {
          user: {
            email: userEmail,
          },
        },
      },
    },
    include: {
      messages: true,
      users: {
        include: {
          user: true,
        },
      },
    },
  });

  return chatrooms;
}

export const getUsers = async (contains: string) => {
  const users = await prisma?.user.findMany({
    where: {
      name: {
        contains: contains as string,
        mode: "insensitive",
      },
    },
  });

  return users;
};

export const createChatRoom = async (name: string, userEmails: string[]) => {
  const chatRoom = await prisma?.chatRoom.create({
    data: {
      name: name,
      users: {
        create: userEmails.map((email) => {
          return {
            user: {
              connect: {
                email: email,
              },
            },
          };
        }),
      },
    },
  });
  console.log(chatRoom);
  revalidatePath("/");
};
