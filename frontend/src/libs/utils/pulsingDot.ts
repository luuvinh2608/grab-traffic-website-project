export const pulsingDotBuilder = (color: string, size: number) => {
  const dot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    context: null as CanvasRenderingContext2D | null,
    onAdd: function () {
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      this.context = canvas.getContext('2d')
    }
  }
  return dot
}
