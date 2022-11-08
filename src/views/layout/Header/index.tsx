import Link from "next/link";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import Account from "./Account";
import NavMenu from "./NavMenu";
import Search from "./Search";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <>
      <header className="z-40 bg-white border-b border-gray-200 py-2 sticky top-0 lg:relative">
        <div className="container flex justify-between items-center">
          <BiMenu
            size="1.875rem"
            className="lg:hidden cursor-pointer"
            onClick={() => setIsMobile(true)}
          />
          <Link href="/">
            <a>
              <img src="/logo.webp" alt="logo" className="h-8" />
            </a>
          </Link>
          <div className="flex">
            <Search />
            <Account />
          </div>
        </div>
      </header>
      <NavMenu isMobile={isMobile} setIsMobile={setIsMobile} />
    </>
  );
};

export default Header;
