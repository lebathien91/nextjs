import { setCookie } from "typescript-cookie";
import { MdFacebook } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { ReactElement, useContext, useEffect, useState } from "react";
import { FormSubmit, InputChange } from "../utils/interface";
import { toast } from "react-toastify";
import { postData } from "../utils/fetchData";
import { GlobalContext } from "../store/GlobalState";
import { useRouter } from "next/router";
import Seo from "@/components/Seo";

const Login = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(GlobalContext);
  const { auth } = state;

  useEffect(() => {
    const authLength = Object.keys(auth).length;

    const url = router.asPath.split("?")[1] || "/me";

    if (!auth.loading && authLength !== 0) router.push(url);
  }, [auth]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const { email, password, remember } = formData;

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckBox = (e: InputChange) => {
    const { name, checked } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();

    if (!email || !password)
      toast.error("Bạn phải nhập đầy đủ các trường!", { theme: "colored" });

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData("auth/login", formData);
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error)
      return toast.error(res.error, {
        theme: "colored",
      });

    toast.success(res.success);
    dispatch({
      type: "AUTH",
      payload: { token: res.accessToken, user: res.user },
    });

    setCookie("refreshtoken", res.refeshToken, { expires: 7, path: "/" });
    localStorage.setItem("Logined", process.env.NEXT_PUBLIC_API_URL as string);
  };

  return (
    <main>
      <section className="relative w-full h-full py-32 min-h-screen">
        <div className="absolute top-0 w-full h-full bg-gray-800 bg-no-repeat bg-full"></div>
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-gray-500 text-sm font-bold">
                      Sign in with
                    </h6>
                  </div>
                  <div className="btn-wrapper text-center">
                    <button
                      className="bg-white active:bg-gray-50 text-gray-700 px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                      type="button"
                    >
                      <MdFacebook
                        size="1.5rem"
                        className="mr-2 text-[#4267B2]"
                      />
                      Facebook
                    </button>
                    <button
                      className="bg-white active:bg-gray-50 text-gray-700 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                      type="button"
                    >
                      <FcGoogle size="1.5rem" className="mr-2" />
                      Google
                    </button>
                  </div>
                  <hr className="mt-6 border-b-1 border-gray-300" />
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div className="text-gray-400 text-center mb-3 font-bold">
                    <small>Or sign in with credentials</small>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="relative w-full mb-3">
                      <label
                        htmlFor="email"
                        className="block uppercase text-gray-600 text-xs font-bold mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleChangeInput}
                        className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        htmlFor="password"
                        className="block uppercase text-gray-600 text-xs font-bold mb-2"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={handleChangeInput}
                        className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="remember"
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          id="remember"
                          type="checkbox"
                          name="remember"
                          checked={remember}
                          onChange={handleCheckBox}
                          className="form-checkbox border-0 rounded text-gray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        />
                        <span className="ml-2 text-sm font-semibold text-gray-600">
                          Remember me
                        </span>
                      </label>
                    </div>
                    <div className="text-center mt-6">
                      <button className="bg-gray-800 text-white active:bg-gray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150">
                        Sign In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                  <Link href="/auth/forgot">
                    <a className="text-gray-200 text-sm">Forgot password?</a>
                  </Link>
                </div>
                <div className="w-1/2 text-right">
                  <Link href="/register">
                    <a className="text-gray-200 text-sm">Create new account</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Seo title="Đăng nhập" />
      {page}
    </>
  );
};
