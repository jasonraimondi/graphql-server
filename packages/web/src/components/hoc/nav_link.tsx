import React from "react";
import NextLink from "next/link";

type Props = {
    href: string;
};

export const Link: React.FunctionComponent<Props> = ({ children, href }) => {
    return (
        <NextLink href={href} passHref>
            {children}
        </NextLink>
    );
};
