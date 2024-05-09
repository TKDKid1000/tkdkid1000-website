import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
    name: string
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        res.status(200).json({
            name: "bob"
        } as Data)
    }
}

export default handler
