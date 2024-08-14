import Image from "next/image";
import { TCountryOption } from "~/lib/types";

const CustomSelectOptions = ({ data }: { data: TCountryOption }) => {
  return (
    <div key={data.value} className="flex items-center">
      <Image
        src={data.flag}
        alt={data.label}
        height={20}
        width={20}
        style={{ width: "20px", marginRight: "10px" }}
      />
      {data.label}
    </div>
  );
}
export default CustomSelectOptions;