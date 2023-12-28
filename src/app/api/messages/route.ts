import { NextResponse } from "next/server";

interface RequestBody {
  message: string;
 chatRoomId: string;
 userId : string;
}
export const POST = async (req: Request, res: Response) => {
   const rquestBody: RequestBody = await req.json()
    const prisma = globalThis.prisma;
    console.log(rquestBody);
    const message = await prisma?.message.create({
        data: {

          content: rquestBody.message,
            chatRoomId: rquestBody.chatRoomId,
            userId: rquestBody.userId,
              
        }}
        )
        console.log(message);
    return new NextResponse("created", { status: 200 })

}
  
export const GET = async (req: Request) => {
    const prisma = globalThis.prisma;
    const searchParams = new URL(req.url);
    const chatRoomId = searchParams.searchParams.get('chatRoomId');
    // const data = await req.json();
    
    const messages = await prisma?.message.findMany({
        where:{
            chatRoomId: chatRoomId as string
        }
    })
    console.log(messages);
    return new NextResponse(  JSON.stringify(messages), { status: 200 })
}