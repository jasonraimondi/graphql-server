import React from "react";
import {useUsersQuery} from "../generated/graphql";
import {Layout} from "../components/layout";
import { withApollo } from "../lib/apollo";

let page = () => {
    const {data} = useUsersQuery({ fetchPolicy: "network-only"});

    if (!data) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>
                <div>users:</div>
                <ul>
                    {data.users.map(x => {
                        return (
                            <li key={x.uuid}>
                                {x.email}, {x.uuid}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Layout>
    );
};

export default withApollo(page);