const ImageKit = require('imagekit');
import { apiHandler } from "../../../utils/helpers/api";

const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/uihusbecs1/',
    publicKey: 'public_RFMgpmved2Nz3zxH+LMI9OyPmr4=',
    privateKey: 'private_Hj4mMODfWxHjddwRcKzFPO983z4='
});
  
const Auth = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}

export default apiHandler({
    get: Auth,
});
