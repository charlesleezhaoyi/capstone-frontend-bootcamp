import React, { FC, ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavMenu } from "./NavMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, CircleUserRound } from "lucide-react";
import LoginButton from "../auth0/LoginButton";
import { useNavigate, useParams } from "react-router-dom";
import { ImageWithFallback } from "../members/ImageWithFallback";
import defaultUserImg from "../../assets/defaultUser.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../UserContext";

export const Nav: FC = () => {
  const { pathname } = useLocation();
  const { npo_name } = useParams<{ npo_name: string }>();
  const rootPath = pathname.split("/")[1];
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const { userId } = useUser();
  const handleClick = () => {
    navigate("/public-onboarding");
  };

  const mobileHeader = (
    <nav className="flex flex-row justify-between items-center md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex-col flex">
          <NavMenu inSheet={true} />
        </SheetContent>
      </Sheet>
      <span className="font-bold text-xl">{rootPath}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <CircleUserRound className="h-5 w-5" />
            <span className="sr-only">Toggle user profile menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <LoginButton npo_name={npo_name ?? ""}></LoginButton>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button className="text-white w-full">Sign Up</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );

  const desktopHeader = (
    <nav className="hidden md:flex flex-row justify-between items-center px-5">
      <h3 className="hidden md:flex">OUR PRODUCT NAME</h3>
      <div className="flex flex-row items-center">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ImageWithFallback
                src="placeholder"
                alt="navbar profile"
                fallback={defaultUserImg}
                className="h-8 w-8"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>userId: {userId}</DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <LoginButton npo_name={npo_name ?? ""}></LoginButton>
            <Button
              className="text-white w-full text-md rounded-lg"
              onClick={handleClick}
            >
              Sign Up
            </Button>
          </>
        )}
        <Button
          className="text-white w-full text-md rounded-lg"
          onClick={handleClick}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="block text-secondary p-3">
        {mobileHeader}
        {desktopHeader}
      </header>
      <main className="flex flex-row h-full overflow-hidden">
        <div className="hidden md:flex flex-col p-6 w-[30%] max-w-[300px] border-t-2 border-secondary">
          <NavMenu />
        </div>
        <div className="flex-grow overflow-scroll border-t-2 border-secondary">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
