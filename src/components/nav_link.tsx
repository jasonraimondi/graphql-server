import React from "react";
import Link from "next/link";

type Props = {
  href: string;
};

export const NavLink: React.FunctionComponent<Props> = ({ children, href }) => {
  return <Link href={href} passHref>{children}</Link>;
};