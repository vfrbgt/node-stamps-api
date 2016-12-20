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

var trackNumber = '9400111899564483465995';

describe('Test', function() {
    describe('#auth', function() {
        it('check auth data', function() {
            should.exist(options.id);
            should.exist(options.username);
            should.exist(options.password);
        });
    })
});

describe('Stamps', function() {
    describe('#create', function() {
        it('should create client', function() {
            should.exist(Stamps);
        });
    })
});

describe('Stamps', function() {
    describe('#AuthenticateUser()', function() {
        it('should exist token', function(done) {
            Stamps.connect().then(() => {
                Stamps.auth(options).then(() => {
                    should.exist(Stamps.token);
                    done();
                });
            });
        });
    });
});

describe('Stamps', function() {
    describe('#TrackShipment()', function() {
        it('should track shipment', function(done) {
            Stamps.connect().then(() => {
                Stamps.request('TrackShipment', {
                    TrackingNumber: trackNumber
                }).then(function(trackingResponse) {
                    should.exist(trackingResponse);
                    should.exist(trackingResponse.TrackingEvents);
                    should.exist(trackingResponse.TrackingEvents.TrackingEvent);
                    done();
                });
            });
        });
    });
});



describe('#createTestIndicium()', function() {
    it('should create test indicum', function(done) {
        Stamps.request('CreateIndicium', {
            'Rate': rate,
            'From': from,
            'To': to,
            'SampleOnly': true
        }, true).then((indicium) => {
            should.exist(indicium);
            done();
        });
    });
});