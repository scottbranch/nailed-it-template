import React, { useEffect, useState } from 'react';
import './home.css';

function HomePage() {
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(function (stream) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = function () {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          console.log(Math.round(average));
          setVolumeLevel(Math.round(average));
        };
      })
      .catch(function (err) {
        console.error(err);
      });
  }, []);

  return (
    <div className="home-page">
      <div
        className="volume-bar"
        style={{ transform: `scaleX(.${volumeLevel})` }}
      ></div>
    </div>
  );
}

export default HomePage;
