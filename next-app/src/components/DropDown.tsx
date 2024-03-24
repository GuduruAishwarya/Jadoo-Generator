import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import Image from "next/image";
import { clsx } from "clsx";

export default function MenuDropDown() {
  const router = useRouter();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full gap-2 items-center text-base justify-center rounded-md px-4 py-2 text-sm  text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
           <div>Services</div>
          <Image src="/dropdown.svg" height={20} width={20} alt="Dropdown" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            "absolute mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            "right-0"
          )}
        >
          <div className="px-1 py-1 w-fit ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => router.push("/createSchema")}
                >
                  Create Schema
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => router.push("/uploadSchema")}
                >
                  Upload Schema
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => router.push("/chooseSchema")}
                >
                  Choose Schema
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
