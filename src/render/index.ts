import { Canvas, createCanvas, Image } from 'canvas'
import { BitmapsCache, PLAYER_PLAY_MODE, PlayerConfig, PlayerConfigOptions, Video } from '../types'
import svgaRender from './render'

const getImage = (image: Buffer) => {
  return new Promise<Image>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = image
  })
}

export const render = async (videoEntity: Video, opts: PlayerConfigOptions = {}) => {
  const { playMode, startFrame, endFrame }: PlayerConfig = {
    playMode: opts.playMode ?? PLAYER_PLAY_MODE.FORWARDS,
    startFrame: opts.startFrame ?? 0,
    endFrame: opts.endFrame ?? 0,
  }

  const totalFrames = videoEntity.frames - 1
  const bitmapsCache: BitmapsCache = {}
  for (const key in videoEntity.images) {
    const image = videoEntity.images[key]
    const img = await getImage(image)
    bitmapsCache[key] = img
  }

  let startValue: number
  let endValue: number
  if (playMode === PLAYER_PLAY_MODE.FORWARDS) {
    startValue = startFrame > 0 ? startFrame : 0
    endValue = endFrame > 0 ? endFrame : totalFrames
    if (startValue > endValue)
      throw new Error(
        `Invalid frame range: startFrame(${startValue}) cannot be greater than endFrame(${endValue})`,
      )
  } else {
    startValue = endFrame > 0 ? endFrame : totalFrames
    endValue = startFrame > 0 ? startFrame : 0
    if (endValue > startValue)
      throw new Error(
        `Invalid frame range: endFrame(${endValue}) cannot be greater than startFrame(${startValue})`,
      )
  }
  // render
  const frames: Canvas[] = []
  for (let currentFrame = startValue; currentFrame < endValue; currentFrame++) {
    const canvas = createCanvas(videoEntity.size.width, videoEntity.size.height)
    svgaRender(canvas, bitmapsCache, videoEntity, currentFrame + 1)
    frames.push(canvas)
  }
  return frames
}
