import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

var insertServices = async (req, res) => {
    const { db } = await connectToDatabase();
    const data = [
        {
            title: 'UI/UX',
            icon: 'uiuxIcon.svg'
        },
        {
            title: 'Design',
            icon: 'designIcon.svg'
        },
        {
            title: 'Development',
            icon: 'developmentIcon.svg'
        },
        {
            title: 'Tokens',
            icon: 'tokensIcon.svg'
        },
        {
            title: 'Smart Contracts',
            icon: 'smartcontractIcon.svg'
        },
        {
            title: 'DApps',
            icon: 'dappIcon.svg'
        },
        {
            title: 'DeFi',
            icon: 'defiIcon.svg'
        },
        {
            title: 'NFTs',
            icon: 'nftIcon.svg'
        },
        {
            title: 'DEX',
            icon: 'dexIcon.svg'
        },
        {
            title: 'Web3',
            icon: 'web3Icon.svg'
        },
        {
            title: 'Blockchain',
            icon: 'blockchainIcon.svg'
        },
        {
            title: 'Metaverse',
            icon: 'metaverseIcon.svg'
        },
    ];

    try {
        db.collection('services').insertMany(data);
        return res.status(201).end();
     } catch (e) {
        console.log(e)
        throw 'Something went wrong!';
    }
};

const getServices = async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const services = await db.collection('services').find().toArray();
        return res.status(200).json(services);
    } catch (e) {
        throw 'Somthing went wrong!';
    }
}

export default apiHandler({
    post: insertServices,
    get: getServices
});
