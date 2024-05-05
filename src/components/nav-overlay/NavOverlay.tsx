import React, { FC, ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { NavMenu } from "./NavMenu";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

export const Nav: FC = (props) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="sticky top-0 flex flex-row justify-between bg-black text-white">
        <nav className="flex flex-row">
          <Sheet>
            <SheetTrigger>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden text-black"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <NavMenu />
            </SheetContent>
          </Sheet>
          <h3>OUR PRODUCT NAME</h3>
        </nav>
        <h3>PROFILE LOGO</h3>
      </header>
      <main className="flex flex-row h-full">
        <div className="hidden md:flex">
          <NavMenu />
        </div>
        <Outlet />
      </main>
    </div>
  );
};
