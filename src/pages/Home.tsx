import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Home: FC = () => {
  const [npo, setNpo] = useState<string | undefined>();
  const params = useParams();
  useEffect(() => {
    if (params.npo_url_extension) {
      setNpo(params.npo_url_extension);
    }
  }, []);
  return <h3>{npo && npo} Home</h3>;
};
