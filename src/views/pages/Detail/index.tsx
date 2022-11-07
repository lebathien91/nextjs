import { parse } from "node-html-parser";
import slug from "slugify";
import { useState } from "react";
import styles from "./Detail.module.css";

import Link from "next/link";
import { format } from "date-fns";
import { MdFormatListBulleted } from "react-icons/md";

import TableContent from "./TableContent";
import Topic from "./Topic";
import Comments from "./Comments";

const Detail = ({ data }: any) => {
  const [activeTopic, setActiveTopic] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const handleOpen = () => {
    setActiveTopic(true);
    setIsMobile(true);
  };

  const handleClose = () => {
    setActiveTopic(false);
    setIsMobile(false);
  };

  const { disease, nameDisease, slugDisease, article, articleSlug, articles } =
    data;

  if (!article) {
    return <div className="single"></div>;
  }
  const wordsContent = article.content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordsContent / 200);

  const content = parse(article.content);
  const headings = content.querySelectorAll("h1, h2, h3");
  for (const heading of headings) {
    heading.setAttribute(
      "id",
      slug(heading.rawText, { locale: "vi", lower: true })
    );
  }

  return (
    <div className="mb-12">
      <button
        className={`fixed bottom-16 left-12 p-1 bg-[#20232a] text-[#61dafb] w-14 h-14 z-30 rounded-full ${
          activeTopic && !isMobile && "lg:hidden"
        } ${!activeTopic && !isMobile && "lg:block"} ${
          activeTopic && isMobile && "hidden"
        }`}
        onClick={() => handleOpen()}
      >
        <div className="flex justify-center items-center">
          <MdFormatListBulleted size={26} />
        </div>
      </button>

      <div className="container flex relative">
        <Topic
          key={`topic-${articleSlug}`}
          isMobile={isMobile}
          active={activeTopic}
          setActive={handleClose}
          disease={disease}
          articleSlug={articleSlug}
          articles={articles}
        />

        <article className="flex-[7_1_0%] px-4">
          <header className="py-8">
            <div className="font-semibold text-xl text-[#0065b3]">
              <Link href={`/tag/${slugDisease}`}>
                <a className="hover:underline">{nameDisease}</a>
              </Link>
              <span> / </span>
              <Link href={`/${slugDisease}/${article.slug}`}>
                <a className="hover:underline">{article.title}</a>
              </Link>
            </div>
          </header>
          <main className="single">
            <h1 className="text-4xl">{article.title}</h1>
            <div className="mt-2 text-[#4d626e]">
              <time>
                Update: {format(new Date(article.updatedAt), "dd/MM/yyyy")}
              </time>
              <span> - {readTime} phút đọc</span>
            </div>
            <div
              className={styles.single}
              dangerouslySetInnerHTML={{ __html: content.toString() }}
            />
          </main>

          <Comments articleId={article._id} articleUserId={article.user} />
        </article>

        <TableContent key={article.slug} headings={headings} />
      </div>
    </div>
  );
};

export default Detail;
