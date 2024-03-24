import { axiosWraper } from "@/util/api";
import { getMysqlRequestData } from "@/util/api/mysql";
import { NextRequest, NextResponse } from "next/server";

export default async function(req: NextRequest, res: NextResponse){
    try{
        const body = req.body
        const {
            schema:schemaText,
            records
        } = body;

        const mysqlReqData = getMysqlRequestData(schemaText, records)
        const instance = axiosWraper.getPythonAPIInstance()
        const apiRes = await instance.post("/api/GenerateApi",mysqlReqData)
        return res.status(200).json({
            data: apiRes.data
        })
      }catch(err){
        console.log('err', err)
        res.status(400).json({ message: err.message  })
      }
}