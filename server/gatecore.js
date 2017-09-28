var request = require('request');
const stream = require('stream');
var url = require('url');
var coap = require('coap')
var mosca = require('mosca')

module.exports = Gatecore

function Gatecore () {
    var servers = [];
    function stage(_name, _url, type, callback) {
        this._name = _name;
        this._url = _url;
        // console.log(this)
        if (_url) {
            console.log('stage for :', _url)
            var stage_url = url.parse(_url);
        }
        var data = "";
        var self = this;
        var iostream = new stream.Duplex({
            write: function (chunk, encoding, next) {
                data += chunk;
                next();
            },
            read: function (chunk, encoding, next) {

            }
        });
        var formRequest = function (formInput) {
            if (stage_url) {
                console.log('requesting', _name,'on', _url)
                var requestParams = { url: _url, qs: formInput }
                return request.get(requestParams, function (error, response, body) {
                    if (error) console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    // iostream.push(body)
                    // iostream.push(null)
                    // data=null;
                })
            } else {
                console.log('stage_url not defined.')
            }
        }
        var coap_server =   function (name, port, callback) {
            var server = { 'name': name, server: coap.createServer({ multicastAddress: '224.0.0.1', type: 'udp4' })}
            server.server.name = name;
            servers.push(server);
            servers[servers.length-1].server.on('request', callback)
            servers[servers.length-1].server.listen(port);
        } 
        var coap_client = function (coap_url) {
            var req = coap.request(coap_url)

            req.on('response', function (res) {
                res.pipe(process.stdout)
                res.on('end', function () {
                    // process.exit(0)
                })
            })

            req.end()
        }
        iostream.on('finish', () => {
            formRequest(data)
        });
        return { iostream: iostream, formRequest: formRequest, coap_server: coap_server, coap_client: coap_client }
    }
    // stage(url);

    return { servers: servers, stage: stage, status: true }
}