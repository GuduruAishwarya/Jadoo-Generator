"use client";
import { ExistingSchemas } from "../dataTypes";
import CreateSchema from "../page";

export type RowFields={
  fieldName: string;
  dataType: string[];
  nulls: number;
  formula: string;
}[]


export default function Test({ params }: {params:{
  slug: keyof (typeof ExistingSchemas)
}}) {
  const data = ExistingSchemas[params.slug];
  const rephrasedData = data.map((v) => {
    return {
      fieldName: v.fieldName,
      dataType: v.dataType,
      nulls: 0,
      formula: "",
    };
  });
  return (
    <>
      <div className="pl-24 text-2xl font-semibold text-white"> {params.slug} Schema</div>
      {console.log(rephrasedData, "data...", data)}
      <CreateSchema existingData={rephrasedData} />
    </>
  );
}
