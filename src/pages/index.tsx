import { ReactElement, useContext, useState } from "react";

import Layout from "@/layout/index";
import Tags from "@/views/pages/Tags";
import { getData } from "@/utils/fetchData";

import { ITag } from "@/utils/interface";
import Seo from "@/components/Seo";
import { GlobalContext } from "@/store/GlobalState";

interface IHome {
  tags: Array<ITag>;
  count: number;
}

export default function Home({ tags, count }: IHome) {
  const { state, dispatch } = useContext(GlobalContext);

  const limit = 5;
  const totalPage = Math.ceil(count / limit);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Array<ITag>>(tags);

  const loadmore = async (page: number) => {
    try {
      dispatch({ type: "NOTIFY", payload: { loading: true } });
      const res = await getData(
        `tag?populate=category&page=${page}&limit=${limit}&sort=createdAt`
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

  return (
    <>
      <Seo title="Trang chủ" />
      <Tags posts={posts} />

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

export async function getStaticProps() {
  try {
    const res = await getData(
      `tag?populate=category&page=1&limit=5&sort=createdAt`
    );

    const { tags, count } = res;

    return {
      props: {
        tags,
        count,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
