var should = require('should'),
    Stamps = require('../index');

var options = {
    id: process.env.STAMPS_ID,
    username: process.env.STAMPS_USERNAME,
    password: process.env.STAMPS_PASSWORD
};

var from = {
    FullName: "Cruzio",
    Address1: "877 Cedar St",
    Address2: "Ste 150",
    City: "Santa Cruz",
    State: "CA",
    ZIPCode: "95060"
};

var to = {
    FullName: "NextSpace",
    Address1: "101 Cooper Street",
    City: "Santa Cruz",
    State: "CA",
    ZIPCode: "95060"
};

var rate = {
    FromZIPCode: "95060",
    ToZIPCode: "95060",
    ServiceType: "US-PM",
    WeightLb: 0.5,
    PackageType: "Package",
    ShipDate: new Date().toISOString().split('T')[0],
    AddOns: {
        AddOnV7: [
            {AddOnType: 'US-A-DC'}
        ]
    }
};

var envelopeRate = {
    FromZIPCode: "95060",
    ToZIPCode: "95060",
    ServiceType: "US-FC",
    PrintLayout: "Envelope9",
    WeightLb: 0,
    WeightOz: 1,
    PackageType: "Letter",
    ShipDate: new Date().toISOString().split('T')[0],
    RectangularShaped: true
};

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

var trackNumber = '9400111899564483465995';

describe('#auth', function () {
    it('check auth data', function () {
        should.exist(options.id);
        should.exist(options.username);
        should.exist(options.password);
    });
});

describe('#create', function () {
    it('should create client', function () {
        should.exist(Stamps);
    });
});

describe('#AuthenticateUser()', function () {
    it('should exist token', function (done) {
        Stamps.connect({isDev: true}).then(() => {
            Stamps.auth(options).then(() => {
                should.exist(Stamps.Credentials);
                done();
            }, (err) => {
                should.not().exist(err);
                done();
            });
        });
    });
});

describe('#TrackShipment()', function () {
    it('should track shipment', function (done) {
        Stamps.connect({isDev: true}).then(() => {
            Stamps.request('TrackShipment', {
                TrackingNumber: trackNumber
            }).then(function (trackingResponse) {
                should.exist(trackingResponse);
                should.exist(trackingResponse.TrackingEvents);
                should.exist(trackingResponse.TrackingEvents.TrackingEvent);
                done();
            }, function(err) {
                let isNoRecord = err.root.Envelope.Body.Fault.faultstring.indexOf('USPS Desc:No record of that item');
                should.notEqual(isNoRecord, -1);
                done();
            });
        });
    });
});

describe('#createTestIndicium()', function () {
    it('should create test indicum', function (done) {
        Stamps.request('CreateIndicium', {
            'Rate': rate,
            'From': from,
            'To': to,
            'SampleOnly': true
        }, true).then((indicium) => {
            should.exist(indicium);
            done();
        }, (err) => {
            should.not.exists(err);
            done();
        });
    });
});

describe('#getRates()', function() {
    it('should get rates', function(done) {
        Stamps.request('GetRates', {
            'Rate': envelopeRate
        }).then((rates) => {
            should.exist(rates);
            should.exist(rates.Rates);
            should.exist(rates.Rates.Rate);
            done();
        }, (err) => {
            should.not.exists(err);
            done();
        });
    });
});

describe('#createEnvelopeIndicium()', function () {
    it('should create test Envelope Indicium', function (done) {
        Stamps.request('CreateEnvelopeIndicium', {
            'Rate': envelopeRate,
            'From': from,
            'To': to
        }, true).then((indiciumEnvelope) => {
            should.exist(indiciumEnvelope);
            done();
        }, (err) => {
            should.not.exist(err);
            done();
        });
    });
});