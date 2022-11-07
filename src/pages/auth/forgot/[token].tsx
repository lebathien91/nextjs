import Seo from "@/components/Seo";
import { GlobalContext } from "@/store/GlobalState";
import { postData } from "@/utils/fetchData";
import { FormSubmit, InputChange } from "@/utils/interface";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const router = useRouter();
  const { state, dispatch } = useContext(GlobalContext);

  const [formData, setFormData] = useState({
    password: "",
    cf_password: "",
  });

  const { password, cf_password } = formData;

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();

    if (password.length < 6)
      return toast.error("Mật khẩu ít nhấp 6 ký tự", { theme: "colored" });

    if (password !== cf_password)
      return toast.error("Mật khẩu nhập lại không khớp", { theme: "colored" });

    const token = router.query.token;
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData(
      "auth/reset-password",
      { password },
      token as string
    );
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error) return toast.error(res.error, { theme: "colored" });

    toast.success(res.success, { theme: "colored" });
  };
  return (
    <main>
      <Seo title="Đặt lại mật khẩu" />
      <section className="relative w-full h-full py-32 min-h-screen">
        <div className="absolute top-0 w-full h-full bg-gray-800 bg-no-repeat bg-full"></div>
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-gray-200 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10">
                  <div className="text-center my-6 text-gray-600">
                    <h2>Khôi phục mật khẩu</h2>
                    <p className="my-2">Nhập mật khẩu mới và xác nhận lại</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="relative w-full mb-3">
                      <label
                        htmlFor="password"
                        className="block uppercase text-gray-600 text-xs font-bold mb-2"
                      >
                        New Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChangeInput}
                        className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        htmlFor="cf_password"
                        className="block uppercase text-gray-600 text-xs font-bold mb-2"
                      >
                        Confirm New Password
                      </label>
                      <input
                        id="cf_password"
                        type="password"
                        name="cf_password"
                        value={cf_password}
                        onChange={handleChangeInput}
                        className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                      />
                    </div>

                    <div className="text-center mt-6">
                      <button className="bg-gray-800 text-white active:bg-gray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
