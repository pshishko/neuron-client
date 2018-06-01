define(['_', 'dd', 'key', 'Viva'], function(_, dd, key, Viva) {

    'use strict';

    return ['Helper', '$timeout', function(Helper, $timeout) {
        return {
            restrict: 'A',
            scope   : {
                bindGraph: '=',
                close: '&'
            },
            link : function($scope, elem, attrs) {
                var elemId = key.getUid();
                elem.attr('id', elemId);
                
                var graph = Viva.Graph.graph();
                // var graphics = Viva.Graph.View.webglGraphics();
                var graphics = Viva.Graph.View.svgGraphics();

                var currentGraphNodes = [];

                Helper.watch($scope, 'bindGraph', function(nodes) {
                    // var newNodes = Helper.difference(nodes, currentGraphNodes);
                    var newNodes = nodes;
                    // var newNodes = _.difference(nodes, currentGraphNodes);
                    currentGraphNodes = _.clone(nodes);

                    graph.beginUpdate();
                    _.each(newNodes, function(node, key) {
                        if (!graph.getNode(node.id)) {
                            graph.addNode(node.id, node);
                        }
                        $timeout(function(){
                            _.each(node.links, function(link) {
                                let ll = graph.getLink(node.id, link.link);
                                if (ll && link.text) {
                                    graphics.getLinkUI(ll.id).childNodes[1].childNodes[0].text(link.text);
                                }
                                if (!graph.getLink(node.id, link.link)) {
                                    graph.addLink(node.id, link.link, link);
                                }
                            });
                        }, 10);
                    });
                    graph.endUpdate();
                });

                graphics.node(function(node) {
                    var ui = Viva.Graph.svg('g');
                    ui.size = node.data.size;
                    var img = Viva.Graph.svg('image')
                        .attr('width', node.data.size + 'px')
                        .attr('height', node.data.size + 'px')
                        .link(node.data.url);

                    var text = Viva.Graph.svg('text')
                        .attr('y', node.data.size + 20)
                        .attr('text-anchor','middle')
                        .attr('x',node.data.size / 2)
                        .attr('width', node.data.size)
                        .attr('font-size', 30)
                        .attr('fill', node.data.status == 'active' ? 'black' : 'red')
                        .text(node.data.name);

                    ui.append(img);                
                    ui.append(text); 
                    return ui; 
                }).placeNode(function(nodeUI, pos){
                    var half = nodeUI.size / 2;
                    nodeUI.attr('transform', 'translate(' + (pos.x - half) + ',' + (pos.y - half) + ')');
                });

                graphics.link(function(link) {
                    var g = Viva.Graph.svg('g');

                    var line = Viva.Graph.svg('path')
                        .attr('id', link.id)
                        .attr('stroke', link.data.text > 0 ? 'green' : 'red')
                        // .attr('stroke-dasharray', '5, 5');
                    g.append(line);

                    if (link.data.text) {
                        var textPath = Viva.Graph.svg('textPath')
                            .attr('href', '#' + link.id)
                            .attr('startOffset', link.data.size / 3)
                            .attr('side', 'right')
                            .text(link.data.text);

                        var text = Viva.Graph.svg('text');
                                // .attr('y', node.data.size + 20)
                                // .attr('text-anchor','middle')
                                // .attr('x',node.data.size / 2)
                                // .attr('width', node.data.size)
                                // .attr('font-size', 30)
                                // .attr('fill', node.data.status == 'active' ? 'black' : 'red')
                                // .text(123);
                        text.append(textPath);
                        g.append(text);
                    }
                    
                    return g;
                }).placeLink(function(linkUI, fromPos, toPos) {
                    var data = 'M' + fromPos.x + ',' + fromPos.y + 'L' + toPos.x + ',' + toPos.y;
                    linkUI.childNodes[0].attr("d", data);
                });

                var layout = Viva.Graph.Layout.forceDirected(graph, {
                    springLength : 400,
                    springCoeff : 0.0005,
                    dragCoeff : 0.02,
                    gravity : -1.2,
                    // thetaCoeff : 0.8
                    springTransform: function (link, spring) {
                        spring.length = link.data.size;
                    }
                });

                $timeout(function(){
                    var renderer = Viva.Graph.View.renderer(graph, {
                        layout : layout,
                        graphics : graphics,
                        container: document.getElementById(elemId)
                    });
                    renderer.run();
                });
            }
        };
    }];
});
