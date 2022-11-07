import { ReactElement } from "react";
import { useRouter } from "next/router";

import Layout from "@/layout/index";
import Loading from "@/components/Loading";
import Detail from "@/views/pages/Detail";
import { getData } from "@/utils/fetchData";
import { IArticle, ITag } from "@/utils/interface";
import Seo from "@/components/Seo";

interface ITags {
  tag: ITag;
  articles: Array<IArticle>;
  slug: string;
}

export default function Tags({ tag, articles, slug }: ITags) {
  const router = useRouter();
  if (router.isFallback) {
    return <Loading />;
  }

  const data = {
    disease: tag,
    articles,
    nameDisease: tag?.name,
    slugDisease: slug,
    article: articles[0],
    articleSlug: articles[0]?.slug,
  };
  return (
    <>
      <Seo
        title={tag?.name}
        description={tag?.description}
        image={tag.thumbnail}
      />
      <Detail data={data} />
    </>
  );
}

export async function getStaticPaths() {
  const res = await getData("tag?limit=100");
  const paths = res.tags.map((tag: ITag) => ({
    params: {
      slug: tag.slug,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  try {
    const slug = params.slug;

    const res = await getData(`tag/slug/${slug}`);

    const tag = res.tag;

    const articleRes = await getData(`article?tag=${tag._id}`);

    const { articles } = articleRes;

    if (!tag || !articles || !slug) {
      return {
        notFound: true,
      };
    }

    return {
      props: { tag, articles, slug },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

Tags.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
