import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async function handler(req:NextApiRequest, res: NextApiResponse) {
    const stsClass = req.query.class;
    const stsClassStr = Array.isArray(stsClass) ? stsClass[0]: stsClass; 
    const stsCardUpvoteId = req.query.upvoteId;
    const stsCardUpvoteIdNum = Array.isArray(stsCardUpvoteId) ? stsCardUpvoteId[0]: stsCardUpvoteId; 
    const stsCardDownvoteId = req.query.downvoteId;
    const stsCardDownvoteIdNum = Array.isArray(stsCardDownvoteId) ? stsCardDownvoteId[0]: stsCardDownvoteId; 
    if(!stsClassStr) res.status(200).json("Class is required");
    
    if(req.method == 'GET'){
        const stsCardVotes = await prisma.stSCardVote.findMany({where:{class:stsClassStr}, include:{card:true}})
        if(stsCardVotes) return res.status(200).json(stsCardVotes || "invalid class");       
    }

    if(req.method == 'POST'){
        if(!stsCardUpvoteIdNum || !stsCardDownvoteIdNum) return res.status(200).json("Both upvoteId and downvoteId are required");
        const upC = await prisma.stSCardVote.update({where:{id:parseInt(stsCardUpvoteIdNum)},data:{upvotes:{increment:1},timesListed:{increment:1}}});
        const downC = await prisma.stSCardVote.update({where:{id:parseInt(stsCardDownvoteIdNum)},data:{timesListed:{increment:1}}});
        if(upC && downC) return res.status(200).json("Vote submitted");
    }

    return res.status(405);
}

export default handler;