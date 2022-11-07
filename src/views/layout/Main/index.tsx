import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
  className?: string;
}

const Main = ({ children, className }: MainProps) => {
  return <main className={className}>{children}</main>;
};

export default Main;
