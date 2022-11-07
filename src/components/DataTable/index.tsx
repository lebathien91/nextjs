import React, { ReactNode } from "react";

export interface TableProps {
  children: ReactNode;
  headerColor?: string;
  title?: string;
  subtitle?: string;
}

const DataTable = ({
  children,
  headerColor = "bg-cyan-700",
  title,
  subtitle,
}: TableProps) => {
  return (
    <div className="w-full">
      <div className="my-8 relative bg-white text-[#333] rounded-md w-full shadow-md flex flex-col break-words">
        {(title || subtitle) && (
          <div className={`${headerColor} p-4 mt-[-20px] mx-4 rounded-sm`}>
            <h4 className="text-white text-2xl">{title}</h4>
            <p className="text-white/[0.6]">{subtitle}</p>
          </div>
        )}

        <div className="p-4 w-full overflow-x-auto">
          <table className="w-full mb-4 border-collapse">{children}</table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
