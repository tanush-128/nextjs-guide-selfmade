import { NextResponse } from "next/server";

export default  async function getHandler (req: Request){
    const { searchParams } = new URL(req.url);
    if (!searchParams.has("slug")) {
      const posts = await prisma?.post.findMany();
      try {
        return new NextResponse(JSON.stringify(posts), { status: 200 });
      } catch (e: any) {
        return new Response(e.message);
      }
    }
    const slug = searchParams.get("slug");
    const post = await prisma?.post.findUnique({
      where: {
        slug: slug as string,
      },
    });
    try {
      return new NextResponse(JSON.stringify(post), { status: 200 });
    } catch (e: any) {
      return new Response(e.message);
    }
  };
  