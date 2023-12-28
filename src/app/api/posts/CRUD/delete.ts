import { NextResponse } from "next/server";

export default async function deleteHandler (req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const post = await prisma?.post.delete({
      where: {
        slug: slug as string,
      },
    });
    return new NextResponse(JSON.stringify(post), {
      status: 200,
    });
  };