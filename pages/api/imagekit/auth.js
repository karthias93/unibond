const ImageKit = require('imagekit');
import { apiHandler } from "../../../utils/helpers/api";

const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/uihusbecs1/unibond/',
    publicKey: 'public_cpIQIqH/QSniDBAqeSdoCHQtcbE=',
    privateKey: 'private_0RFW0GwfnklObB2rqJALShnxQzE='
});
  
const Auth = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}

export default apiHandler({
    get: Auth,
});
