import { ReactElement, useContext, useEffect, useState } from "react";
import Layout from "@/layout/index";
import { GlobalContext } from "@/store/GlobalState";
import { FaCamera, FaFacebookF, FaTiktok, FaTwitter } from "react-icons/fa";
import { FormSubmit, InputChange, IUser } from "@/utils/interface";
import Loading from "@/components/Loading";
import Login from "./login";
import { toast } from "react-toastify";
import { validRegister } from "@/utils/valid";
import { patchData, putData } from "@/utils/fetchData";
import { checkImage, uploadImage } from "@/utils/uploadImage";
import Seo from "@/components/Seo";

export default function Profile() {
  const { state, dispatch } = useContext(GlobalContext);
  const { auth } = state;
  const { user, token } = auth;

  const initialState = {
    _id: "",
    avatar: "",
    username: "",
    password: "",
    cf_password: "",
    email: "",
    role: "user",
    aboutMe: "",
  };

  const [formData, setFormData] = useState<IUser>(initialState);
  const [newAvatar, setNewAvatar] = useState<File>();

  useEffect(() => {
    setFormData({ ...formData, ...user });
  }, [user]);

  const { avatar, username, email, password, cf_password, aboutMe } = formData;

  const changeAvatar = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      const file = files[0];
      console.log(file);
      const errMsg = checkImage(file, 2);
      if (errMsg) return toast.error(errMsg, { theme: "colored" });
      setNewAvatar(file);
    }
  };

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    if (!username)
      return toast.error("Bạn phải nhập username", { theme: "colored" });

    if (password) {
      const errMsg = validRegister(username, email, password, cf_password);
      if (errMsg) return toast.error(errMsg, { theme: "colored" });

      dispatch({ type: "NOTIFY", payload: { loading: true } });
      const res = await patchData("auth", { password }, token);
      dispatch({ type: "NOTIFY", payload: {} });
      if (res.error) return toast.error(res.error, { theme: "colored" });

      toast.success(res.success, { theme: "colored" });
    }

    if (newAvatar || username !== user.username || aboutMe !== user.aboutMe) {
      let media;

      dispatch({ type: "NOTIFY", payload: { loading: true } });
      if (newAvatar) media = await uploadImage(newAvatar, "UserName");

      const res = await putData(
        "auth",
        {
          ...formData,
          avatar: media && media.url,
        },
        token
      );
      dispatch({ type: "NOTIFY", payload: {} });
      if (res.error) return toast.error(res.error, { theme: "colored" });

      return toast.success(res.success, { theme: "colored" });
    }
  };

  if (auth.loading) return <Loading />;
  if (!user) return <Login />;
  return (
    <Layout>
      <Seo title={user.username} />

      <form
        className="container grid grid-cols-3 my-24 gap-8"
        onSubmit={handleSubmit}
      >
        <aside className="col-span-3 xl:col-span-1">
          <div className="border rounded-md shadow-md p-4">
            <div className="mx-auto w-40 h-40 rounded-full overflow-hidden mt-[-90px] relative group">
              <img src={newAvatar ? URL.createObjectURL(newAvatar) : avatar} />
              <span className="absolute w-full h-[50%] bg-slate-200 opacity-80 left-0 bottom-[-100%] group-hover:bottom-[-10%] text-orange-500 flex flex-col items-center py-2 font-semibold">
                <FaCamera />
                <p>Change...</p>
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept="image/*"
                  onChange={changeAvatar}
                  className="absolute top-0 left-0 w-full h-full opacity-0"
                />
              </span>
            </div>

            <h2 className="uppercase text-gray-600 text-center my-4">
              {username}
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
          <div className="border rounded-md shadow-md p-4">
            <div className="mb-8">
              <label
                htmlFor="username"
                className="w-full text-xl font-semibold"
              >
                UserName
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Your Name"
                value={username}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="email" className="w-full text-xl font-semibold">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Your Email"
                disabled={true}
                defaultValue={email}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="password"
                className="w-full text-xl font-semibold"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="cf_password"
                className="w-full text-xl font-semibold"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="cf_password"
                id="cf_password"
                value={cf_password}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="aboutMe" className="w-full text-xl font-semibold">
                About Me
              </label>
              <textarea
                name="aboutMe"
                id="aboutMe"
                rows={3}
                placeholder="About me"
                value={aboutMe}
                onChange={handleChangeInput}
                className="w-full p-2 pr-8 block mt-1 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-[#2563eb] focus:border focus:outline-none"
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="border py-2 px-4 bg-cyan-700 rounded-md text-white font-bold mr-8"
              >
                Save
              </button>
            </div>
          </div>
        </main>
      </form>
    </Layout>
  );
}
