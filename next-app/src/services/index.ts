"use client";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { BACKEND_API } from "./constants";
import { SchemaType } from "@/components/DownloadSelection";
const errorCheck = (data: any[], download: string | undefined, recordCount: number) => {
  if (data.length) {
    data.map((v, index) => {
      console.log(v.dataType.length, v.fieldName === "");
      if (v.fieldName === "" && v.dataType.length == 0) data.splice(index, 1);
      if (
        (v.fieldName === "" && v.dataType.length) ||
        (v.fieldName != "" && v.dataType.length == 0)
      )
        throw "Fill the schema completely";
    });
  } else throw "Fill at least one field";
  if (download === "" || !download) {
    throw "Select proper download Type";
  }
  if (recordCount === 0) {
    throw "Generate atleast 1 record";
  }
};
export const createSchemaGeneratingData = async (
  data: any,
  download: string | undefined,
  recordCount: number,
  setDownloadData: (val: any)=> void 
) => {
  console.log("generatingData", data, download, recordCount, setDownloadData);
  try {
    await errorCheck(data, download, recordCount);
    const response = await fetch(`http://localhost:8000/api/createSchema`, {
      method: "POST",
      headers: { "Content-Type": "application/json","Access-Control-Allow-Origin":"*"  },
      body: JSON.stringify({
        data,
        returnFormat: !!download,
        records: Number(recordCount),
      }),
    });
    console.log("Response:",response)
    const res = await response.json();
    console.log("Res:",res)
    if (!res?.success) throw res?.error ;
    else {
      await setDownloadData(res?.data);
      return res;
    }
  } catch (error) {
    console.error("Error :", error);
    return { success: false, error };
  }
};

export const GeneratingApiData = async (
  data: any,
  recordCount: number,
  setUrl: (url: string)=> void,
  type: SchemaType,
  getValue?: any
) => {
  console.log("generatingData", data,  recordCount, setUrl);
  try {

    if(type == "typescript"){
      const [value, setCacheSchema, cacheSchema, selectedObject] = getValue()
      let valiationData;
      if (!cacheSchema) {
        const tsValidationResponse = await getTsFormatedData(value);
        if (tsValidationResponse.ok) {
          setCacheSchema(tsValidationResponse.data);
        } else {
          return;
        }
        valiationData = tsValidationResponse.data;
      } else {
        valiationData = cacheSchema;
      }

      const response = await fetch(
        `http://localhost:3000/api/get-streaming-endpoint`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schema: valiationData?.data,
            objectName:
              selectedObject ?? [...valiationData.topLevelEntities].pop(),
            records: Number(recordCount),
          }),
        }
      );
      const res = await response.json();
      setUrl(res.data)
      return { success: true };
    }else if(type == "sql"){
      const [value] = getValue()
      const mysqlresponse = await fetch(
        `http://localhost:3000/api/get-streaming-msyl-endpoint`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schema: value,
            records: Number(recordCount),
          }),
        }
      );
      if (!mysqlresponse.ok) return;
      const res = await mysqlresponse.json();
      setUrl(res.data)
      return { success: true };
    }
    const response = await fetch(`http://localhost:8000/api/GenerateApi`, {
      method: "POST",
      headers: { "Content-Type": "application/json","Access-Control-Allow-Origin":"*"  },
      body: JSON.stringify({
        data,
        records: Number(recordCount),
      }),
    });
    console.log("Response:",response)
    const res = await response.json();
    console.log("Res:",res)
    setUrl(res);
  } catch (error) {
    console.error("Error :", error);
    return { success: false, error };
  }
};

export const downloadJSON = (data: any, fieldName?: string) => {
  console.log("downloadJSON", data);
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data.length > 1 ? data : data[0], undefined, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = (fieldName ?? "data") + ".json";

  link.click();
  link.remove();
};
export const downloadExcel = (downloadData: any[], fileName?: string) => {
  fileName = fileName ?? "test";
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  downloadData.map((v, index) => {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(v);
    XLSX.utils.book_append_sheet(wb, ws, `sheet-${index}`);
  });

  // XLSX.writeFile(wb, fileName);
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const xlsxData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(xlsxData, fileName + fileExtension);
};

export const DownloadData = (
  download: string,
  res: any,
  csvLink?: any,
  fileName?: string
) => {
  console.log("download, res, csvLink", download, res, csvLink, fileName);
  if (res.length)
    switch (download) {
      case "xlsx":
        downloadExcel(res, fileName);
        break;
      case "csv":
        [...csvLink?.current?.children]?.forEach((v) => v.click());
        break;
      case "json":
        downloadJSON(res, fileName);
        break;
      default:
        break;
    }
};

export async function getTsFormatedData(value: string) {
  const response = await fetch(
    `${BACKEND_API.baseUrl}${BACKEND_API.valifyTypeScript.url}`,
    {
      method: BACKEND_API.valifyTypeScript.method.post,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: value,
      }),
    }
  );
  const data = await response.json();
  return warpApiData(response, data);
}

function warpApiData<T>(res: Response, data: T) {
  return {
    ok: res.ok,
    data,
  };
}
