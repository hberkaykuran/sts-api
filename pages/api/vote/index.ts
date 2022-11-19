import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async function handler(req:NextApiRequest, res: NextApiResponse) {
    console.log("HERE!");
    console.log(req.method);    
    const stsClass = req.query.class;
    const stsClassStr = Array.isArray(stsClass) ? stsClass[0]: stsClass; 
    const stsCardUpvoteId = req.query.upvoteId;
    const stsCardUpvoteIdNum = Array.isArray(stsCardUpvoteId) ? stsCardUpvoteId[0]: stsCardUpvoteId; 
    const stsCardDownvoteId = req.query.downvoteId;
    const stsCardDownvoteIdNum = Array.isArray(stsCardDownvoteId) ? stsCardDownvoteId[0]: stsCardDownvoteId; 
    console.log(stsCardUpvoteIdNum + " " + stsCardDownvoteIdNum);
    if(!stsClassStr) res.status(200).json("Class is required");
    
    if(req.method == 'GET'){           
        //const stsClass = await prisma.stSClass.findFirst({where:{name:stsClassStr},include:{cards:{include: {votes:true}}}});
        const stsCardVotes = await prisma.stSCardVote.findMany({where:{class:stsClassStr}, include:{card:true}})
        if(stsCardVotes) return res.status(200).json(stsCardVotes || "invalid class");       
        //const shuffled = [...stsClass.cards].sort(() => 0.5 - Math.random());
    }

    if(req.method == 'POST'){
        console.log(stsCardUpvoteIdNum + " " + stsCardDownvoteIdNum);
        console.log("test");
        if(!stsCardUpvoteIdNum || !stsCardDownvoteIdNum) return res.status(200).json("Both upvoteId and downvoteId are required");
        console.log("passed test");
        const upC = await prisma.stSCardVote.update({where:{id:parseInt(stsCardUpvoteIdNum)},data:{upvotes:{increment:1},timesListed:{increment:1}}});
        const downC = await prisma.stSCardVote.update({where:{id:parseInt(stsCardDownvoteIdNum)},data:{timesListed:{increment:1}}});
        if(upC && downC) return res.status(200).json("Vote submitted");
    }

    return res.status(405);
}

export default handler;