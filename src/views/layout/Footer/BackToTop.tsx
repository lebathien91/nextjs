import { useState, useEffect } from "react";
import { FiArrowUpCircle } from "react-icons/fi";

const BackToTop = () => {
  const [showBackTop, setShowBackTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.pageYOffset > 300);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="fixed right-4 md:right-12 bottom-16">
      {showBackTop && (
        <button
          className="text-[#b52759] hover:text-[#1e73be]"
          onClick={scrollToTop}
        >
          <FiArrowUpCircle size="3rem" />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
