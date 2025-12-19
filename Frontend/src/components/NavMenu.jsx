import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavMenu() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("crowd_user") || "null");

  function logout() {
    localStorage.removeItem("crowd_user");
    navigate("/");
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">CrowdTrust</Link>
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <Link to={`/profile/${user.id}`}>Profile</Link>
            <button className="btn ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
