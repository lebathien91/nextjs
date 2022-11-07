import Link from "next/link";
import { useRouter } from "next/router";

import {
  BiMenu,
  BiMenuAltRight,
  BiCategory,
  BiSearch,
  BiPurchaseTagAlt,
  BiUser,
} from "react-icons/bi";
import {
  MdDashboard,
  MdOutlineArticle,
  MdOutlineComment,
  MdOutlinePermMedia,
  MdSettings,
} from "react-icons/md";

const ListMenu = [
  {
    title: "Dashboard",
    slug: "",
    icon: <MdDashboard size="22px" />,
  },
  {
    title: "Users",
    slug: "user",
    icon: <BiUser size="22px" />,
  },
  {
    title: "Categories",
    slug: "category",
    icon: <BiCategory size="22px" />,
  },
  {
    title: "Tags",
    slug: "tag",
    icon: <BiPurchaseTagAlt size="22px" />,
  },
  {
    title: "Articles",
    slug: "article",
    icon: <MdOutlineArticle size="22px" />,
  },
  {
    title: "Comments",
    slug: "comment",
    icon: <MdOutlineComment size="22px" />,
  },
  {
    title: "Files",
    slug: "file",
    icon: <MdOutlinePermMedia size="22px" />,
  },
  {
    title: "Settings",
    slug: "settings",
    icon: <MdSettings size="22px" />,
  },
];

interface PropsSidebar {
  active: boolean;
  setActive: Function;
}

const Sidebar = ({ active, setActive }: PropsSidebar) => {
  const router = useRouter();
  let path = router.asPath.toString();

  return (
    <aside
      className={`fixed text-white bg-[#11101D] top-0 left-0 h-full px-[14px] py-2 z-30 transition-all ease-linear duration-300 ${
        active ? "w-[250px]" : "w-[78px]"
      }`}
    >
      <div className={`flex items-center relative h-[60px]`}>
        <i
          className={`cursor-pointer flex items-center justify-center min-w-[50px] h-[60px] leading-[60px] ${
            active ? "opacity-0 hidden" : "opacity-100"
          }`}
          onClick={() => setActive(!active)}
        >
          <BiMenu size="23px" />
        </i>
        <Link href="/me">
          <a
            className={`text-[20px] transition-all ease-linear duration-300 pl-4 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            Logo
          </a>
        </Link>
        <i
          className={`cursor-pointer flex items-center justify-center min-w-[50px] h-[60px] leading-[60px] absolute top-1/2 right-0 -translate-y-1/2 transition-all ease-linear duration-300  ${
            active ? "opacity-100 text-right" : "opacity-0"
          }`}
          onClick={() => setActive(!active)}
        >
          <BiMenuAltRight size="23px" />
        </i>
      </div>
      <ul className="mt-5 h-full">
        <li className="relative my-2 group">
          <i
            className={`cursor-pointer flex items-center justify-center min-w-[50px] h-[50px] rounded-xl leading-[50px] absolute text-lg bg-[#1d1b31] hover:bg-white hover:text-slate-900`}
            onClick={() => setActive(true)}
          >
            <BiSearch size="22px" />
          </i>
          <input
            type="text"
            placeholder="Search..."
            name="q"
            className={`bg-[#1d1b31] outline-none h-[50px] ${
              active ? "w-full pr-5 pl-[50px]" : "w-[50px]"
            } border-0 rounded-[12px] transition-all ease-linear duration-300`}
          />
          <span
            className={`absolute left-[calc(100%_+_15px)] -top-5 group-hover:top-1/2 group-hover:-translate-y-1/2 duration-300 shadow-lg z-10 bg-white text-slate-900 px-3 py-2 rounded-md pointer-events-none whitespace-nowrap opacity-0 ${
              active ? "hidden" : "group-hover:opacity-100"
            }`}
          >
            Search
          </span>
        </li>
        {ListMenu.map((item, index) => {
          const match =
            (!item.slug && path === "/me") ||
            (item.slug && path.includes(item.slug));

          return (
            <li className="relative my-2 group" key={index}>
              <Link href={`/me/${item.slug}`}>
                <a
                  className={`flex h-full w-full ${
                    match && "bg-white text-slate-900"
                  } hover:bg-white hover:text-slate-900 rounded-xl items-center transition-all ease-linear duration-300`}
                >
                  <i
                    className={`cursor-pointer flex items-center justify-center min-w-[50px] h-[50px] rounded-xl leading-[50px] text-lg`}
                  >
                    {item.icon}
                  </i>
                  <span
                    className={`duration-300 pointer-events-none whitespace-nowrap ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.title}
                  </span>
                </a>
              </Link>
              <span
                className={`absolute left-[calc(100%_+_15px)] -top-5 group-hover:top-1/2 group-hover:-translate-y-1/2 duration-300 shadow-lg z-10 bg-white text-slate-900 px-3 py-2 rounded-md pointer-events-none whitespace-nowrap opacity-0 ${
                  active ? "hidden" : "group-hover:opacity-100"
                }`}
              >
                {item.title}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
