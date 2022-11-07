import { useContext, useState } from "react";
import { BiUser } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import WrapperTippy from "../../../components/WrapperTippy";
import { GlobalContext } from "../../../store/GlobalState";
import NextImage from "../../../components/Image";
import { removeCookie } from "typescript-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Account = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { state, dispatch } = useContext(GlobalContext);
  const { user } = state.auth;

  const handleLogout = () => {
    removeCookie("refreshtoken", { path: "/" });
    localStorage.removeItem("Logined");
    dispatch({ type: "AUTH", payload: {} });
    toast.success("Đăng xuất thành công!");
    router.push("/");
  };
  return (
    <>
      {user ? (
        <Tippy
          interactive
          visible={visible}
          onClickOutside={() => setVisible(false)}
          render={(attrs) =>
            visible && (
              <WrapperTippy {...attrs} icon>
                <ul className="text-xl px-4">
                  <li className="flex py-2 items-center hover:text-rose-800 border-b border-[#e5e5e5]">
                    <Link href="/me">
                      <a
                        className="flex items-center"
                        onClick={() => setVisible(false)}
                      >
                        <span className="overflow-hidden w-12 h-12 rounded-full mr-2">
                          <NextImage
                            src={user.avatar}
                            alt={user.username}
                            width={50}
                            height={50}
                          />
                        </span>
                        <span>{user.username}</span>
                      </a>
                    </Link>
                  </li>
                  <li className="flex py-2 items-center hover:text-rose-800">
                    <Link href="/me/article/create">
                      <a onClick={() => setVisible(false)}>New Article</a>
                    </Link>
                  </li>
                  <li className="flex py-2 items-center hover:text-rose-800">
                    <Link href="/profile">
                      <a onClick={() => setVisible(false)}>Your Profile</a>
                    </Link>
                  </li>
                  <li className="flex py-2 items-center hover:text-rose-800 border-t border-[#e5e5e5]">
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </WrapperTippy>
            )
          }
        >
          <button
            className="mx-4 flex items-center cursor-pointer relative after:content-[''] after:absolute after:top-4 after:right-[-10px]  after:border-t-[#757575] after:border-t-[6px] after:border-x-[3px] after:border-x-transparent"
            onClick={() => setVisible(true)}
          >
            <span className="w-8 h-8 rounded-full overflow-hidden">
              <NextImage
                src={user.avatar}
                alt={user.username}
                width={32}
                height={32}
              />
            </span>
          </button>
        </Tippy>
      ) : (
        <Link href="/login">
          <a className="ml-4 flex items-center">
            <BiUser size="24px" />
            <span className="ml-2 hidden md:inline-block">Login</span>
          </a>
        </Link>
      )}
    </>
  );
};

export default Account;
