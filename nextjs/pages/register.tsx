import React, { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import withApollo from "../lib/apollo";

const foo = () => {
    const [register] = useRegisterMutation();
    const handleRegister = async (e) => {
        e.preventDefault();
        const result = await register({
            variables: {
                data: {
                    email,
                    password,
                    firstName: "hi ya",
                    lastName: "slugger",
                },
            },
        });
        console.log(result);
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return <form onSubmit={handleRegister}>
        <label>
            Email
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>
        <label>
            Password
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </label>
        <button type="submit">Submit</button>
    </form>;
};

export default withApollo(foo);