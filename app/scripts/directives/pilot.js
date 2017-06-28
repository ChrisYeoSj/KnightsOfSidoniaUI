'use strict';

/**
 * @ngdoc directive
 * @name kosApp.directive:pilot
 * @description
 * # pilot
 */
angular.module('kosApp')
    .directive('pilot', function() {
        return {
            templateUrl: '../scripts/directives/pilot.html',
            restrict: 'E',
            replace: true,
            scope: {
                'callsign': '@',
                'warningMessage': '@',
                'audioSrc': '@',
                'pilotName': '@',
                'pilotImage': '@'
            },
            link: function postLink(scope, element, attrs) {

            	console.log(attrs);

            	var audioSrcUrl = attrs.audioSrc;
            	var audioElement = angular.element('<audio/>');

            	audioElement.attr('src', audioSrcUrl);
            	audioElement.src = audioSrcUrl;
            	element.append(audioElement);

            	scope.audio = audioElement[0];

                window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

                scope.togglePlay = function() {
                    var isPlaying = scope.audio.currentTime > 0 && !scope.audio.paused && !scope.audio.ended && scope.audio.readyState > 2;

                    if (!isPlaying) {
                        scope.audio.play();
                    } else {
                        scope.audio.pause();
                    }
                }

                scope.init = function() {

                    var barsArr = [],
                        rightBarsArr = [],
                        volBarsArr = [],
                        barsRightElement,
                        volumeBarsElement,
                        warningElement;

                    var micSpeakElement;

                    var ctx = new AudioContext();
                    var audioSrc = ctx.createMediaElementSource(scope.audio);
                    var analyser = ctx.createAnalyser();
                    // we have to connect the MediaElementSource with the analyser 
                    audioSrc.connect(analyser);
                    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
                    audioSrc.connect(ctx.destination);
                    // frequencyBinCount tells you how many values you'll receive from the analyser
                    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

                    var init = function() {

                        var volWidth = 150;
                        var volHeight = 100;

                        var padding = 5;


                        var warningEle = element.find('#warningDirective');
                        if (warningEle.length > 0){
                        	warningElement = warningEle[0];
                        }

                        var micSpeakEle = element.find('#micStatusDirective');

                        if (micSpeakEle.length > 0){
                        	micSpeakElement = micSpeakEle[0];
                        }

                        micSpeakElement.width = volWidth - (padding * 2);
                        micSpeakElement.height = volHeight - (padding * 2);

                        var volumeBarsEle = element.find('#volumeBarsDirective');

                        if (volumeBarsEle.length > 0){
                        	volumeBarsElement = volumeBarsEle[0];
                        }

                        var volCount = 8;

                        var initialLeftWidth = (volWidth * 0.3) / 2;
                        var volBarWidth = ((volWidth - (initialLeftWidth * 2)) / (volCount + (volCount - 1))) >> 0;
                        var volBarHeight = (volHeight / 4) * 2;
                        var volBarBottomUp = volHeight / 4; //bottom padding
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


                    init();

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
                    }

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
                    }


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
                    }

                    renderFrame();
                };

                scope.init();

            }
        };
    });
