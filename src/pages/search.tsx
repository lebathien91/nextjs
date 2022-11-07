import Layout from "@/layout/index";
import { getData } from "@/utils/fetchData";
import { IArticle, ITag } from "@/utils/interface";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const keyword = router.query.q;

  const limit = 10;

  const [results, setResults] = useState<IArticle[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const totalPage = Math.ceil(count / limit);

  useEffect(() => {
    if (!keyword) return;
    getData(`article?populate=tag&search=${keyword}&limit=${page * limit}`)
      .then((res) => {
        setResults(res.articles);
        setCount(res.count);
      })
      .catch((error) => {
        console.log(error);
        setResults([]);
        setCount(0);
      });
  }, [keyword, page, limit]);

  return (
    <div className="container my-12 text-center min-h-[500px] max-w-[500px] mx-auto ">
      <form action="/search" className="flex px-2">
        <input
          type="text"
          placeholder="Nhập từ khóa..."
          autoComplete="off"
          name="q"
          className="border border-slate-500 w-full px-2 py-1 outline-none rounded-md"
        />
        <button className="ml-2 bg-sky-600 rounded-md min-w-max py-1 px-2 text-white text-[17px]">
          Tìm kiếm
        </button>
      </form>
      <div className="mt-12 text-left">
        <ul>
          {results.map((article) => (
            <li
              key={article.slug}
              className="p-2 text-lg hover:bg-slate-500 hover:text-white"
            >
              <Link href={`/${(article.tag as ITag).slug}/${article.slug}`}>
                <a>{article.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {page < totalPage && (
        <div className="container text-center my-4">
          <button
            onClick={() => setPage((pre) => pre + 1)}
            className="px-4 py-2 border-2 border-[#1e73be] hover:bg-[#1e73be] hover:text-white rounded-md uppercase font-semibold translate ease-out duration-500 hover:scale-125"
          >
            Loadmore
          </button>
        </div>
      )}
    </div>
  );
}

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
