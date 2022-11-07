import Link from "next/link";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import { FaSort, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";

import AuthRouter from "@/middleware/AuthRouter";
import Table from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { GlobalContext } from "@/store/GlobalState";
import { getData, patchData } from "@/utils/fetchData";
import { FormSubmit, InputChange, IComment } from "@/utils/interface";
import useDebounce from "@/hooks/useDebounce";
import Seo from "@/components/Seo";
import { MdCheck } from "react-icons/md";

export default function CommentPage() {
  const router = useRouter();

  const { state, dispatch } = useContext(GlobalContext);
  const { auth } = state;
  const token = auth?.token;

  const [posts, setPosts] = useState<Array<IComment>>([]);
  const [select, setSelect] = useState<string>();
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const pages = Math.ceil(count / limit);
  const page = router.query.page || 1;
  const [sort, setSort] = useState<string>();
  const [keyword, setKeyword] = useState<string>("");

  const debounced = useDebounce(keyword, 500);
  useEffect(() => {
    // getPost & getCount dựa trên page and limit
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    getData(
      `comment?populate=user&page=${page}&limit=${limit}&sort=${sort}&search=${encodeURIComponent(
        debounced
      )}`,
      token
    )
      .then((res) => {
        if (!res.error) {
          setPosts(res.comments);
          setCount(res.count);
        }

        dispatch({ type: "NOTIFY", payload: {} });
      })
      .catch((error) => {
        setPosts([]);
        setCount(0);
        dispatch({ type: "NOTIFY", payload: {} });

        toast.error(error, { theme: "colored" });
      });
  }, [limit, page, sort, debounced]);

  const handleCheckBox = (e: InputChange) => {
    const { value, checked } = e.target as HTMLInputElement;

    if (value === "allSelect") {
      const newPosts = posts.map((post) => {
        return { ...post, isChecked: checked };
      });
      setPosts(newPosts);
    } else {
      const newPosts = posts.map((post) =>
        post._id?.toString() === value ? { ...post, isChecked: checked } : post
      );
      setPosts(newPosts);
    }
  };

  const handleDelete = async (id: string) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await patchData(`comment/${id}`, {}, token);
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error) return toast.error(res.error, { theme: "colored" });
    const newPosts = posts.filter((post) => {
      return post._id !== id;
    });
    setPosts(newPosts);
    setCount((prev) => prev - 1);
    return toast.success(res.success, { theme: "colored" });
  };

  const handeMutiDelete = async (ids: Array<string>) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await patchData("comment", ids, token);
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error) return toast.error(res.error, { theme: "colored" });

    const newPosts = posts.filter((post) => {
      return !ids.includes(post._id);
    });
    setPosts(newPosts);
    setCount((prev) => prev - ids.length);

    return toast.success(res.success, { theme: "colored" });
  };

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    let selectPosts: any = [];
    posts.forEach((post) => {
      if (post.isChecked) {
        selectPosts.push(post._id);
      }
    });
    if (select === "DELETE_MULTI_COMMENT")
      return dispatch({
        type: "NOTIFY",
        payload: {
          modal: {
            title: "Xóa chủ đề",
            message: "Bạn có chắc chắn muốn xóa những chủ đề đã chọn?",
            handleSure: () => handeMutiDelete(selectPosts),
          },
        },
      });
  };

  const onSortingChange = (field: string) => {
    const order = field === sort ? `-${field}` : field;
    setSort(order);
  };

  const TableHeaders = [
    {
      name: "STT",
      field: "stt",
      sortable: false,
    },
    {
      name: "Content",
      field: "content",
      sortable: true,
    },
    {
      name: "User",
      field: "user",
      sortable: true,
    },
    {
      name: "Root Comment",
      field: "commentRoot",
      sortable: true,
    },
    {
      name: "Actions",
      field: "action",
      sortable: false,
    },
  ];

  return (
    <>
      <Seo title="Danh sách comment - Dashboard" />
      <div className="my-8 font-semibold text-sky-700">
        <a className="mx-2 px-2 border-r border-slate-800 text-gray-500">
          Public ({count})
        </a>

        <Link href="/me/comment/trash">
          <a>Trash</a>
        </Link>
      </div>
      <div className="flex justify-between px-4">
        <div className="flex items-center">
          <form onSubmit={handleSubmit}>
            <select
              name="select"
              id="select"
              onChange={(e) => setSelect(e.target.value)}
              className="py-2 px-4 border border-gray-400 rounded-sm outline-none"
            >
              <option>--Action--</option>
              <option value="DELETE_MULTI_COMMENT">Delete</option>
            </select>
            <button className="ml-4 px-4 py-2 bg-yellow-600 rounded-sm text-white text-md font-semibold">
              Submit
            </button>
          </form>
          <input
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="ml-4 p-2 pr-8 hidden lg:block rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
          />
        </div>
      </div>

      <Table title="Title Table" subtitle="Subtitle Table">
        <thead className="text-blue-800 font-semibold text-md">
          <tr>
            <th className="py-3 border-b text-center pr-4">
              <input
                type="checkbox"
                value="allSelect"
                checked={
                  posts.length !== 0 &&
                  !posts.some((post) => post?.isChecked != true)
                }
                onChange={handleCheckBox}
              />
            </th>
            {TableHeaders.map((header) => (
              <th className="py-3 border-b text-left" key={header.field}>
                {header.sortable ? (
                  <span
                    className="cursor-pointer flex items-center"
                    onClick={() => onSortingChange(header.field)}
                  >
                    {header.name}

                    {sort === header.field ? (
                      <FaSortAlphaDown className="ml-2" />
                    ) : sort === "-" + header.field ? (
                      <FaSortAlphaDownAlt className="ml-2" />
                    ) : (
                      <FaSort className="ml-2" />
                    )}
                  </span>
                ) : (
                  header.name
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post._id}>
              <td className="py-3 border-b text-center pr-4">
                <input
                  type="checkbox"
                  value={post._id}
                  checked={post?.isChecked || false}
                  onChange={handleCheckBox}
                />
              </td>
              <td className="py-3 border-b pr-4">{index + 1}</td>
              <td className="py-3 border-b max-w-xs pr-8">
                <p className="line-clamp-1">{post.content}</p>
              </td>
              <td className="py-3 border-b">
                {typeof post.user === "object" && post.user?.username}
              </td>
              <td className="py-3 border-b max-w-xs px-8">
                {post.commentRoot ? (
                  ""
                ) : (
                  <MdCheck size={26} className="font-bold text-sky-600" />
                )}
              </td>
              <td className="py-3 border-b">
                <button
                  className="text-red-700 text-xl"
                  onClick={() =>
                    dispatch({
                      type: "NOTIFY",
                      payload: {
                        modal: {
                          title: "Xóa chủ đề",
                          message: "Bạn có chắc chắn muốn xóa chủ đề?",
                          handleSure: () => handleDelete(post._id),
                        },
                      },
                    })
                  }
                >
                  <BiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination limit={limit} setLimit={setLimit} pages={pages} />
    </>
  );
}

CommentPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthRouter>{page}</AuthRouter>;
};
