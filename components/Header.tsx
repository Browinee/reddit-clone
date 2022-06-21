import React from "react";
import Image from "next/image";
import { ChevronDownIcon, HomeIcon, SearchIcon } from "@heroicons/react/solid";
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";
function Header() {
  const { data: session } = useSession();

  return (
    <div className="items-center sticky top-0 z-50 flex bg-white shadow-sm px-5 py-2">
      <div className="relative h-10 w-20 flex-shrink-0">
        <Image
          src="https://links.papareact.com/fqy"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="flex items-center mx-7 xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className="ml-2 hidden flex-1 lg:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      <form className="flex flex-1 items-center space-x-2 border border-gray-200 rounded-lg bg-gray-100 px-3 py-1">
        <SearchIcon className="h-6 w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Search Reddit"
          className="outline-none bg-transparent flex-1"
        />
        <button type="submit" hidden />
      </form>
      <div className="flex items-center space-x-2 hidden lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <MenuIcon className="icon" />
      </div>
      <div
        onClick={() => (session ? signOut() : signIn())}
        className="hidden lg:flex items-center space-x-2  border border-gray-100 p-2 cursor-pointer"
      >
        <div className="relative h-5 w-5 ">
          <Image
            src="https://links.papareact.com/23l"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {session && (
          <>
            <div className="flex-1 text-xs">
              <p className="truncate">{session?.user?.name}</p>
            </div>
            <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
          </>
        )}

        <p className="text-gray-400">{session ? "" : "Sign In"}</p>
      </div>
    </div>
  );
}

export default Header;
