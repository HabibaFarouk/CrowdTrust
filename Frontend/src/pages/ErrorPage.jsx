import React from "react";
import NavMenu from "../components/NavMenu";

export default function ErrorPage(){
  return (
    <div style={{ padding: 16 }}>
      <NavMenu />
      <h1>Something went wrong</h1>
      <p>We couldn't find that page or an error occurred.</p>
    </div>
  );
}
