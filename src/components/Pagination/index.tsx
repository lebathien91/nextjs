import Link from "next/link";
import { useRouter } from "next/router";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface PaginationProps {
  limit?: number;
  setLimit: Function;
  pages: number;
}

const Pagination = ({ limit = 10, pages = 1, setLimit }: PaginationProps) => {
  const router = useRouter();
  const page = router.query.page || 1;
  const arrPages = new Array(pages).fill(0);
  const maxLimit = new Array(51).fill(0);

  const prev = parseInt(page.toString()) - 1;
  const next = parseInt(page.toString()) + 1;

  return (
    <div className="flex justify-center md:justify-between items-center px-8">
      <div className="hidden md:flex items-center">
        <select
          name="pagination"
          id="pagnation"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="py-1 pl-2 pr-6 border border-gray-400 rounded-sm outline-none"
        >
          {maxLimit.map((e, i) => {
            if (i > 0 && i % 5 === 0) {
              return (
                <option key={i} value={i}>
                  {i}
                </option>
              );
            }
          })}
        </select>
        <span className="ml-4 text-gray-500">Entries per Page</span>
      </div>
      <div className="flex items-center">
        <Link href={`?page=${prev}`}>
          <button
            className={`${page <= 1 && "text-gray-400"}`}
            disabled={page <= 1}
          >
            <MdKeyboardArrowLeft size="2rem" />
          </button>
        </Link>
        {arrPages.map((e, i) => (
          <Link href={`?page=${i + 1}`} key={i}>
            <button
              className={`py-2 px-3 mx-1 ${
                i + 1 === parseInt(page.toString()) ? "bg-red-500" : "bg-white"
              }  rounded-sm cursor-pointer`}
            >
              {i + 1}
            </button>
          </Link>
        ))}

        <Link href={`?page=${next}`}>
          <button
            className={`${page >= pages && "text-gray-400"}`}
            disabled={page >= pages}
          >
            <MdKeyboardArrowRight size="2rem" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
