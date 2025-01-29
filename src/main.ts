import GUI from 'lil-gui';
import Experience from './experience';

window.gui = new GUI().title("Sparklers").hide();
window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    window.gui.show(window.gui._hidden);
  }
});
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
new Experience(canvas);