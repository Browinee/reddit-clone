import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const AVATARS_DICEBEAR = "https://avatars.dicebear.com/api/open-peeps/";
interface AvatarProps {
  seed?: string;
  large?: boolean;
  name: string;
}
function Avatar({ seed, large, name }: AvatarProps) {
  return (
    <div
      className={`relative overflow-hidden  rounded-full border-gray-300 bg-white ${
        large ? "w-20 h-20" : "h-10 w-10"
      } `}
    >
      <Image
        src={`${AVATARS_DICEBEAR}${name}.svg`}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}

export default Avatar;
