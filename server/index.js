var Gatecore = require('./gatecore');

var gatecore = new Gatecore;

var usgs = gatecore.stage('usgs','https://earthquake.usgs.gov/fdsnws/event/1/query', 'REST');  // Servicio de información de terremotos del USGS
var openaq = gatecore.stage('openaq', 'https://api.openaq.org/v1/latest', 'REST') // Servicio de calidad del aire de OpenAQ.

usgs.formRequest({ 'format' : 'geojson', 'starttime' : '2014-01-01', 'endtime': '2014-01-02', 'minmagnitude': '5' }).pipe(process.stdout)
openaq.formRequest({ 'country': 'CL', 'city': "Parque O'Higgins" }).pipe(process.stdout)