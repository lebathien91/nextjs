import { ReactElement, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "@/layout/index";
import Tags from "@/views/pages/Tags";
import Loading from "@/components/Loading";
import { getData } from "@/utils/fetchData";
import { ITag } from "@/utils/interface";
import Seo from "@/components/Seo";
import { GlobalContext } from "@/store/GlobalState";

interface ICategory {
  tags: Array<ITag>;
  count: number;
  catId: string;
}

export default function Category({ tags, count, catId }: ICategory) {
  const { state, dispatch } = useContext(GlobalContext);

  const router = useRouter();

  const limit = 3;
  const totalPage = Math.ceil(count / limit);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Array<ITag>>([]);

  useEffect(() => {
    setPosts(tags);
    setPage(1);
  }, [catId]);

  const loadmore = async (page: number) => {
    try {
      dispatch({ type: "NOTIFY", payload: { loading: true } });
      const res = await getData(
        `tag?populate=category&category=${catId}&page=${page}&limit=${limit}&sort=createdAt`
      );
      dispatch({ type: "NOTIFY", payload: {} });

      if (!res) return setPosts(tags);

      setPage((pre) => pre + 1);
      setPosts((pre) => [...pre, ...res.tags]);
    } catch (error) {
      console.log(error);
      setPosts(tags);
    }
  };

  if (router.isFallback) {
    return <Loading />;
  }
  return (
    <>
      <Tags posts={posts} key={catId} />
      {page < totalPage && (
        <div className="container text-center my-4">
          <button
            onClick={() => loadmore(page + 1)}
            className="px-4 py-2 border-2 border-[#1e73be] hover:bg-[#1e73be] hover:text-white rounded-md uppercase font-semibold translate ease-out duration-500 hover:scale-125"
          >
            Loadmore
          </button>
        </div>
      )}
    </>
  );
}

export async function getStaticPaths() {
  const res = await getData("category");

  const paths = res.categories.map((category: any) => ({
    params: {
      slug: category.slug,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  try {
    const slug = params?.slug;
    const res = await getData(`category/slug/${slug}`);
    const catId = res.category._id;

    const tagsRes = await getData(
      `tag?category=${catId}&page=1&limit=3&sort=createdAt`
    );

    const { tags, count } = tagsRes;

    if (!tags || !count || !slug) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        tags,
        count,
        catId,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

Category.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Seo title="Chuyên mục" />
      {page}
    </Layout>
  );
};
