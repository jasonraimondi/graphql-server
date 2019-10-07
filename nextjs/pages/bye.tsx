import React from "react";
import {useAppVersionQuery} from "../generated/graphql";

import {Layout} from "../components/layout";
import { withApollo } from "../lib/apollo";

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
