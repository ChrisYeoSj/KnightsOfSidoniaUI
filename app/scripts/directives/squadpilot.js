'use strict';

/**
 * @ngdoc directive
 * @name kosApp.directive:squadPilot
 * @description
 * # squadPilot
 */
angular.module('kosApp')
    .directive('squadPilot', function() {
        return {
            templateUrl: '../scripts/directives/squadpilot.html',
            restrict: 'E',
            replace: true,
            scope: {
                'pilotName': '@',
                'callsign': '@',
                'warningMessage': '@',
                'audioSrc': '@',
                'pilotImage': '@',
                'temperature': '@'
            },
            link: function postLink(scope, element, attrs) {

                scope.audio = {};

                scope.togglePlay = function() {
                    var isPlaying = scope.audio.currentTime > 0 && !scope.audio.paused && !scope.audio.ended && scope.audio.readyState > 2;
                    if (!isPlaying) {
                        scope.audio.play();
                    } else {
                        scope.audio.pause();
                    }

                };

                scope.init = function() {

                    var volBarsArr = [],
                        volumeBarsElement,
                        warningElement;

                    var micSpeakElement;

                    var ctx = new AudioContext();
                    var audioAngularElement = angular.element('<audio/>');
                    audioAngularElement.attr('src', attrs.audioSrc);
                    audioAngularElement.src = attrs.audioSrc;
                    scope.audio = audioAngularElement[0];
                    console.log(scope.audio);
                    var audioSrc = ctx.createMediaElementSource(scope.audio);
                    var analyser = ctx.createAnalyser();
                    // we have to connect the MediaElementSource with the analyser 
                    audioSrc.connect(analyser);
                    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
                    audioSrc.connect(ctx.destination);
                    // frequencyBinCount tells you how many values you'll receive from the analyser
                    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

                    var canvasBrainAngularElement = element.find('#BrainWaveMonitorCanvas');
                    var canvasBrain;
                    if (canvasBrainAngularElement.length > 0){
                        canvasBrain = canvasBrainAngularElement[0];
                    }

                    var canvasStressAngularElement = element.find('#StressMonitorCanvas');
                    var canvasStress; 
                    if (canvasStressAngularElement.length > 0){
                       canvasStress = canvasStressAngularElement[0];
                    }

                    //var canvasBrain = document.getElementById("BrainWaveMonitorCanvas");
                    //var canvasStress = document.getElementById("StressMonitorCanvas");
                    var ctxB = canvasBrain.getContext("2d");
                    var ctxS = canvasStress.getContext("2d");

                    ctxS.fillStyle = "#5FDCCD";
                    ctxB.fillStyle = "#5FDCCD";

                    var data = [];
                    for (var i = 0; i < 10000; i++) {
                        data.push(Math.sin(i / 8) * 70 + 75);
                    }



                    //var canvas = document.getElementById('HeartMonitorCanvas');

                    var canvasHeartAngularElement = element.find('#HeartMonitorCanvas');
                    var canvas;
                    if (canvasHeartAngularElement.length > 0){
                        canvas = canvasHeartAngularElement[0];
                    }

                    var context = canvas.getContext('2d'),
                        width = canvas.width,
                        height = canvas.height,
                        ball = {
                            x: 0,
                            y: height / 2,
                        },
                        point = {
                            x: 0,
                            y: ball.y
                        },
                        current_point = 0;

                    var heartbeatPoints = [
                        { y: 0, x: 20 },
                        { y: 0, x: 1 },
                        { y: 8, x: 1 },
                        { y: -9, x: 2 },
                        { y: 20, x: 2 },
                        { y: -22, x: 3 },
                        { y: 45, x: 5 },
                        { y: -48, x: 4 },
                        { y: 24, x: 3 },
                        { y: 5, x: 2 },
                        { y: 0, x: 1 },
                        { y: 0, x: 20 }
                    ];

                    context.fillStyle = "#5FDCCD";

                    function animateTo() {
                        function dist(x1, x2, y1, y2) {
                            var dx = x1 - x2,
                                dy = y1 - y2;
                            return {
                                d: Math.sqrt(dx * dx + dy * dy),
                                dx: dx,
                                dy: dy
                            };
                        }
                        var dis = dist(ball.x, point.x + heartbeatPoints[current_point].x, ball.y, point.y + heartbeatPoints[current_point].y);
                        if (dis.d > 1) {
                            var s = Math.abs(dis.dy) > 13 ? 2 : 1;
                            ball.x += -(dis.dx / dis.d) * s;
                            ball.y += -(dis.dy / dis.d) * s;
                        } else {
                            ball.x = point.x + heartbeatPoints[current_point].x;
                            ball.y = point.y + heartbeatPoints[current_point].y;
                            point.x += heartbeatPoints[current_point].x;
                            current_point++;
                            if (current_point >= heartbeatPoints.length || ball.x > width) {
                                current_point = 0;
                                if (ball.x > width) {
                                    point.x = ball.x = 0;
                                }
                            }
                        }
                    }




                    var x = 0;
                    var panAtX = 300;
                    var continueAnimation = true;

                    var animate = function() {

                        if (x > data.length - 1) {
                            return;
                        }

                        if (continueAnimation) {
                            requestAnimationFrame(animate);
                        }

                        if (x++ < panAtX) {

                            ctxB.fillRect(x, data[x], 3, 3);
                            ctxS.fillRect(x, data[x], 3, 3);


                        } else {

                            ctxB.clearRect(0, 0, canvasBrain.width, canvasBrain.height);
                            ctxS.clearRect(0, 0, canvasStress.width, canvasStress.height);
                            // plot data[] from x-PanAtX to x 

                            for (var xx = 0; xx < panAtX; xx++) {
                                var y = data[x - panAtX + xx];
                                ctxB.fillRect(xx, y, 3, 3);
                                ctxS.fillRect(xx, y, 3, 3);
                            }
                        }

                        for (var i = 0; i < 3; i++) {
                            animateTo();
                            context.fillStyle = "rgba(0, 0, 0, .01)";
                            context.fillRect(0, 0, width, height);
                            context.fillStyle = "#5FDCCD";
                            context.beginPath();
                            context.arc(ball.x, ball.y, 1, 0, 2 * Math.PI, true);
                            context.closePath();
                            context.fill();
                        }



                    };


                    var elementInit = function() {

                        var volWidth = 100;
                        var volHeight = 70;

                        var padding = 3;

                        var warningElementAngularElement = element.find('#warning');

                        if (warningElementAngularElement.length > 0){
                            warningElement = warningElementAngularElement[0];
                        };



                        var micSpeakAngularElement = element.find('#micStatus');

                        if (micSpeakAngularElement.length > 0){
                            micSpeakElement = micSpeakAngularElement[0];
                        };


                        micSpeakElement.width = volWidth - (padding * 2);
                        micSpeakElement.height = volHeight - (padding * 2);

                        var volumeBarsAngularElement = element.find('#volumeBars');

                        if (volumeBarsAngularElement.length > 0){
                            volumeBarsElement = volumeBarsAngularElement[0];
                        };

                        var volCount = 8;

                        var initialLeftWidth = (volWidth * 0.2) / 2;
                        var volBarWidth = ((volWidth - (initialLeftWidth * 2)) / (volCount + (volCount - 1))) >> 0;
                        var volBarHeight = (volHeight / 8) * 5;
                        var volBarBottomUp = volHeight / 6 >> 0; //bottom padding
                        console.log(volBarWidth);

                        //init bars within volume bar element
                        for (var i = 0; i < volCount; i++) {
                            var volNewNode = document.createElement('div');
                            volNewNode.classList.add('volBar');
                            volNewNode.style.width = volBarWidth + 'px';
                            volNewNode.style.height = volBarHeight + 'px';
                            volNewNode.style.bottom = volBarBottomUp + 'px';
                            volNewNode.style.left = initialLeftWidth + (2 * volBarWidth * i) + 'px';
                            volBarsArr.push(volNewNode);
                            volumeBarsElement.appendChild(volNewNode);
                            //67CED4
                        }
                    };

                    animate();
                    elementInit();

                    function renderFrame() {
                        requestAnimationFrame(renderFrame);
                        // update data in frequencyData
                        analyser.getByteFrequencyData(frequencyData);
                        // render frame based on values in frequencyData
                        renderFrameMicSpeak(frequencyData);
                        renderFrameVolume(frequencyData);
                        renderWarning(frequencyData);
                    }


                    var max = 256;

                    var renderFrameMicSpeak = function(frequencyData) {
                        var frequency = frequencyData[0];

                        var frequencyPercent = frequency / max;

                        if (frequencyPercent > 0.8) {
                            micSpeakElement.className = "firstVolSpeak";
                            //console.log('1');
                        } else if (frequencyPercent > 0.7) {
                            micSpeakElement.className = "secondVolSpeak";
                            //console.log('2');
                        } else if (frequencyPercent > (0.6)) {
                            micSpeakElement.className = "thirdVolSpeak";
                            //console.log('3');
                        } else if (frequencyPercent > (0.5)) {
                            micSpeakElement.className = "fourthVolSpeak";
                            //console.log('4');
                        } else if (frequencyPercent > (0.4)) {
                            micSpeakElement.className = "fifthVolSpeak";
                            //console.log('5');
                        } else if (frequencyPercent > 0.3) {
                            micSpeakElement.className = "sixthVolSpeak";
                            //console.log('6');
                        } else if (frequencyPercent > 0.2) {
                            micSpeakElement.className = "seventhVolSpeak";
                            //console.log('7');
                        } else if (frequencyPercent > 0.1) {
                            micSpeakElement.className = "eighthVolSpeak";
                            //console.log('8');
                        } else if (frequencyPercent > 0.0) {
                            micSpeakElement.className = "ninthVolSpeak";
                            //console.log('9');
                        } else {
                            micSpeakElement.className = "notspeaking";
                            //console.log('0');
                        }
                    };

                    var renderWarning = function(frequencyData) {
                        var frequency = frequencyData[0];
                        var frequencyPercent = frequency / max;
                        if (frequencyPercent > 0.0) {
                            warningElement.style.visibility = "visible";
                            //console.log('9');
                        } else {
                            warningElement.style.visibility = "hidden";
                            //console.log('0');
                        }
                    };


                    var renderFrameVolume = function(frequencyData) {
                        var frequency = frequencyData[0];
                        var frequencyPercent = frequency / max;

                        if (frequencyPercent > 0) { // MUST REFACTOR!
                            volBarsArr[0].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[0].classList.remove("volBarSpeaking");
                        }

                        if (frequencyPercent > 0.2) {
                            volBarsArr[1].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[1].classList.remove("volBarSpeaking");
                        }

                        if (frequencyPercent > 0.3) {
                            volBarsArr[2].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[2].classList.remove("volBarSpeaking");
                        }

                        if (frequencyPercent > 0.4) {
                            volBarsArr[3].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[3].classList.remove("volBarSpeaking");
                        }

                        if (frequencyPercent > 0.5) {
                            volBarsArr[4].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[4].classList.remove("volBarSpeaking");
                        }

                        if (frequencyPercent > 0.6) {
                            volBarsArr[5].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[5].classList.remove("volBarSpeaking");
                        }

                        if (frequencyPercent > 0.7) {
                            volBarsArr[6].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[6].classList.remove("volBarSpeaking");
                        }

                        if (frequencyPercent > 0.8) {
                            volBarsArr[7].classList.add("volBarSpeaking");
                        } else {
                            volBarsArr[7].classList.remove("volBarSpeaking");
                        }
                    };

                    renderFrame();
                };

                scope.init();

            }
        };
    });
