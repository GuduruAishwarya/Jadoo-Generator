"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ChooseSchema = () => {
  return (
    <div className="pt-16 pl-32 grid grid-cols-2 grid-wrap items-center gap-16 w-[50vw]">
      <Link href="/createSchema/Hospital" className="card yellow-card">
        <div className="overlay"></div>
        <div className="circle">
          <Image
            src="/hospital-icon.svg"
            alt="hospital-icon"
            height={50}
            width={50}
            className="z-10"
          />
        </div>
        <p>Hospital</p>
      </Link>
      <Link href="/createSchema/School" className="card blue-card">
        <div className="overlay"></div>
        <div className="circle">
          <Image src="/school.svg" alt="school-icon"  className="z-10" height={50} width={50} />
        </div>
        <p>School</p>
      </Link>
      <Link href="/createSchema/Organization" className="card purple-card">
        {" "}
        <div className="overlay"></div>
        <div className="circle">
          <Image src="/org.svg" alt="org-icon"  className="z-10" height={50} width={50} />
        </div>
        <p>Organization</p>
      </Link>
      <Link href="/createSchema/Bank" className="card teal-card">
        <div className="overlay"></div>
        <div className="circle">
          <Image src="/bank.svg" alt="bank-icon"  className="z-10" height={60} width={50} />
        </div>
        <p>Bank</p>
      </Link>
    </div>
  );
};

export default ChooseSchema;
