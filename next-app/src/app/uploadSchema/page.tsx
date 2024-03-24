"use client";
import { useContext, useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import DownloadSelection from "@/components/DownloadSelection";
import { DownloadData, getTsFormatedData } from "@/services";
import { checkTypescript } from "@/services/tsservice";
import { PreviewModel } from "@/components/preview";
import { ToastContainer, toast } from "react-toastify";
import { LoaderContext } from "@/components/Loader";
import { GenerateApi } from "@/components/generateApi";
import "react-toastify/dist/ReactToastify.css";
import { headingContext } from "../layout";

const UploadSchema = () => {
  const ref = useRef(null);
  const [download, setDownload] = useState("");
  const [schemaType, setSchemaType] = useState("typescript");
  const [recordCount, setRecordCount] = useState(0);
  const [isOpenPreview, setIsOpenPreview] = useState(true);
  const [previewData, setPreviewData] = useState<any>();
  const [url, setUrl] = useState();
  const [tsCompiledData, setTsCompiledData] = useState<{
    data: string;
    topLevelEntities: string[];
    warnings: string[];
  }>();
  const [updatedString, setUpdatedString] = useState(true);
  const [errors, setErrors] = useState([]);
  const [selectedObject, setSelectedObject] = useState<string>();
  const loader = useContext(LoaderContext);
  const heading = useContext(headingContext);
  const csvLink = useRef();
  useEffect(() => {
    console.log(schemaType, download, recordCount);
  });
  const settingToast = (e: string) => {
    toast.error(e, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const setMode = () => {
    switch (schemaType) {
      case "typescript":
        return "javascript";
        break;
      case "sql":
        return "mysql";
        break;
    }
  };

  const verifySchema = async (fromOnChange = false) => {
    console.log("schemaType..", schemaType);
    switch (schemaType) {
      case "typescript": {
        const value = ref.current.editor.getValue();
        const tsRes = checkTypescript(value);
        console.log("tsErrors", tsRes);
        setErrors(
          tsRes.errors.map(
            (err) =>
              `${err.position.line}:${err.position.character} ${err.message}`
          )
        );
        if (tsRes.errors.length == 0) {
          setTsCompiledData({
            ...tsCompiledData,
            topLevelEntities: [...tsRes.types],
          });
        } else {
          setTsCompiledData({
            ...tsCompiledData,
            topLevelEntities: [],
          });
        }
      }
    }
  };

  const generatingData = async () => {
    if (errors.length) {
      return;
    }
    try {
      loader.setLoading(true);
      switch (schemaType) {
        case "typescript":
          {
            const value = ref.current.editor.getValue();
            let valiationData;
            if (updatedString) {
              const tsValidationResponse = await getTsFormatedData(value);
              if (tsValidationResponse.ok) {
                setTsCompiledData(tsValidationResponse.data);
              } else {
                return;
              }
              console.log("data:::::::", tsValidationResponse);

              valiationData = tsValidationResponse.data;
            } else {
              valiationData = tsCompiledData;
            }

            setUpdatedString(false);

            const response = await fetch(
              `http://localhost:3000/api/get-data-from-ts-schema`,
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
            setIsOpenPreview(true);
            setPreviewData(res.data.data);
            DownloadData(download, [res.data.data], csvLink);
          }
          break;
        case "sql":
          {
            const value = ref.current.editor.getValue();
            const mysqlresponse = await fetch(
              `http://localhost:3000/api/get-data-from-mysql`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  schema: value,
                  records: Number(recordCount),
                }),
              }
            );
            console.log("mysqlresponse.ok", mysqlresponse.ok);
            if (!mysqlresponse.ok) return;
            const mysqlres = await mysqlresponse.json();
            console.log("mysqlres", mysqlres);
            const data = mysqlres.data.data;
            const formatedData = Object.entries(data).reduce(
              (
                acc: { [id: string]: any },
                [tableName, tableValue]: [string, any]
              ) => {
                acc[tableName] = [tableValue.columns];
                const table: string[][] = acc[tableName];
                const v = tableValue.data as Array<Array<string>>;
                v.forEach((e) => {
                  table.push(e);
                });
                return acc;
              },
              {}
            );
            setIsOpenPreview(true);
            setPreviewData({
              sqldata: true,
              data: formatedData,
            });
          }
          break;
      }
    } catch (error) {
      console.error("Error :", error);
    } finally {
      loader.setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-[77vw] h-[75vh] pl-20 pt-4 ">
      <div className="container flex flex-col gap-4 py-4 px-6 pb-8 bg-white rounded-lg">
        <div className="flex justify-between items-baseline w-full">
          <div className="text-lg font-bold">{heading}</div>
          <select
            defaultValue="typescript"
            name="schemaType"
            onChange={(e) => {
              setSchemaType(e.target.value);
            }}
            className="border-2 border-purple-300 rounded-md p-2 w-64"
          >
            <option value="">Select a Schema type</option>
            <option value="typescript">TypeScript</option>
            <option value="sql">SQL</option>
          </select>
        </div>
        <AceEditor
          height="100px"
          width="100%"
          ref={ref}
          mode={setMode()}
          onChange={(val) => {
            setUpdatedString(true);
            verifySchema(true);
            console.log("val", val);
          }}
          theme="github"
          fontSize="16px"
          highlightActiveLine={true}
          setOptions={{
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />

        {errors.length > 0 && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {errors.map((err, i) => (
              <div key={i} className="block sm:inline">
                <span className="block sm:inline">{err}</span>
              </div>
            ))}
          </div>
        )}
        {recordCount <= 0 && <ToastContainer />}

        <DownloadSelection
          setDownload={setDownload}
          recordCount={recordCount}
          setRecordCount={setRecordCount}
          disableDownloadtype={true}
          data={previewData}
          setError={(e) => {
            settingToast(e);
          }}
          getValue={() => {
            const data = [ref.current.editor.getValue()];
            if (schemaType === "typescript") {
              data.push((schemaString) => {
                setTsCompiledData(schemaString);
                setUpdatedString(false);
              });
              data.push(updatedString ? undefined : tsCompiledData);
              data.push(selectedObject);
            }
            return data;
          }}
          previewData={generatingData}
          schemaOptions={tsCompiledData?.topLevelEntities}
          setSelectedOpation={setSelectedObject}
          type={schemaType}
        />
        <GenerateApi
          recordCount={recordCount}
          data={previewData}
          setUrl={setUrl}
          url={url}
          setError={(e) => {
            settingToast(e);
          }}
          type={schemaType}
          getValue={() => {
            const data = [ref.current.editor.getValue()];
            if (schemaType === "typescript") {
              data.push((schemaString) => {
                setTsCompiledData(schemaString);
                setUpdatedString(false);
              });
              data.push(updatedString ? undefined : tsCompiledData);
              data.push(selectedObject);
            }
            return data;
          }}
        />
        <PreviewModel
          filename={
            schemaType == "typescript" ? selectedObject : "Test-SQL-data"
          }
          isOpen={isOpenPreview && !!previewData}
          data={previewData}
          closeModal={() => {
            setIsOpenPreview(false);
          }}
        />
      </div>
    </div>
  );
};

export default UploadSchema;
