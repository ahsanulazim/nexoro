import { FaChevronRight } from "react-icons/fa6";
import * as LuIcons from "react-icons/lu";

const AccountInfo = ({ data, value }) => {
  const Icon = LuIcons[data.icon];

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-300">
      <h1 className="p-4 text-xl sm:text-2xl font-semibold flex items-center gap-3 border-b border-b-base-content/5">
        <Icon className="size-6 text-purple-500" />
        {data.title}
      </h1>
      <table className="table rounded-t-none">
        <tbody>
          {data.info.map((list) => (
            <tr key={list}>
              <td className="flex justify-between gap-5 items-center cursor-pointer">
                <div>
                  <label className="font-semibold text-base capitalize">
                    {list}
                  </label>
                  <p className="opacity-50">{value[list]}</p>
                </div>
                <FaChevronRight />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountInfo;
