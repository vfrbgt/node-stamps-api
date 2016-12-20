let soap = require('soap');

const STAMPS_API_URL = "https://swsim.stamps.com/swsim/swsimv50.asmx?wsdl";

class Stamps {

    get IntegratorTxID() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    constructor() {
      this.Credentials = null;
    }

    connect() {
        let self = this;
        return new Promise((resolve, reject) => {
            soap.createClient(STAMPS_API_URL, {
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

    auth(authParams) {
        let self = this;
        let options = {
            IntegrationID: authParams.id,
            Username: authParams.username,
            Password: authParams.password
        };
        this.Credentials = options;
        return new Promise((resolve, reject) => {
            this.request('AuthenticateUser', {
                Credentials: options
            }).then((result) => {
                self.token = result.Authenticator;
                resolve();
            }, (error) => {
                reject(new Error(body));
            });
        });
    };

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