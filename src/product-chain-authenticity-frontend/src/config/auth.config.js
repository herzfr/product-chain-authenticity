export const DefaultAuthOptions = {
    createOptions: {
        idleOptions: {
            disableIdle: true,
        },
    },
    loginOptions: {
        identityProvider:
            process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/#authorize"
                : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943#authorize`,
    },
}