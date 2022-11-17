import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
const handler = async function handler(req:NextApiRequest, res: NextApiResponse) {
    if(req.method != 'GET') return res.status(405);
    const stsClass = req.query.class;
    const stsClassStr = Array.isArray(stsClass) ? stsClass[0]: stsClass;

    if(stsClassStr){        
    const stsClass = await prisma.stSClass.findFirst({where:{name:stsClassStr},include:{cards:true}});
    return res.status(200).json(stsClass || "invalid class");
    }
    const strCards = await (await prisma.stSCard.findMany({distinct:'name'}));
    return res.status(200).json(strCards);
}

export default handler;