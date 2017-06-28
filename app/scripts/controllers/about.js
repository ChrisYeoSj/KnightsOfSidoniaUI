'use strict';

/**
 * @ngdoc function
 * @name kosApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the kosApp
 */
angular.module('kosApp')
    .controller('AboutCtrl', function($scope) {
        $scope.$on('$viewContentLoaded', angular.bind(this, function() {
            console.log('Lol');
            this.init();

        }));

        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

        this.togglePlay = function() {

            var isPlaying = this.audio.currentTime > 0 && !this.audio.paused && !this.audio.ended && this.audio.readyState > 2;

            if (!isPlaying) {
                this.audio.play();
            } else {
                this.audio.pause();
            }

        }

        this.init = angular.bind(this, function() {

            var barsArr = [],
                rightBarsArr = [],
                volBarsArr = [],
                barsRightElement,
                volumeBarsElement,
                warningElement;

            var micSpeakElement;

            var ctx = new AudioContext();
            this.audio = document.getElementById('audioSong');
            var audioSrc = ctx.createMediaElementSource(this.audio);
            var analyser = ctx.createAnalyser();
            // we have to connect the MediaElementSource with the analyser 
            audioSrc.connect(analyser);
            // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
            audioSrc.connect(ctx.destination);
            // frequencyBinCount tells you how many values you'll receive from the analyser
            var frequencyData = new Uint8Array(analyser.frequencyBinCount);


            var init = function() {

                var volWidth = 100;
                var volHeight = 70;

                var padding = 3;

                warningElement = document.getElementById('warning');

                micSpeakElement = document.getElementById('micStatus');

                micSpeakElement.width = volWidth - (padding * 2);
                micSpeakElement.height = volHeight - (padding * 2);

                volumeBarsElement = document.getElementById('volumeBars');

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
        });


    });
