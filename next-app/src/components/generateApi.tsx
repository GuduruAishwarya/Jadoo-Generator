import { GeneratingApiData } from "@/services";

export function GenerateApi({
  url,
  data,
  setUrl,
  setError,
  recordCount,
  type,
  getValue,
}) {
  return (
    <div className="flex gap-4 items-baseline">
      <button
        onClick={async () => {
          if (recordCount <= 0) setError("Generate atleast one Record");
          else {
            const result = await GeneratingApiData(
              data,
              recordCount,
              setUrl,
              type,
              getValue
            );
            if (!result?.success) setError(result?.error);
          }
        }}
        className="w-fit p-2 bg-[#93EFED] rounded-lg text-center font-semibold shadow-lg"
      >
        Generate Api
      </button>
      {url && (
        <div>
          Use this URL:
          <a className="bg-yellow-300" href={url} target="_blank">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
