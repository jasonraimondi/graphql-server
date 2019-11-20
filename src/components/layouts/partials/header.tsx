import React from "react";

import { NavLink } from "@/app/components/nav_link";

interface Props {
  user?: { email: string, name: string, };
}


export const Header: React.FC<Props> = ({ user }) => {
  return (
    <header>
      <nav>
        <NavLink href="/">
          <a className="helmet">Home</a>
        </NavLink>
        <NavLink href="/register">
          <a className="helmet">Register</a>
        </NavLink>
        <NavLink href="/login">
          <a className="helmet">Login</a>
        </NavLink>
        {user ? <NavLink href="/logout">
          <a className="helmet">Logout</a>
        </NavLink> : null}
      </nav>

      <style jsx>{`
        nav { 
          display: flex;
        }
        .helmet {
          color: teal;
        }
        .helmet:after {
          content: "|";
          color: black;
          text-decoration: none;
          padding: 0 2px;
        }
        .helmet:last-child:after {
          content: "";
          padding: 0;
        }
      `}</style>
    </header>
  );
};