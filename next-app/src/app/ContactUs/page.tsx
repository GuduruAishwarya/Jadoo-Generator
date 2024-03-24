"use client"
import Image from "next/image";
import { useState, useEffect ,useRef} from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const sendMail=async(e)=>{
    console.log(e.target)
    const serviceId = "service_xh996im";
    const templateId = "template_dntk3aj";
    emailjs.sendForm(serviceId, templateId, e.target, 'KHLQuaAFa0JltxlpR')
      .then((result) => {
          console.log("reload", result)
          toast.success("Sent your message successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
      }, (error) => {
          console.log("ERRR",error.text);
      });
  }
  useEffect(() => emailjs.init("KHLQuaAFa0JltxlpR"), []);
  return (
    <form  onSubmit={sendMail} className="pl-32 pt-4 flex-flex-col gap-8">
      <div className="p-4 text-2xl text-white font-bold w-fit"> CONTACT US</div>
      <div className="p-8 rounded-md bg-white flex flex-col gap-8 w-[40vw]">
        <input
          type="text"
          placeholder="Your name"
          name="name"
          className="focus:outline-none focus:ring relative w-full px-3 py-3 placeholder-gray-400 border-2 border-purple-300 rounded-md p-2"
          required
        />

        <input
          type="email"
          placeholder="Email"
          name="recipient"
          className="focus:outline-none focus:ring relative w-full px-3 py-3 placeholder-gray-400 border-2 border-purple-300 rounded-md p-2"
          required
        />

        <textarea
          placeholder="Your message"
          name="message"
          className="focus:outline-none h-32 focus:ring relative w-full px-3 py-3 placeholder-gray-400 border-2 border-purple-300 rounded-md p-2"
          required
        />

        <button
          className="bg-purple-800 text-white active:bg-blue-500 
          font-bold px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-52"
          type="submit"
          onClick={(e)=>{
            sendMail(e)
          }}
        >
          Send a message
        </button>
      </div>
        <div className="flex pt-4 gap-2 text-white text-base"><Image src="/mail.svg" width={20} height={20} alt="mail"/>  For any queries reach out to : jadooDataGenerator@gmail.com</div>
          <ToastContainer/>
    </form>
  );
};
export default ContactUs;
