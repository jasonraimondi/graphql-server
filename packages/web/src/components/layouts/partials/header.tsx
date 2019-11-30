import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Link } from "@/app/components/hoc/nav_link";
import { colors } from "@/styles/theme";
import { DeprecatedAuth } from "@/app/lib/auth";

interface Props {
    auth?: DeprecatedAuth;
}

export const Header: React.FC<Props> = ({ auth }) => {
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
                <Link href="/dashboard">
                    <NavAnchor>Dashboard</NavAnchor>
                </Link>
                <Link href="/blank">
                    <NavAnchor>Blank</NavAnchor>
                </Link>
                {auth && auth.email ? (
                    <>
                        <Link href="/logout">
                            <NavAnchor>Logout</NavAnchor>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/register">
                            <NavAnchor>Register</NavAnchor>
                        </Link>
                        <Link href="/login">
                            <NavAnchor>Login</NavAnchor>
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
