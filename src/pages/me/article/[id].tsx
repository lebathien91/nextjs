import { ReactElement, useContext, useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useRouter } from "next/router";

import AuthRouter from "@/middleware/AuthRouter";
import Editor from "@/components/Editor";
import { getData, putData } from "@/utils/fetchData";
import { GlobalContext } from "@/store/GlobalState";
import { FormSubmit, IArticle, InputChange, ITag } from "@/utils/interface";
import Seo from "@/components/Seo";

export default function UpdateArticle() {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useContext(GlobalContext);
  const { user, token } = state.auth;

  const initialState = {
    _id: "",
    title: "",
    description: "",
    tag: "",
    content: "",
  };
  const [formData, setFormData] = useState<IArticle>(initialState);
  const [body, setBody] = useState<string>("");
  const [tagId, setTagId] = useState<string>("");
  const [defaultTag, setDefaultTag] = useState<string>("");

  useEffect(() => {
    if (id) {
      // Get Data
      dispatch({ type: "NOTIFY", payload: { loading: true } });
      getData(`article/${id}?populate=tag`)
        .then((res) => {
          setFormData(res.article);
          setDefaultTag(res.article.tag.name);
          setBody(res.article.content);
          dispatch({ type: "NOTIFY", payload: {} });
        })
        .catch((error) => {
          toast.error(error);
          dispatch({ type: "NOTIFY", payload: {} });
        });
    }
  }, [id]);

  const { title, description, tag, createdAt, updatedAt } = formData;

  const loadTags = async (inputValue: string) => {
    let options: Array<{ value: string; label: string }> = [];
    try {
      const res = await getData(`tag?limit=20&search=${inputValue}`);

      // Get Tags
      res.tags.forEach((tag: ITag) => {
        options.push({
          value: tag._id,
          label: tag.name,
        });
      });

      return { options };
    } catch (error) {
      console.log(error);
      return { options };
    }
  };

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeTagSelect = (e: any) => {
    setTagId(e.value);
  };

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const res = await putData(
      `article/${id}`,
      { ...formData, tag: tagId ? tagId : tag, content: body },
      token
    );
    dispatch({ type: "NOTIFY", payload: {} });
    if (res.error) return toast.error(res.error, { theme: "colored" });

    toast.success(res.success, { theme: "colored" });
    return router.back();
  };

  return (
    <>
      <Seo title="Chỉnh sửa bài viết - Dashboard" />
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex justify-between px-8 mb-8">
          <h2 className="text-4xl">Update Article</h2>
          <button className="px-4 py-2 bg-green-800 rounded-sm text-white text-md font-semibold">
            Save
          </button>
        </div>
        <div className="grid grid-cols-8 gap-8">
          <div className="p-8 col-span-8 xl:col-span-5 bg-white rounded-md shadow-md border">
            <div className="mb-8">
              <label htmlFor="title" className="w-full text-xl font-semibold">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                value={title}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="description"
                className="w-full text-xl font-semibold"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Description..."
                value={description}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              ></textarea>
            </div>
            <div className="">
              <label htmlFor="content" className="w-full text-xl font-semibold">
                Content
              </label>
              <Editor body={body} setBody={setBody} />
            </div>
          </div>
          <div className="col-span-8 xl:col-span-3">
            <div className="rounded-md shadow-md p-6 mb-8 bg-white border">
              <h3 className="uppercase text-gray-500 border-b">Relation</h3>
              <div className="my-4">
                <label htmlFor="tag" className="w-full text-xl font-semibold">
                  Tag
                </label>
                <AsyncPaginate
                  instanceId="tag"
                  defaultOptions
                  placeholder={defaultTag}
                  loadOptions={loadTags}
                  onChange={handleChangeTagSelect}
                  debounceTimeout={500}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="rounded-md shadow-md p-6 mb-8 bg-white border">
              <h3 className="uppercase text-gray-500 border-b">Infomation</h3>
              <div className="flex justify-between py-3">
                <span>Created</span>
                <time>
                  {createdAt &&
                    format(new Date(createdAt as string), "h:m a - dd/MM/yyyy")}
                </time>
              </div>
              <div className="flex justify-between py-3">
                <span>Updated</span>
                <time>{format(new Date(), "h:m a - dd/MM/yyyy")}</time>
              </div>
              <div className="flex justify-between py-3">
                <span>Update By</span>
                <span>{user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

UpdateArticle.getLayout = function getLayout(page: ReactElement) {
  return <AuthRouter isUser>{page}</AuthRouter>;
};
