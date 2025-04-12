import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'audio.component.html',
  styleUrls: ['audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
  screen: 'start' | 'recording' | 'done' = 'start';
  recording:boolean = false;
  mediaRecorder: any;
  recordedChunks: any[] = [];
  audioUrl: string | any = null;
  audioContext: AudioContext | any = null;
  analyser: AnalyserNode | any = null;
  source: MediaStreamAudioSourceNode | any = null;
  animationFrameId: number = 0;
  timerId: number | any = 0;
  waveData: number[] = [];
  bars: number[] = [];

  ngOnInit(): void {}


  //start recording
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.screen = 'recording';
      this.recording = true;
      this.recordedChunks = [];

      this.mediaRecorder = new (window as any).MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped!');
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(blob);
        this.screen = 'done';
        this.recording = false;
      };

      this.mediaRecorder.start();
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.source.connect(this.analyser);
      this.animateWave();

      this.timerId = setTimeout(() => {
        this.stopRecording();
      }, 30000);
    } catch (err) {
      alert('Microphone access denied.');
      this.screen = 'start';
    }
  }


  //stop recording
  stopRecording(): void {
    try {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }

      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
      }

      cancelAnimationFrame(this.animationFrameId);
      clearTimeout(this.timerId);

      setTimeout(() => {
        if (this.screen !== 'done') {
          const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          this.audioUrl = URL.createObjectURL(blob);
          this.screen = 'done';
          this.recording = false;
        }
      }, 1000);
    } catch (error) {
      this.screen = 'done';
    }
  }

  //playaudio
  playAudio(): void {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  }

  cancel(): void {
    this.audioUrl = null;
    this.recordedChunks = [];
    this.waveData = [];
    this.screen = 'start';
    this.recording = false;
    clearTimeout(this.timerId);
    cancelAnimationFrame(this.animationFrameId);
    if (this.audioContext?.state !== 'closed') {
      this.audioContext.close();
    }
  }

  //wave
  animateWave(): void {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      this.analyser.getByteFrequencyData(dataArray);
      this.waveData = Array.from(dataArray);

      this.bars = this.waveData.slice(0, 20).map((value) => {
        const barHeight = Math.min((value / 255) * 40, 40);
        return barHeight;
      });

      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  get wavePath(): string {
    const points = this.waveData;
    let path = `M0,200`;

    for (let i = 1; i < points.length; i++) {
      const x = (i / points.length) * 100;
      const y = 30 + (points[i] / 255) * 30;
      path +=  `L${x} ${y}`;
    }

    return path;
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    clearTimeout(this.timerId);
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}
