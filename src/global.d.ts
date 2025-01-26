import type GUI from 'lil-gui';

declare global {
    interface Window {
        gui: GUI;
    }
}