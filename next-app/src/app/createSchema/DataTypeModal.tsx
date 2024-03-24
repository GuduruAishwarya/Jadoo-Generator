import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import Data from "./dataTypes";
import clsx from "clsx";
export const DataTypeModal = ({
  onChange,
  rowId,
  existingDatatype,
  isOpen,
  closeModal,
}: {
  onChange: any,
  rowId: number,
  existingDatatype: string[],
  isOpen: boolean,
  closeModal: (close: boolean)=> void,
}) => {
  const [group, setGroup] = useState("Person");
  const [datatype, setDatatype] = useState(
    existingDatatype ? existingDatatype : []
  );
  console.log("data,group,datatype", group, datatype);
  useEffect(() => {
    onChange(datatype, "dataType", rowId);
  }, [datatype]);
  const IsSelected = (val: string) => {
    return datatype.includes(val);
  };

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
              <Dialog.Panel className="flex flex-col gap-4 w-1/2 h-[70%] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-baseline">
                  <div >Choose DataType :</div>
                  <div
                    onClick={() => {
                      closeModal(isOpen);
                    }}
                    className="cursor-pointer"
                  >
                    X
                  </div>
                </Dialog.Title>
                  <div className="container flex gap-3 w-full">
                    <div className="left flex flex-col gap-2 p-2 w-[30vw] overflow-y-auto bg-purple-100 h-[50vh] rounded-md">
                      {Object.keys(Data)?.map((v) => {
                        return (
                          <div
                            onClick={() => {
                              setGroup(v);
                            }}
                            key={v}
                            className={clsx("w-full h-fit p-2 cursor-pointer", {
                              "bg-purple-400 rounded-md": group === v,
                            })}
                          >
                            {v}
                          </div>
                        );
                      })}
                    </div>

                    <div className="right flex gap-3 p-2 w-[60vw] justify-evenly h-fit overflow-y-auto flex-wrap">
                      {Data[group as keyof (typeof Data)]?.map((v) => {
                        return (
                          <div
                            onClick={() => {
                              if (IsSelected(v))
                                setDatatype(
                                  datatype.filter((item) => item !== v)
                                );
                              else setDatatype([...datatype, v]);
                            }}
                            key={v}
                            className={clsx(
                              "w-fit h-fit px-4 py-2 cursor-pointer bg-purple-100 rounded-md",
                              { "border-2 border-black": IsSelected(v) }
                            )}
                          >
                            {v}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button
                  className="bg-purple-300 text-black active:bg-blue-500 w-fit h-fit self-end
                  font-bold py-1 px-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-52"
                  onClick={() => {
                      closeModal(isOpen);
                    }}
                  >
                    ok
                  </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
