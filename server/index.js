var Gatecore = require('./gatecore');
var coap = require('coap')

var gatecore = new Gatecore;

var usgs = gatecore.stage('usgs','https://earthquake.usgs.gov/fdsnws/event/1/query', 'REST');  // Servicio de información de terremotos del USGS
var openaq = gatecore.stage('openaq', 'https://api.openaq.org/v1/latest', 'REST') // Servicio de calidad del aire de OpenAQ.

usgs.formRequest({ 'format' : 'geojson', 'starttime' : '2014-01-01', 'endtime': '2014-01-02', 'minmagnitude': '5' })//.pipe(process.stdout)
openaq.formRequest({ 'country': 'CL', 'city': "Parque O'Higgins" })//.pipe(process.stdout)

usgs.coap_server('device1', 5683, function(req, res) {
    res.end(this.name+' : Hello ' +req.url.split('/')[1] + '\n')
})

usgs.coap_server('device2', 5683, function (req, res) {
    res.end(this.name+' : Googbye ' + req.url.split('/')[1] + '\n')
})

openaq.coap_server('device3', 5683, function (req, res) {
    res.end(this.name + ' : Where is ' + req.url.split('/')[1] + '\n')
})

usgs.coap_client('coap://224.0.0.1/Me')

openaq.coap_client({
    hostname: '224.0.0.1',
    pathname: '/Her'
    , multicast: true
    , multicastTimeout: 2000
})

// console.log(gatecore.servers)