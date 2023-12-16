export const GET = async (req: Request) => {
    const searchParams = new URL(req.url);
    const userEmail = searchParams.searchParams.get('userEmail');
    const prisma = globalThis.prisma;
    const user = await prisma?.user.findUnique({
        where: {
            email: userEmail as string
        }
    })

    return new Response(JSON.stringify({userId :user?.id}), { status: 200 })

}