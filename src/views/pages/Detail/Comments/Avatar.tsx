import React from "react";
import { IUser } from "@/utils/interface";

const Avatar = ({ user, size = 8 }: { user: IUser; size: number }) => {
  return (
    <div
      className={`h-${size} w-${size} rounded-full overflow-hidden flex flex-shrink-0 self-start cursor-pointer`}
    >
      <img src={user.avatar} alt={user.username} />
    </div>
  );
};
export default Avatar;
