import { withData } from "next-apollo";
import { HttpLink } from "apollo-boost";

const config = {
    link: new HttpLink({
        uri: "http://localhost:4000/graphql", // Server URL (must be absolute)
        credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
    })
};

export default withData(config);
