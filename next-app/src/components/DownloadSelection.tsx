import { DownloadData, createSchemaGeneratingData } from "../services/index";

export type SchemaType = "typescript" | "sql" | undefined;

const DownloadSelection: React.FC<{
  data: any;
  setError: (error: unknown) => void;
  download: string;
  setDownload: (val: string) => void;
  recordCount: number;
  setRecordCount: (count: number) => void;
  disableDownloadtype?: boolean;
  previewData?: () => void;
  generate: boolean;
  schemaOptions?: string[];
  setSelectedOpation?: (val: string) => void;
  type: string
}> = ({
  data,
  setError,
  download,
  setDownload,
  setDownloadData,
  recordCount,
  setRecordCount,
  disableDownloadtype = false,
  csvLink,
  previewData,
  generate = false,
  schemaOptions,
  setSelectedOpation,
  type
}) => {
  const GeneratingActualData = async () => {
    const result = await createSchemaGeneratingData(
      data,
      download,
      recordCount,
      setDownloadData
    );
    return result;
  };
  const checkErrors = () => {
      if (download === "" || !download) {
        setError("select proper download Type");
      }
      if (recordCount <= 0) {
        setError("Generate atleast one Record");
      }
  };
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex gap-4 items-baseline">
        {!disableDownloadtype && (
          <select
            name="downloadType"
            onChange={(e: any) => {
              setDownload(e.target.value);
            }}
            className="border-2 border-purple-300 rounded-md p-2 w-64"
          >
            <option value="">Select a download type</option>
            <option value="json">json</option>
            <option value="xlsx">xlsx</option>
            <option value="csv">csv</option>
          </select>
        )}
        <label htmlFor="fieldName">Records</label>
        <input
          name="records"
          type="number"
          min={1}
          max={10000}
          value={recordCount}
          onChange={(e: any) => {
            setRecordCount(e.target.value);
          }}
          className="border-2 border-purple-300 rounded-md p-2 w-48"
        />

        { type == "typescript" && (schemaOptions?.length || 0) > 0 && (
          <>
            <select
              name="object selection"
              onChange={(e) => {
                if (setSelectedOpation) setSelectedOpation(e.target.value);
              }}
              className="border-2 border-purple-300 rounded-md p-2 w-64"
            >
              <option value="">Select a Objects</option>
              {schemaOptions?.map((objName, i) => (
                <option key={objName + i} value={objName}>
                  {" "}
                  {objName}{" "}
                </option>
              ))}
            </select>
          </>
        )}

        {generate && (
          <button
            onClick={async () => {
              checkErrors();
              const result = await GeneratingActualData();
              console.log("res:", result);
              if (result?.success) {
                DownloadData(download, [result?.data], csvLink);
                setError(undefined);
              } else setError(result?.error);
            }}
            className="w-fit p-2 bg-[#93EFED] rounded-lg text-center font-semibold "
          >
            Generate
          </button>
        )}

        {previewData && (
          <button
            onClick={async () => {
              checkErrors();
                if (generate) await GeneratingActualData();
                if(recordCount>0) previewData();
            }}
            className="w-fit p-2 bg-[#93EFED] rounded-lg text-center font-semibold "
          >
            preview
          </button>
        )}
      </div>
    </div>
  );
};
export default DownloadSelection;
