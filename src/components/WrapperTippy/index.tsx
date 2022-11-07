import { ReactNode } from "react";

const WrapperTippy = ({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: boolean;
}) => {
  return (
    <div className="w-full shadow-lg bg-white border border-[#e5e5e5] rounded-sm text-left">
      {children}
      {icon && (
        <span className="bg-white w-4 h-4 border-r border-b border-[#e5e5e5] absolute top-[-7px] right-[32px] rotate-[225deg]"></span>
      )}
    </div>
  );
};

export default WrapperTippy;
