import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { MdNotifications, MdOutlineSearch } from "react-icons/md";
import Main from "./Main";

import Account from "./Header/Account";
import Tippy from "@tippyjs/react";
import WrapperTippy from "@/components/WrapperTippy";
import Link from "next/link";
import { IArticle, InputChange, ITag } from "@/utils/interface";
import useDebounce from "@/hooks/useDebounce";
import { getData } from "@/utils/fetchData";

export default function Admin({ children }: { children: ReactNode }) {
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<IArticle[]>([]);
  const debounced = useDebounce(keyword, 500);
  const handleOnChange = (e: InputChange) => {
    setKeyword(e.target.value);
  };
  useEffect(() => {
    if (debounced.trim().length < 3) {
      setResults([]);
      return;
    }
    getData(
      `article?populate=tag&search=${encodeURIComponent(debounced)}`
    ).then((res) => {
      setResults(res.articles);
    });
  }, [debounced]);

  return (
    <>
      <Sidebar active={activeSidebar} setActive={setActiveSidebar} />
      <section
        className={`z-10 bg-slate-200 relative top-0 min-h-screen transition-all ease-linear duration-300 ${
          activeSidebar
            ? "left-[250px] w-[calc(100%_-_250px)]"
            : "left-[78px] w-[calc(100%_-_78px)]"
        }`}
      >
        <header className="flex justify-between px-8 py-2 z-30">
          <h2>Dashboard</h2>

          <div className="flex">
            <form
              method="GET"
              action="/search"
              className="hidden md:flex flex-wrap relative w-full items-stretch"
            >
              <div>
                <Tippy
                  interactive
                  visible={visible && results.length > 0}
                  onClickOutside={() => setVisible(false)}
                  render={(attrs) =>
                    visible &&
                    results.length > 0 && (
                      <WrapperTippy {...attrs}>
                        <ul className="min-w-[450px] w-full py-4">
                          {results.map((result) => (
                            <li
                              className="py-1 px-4 hover:bg-slate-400"
                              key={result.slug}
                              onClick={() => setVisible(false)}
                            >
                              <Link
                                href={`/${(result.tag as ITag).slug}/${
                                  result.slug
                                }`}
                              >
                                <a>{result.title}</a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </WrapperTippy>
                    )
                  }
                >
                  <input
                    className="relative text-slate-800 py-2 h-9 bg-transparent outline-none border-b border-slate-400 focus:border-b-2 focus:border-violet-700"
                    type="text"
                    placeholder="Tìm kiếm..."
                    autoComplete="off"
                    value={keyword}
                    name="q"
                    onChange={handleOnChange}
                    onFocus={() => setVisible(true)}
                  />
                </Tippy>
              </div>
              <button className="text-slate-400 bg-white h-10 w-10 leading-10 overflow-hidden rounded-full flex justify-center items-center">
                <MdOutlineSearch size="1.75rem" />
              </button>
            </form>
            <ul className="flex items-center">
              <li>
                <a className="block relative px-4 py-2 leading-5" href="#">
                  <MdNotifications size="25px" />

                  <span className="bg-red-500 absolute top-0 right-3 text-[10px] px-[5px] leading-4 text-white border border-white rounded-full">
                    5
                  </span>
                </a>
              </li>
              <li className="pb-1">
                <Account />
              </li>
            </ul>
          </div>
        </header>

        <Main className="px-4 py-8">{children}</Main>
      </section>
    </>
  );
}
