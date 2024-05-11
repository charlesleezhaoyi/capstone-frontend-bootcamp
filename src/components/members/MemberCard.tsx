import React, { FC } from "react";
import { Card, CardHeader, CardFooter } from "../ui/card";

export const MemberCard: FC = (props) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="aspect-square overflow-clip flex flex-row items-center justify-center">
          <img
            className="w-full"
            alt="User Profile"
            src="https://images.squarespace-cdn.com/content/v1/65538ce54f7b98232f41d3b0/ab770767-c25b-4cac-9a72-a159b36f3223/cf2022_full-56_original.jpg?format=300w"
          />
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col">
        <h3>Charles Lee</h3>
        <span>Admin</span>
      </CardFooter>
    </Card>
  );
};
