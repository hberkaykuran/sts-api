import Head from "next/head";
import {FaGithub, FaGoogle} from "react-icons/fa";

export default function Home() {
  return (    
    <div>
      <Head>
        <title>StS API</title>
      </Head>
      <div className="items-center w-[100vw] h-[100vh] flex flex-col">
        <div className="mt-52">
          <p className="text-2xl">This is the StS API. For more information:</p>
        </div> 
        <div className="space-y-5 mt-8">
          <div className="customButton">
            <a href="https://github.com/hberkaykuran/sts-api" target="_blank" rel="noreferrer">
              <FaGithub className="w-10 h-10 inline-block "/> 
              <p className="flex-grow text-center">Go to Documentation</p>
            </a>
          </div>
          <div className="customButton">
            <a href="mailto:berkaykuran54@gmail.com">
              <FaGoogle className="w-8 h-8 inline-block "/>
              <p className="flex-grow text-center">Contact Me</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
