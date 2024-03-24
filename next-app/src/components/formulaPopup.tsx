import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
export const FormulaModal = (props: {
  isOpen: boolean;
  oldValue : string;
  setFormula: any;
  closeModal: (open: boolean) => void;
  rowId: number
}) => {
  const { isOpen,oldValue,  closeModal, setFormula, rowId} = props;
  const [value, setValue]= useState(oldValue? oldValue :'')

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
              <Dialog.Panel className="w-1/2 h-fill transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-baseline"
                >
                  <div>Formula</div>
                  <div onClick={closeModal} className="cursor-pointer">
                    X
                  </div>
                </Dialog.Title>

                <div className="mt-2 h-full">
                  <textarea
                    className="w-full text-black h-[30vh] border-2 border-purple-300 active:border-purple-300 focus:border-purple-300 rounded-md p-2"
                    value={value}
                    onChange={(e)=>{
                        setValue(e.target.value)
                    }}
                  ></textarea>
                </div>
                  <button
                    onClick={()=>{
                        console.log("TEXT AREA:", value)
                        setFormula(value, "formula", rowId);
                        closeModal(isOpen)
                    }}
                    className="bg-purple-300 hover:bg-purple-300 text-black font-bold py-2 px-4 rounded inline-flex items-end"
                  >
                    <span>Save</span>
                  </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
