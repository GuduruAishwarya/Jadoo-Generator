import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export default async function handler(req: NextRequest, res: NextResponse<any>){
    
    const pythonApi = process.env.pythonApi
    try{
        const body = req.body
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
        const apiRes = await instance.post("/api/json",data)
        console.log('api res status', apiRes.status)
        return res.status(200).json({
            data: apiRes.data
        })
      }catch(err){
        res.status(400).json({ message: err.message  })
      }
}

