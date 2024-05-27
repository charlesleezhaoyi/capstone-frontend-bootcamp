import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import welcomeImg from "../assets/WelcomeImage.png";

export const Home: FC = () => {
  const [npo, setNpo] = useState<string | undefined>();
  const params = useParams();
  useEffect(() => {
    if (params.npo_url_extension) {
      setNpo(params.npo_url_extension);
    }
  }, []);
  return (
    <div className="flex justify-center items-center">
      <img src={welcomeImg} alt="homepage" className="w-1/2" />
    </div>
  );
};
