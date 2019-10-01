import { withData } from "next-apollo";
import { HttpLink } from "apollo-boost";

const config = {
    link: new HttpLink({
        uri: "https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn", // Server URL (must be absolute)
        credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
    })
};

export default withData(config);
