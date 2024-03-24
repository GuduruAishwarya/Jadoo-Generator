import Image from "next/image";
const AboutUs = () => {
  return (
    <div className="flex flex-col text-white pt-16 gap-4 text-base w-[50vw] h-[75vh] pl-32 pt-4">
      <div className="p-4 text-2xl border-b-2 border-white font-bold w-fit"> ABOUT US</div>
      <div className="pt-8">JADOO Data Generator is a tool to generate dummy customized test data in 3 different ways.</div>
      <div>
        Need some mock data to test your application???? <br></br>Use this to
        generate up to 10,000 rows of realistic test data in CSV, JSON and Excel
        formats.
      </div>
      <div>We provide services like :</div>
      <ul className="list-disc pl-4">
        <li>Creating a schema from scratch</li>
        <li>Uploading an existing schema </li>
        <li>Choosing readily built Schema</li>
      </ul>
      <div className="flex flex-col gap-2 pt-8">
        <div className="flex gap-8"><Image src="/mail.svg" width={20} height={20} alt="mail"/> jadooDataGenerator@gmail.com</div>
        <div className="flex gap-8"><Image src="/call.svg" width={20} height={20} alt="call"/> +91 9999999999</div>
        <div className="flex gap-8"><Image src="/location.svg" width={20} height={20} alt="pin"/> Nheights, Hitechcity, Hyderabad</div>
      </div>
    </div>
  );
};
export default AboutUs;
