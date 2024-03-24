import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export default async function getStreamingEndpoint(nexReq: NextRequest, nextRes: NextResponse){
    const pythonApi = process.env.pythonApi
    try{
        const body = nexReq.body
        const {
            schema:schemaText,
            objectName,
            records
        } = body;

        const instance = axios.create({
          baseURL: pythonApi,
          // timeout: 5000,
          headers: { "Content-Type": "application/json" },
        });
        const data = {
          data: schemaText,
          object_name: objectName,
          records
        }
        const apiRes = await instance.post("/api/GenerateApi",data)
        console.log("apiRes2", apiRes.data)
        return nextRes.status(200).json({
            data: apiRes.data
        })
      }catch(err){
        nextRes.status(400).json({ message: err.message  })
      }
}

