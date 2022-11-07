import { IArticle, ITag } from "@/utils/interface";
import Link from "next/link";
import { MdClose } from "react-icons/md";

interface TopicProps {
  isMobile: boolean;
  active: boolean;
  setActive: Function;
  disease: ITag;
  articles: IArticle[];
  articleSlug: string;
}

const Topic = ({
  isMobile,
  active,
  setActive,
  disease,
  articles,
  articleSlug,
}: TopicProps) => {
  return (
    <aside
      className={`flex-[3_1_0%] bg-white absolute lg:relative left-0 top-0 bottom-0 ${
        isMobile && active && "block"
      } ${!isMobile && !active && "hidden"} ${
        active && !isMobile && "hidden lg:block"
      }`}
    >
      <nav className="px-4 md:px-2 lg:px-1 min-w-[230px] sticky top-16">
        <MdClose
          size="1.5rem"
          className="absolute right-4 top-4 cursor-pointer"
          onClick={() => setActive(false)}
        />
        <h2 className="py-4 pr-12">Topic: {disease.name}</h2>
        <ul>
          {articles.map((item) => (
            <li key={item.slug} className="my-1 text-[#0065b3] hover:underline">
              <Link href={`/${disease.slug}/${item.slug}`}>
                <a
                  className={
                    item.slug === articleSlug ? "font-bold text-black" : ""
                  }
                >
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Topic;
