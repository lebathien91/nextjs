import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaEdit,
  FaFacebookF,
  FaTiktok,
  FaTrash,
  FaTwitter,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Pagination from "@/components/Pagination";
import { GlobalContext } from "@/store/GlobalState";
import { getData, patchData } from "@/utils/fetchData";
import { IArticle } from "@/utils/interface";
import Seo from "@/components/Seo";

export default function Me() {
  const router = useRouter();
  const { state, dispatch } = useContext(GlobalContext);
  const { user, token } = state.auth;
  const { _id, avatar, username, aboutMe } = user;

  const [posts, setPosts] = useState<Array<IArticle>>([]);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const pages = Math.ceil(count / limit);
  const page = router.query.page || 1;

  useEffect(() => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    getData(`article?populate=tag&user=${_id}&page=${page}&limit=${limit}`)
      .then((res) => {
        setPosts(res.articles);
        setCount(res.count);
        dispatch({ type: "NOTIFY", payload: {} });
      })
      .catch((error) => {
        setPosts([]);
        setCount(0);
        toast.error(error, { theme: "colored" });
      });
  }, [limit, page, count]);

  const handleDelete = async (id: string) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await patchData(`article/${id}`, {}, token);
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error) return toast.error(res.error, { theme: "colored" });
    const newPosts = posts.filter((post) => {
      return post._id !== id;
    });
    setPosts(newPosts);
    setCount((prev) => prev - 1);
    return toast.success(res.success, { theme: "colored" });
  };

  return (
    <>
      <Seo title={`Bài viết của ${user.username}`} />
      <div className="container grid grid-cols-3 my-4 gap-8">
        <aside className="col-span-3 xl:col-span-1 mt-16">
          <div className="border rounded-md shadow-md p-4 relative group">
            <Link href="/profile">
              <a
                className="absolute right-4 text-sky-800 text-2xl opacity-0 group-hover:opacity-100"
                title="Edit"
              >
                <FaEdit />
              </a>
            </Link>
            <div className="mx-auto w-40 h-40 rounded-full overflow-hidden mt-[-90px] relative group">
              <img src={avatar && avatar} />
            </div>
            <h2 className="uppercase text-gray-600 text-center my-4">
              {username && username}
            </h2>
            <p className="text-center">
              {aboutMe
                ? aboutMe
                : "Vài dòng giới thiệu ngắn gọn về bản thân bạn để cho mọi người biết về bạn?"}
            </p>
            <div className="mt-12 mb-6 flex items-center justify-center text-2xl">
              <a href="https://facebook.com" title="Facebook">
                <FaFacebookF className="text-[#4267B2]" />
              </a>
              <a href="https://twitter.com/" title="Twitter">
                <FaTwitter className="mx-6 text-[#1DA1F2]" />
              </a>
              <a href="https://www.tiktok.com/" title="Tiktok">
                <FaTiktok className="text-[#833AB4]" />
              </a>
            </div>
          </div>
        </aside>
        <main className="col-span-3 xl:col-span-2">
          <div className="mr-4 mb-9 text-right">
            <Link href="/me/article/create">
              <a className="px-4 py-2 bg-green-800 rounded-sm text-white text-lg font-semibold">
                Create Article
              </a>
            </Link>
          </div>
          <div className="border rounded-md shadow-md p-4">
            <h1 className="my-2 text-rose-700">Your&apos;s Articles</h1>
            {posts.length > 0 ? (
              <>
                <div className="mb-8">
                  {posts?.map((post) => (
                    <div key={post.slug} className="border-b py-4">
                      <h3>{post.title}</h3>
                      <span className="flex items-center my-1 text-gray-600">
                        <FaCalendarAlt className="text-orange-700 text-xl mr-2" />
                        <time>
                          {format(
                            new Date(post.createdAt as string),
                            "dd/MM/yyyy"
                          )}
                        </time>
                        <Link href={`/me/article/${post._id}`}>
                          <a className="mx-4 text-sky-600 text-xl">
                            <FaEdit />
                          </a>
                        </Link>
                        <button
                          onClick={() => {
                            dispatch({
                              type: "NOTIFY",
                              payload: {
                                modal: {
                                  title: "Xoá bài viết",
                                  message:
                                    "Bạn có chắc chắn muốn xoá bài viết?",
                                  handleSure: () =>
                                    handleDelete(post._id as string),
                                },
                              },
                            });
                          }}
                        >
                          <FaTrash className="text-red-600" />
                        </button>
                      </span>
                      <p>{post.description}</p>
                    </div>
                  ))}
                </div>
                <Pagination pages={pages} limit={limit} setLimit={setLimit} />
              </>
            ) : (
              <p>
                Bạn chưa có bài viết nào. Hãy tạo bài viết mới
                <Link href="/me/article/create">
                  <a className="text-red-600 font-bold"> tại đây</a>
                </Link>
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
