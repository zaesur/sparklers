import GUI from 'lil-gui';
import Experience from './experience';

window.gui = new GUI().title("Sparklers");
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
new Experience(canvas);