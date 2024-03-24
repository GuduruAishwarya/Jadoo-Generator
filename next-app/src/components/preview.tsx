import { DownloadData } from "@/services";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { CSVLink } from "react-csv";
export const PreviewModel = (props: {
  isOpen: boolean;
  data: any;
  closeModal: (open: boolean) => void;
  filename?: string;
  existingDownload?: string;
  existingCSVLink?:any
}) => {
  const [download, setDownload] = useState(props.existingDownload);
  const csvLink = useRef();
  const { isOpen, closeModal, data = [], filename } = props;
  let value = "";
  if (typeof data == "string") {
    value = data;
  } else if (typeof data == "object") {
    if (data.sqldata) {
      const sqldata = data.data;
      Object.keys(sqldata).forEach((tableName, i) => {
        const tableData = sqldata[tableName];
        if (i > 0) value += "\n\n";
        value += "Table: " + tableName + "\n";
        value += tableData
          .slice(0, 11)
          .map((row) => row.join())
          .join("\n");
      });
    } else {
      value = JSON.stringify(data.slice(0,10), undefined, 2);
    }
  }
  function formatData(db: Record<string, any>) {
    const sheets: any[] = [];
    Object.keys(db).forEach((tableName) => {
      const val: string[][] = db[tableName];
      console.log("val", val);
      const xlTable: any[] = [];
      const cols = val[0];
      val.forEach((v, i) => {
        if (i > 0) {
          const row = {};
          cols.forEach((c, j) => {
            row[c] = v[j];
          });
          xlTable.push(row);
        }
      });
      console.log("xlTable", xlTable);
      sheets.push(xlTable);
    });
    return sheets;
  }
  function downloadData(download: any, csvLink:any) {
    if (data.sqldata) {
      const db = data.data;
      const sheets = formatData(db);
      DownloadData(download, sheets, csvLink, props.filename);
    } else DownloadData(download, [data], csvLink, props.filename);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full  w-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-1/2 h-fill transform text-black overflow-hidden rounded-2xl p-4 bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-baseline">
                  <div>Preview</div>
                  <div onClick={closeModal} className="cursor-pointer">
                    X
                  </div>
                </Dialog.Title>

                <div className="mt-2 h-full">
                  <textarea
                    className="w-full  h-[50vh] border-2 border-purple-300 active:border-purple-300 focus:border-purple-300 rounded-md p-2"
                    value={value}
                  ></textarea>
                </div>

                <div className="flex justify-center gap-6">
                  {!props.existingDownload && (
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
                  <button
                    onClick={()=>{downloadData(props.existingDownload? props.existingDownload: download, props.existingCSVLink?props.existingCSVLink:csvLink)}}
                    className="bg-purple-300 hover:bg-purple-300 text-black font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <svg
                      className="fill-current w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                    </svg>
                    <span>Download</span>
                  </button>
                  {download === "csv" && (
                    <div ref={csvLink}>
                      {data?.data ? (
                        formatData(data?.data).map((v) => {
                          {
                            console.log("v:", v);
                          }
                          return <CSVLink filename={filename} data={v} />;
                        })
                      ) : (
                        <CSVLink filename={filename} data={data} />
                      )}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
