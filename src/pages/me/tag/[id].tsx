import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import AuthRouter from "@/middleware/AuthRouter";
import NextImage from "@/components/Image";
import { getData, putData } from "@/utils/fetchData";
import { GlobalContext } from "@/store/GlobalState";
import { InputChange, FormSubmit, ICategory, ITag } from "@/utils/interface";
import { checkImage, uploadImage } from "@/utils/uploadImage";
import Seo from "@/components/Seo";
import { format } from "date-fns";

export default function UpdateTag() {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useContext(GlobalContext);
  const token = state.auth.token;

  const initialState = {
    _id: "",
    name: "",
    description: "",
    category: "",
    thumbnail: "",
  };

  const [formData, setFormData] = useState<ITag>(initialState);
  const [newThumbnail, setNewThumbnail] = useState<File>();
  const [categories, setCategories] = useState<Array<ICategory>>([]);

  useEffect(() => {
    getData("category")
      .then((res) => {
        setCategories(res.categories);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error, { theme: "colored" });
      });
  }, []);

  useEffect(() => {
    if (id) {
      // Get Data
      dispatch({ type: "NOTIFY", payload: { loading: true } });
      getData(`tag/${id}`)
        .then((res) => {
          setFormData(res.tag);
          dispatch({ type: "NOTIFY", payload: {} });
        })
        .catch((error) => {
          toast.error(error);
          dispatch({ type: "NOTIFY", payload: {} });
        });
    }
  }, [id]);

  const { name, description, category, thumbnail, createdAt } = formData;

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangThumbnail = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      const file = files[0];

      const errMsg = checkImage(file, 3);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

      setNewThumbnail(file);
    }
  };

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    if (!category)
      return toast.error("Bạn phải chọn Category", { theme: "colored" });

    let media;

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    if (newThumbnail) media = await uploadImage(newThumbnail, "TagsList");

    const res = await putData(
      `tag/${id}`,
      { ...formData, thumbnail: media && media.url },
      token
    );
    dispatch({ type: "NOTIFY", payload: {} });
    if (res.error) return toast.error(res.error, { theme: "colored" });

    toast.success(res.success, { theme: "colored" });
    return router.back();
  };

  return (
    <>
      <Seo title="Chỉnh sửa tag - Dashboard" />

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex justify-between px-8 mb-8">
          <h2 className="text-4xl">Update tag</h2>
          <button className="px-4 py-2 bg-green-800 rounded-sm text-white text-md font-semibold">
            Save
          </button>
        </div>
        <div className="w-full grid grid-cols-8">
          <div className="col-span-8 lg:col-span-4 xl:col-span-5 bg-white p-8 rounded-md shadow-md border">
            <div className="mb-8">
              <label htmlFor="name" className="w-full text-xl font-semibold">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name Tag"
                value={name}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="category"
                className="w-full text-xl font-semibold"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                value={typeof category === "string" ? category : category._id}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              >
                <option value="">-- Choose --</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-8">
              <label
                htmlFor="thumbnail"
                className="w-full text-xl font-semibold"
              >
                Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                id="thumbnail"
                accept="image/*"
                onChange={handleChangThumbnail}
                className="w-full block mt-1"
              />
            </div>
            <div className="">
              <label
                htmlFor="description"
                className="w-full text-xl font-semibold"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                placeholder="Description Tag"
                value={description}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              ></textarea>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:pl-8">
            <div className="bg-white border border-gray-300 rounded-md overflow-hidden shadow-md shadow-slate-300 hover:shadow-2xl hover:shadow-slate-300">
              <NextImage
                src={
                  newThumbnail
                    ? URL.createObjectURL(newThumbnail)
                    : thumbnail
                    ? thumbnail
                    : "https://res.cloudinary.com/kuchuoi/image/upload/v1662444829/Diseases/jpe803fyhzckocfxpn8r.webp"
                }
                alt="Example"
              />

              <main className="px-4">
                <h2 className="py-2">{name ? name : "Title Example"}</h2>
                <p className="line-clamp-3">
                  {description
                    ? description
                    : "Phần mô tả tóm tắt nội dung. Phần này thường dài khoảng ~ 200 ký tự trong đó nêu những nội dung nổi bật của bài"}
                </p>
              </main>
              <footer className="px-4 py-2 flex justify-between text-[17px]">
                <span>
                  {category
                    ? categories.find((cat) => cat._id?.toString() === category)
                        ?.name
                    : "Category"}
                </span>

                <span>
                  {createdAt &&
                    format(new Date(createdAt as string), "h:m a - dd/MM/yyyy")}
                </span>
              </footer>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

UpdateTag.getLayout = function getLayout(page: ReactElement) {
  return <AuthRouter>{page}</AuthRouter>;
};
