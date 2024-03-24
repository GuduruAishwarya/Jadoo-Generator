"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import DownloadSelection from "../../components/DownloadSelection";
import { DataTypeModal } from "./DataTypeModal";
import clsx from "clsx";
import Image from "next/image";
import { CSVLink } from "react-csv";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormulaModal } from "@/components/formulaPopup";
import Data from "./dataTypes";
import { RowFields } from "./[slug]/page";
import { GenerateApi } from "@/components/generateApi";
import { PreviewModel } from "@/components/preview";
import { headingContext } from "../layout";

const AddField = ({
  rowId,
  row,
  setRow,
  removeRow,
}: {
  rowId: number;
  row: RowFields;
  setRow: (val: RowFields) => void;
  removeRow: (i: number) => void;
}) => {
  const [formulaModelOpen, setFormulaModelOpen] = useState(false);
  const [dataTypeModelOpen, setDataTypeModelOpen] = useState(false);
  const [viewInfo, setViewInfo] = useState(false);
  const OnChangeHandler = (
    e: RowFields[number][keyof RowFields[number]],
    val: keyof RowFields[number],
    rowNo: number
  ) => {
    const clone = [...row];
    let obj = clone[rowNo];
    obj = { ...obj };
    obj[val] = e;
    clone[rowNo] = obj;
    setRow(clone);
  };
  return (
    <tr key={rowId} className="flex w-full gap-16 pr-2">
      <td>
        <input
          name={`fieldName${rowId}`}
          type="text"
          value={row[rowId].fieldName}
          onChange={(e) => {
            OnChangeHandler(e.target.value, "fieldName", rowId);
          }}
          className="border-2 border-purple-300 rounded-md p-2"
        />
      </td>
      <td className="flex gap-2 w-80 relative">
        {viewInfo && (
          <div className="absolute bg-black text-white rounded right-1/3 p-2 w-40 overflow-y-auto z-10">
            {row[rowId].dataType.join(" , ")}
          </div>
        )}
        <button
          className="bg-indigo-400 text-black active:bg-blue-500 
      font-bold px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-52"
          type="button"
          onClick={() => setDataTypeModelOpen(!dataTypeModelOpen)}
        >
          {row[rowId].dataType.length > 0
            ? row[rowId].dataType.length == 1
              ? row[rowId].dataType[0]
              : "Custom Object"
            : "Choose DataType"}
        </button>
        {row[rowId].dataType.length > 1 && (
          <div
            onClick={() => {
              setViewInfo(!viewInfo);
            }}
            className="border border-black rounded-full cursor-pointer w-5 h-5 font-extrabold text-xs text-center "
          >
            i
          </div>
        )}
        <DataTypeModal
          onChange={OnChangeHandler}
          rowId={rowId}
          existingDatatype={row[rowId].dataType}
          isOpen={dataTypeModelOpen}
          closeModal={() => {
            setDataTypeModelOpen(false);
          }}
        />
      </td>
      <td>
        <input
          name={`nulls${rowId}`}
          type="number"
          value={row[rowId].nulls}
          onChange={(e: any) => {
            OnChangeHandler(e.target.value, "nulls", rowId);
          }}
          min={0}
          max={100}
          className="border-2 border-purple-300 rounded-md p-2 w-16"
        />
      </td>
      <td>
        <button
          type="button"
          onClick={() => {
            setFormulaModelOpen(!formulaModelOpen);
          }}
          disabled={
            row[rowId].dataType.every((v) => Data.Number.includes(v))
              ? false
              : true
          }
          className={clsx(
            "align-center w-fit px-4 py-2 rounded-lg ",
            row[rowId].formula !== "" ? "!bg-purple-300" : "bg-indigo-400"
          )}
        >
          <Image
            src="/formula.svg"
            height={30}
            width={30}
            alt="Formula"
            className="h-6 w-6"
          />
        </button>
        {formulaModelOpen && (
          <FormulaModal
            isOpen={formulaModelOpen}
            oldValue={row[rowId].formula}
            setFormula={OnChangeHandler}
            closeModal={() => {
              setFormulaModelOpen(false);
            }}
            rowId={rowId}
          />
        )}
      </td>
      <td>
        <button
          type="button"
          onClick={() => removeRow(rowId)}
          disabled={row.length <= 1}
          className="w-fit px-4 py-2 bg-indigo-400 rounded-lg text-center font-semibold "
        >
          <Image
            src="/bin.svg"
            height={20}
            width={20}
            alt="bin"
            className="h-6 w-6"
          />
        </button>
      </td>
    </tr>
  );
};

