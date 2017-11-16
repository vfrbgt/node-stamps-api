let soap = require('soap');

const STAMPS_API_URL = "https://swsim.stamps.com/swsim/swsimv62.asmx?wsdl";
const STAMPS_API_URL_DEV = "https://swsim.testing.stamps.com/swsim/swsimv62.asmx?wsdl";

class Stamps {

    /**
     * @returns {string} random 32 length string
     */
    get IntegratorTxID() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    constructor(dev = false) {
      this.Credentials = null;
      this.stampsApiUrl = null;
    }

    /**
     * Connect with api need call before auth or request calls
     * @returns {Promise}
     */
    connect(params) {
        if(typeof params !== 'undefined' && params.isDev) {
            this.stampsApiUrl = STAMPS_API_URL_DEV;
        }
        else {
            this.stampsApiUrl = STAMPS_API_URL;
        }
        let self = this;
        return new Promise((resolve, reject) => {
            soap.createClient(self.stampsApiUrl, {
                connection: 'keep-alive',
                ignoredNamespaces: {
                    namespaces: ['targetNamespace', 'typedNamespace'],
                    override: true
                }
            }, function(err, client) {
                if (err) {
                    reject(err);
                }
                self.client = client;
                resolve(client);
            });
        });
    };

    /**
     * Auth in Stamps.com with AuthenticateUser request
     * @param authParams Credentials
     * @param getToken if true make request for get token else use Credentials as auth data
     * @returns {Promise}
     */
    auth(authParams, getToken = false) {
        let self = this;
        let options = {
            IntegrationID: authParams.id,
            Username: authParams.username,
            Password: authParams.password
        };
        this.Credentials = options;
        return new Promise((resolve, reject) => {
            if(getToken) {
                this.request('AuthenticateUser', {
                    Credentials: options
                }).then((result) => {
                    self.token = result.Authenticator;
                    resolve();
                }, (error) => {
                    reject(error);
                });
            }
            else {
                resolve();
            }
        });
    };

    /**
     * Call api from Stamps API
     * @param method {string} calling method from stamps api
     * @param params {object} Object stamps api params
     * @param enableTxID {string} true if need add IntegratorTxID to request
     * @returns {Promise}
     */
    request(method, params, enableTxID) {
        enableTxID = enableTxID || false;
        params = params || {};
        let self = this;
        return new Promise((resolve, reject) => {
            if (enableTxID) {
                params = Object.assign({
                  IntegratorTxID: self.IntegratorTxID
                }, params);
            }
            if (typeof(self.Credentials) !== 'undefined') {
                params = Object.assign({
                  Credentials: this.Credentials
                }, params);
            }
            this.client[method](params, function(err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    };
}

module.exports = new Stamps();
