/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        MONGODB_URI:
        "mongodb://karthick:PFKFUQpFi6mTpSnC@ac-bx1hyft-shard-00-00.3l9etec.mongodb.net:27017,ac-bx1hyft-shard-00-01.3l9etec.mongodb.net:27017,ac-bx1hyft-shard-00-02.3l9etec.mongodb.net:27017/?ssl=true&replicaSet=atlas-3iqehh-shard-0&authSource=admin&retryWrites=true&w=majority",
        //"mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false",
        DB_NAME: "UniBond",
        apiUrl:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000" // development api
                : "https://uni.bond", // production api
        mailPassword: "jbugbloiyopaathg",
        mailUsername: "unibond12@gmail.com",
        imgUrlEndpoint: "https://ik.imagekit.io/uihusbecs1/"
    },
    serverRuntimeConfig: {
        secret: "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT CAN BE ANY STRING",
    },
    publicRuntimeConfig: {
        apiUrl:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000" // development api
                : "https://uni.bond/", // production api
    },
};

module.exports = nextConfig;
