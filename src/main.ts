import GUI from 'lil-gui';
import Experience from './experience';

window.gui = new GUI();
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
new Experience(canvas);