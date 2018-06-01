define(['dd', '_'], function (dd, _) {

    'use strict';

    return ['Model', function (Model) {
        
        var service = {};

        service.model       = Model.instance('Neuron', {socket: 'neuron'});

        service.model.initAction('getStored');
        service.model.initAction('training');
        service.model.initAction('trainingStop');

        service.network    = service.model.observeList();

        /******************************************************************************************************************/
        
        service.model.on('training', function(network) {
            service.network.set(service.convert(network));
        });

        service.nodes = [];
        service.convert = function(network) {
            service.nodes = [];

            _.each(_.reverse(network), (layer) => {
                var prevLayerNeuron;
                _.each(_.reverse(layer.neurons), (neuron) => {
                    service.addNeuron(neuron, prevLayerNeuron);
                    prevLayerNeuron = neuron;
                });
            });
            return service.nodes;
        };

        service.addNeuron = function(neuron, prev) {
            // dd(neuron);
            neuron.outputSinapses = _.map(neuron.outputSinapses, (sinaps) => {
                sinaps.link = sinaps.id.split('/')[1];
                sinaps.size = 400;
                sinaps.text = sinaps.weight;
                return sinaps;
            });


            if (prev) {
                neuron.outputSinapses.push({
                    link: prev.id,
                    // size: 350
                    size: 300
                });
            }

            service.nodes.push({
                id      : neuron.id,
                name    : neuron.id,
                url     : 'img/logo.png',
                size    : 50,
                links   : neuron.outputSinapses
            });
        };


        return service;
    }];
});