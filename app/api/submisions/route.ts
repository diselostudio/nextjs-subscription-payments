export async function POST(req: Request) {
    const body = await req.text();
    const { headers, url } = req;

    console.log('-------------------')
    console.log(body)
    console.log(headers)
    console.log(url)
    console.log('-------------------')

    return new Response(
        JSON.stringify({ received: true }),
        {
            status: 200
        }
    );
}