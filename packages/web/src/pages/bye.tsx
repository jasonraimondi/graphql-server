import React from "react";

import { useAppVersionQuery } from "@/generated/graphql";
import { Layout } from "@/app/components/layout";
import { withApollo } from "@/app/lib/apollo_next";

const page = () => {
    const {data, loading, error} = useAppVersionQuery();

    if (loading) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }

    if (error) {
        console.log(error);
        return (
            <Layout>
                <div>err</div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div>no data</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>{data.version}</div>
        </Layout>
    );
};

export default withApollo(page);
