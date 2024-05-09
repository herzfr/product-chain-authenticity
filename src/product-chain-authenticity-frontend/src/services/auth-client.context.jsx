import { createContext, useContext, useEffect, useState } from "react";
import { DefaultAuthOptions } from "../config/auth.config";
import { AuthClient } from "@dfinity/auth-client";
// import { canisterId, createActor } from "../../../declarations/icp_codefest_atlan3_backend";


const AuthContext = createContext();

export const useAuthClient = (options = DefaultAuthOptions) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authClient, setAuthClient] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [whoamiActor, setWhoamiActor] = useState(null);

    useEffect(() => {
        AuthClient.create(options.createOptions)
            .then(async (client) => {
                updateClient(client);
            });
    }, []);

    const login = () => {
        authClient.login({
            ...options.loginOptions,
            onSuccess: () => {
                updateClient(authClient)
            }
        })
    }

    async function updateClient(client) {
        // const isAuthenticated = await client.isAuthenticated();
        // setIsAuthenticated(isAuthenticated);

        // const identity = client.getIdentity();
        // setIdentity(identity)

        // const principal = identity.getPrincipal();
        // setPrincipal(principal)

        // setAuthClient(client);

        // const actor = createActor(canisterId, {
        //     agentOptions: {
        //         identity,
        //     },
        // })

        // console.log('isAuthenticated ', isAuthenticated);
        // console.log('identity ', identity);
        // console.log('principal ', principal);
        // console.log('actor ', actor);
        // setWhoamiActor(actor);
    }

    async function logout() {
        // await authClient?.logout();
        // await updateClient(authClient);
    }

    return {
        isAuthenticated,
        login,
        logout,
        authClient,
        identity,
        principal,
        whoamiActor,
    };

}

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext)
};

export default useAuth;