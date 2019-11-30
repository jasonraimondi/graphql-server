import { NextPage } from "next";
import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { withApollo } from "@/app/lib/apollo_next";
import { withLayout } from "@/app/components/layouts/layout";
import { useVerifyEmailConfirmationMutation } from "@/generated/graphql";
import { Redirect } from "@/app/lib/redirect";
import { WithRouterProps } from "next/dist/client/with-router";

type Props = WithRouterProps & {};

const VerifyUser: NextPage<Props> = ({
    router: {
        query: { e, u },
    },
}) => {
    const email = Array.isArray(e) ? e[0] : e;
    const uuid = Array.isArray(u) ? u[0] : u;
    const verifyEmailData = { email, uuid };
    const [verifyEmail] = useVerifyEmailConfirmationMutation();
    const [status, setStatus] = useState("Verifying Email...");

    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));

    const handleVerifyUser = async () => {
        await verifyEmail({ variables: { data: verifyEmailData } }).catch(e => {
            setStatus(e.message);
            Redirect(`/login?message=${encodeURI(e.message)}`);
        });
        setStatus("Success! Redirecting to login...");
        await sleep(3000);
        await Redirect("/login");
    };

    useEffect(() => {
        handleVerifyUser().catch(e => console.error(e));
    }, []);

    return <h1 className="h5">{status}</h1>;
};

export default withLayout(withApollo(withRouter(VerifyUser)), {
    title: "VerifyUser Page",
});
