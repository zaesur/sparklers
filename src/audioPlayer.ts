export default class AudioPlayer {
    private audio: HTMLAudioElement;
    private isEnabled = true;
  
    constructor(path: string) {
      this.audio = new Audio(path);
      this.audio.loop = true;
    }
  
    play() {
      this.audio.play();
    }
  
    stop() {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  
    get enabled() {
      return this.isEnabled;
    }
    set enabled(value: boolean) {
      this.isEnabled = value;
      this.audio.muted = !value;
    }
}