const CreateSchema = ({ existingData }: { existingData: RowFields }) => {
  const [data, setData] = useState(() => {
    return existingData
      ? existingData
      : [
          { fieldName: "", dataType: [], nulls: 0, formula: "" },
          { fieldName: "", dataType: [], nulls: 0, formula: "" },
          { fieldName: "", dataType: [], nulls: 0, formula: "" },
          { fieldName: "", dataType: [], nulls: 0, formula: "" },
        ];
  });
  const heading = useContext(headingContext)
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [download, setDownload] = useState(undefined);
  const [recordCount, setRecordCount] = useState(0);
  const [downloadData, setDownloadData] = useState([]);
  const [error, setError] = useState();
  const [url, setUrl] = useState();
  const csvLink = useRef();

  const addRow = () => {
    setData([...data, { fieldName: "", dataType: [], nulls: 0, formula: "" }]);
  };
  const removeRow = (i: number) => {
    const list = [...data];
    list.splice(i, 1);
    setData(list);
  };
  useEffect(() => {
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }, [error]);
  return (
    <div className="flex items-center w-[80vw] h-[75vh] pl-20 pt-4">
      <div className="row bg-white p-4 rounded-lg text-black flex flex-col h-full items-baseline gap-4">
        <div className="flex justify-between items-baseline w-full">
          <div className="text-lg font-bold">{heading}</div>
        <button
          type="button"
          onClick={addRow}
          className="w-fit flex p-2 bg-[#93EFED] rounded-lg text-center font-semibold "
        >
         <Image
            src="/add.svg"
            height={20}
            width={20}
            alt="add"
            className="h-6 w-6"
          /> Add Field
        </button>
        </div>

        <div className="border-2 w-fit !border-white p-2 rounded-md ">
          <table className="block h-full">
            {data.length > 0 && (
              <thead>
                <tr className="text-lg flex gap-64 w-full">
                  <th>
                    <label htmlFor="fieldName">Field Name</label>
                  </th>

                  <th>
                    <label htmlFor="dataType">Data Type</label>
                  </th>

                  <th>
                    <label htmlFor="nulls">Nulls %</label>
                  </th>
                </tr>
              </thead>
            )}
            <tbody>
              {data.map((d, index) => (
                <React.Fragment key={index}>
                  <AddField
                    rowId={index}
                    row={data}
                    setRow={setData}
                    removeRow={removeRow}
                  />
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-md border-2 border-black p-2 w-full items-center">
          <DownloadSelection
            download={download}
            setDownload={setDownload}
            recordCount={recordCount}
            setRecordCount={setRecordCount}
            data={data}
            setError={setError}
            setDownloadData={setDownloadData}
            csvLink={csvLink}
            generate={true}
            previewData={() => {
              setIsOpenPreview(true);
            }}
          />
          <GenerateApi
            recordCount={recordCount}
            data={data}
            setUrl={setUrl}
            url={url}
            setError={setError}
          />
        </div>

        {downloadData?.length > 0 && (
          <div ref={csvLink}>
            <CSVLink filename="sample.csv" data={downloadData} />
          </div>
        )}
        {error && <ToastContainer />}
        {console.log("download:", download)}
        <PreviewModel
          filename="test-data"
          isOpen={isOpenPreview && !!data}
          data={downloadData}
          existingDownload={download}
          existingCSVLink={csvLink}
          closeModal={() => {
            setIsOpenPreview(false);
          }}
        />
      </div>
    </div>
  );
};

export default CreateSchema;
