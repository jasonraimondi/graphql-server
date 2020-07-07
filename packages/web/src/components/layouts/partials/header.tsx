import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Link } from "@/app/components/link";
import { colors } from "@/styles/theme";
import { AuthType } from "@/app/lib/auth/use_auth";

type Props = AuthType & {};

export const Header: React.FC<Props> = ({ accessToken }) => {
  return (
    <header>
      <nav
        css={css`
          display: flex;
        `}
      >
        <Link href="/">
          <NavAnchor>Home</NavAnchor>
        </Link>
        <Link href="/profile">
          <NavAnchor>Testing Profile</NavAnchor>
        </Link>
        {accessToken?.isValid ? (
          <>
            <Link href="/dashboard">
              <NavAnchor>Dashboard</NavAnchor>
            </Link>
            <Link href="/profile">
              <NavAnchor>Profile</NavAnchor>
            </Link>
            <Link href="/logout">
              <NavAnchor data-test="logout-link">Logout</NavAnchor>
            </Link>
          </>
        ) : (
          <>
            <Link href="/register">
              <NavAnchor data-test="register-link">Register</NavAnchor>
            </Link>
            <Link href="/login">
              <NavAnchor data-test="login-link">Login</NavAnchor>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

const NavAnchor = styled.a`
  color: ${colors.gray["100"]};
  font-weight: 500;
  padding: 0.5rem 0;

  &:hover,
  &:active {
    color: ${colors.gray["400"]};
  }

  &:after {
    content: "|";
    color: ${colors.black};
    text-decoration: none;
    padding: 0 2px;
  }
  &:last-child:after {
    content: "";
    padding: 0;
  }
`;
