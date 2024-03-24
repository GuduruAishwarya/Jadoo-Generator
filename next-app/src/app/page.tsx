import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col p-2 pt-16 w-full h-full ">
      <div className="flex flex-col items-left pl-24 w-[40vw] text-center !text-white">
        <div className="text-lg pb-8">
          Need some mock data to test your application? <br></br>Use this to
          generate up to 10,000 rows of realistic test data in CSV, JSON and
          Excel formats.
        </div>
      </div>
      <div className="flex p-8 pl-12 pt-24 gap-16 text-black h-[40vh]">
      <Link href="/createSchema" className="card yellow-card">
        <div className="overlay"></div>
        <div className="circle">
          <Image src="/create.svg" alt="create icon" height={50} width={50} className="z-10" />
        </div>
        <p>Create Schema</p>
      </Link>

      <Link href="/uploadSchema" className="card teal-card">
        <div className="overlay"></div>
        <div className="circle">
          <Image src="/upload.svg" alt="upload icon" height={50} width={50} className="z-10"/>
        </div>
        <p>Upload Schema</p>
      </Link>

      <Link href="/chooseSchema" className="card purple-card">
        <div className="overlay"></div>
        <div className="circle">
          <Image src="/choose.svg" alt="choose icon" height={70} width={60} className="z-10"/>
        </div>
        <p>Choose Schema</p>
      </Link>
    </div>
    </div>
  );
}
