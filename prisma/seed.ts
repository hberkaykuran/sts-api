import axios from 'axios';
import { load } from 'cheerio';
import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getClassInfo = async (className: string) =>{
    const {data} = await axios.get(`https://slay-the-spire.fandom.com/wiki/${className}`);
    const $ = load(data);
    let name = $("#firstHeading").text().trimStart().split(' ')[0];
    let table = $("#mw-content-text").find("div.mw-parser-output").find("table").find("tbody");
    let cards : Prisma.StSCardCreateManyStSClassInput[] = [];
    table.find("tr").each(function () {
        let card : Prisma.StSCardCreateWithoutStSClassInput={            
            name: "",
            details: "",
            image: "",       
        };
        let rowElements = $(this).find("td").each(function(i,el){
            switch(i){
                case 0:{                
                    card.name = $(el).find("a").text();
                    break;
                }
                case 1:{
                    card.image = $(el).find("figure").find("a").attr("href")?.split(".png")[0] + ".png";
                    break;
                }
                case 5:{
                    card.details = $(el).text().trim();
                    break;
                }
                default:{
                    break;
                }
            }
            
        });        
        cards.push(card);

    })
    let classInfo: Prisma.StSClassCreateInput = 
    {
        name: name,
        cards: {createMany:{data:cards}}
    }

    return classInfo;
}



const loadClassesAndCards = async () => {
    try{
        const classInfoPromises = classNames.map((className) => getClassInfo(className));
        const classes : Prisma.StSClassCreateInput[] = await Promise.all(classInfoPromises);
        classes.forEach(async (c: Prisma.StSClassCreateInput)=>{
            await prisma.stSClass.create({data:c});       
        })
         
    }catch(err){
        console.log(err);
    }
}

const classNames = [
"Ironclad_Cards",
"Silent_Cards",
"Defect_Cards",
"Watcher_Cards",
]

loadClassesAndCards();