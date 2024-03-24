import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { getTsToJsonSchema, isValidTypescriptJsonSChema } from "../../src/util/tsToJSON"

export default async function handler(req: NextRequest, res: NextResponse<any>){
    if(req.method != "POST"){
        return res.status(404).json({})
    }
    const tempDir = process.env.tempDir
    const pythonApi = process.env.pythonApi
    try{
        // const body = req.body
        // // save text in file
        // writeFileSync(`${tempDir}/temp.ts`, body.text)
        // // compile with typescript to find any errors in typescript
        // execSync(`tsc ${tempDir}/temp.ts ${tempDir}/temp.ts > ${tempDir}/error.txt`)
        // // convert typescript ton json schema
        // execSync(`typescript-json-schema "${tempDir}/temp.ts" "*" --required true --refs false  -o "${tempDir}/temp.json" --constAsEnum`)
        // const jsonSchemaFile = readFileSync(`${tempDir}/temp.json`)
        // // remove unwanted fields: function types
        // const jsonRes = isValidTypescriptJsonSChema(JSON.parse(jsonSchemaFile))
        // return res.status(200).json({
        //     ...jsonRes
        // })

        const body: any = req.body || {}
       const jsonSchema = await getTsToJsonSchema(body.text)
      //  console.log("jsonSchema", jsonSchema)
        const jsonRes = isValidTypescriptJsonSChema(jsonSchema)
        return res.status(200).json(
          jsonRes
        )
      }catch(err){
        res.status(400).json({
          message: err.message
        })
      }
}

