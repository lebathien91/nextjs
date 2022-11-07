import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import WrapperTippy from "../../../components/WrapperTippy";
import { getData } from "@/utils/fetchData";
import useDebounce from "@/hooks/useDebounce";
import { IArticle, InputChange, ITag } from "@/utils/interface";

const Search = () => {
  const inputElement = useRef<HTMLInputElement>(null);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<IArticle[]>([]);
  const debounced = useDebounce(keyword, 500);

  const handleOnclick = () => {
    setIsSearch(!isSearch);
    inputElement.current?.focus();
  };

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
    <form method="GET" action="/search" className="relative flex">
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
                        href={`/${(result.tag as ITag).slug}/${result.slug}`}
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
            ref={inputElement}
            className={`transition-all ease-linear duration-200 h-8 border-[#e6e6e6] focus:border-[#bdbdbd] outline-none rounded-full leading-8 ${
              isSearch
                ? "w-[200px] pl-4 pr-8 border"
                : "w-0 border-0 lg:border lg:w-[200px] pl-0 pr-0 lg:pl-4 md:pr-8 lg:inline-block"
            }`}
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
      <button
        type="submit"
        className={`h-full absolute right-2 ${
          isSearch ? "" : "hidden"
        } lg:inline-block`}
      >
        <BsSearch size="1rem" />
      </button>
      <BsSearch
        size="1rem"
        onClick={handleOnclick}
        className="h-full absolute right-2 inline-block lg:hidden"
      />
    </form>
  );
};

export default Search;
