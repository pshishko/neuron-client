define(['dd'], function(dd) {

	'use strict';

	return ['$scope', '$timeout', 'Neuron', function($scope, $timeout, Neuron) {
        Neuron.network.set({});
        $scope.graphNodes = Neuron.network.get();

        $scope.get = function() {
            Neuron.model.getStored({}, (network) => {
                Neuron.network.set(Neuron.convert(network));

//                 _.each(Neuron.convert(network), (item) => {
//                     dd(item);
//                     Neuron.network.add(item);
// // dd($scope.graphNodes,1);
//                 });
                // $scope.network = Neuron.convert(network);
                // Neuron.network.set(Neuron.convert(network));
                // dd(Neuron.network.get());
                // dd($scope.network);
            });
        };

        $scope.training = function() {
            Neuron.model.training({}, (network) => {

                // Neuron.network.set(Neuron.convert(network));

//                 _.each(Neuron.convert(network), (item) => {
//                     dd(item);
//                     Neuron.network.update(item.id, item);
// // dd($scope.graphNodes,1);
//                 });

//                 // $scope.graphNodes = Network.set(network);
            });
        };

        $scope.trainingStop = function() {
            Neuron.model.trainingStop({}, (status) => {
                dd(status);
            });
        };
	}];
});