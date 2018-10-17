'use strict';

/**
 * @ngdoc function
 * @name kosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kosApp
 */
angular.module('kosApp')
  .controller('MainCtrl', function($scope, $interval, $http) {

    this.firstPilotTemp = 38.5;
    this.secondPilotTemp = 37.2;
    this.thirdPilotTemp = 36.6;
    this.fourthPilotTemp = 36.2;

    this.firstPilotCallsign = "005";
    this.secondPilotCallsign = "203";
    this.thirdPilotCallsign = "336";
    this.fourthPilotCallsign = "028";

    this.firstPilotName = "イ";
    this.secondPilotName = "焔";
    this.thirdPilotName = "星";
    this.fourthPilotName = "谷";

    this.firstPilotImage = "../images/samara-knights-of-sidonia-square.png";
    this.secondPilotImage = "../images/samara-knights-of-sidonia-square.png";
    this.thirdPilotImage = "../images/samara-knights-of-sidonia-square.png";
    this.fourthPilotImage = "../images/samara-knights-of-sidonia-square.png";

    this.firstPilotAudioStream = "audio/samara-voice-2.mp3";
    this.secondPilotAudioStream = "audio/en-voice.mp3";
    this.thirdPilotAudioStream = "audio/hoshijiro-voice.mp3";
    this.fourthPilotAudioStream = "audio/nagate-voice.mp3";

    $interval(angular.bind(this, function() {
      this.firstPilotTemp = generateRandomTemp();
      this.secondPilotTemp = generateRandomTemp();
      this.thirdPilotTemp = generateRandomTemp();
      this.fourthPilotTemp = generateRandomTemp();
    }), 5000);

    function generateRandomTemp() {
      var min = 36.0,
        max = 39.0,
        highlightedNumber = (Math.random() * (max - min) + min).toFixed(1);

      return highlightedNumber;
    };

    var url = "http://localhost:8080/auth/login";
    var data = { "username": "HenryF@gmail.com", "password": "admin" }

    var config = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8;'
      }
    }

    $http.post(url, data, config)
      .then(
        function(response) {
          console.log("Success: ", response);
        },
        function(response) {
          console.log("Failure: ", response);
        }
      );


    // $scope.$on('$viewContentLoaded', angular.bind(this, function() {
    //     console.log('Lol');
    //     this.init();

    // }));

    // window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

    // this.togglePlay = function() {

    //     var isPlaying = this.audio.currentTime > 0 && !this.audio.paused && !this.audio.ended && this.audio.readyState > 2;

    //     if (!isPlaying){
    //         this.audio.play();
    //     } else {
    //         this.audio.pause();
    //     }

    // }

    // this.init = angular.bind(this, function() {

    //     var barsArr = [],
    //         rightBarsArr = [],
    //         volBarsArr = [],
    //         barsRightElement,
    //         volumeBarsElement,
    //         warningElement;

    //     var micSpeakElement;

    //     var ctx = new AudioContext();
    //     this.audio = document.getElementById('audioSong');
    //     var audioSrc = ctx.createMediaElementSource(this.audio);
    //     var analyser = ctx.createAnalyser();
    //     // we have to connect the MediaElementSource with the analyser 
    //     audioSrc.connect(analyser);
    //     // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    //     audioSrc.connect(ctx.destination);
    //     // frequencyBinCount tells you how many values you'll receive from the analyser
    //     var frequencyData = new Uint8Array(analyser.frequencyBinCount);


    //     var init = function() {

    //         var volWidth = 150;
    //         var volHeight = 100;

    //         var padding = 5;

    //         warningElement = document.getElementById('warning');

    //         micSpeakElement = document.getElementById('micStatus');

    //         micSpeakElement.width = volWidth - (padding * 2);
    //         micSpeakElement.height = volHeight - (padding * 2);

    //         volumeBarsElement = document.getElementById('volumeBars');

    //         var volCount = 8;

    //         var initialLeftWidth = (volWidth * 0.3) / 2;
    //         var volBarWidth = ((volWidth - (initialLeftWidth * 2)) / (volCount + (volCount - 1))) >> 0;
    //         var volBarHeight = (volHeight / 4) * 2;
    //         var volBarBottomUp = volHeight / 4; //bottom padding
    //         console.log(volBarWidth);

    //         //init bars within volume bar element
    //         for (var i = 0; i < volCount; i++) {
    //             var volNewNode = document.createElement('div');
    //             volNewNode.classList.add('volBar');
    //             volNewNode.style.width = volBarWidth + 'px';
    //             volNewNode.style.height = volBarHeight + 'px';
    //             volNewNode.style.bottom = volBarBottomUp + 'px';
    //             volNewNode.style.left = initialLeftWidth + (2 * volBarWidth * i) + 'px';
    //             volBarsArr.push(volNewNode);
    //             volumeBarsElement.appendChild(volNewNode);
    //             //67CED4
    //         }
    //     };


    //     init();

    //     function renderFrame() {
    //         requestAnimationFrame(renderFrame);
    //         // update data in frequencyData
    //         analyser.getByteFrequencyData(frequencyData);
    //         // render frame based on values in frequencyData
    //         renderFrameMicSpeak(frequencyData);
    //         renderFrameVolume(frequencyData);
    //         renderWarning(frequencyData);
    //     }


    //     var max = 256;

    //     var renderFrameMicSpeak = function(frequencyData) {
    //         var frequency = frequencyData[0];

    //         var frequencyPercent = frequency / max;

    //         if (frequencyPercent > 0.8) {
    //             micSpeakElement.className = "firstVolSpeak";
    //             //console.log('1');
    //         } else if (frequencyPercent > 0.7) {
    //             micSpeakElement.className = "secondVolSpeak";
    //             //console.log('2');
    //         } else if (frequencyPercent > (0.6)) {
    //             micSpeakElement.className = "thirdVolSpeak";
    //             //console.log('3');
    //         } else if (frequencyPercent > (0.5)) {
    //             micSpeakElement.className = "fourthVolSpeak";
    //             //console.log('4');
    //         } else if (frequencyPercent > (0.4)) {
    //             micSpeakElement.className = "fifthVolSpeak";
    //             //console.log('5');
    //         } else if (frequencyPercent > 0.3) {
    //             micSpeakElement.className = "sixthVolSpeak";
    //             //console.log('6');
    //         } else if (frequencyPercent > 0.2) {
    //             micSpeakElement.className = "seventhVolSpeak";
    //             //console.log('7');
    //         } else if (frequencyPercent > 0.1) {
    //             micSpeakElement.className = "eighthVolSpeak";
    //             //console.log('8');
    //         } else if (frequencyPercent > 0.0) {
    //             micSpeakElement.className = "ninthVolSpeak";
    //             //console.log('9');
    //         } else {
    //             micSpeakElement.className = "notspeaking";
    //             //console.log('0');
    //         }
    //     }

    //     var renderWarning = function(frequencyData) {
    //         var frequency = frequencyData[0];
    //         var frequencyPercent = frequency / max;
    //         if (frequencyPercent > 0.0) {
    //             warningElement.style.visibility = "visible";
    //             //console.log('9');
    //         } else {
    //             warningElement.style.visibility = "hidden";
    //             //console.log('0');
    //         }
    //     }


    //     var renderFrameVolume = function(frequencyData) {
    //         var frequency = frequencyData[0];
    //         var frequencyPercent = frequency / max;

    //         if (frequencyPercent > 0) { // MUST REFACTOR!
    //             volBarsArr[0].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[0].classList.remove("volBarSpeaking");
    //         }

    //         if (frequencyPercent > 0.2) {
    //             volBarsArr[1].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[1].classList.remove("volBarSpeaking");
    //         }

    //         if (frequencyPercent > 0.3) {
    //             volBarsArr[2].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[2].classList.remove("volBarSpeaking");
    //         }

    //         if (frequencyPercent > 0.4) {
    //             volBarsArr[3].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[3].classList.remove("volBarSpeaking");
    //         }

    //         if (frequencyPercent > 0.5) {
    //             volBarsArr[4].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[4].classList.remove("volBarSpeaking");
    //         }

    //         if (frequencyPercent > 0.6) {
    //             volBarsArr[5].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[5].classList.remove("volBarSpeaking");
    //         }

    //         if (frequencyPercent > 0.7) {
    //             volBarsArr[6].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[6].classList.remove("volBarSpeaking");
    //         }

    //         if (frequencyPercent > 0.8) {
    //             volBarsArr[7].classList.add("volBarSpeaking");
    //         } else {
    //             volBarsArr[7].classList.remove("volBarSpeaking");
    //         }
    //     }

    //     renderFrame();
    // });

  });
