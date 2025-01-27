interface Renderer {
    public render(deltaTime?: number): void;
    public setResolution(width: number, height: number, devicePixelRatio: number): void;
}