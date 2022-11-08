import { ReactElement } from "react";
import Layout from "@/layout/index";
import Detail from "@/views/pages/Detail";
import { getData } from "@/utils/fetchData";
import { IArticle } from "@/utils/interface";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import Seo from "@/components/Seo";

export default function Single({ tag, articles, articleSlug }: any) {
  const router = useRouter();

  if (router.isFallback) {
    return <Loading />;
  }

  const article = articles.filter((item: IArticle) => {
    return item.slug === articleSlug;
  });

  const data = {
    disease: tag,
    articles,
    nameDisease: tag?.name,
    slugDisease: tag?.slug,
    article: article[0],
    articleSlug,
  };

  return (
    <>
      <Seo
        title={article[0].title}
        description={article[0].description}
        article
      />
      <Detail data={data} />
    </>
  );
}

export async function getStaticPaths() {
  const res = await getData("article?limit=1000&populate=tag");
  const articles = res.articles;

  let paths: Array<{ params: object }> = [];
  articles.forEach((article: IArticle) => {
    let articleSlug = article.slug;
    let tagSlug = typeof article.tag === "object" && article.tag.slug;

    paths.push({
      params: {
        tag: tagSlug,
        article: articleSlug,
      },
    });
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  try {
    const tagSlug = params.tag;
    const articleSlug = params.article;

    const res = await getData(`tag/slug/${tagSlug}`);
    const tag = res.tag;

    const articleRes = await getData(`article?tag=${tag._id}`);

    const { articles } = articleRes;

    if (!tag || !articles || !articleSlug) {
      return {
        notFound: true,
      };
    }

    return {
      props: { tag, articles, articleSlug },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

Single.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
