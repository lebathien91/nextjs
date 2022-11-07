import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
  MdLocalOffer,
  MdOutlineArticle,
  MdOutlineAccessTime,
  MdComment,
} from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";

import Table from "@/components/DataTable";
import { getData, patchData } from "@/utils/fetchData";
import { GlobalContext } from "@/store/GlobalState";
import Seo from "@/components/Seo";
import { IArticle, IComment, ITag, IUser } from "@/utils/interface";

const Dashboard = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const token = state.auth.token;

  const [users, setUsers] = useState<IUser[]>([]);
  const [countUsers, setCountUsers] = useState<number>(0);
  const [comments, setComments] = useState<IComment[]>([]);
  const [countComment, setCountComment] = useState<number>(0);
  const [tags, setTags] = useState<ITag[]>([]);
  const [countTag, setCountTag] = useState<number>(0);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [countArticle, setCountArticles] = useState<number>(0);

  useEffect(() => {
    getData(`user?limit=${5}`, token)
      .then((res) => {
        setUsers(res.user);
        setCountUsers(res.count);
      })
      .catch((error) => {
        toast.error(error, { theme: "colored" });
      });
  }, [countUsers]);

  useEffect(() => {
    getData(`comment?limit=${5}`, token)
      .then((res) => {
        setComments(res.comments);
        setCountComment(res.count);
      })
      .catch((error) => {
        toast.error(error, { theme: "colored" });
      });
  }, [countComment]);

  useEffect(() => {
    getData(`tag?limit=${5}`)
      .then((res) => {
        setTags(res.tags);
        setCountTag(res.count);
      })
      .catch((error) => {
        toast.error(error, { theme: "colored" });
      });
  }, [countTag]);

  useEffect(() => {
    getData(`article?limit=${5}`)
      .then((res) => {
        setArticles(res.articles);
        setCountArticles(res.count);
      })
      .catch((error) => {
        toast.error(error, { theme: "colored" });
      });
  }, [countArticle]);

  const handleDeleteArtile = async (id: string | undefined) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await patchData(`article/${id}`, {}, token);
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error) return toast.error(res.error, { theme: "colored" });

    const newArticles = articles.filter((article) => {
      return article._id !== id;
    });
    setArticles(newArticles);
    setCountArticles((prev) => prev - 1);
  };

  const handleDeleteComment = async (id: string | undefined) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await patchData(`comment/${id}`, {}, token);
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error) return toast.error(res.error, { theme: "colored" });

    const newComments = comments.filter((comment) => {
      return comment._id !== id;
    });
    setComments(newComments);
    setCountComment((prev) => prev - 1);
  };

  const cards = [
    {
      icon: <FaUserAlt size="36px" />,
      color: "bg-[#ffa726]",
      category: "Users",
      slug: "user",
      count: countUsers,
      time: "Just Updated",
    },
    {
      icon: <MdLocalOffer size="36px" />,
      color: "bg-[#ef5350]",
      category: "Tags",
      slug: "tag",
      count: countTag,
      time: "Just Updated",
    },
    {
      icon: <MdOutlineArticle size="36px" />,
      color: "bg-[#26c6da]",
      category: "Articles",
      slug: "article",
      count: countArticle,
      time: "Just Updated",
    },
    {
      icon: <MdComment size="36px" />,
      color: "bg-[#66bb6a]",
      category: "Comments",
      slug: "comment",
      count: countComment,
      time: "Just Updated",
    },
  ];

  return (
    <>
      <Seo title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <div className="col-span-1 my-8" key={index}>
            <div className="bg-white rounded-md py-2 px-4 shadow-md">
              <div className="relative text-right">
                <div
                  className={`float-left mt-[-28px] p-6 ${card.color} text-white rounded-sm`}
                >
                  {card.icon}
                </div>
                <p className="text-slate-500">
                  <Link href={`/me/${card.slug}`}>{card.category}</Link>
                </p>
                <h6 className="text-2xl text-[#3c4858]">{card.count}</h6>
              </div>
              <div className="flex items-center border-t border-[#eee] mt-4 pt-2 pb-1">
                <i className="mr-2 text-slate-500">
                  <MdOutlineAccessTime />
                </i>
                <Link href={`/me/${card.slug}`}>
                  <a className="text-slate-500 text-[13px]">{card.time}</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="col-span-1">
          <Table
            title="New Article"
            subtitle="Subtitle Table"
            headerColor="bg-[#ab47bc]"
          >
            <thead className="text-blue-800 font-semibold text-md">
              <tr>
                <th className="py-3 border-b text-center pr-4">ID</th>
                <th className="py-3 pr-8 border-b text-left">Title</th>

                <th className="py-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, i) => (
                <tr key={article._id}>
                  <td className="py-3 pr-4 border-b text-center">{i + 1}</td>

                  <td className="py-3 border-b pr-8">
                    <h4 className="line-clamp-1" title={article.title}>
                      {article.title}
                    </h4>
                  </td>

                  <td className="py-3 border-b text-center">
                    <div className="flex items-center justify-center">
                      <Link href={`/me/article/${article._id}`}>
                        <a className="mr-3 text-sky-800 text-xl">
                          <BiEdit />
                        </a>
                      </Link>
                      <button
                        className="text-red-700 text-xl"
                        onClick={() =>
                          dispatch({
                            type: "NOTIFY",
                            payload: {
                              modal: {
                                title: "Xóa bài viết",
                                message: "Bạn có chắc chắn muốn xóa bài viết?",
                                handleSure: () =>
                                  handleDeleteArtile(article._id),
                              },
                            },
                          })
                        }
                      >
                        <BiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="col-span-1">
          <Table
            title="New Comment"
            subtitle="Subtitle Table"
            headerColor="bg-[#ffa726]"
          >
            <thead className="text-blue-800 font-semibold text-md">
              <tr>
                <th className="py-3 border-b text-center pr-4">ID</th>
                <th className="py-3 pr-8 border-b text-left">Name</th>

                <th className="p-3 border-b text-center">Xoá</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, i) => (
                <tr key={comment._id}>
                  <td className="py-3 border-b text-center pr-4">{i + 1}</td>

                  <td className="py-3 pr-8 border-b">
                    <h4 title={comment.content} className="line-clamp-1">
                      {comment.content}
                    </h4>
                  </td>

                  <td className="p-3 border-b text-center">
                    <div className="flex items-center justify-center">
                      <button
                        className="text-red-700 text-xl"
                        onClick={() =>
                          dispatch({
                            type: "NOTIFY",
                            payload: {
                              modal: {
                                title: "Xóa bình luận",
                                message: "Bạn có chắc chắn muốn xóa bình luận?",
                                handleSure: () =>
                                  handleDeleteComment(comment._id),
                              },
                            },
                          })
                        }
                      >
                        <BiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
