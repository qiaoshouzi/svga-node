# svga-node

Adapted from [svga/SVGAPlayer-Web-Lite](https://github.com/svga/SVGAPlayer-Web-Lite) to support SVGA processing in Node.js

## Example

```js
const buffer = fs.readFileSync(filePath)
const svga = await parser(buffer)
const result = await render(svga)
for (const i in result) {
  const filePath = path.join(outputFolder, `${i}.png`)
  const ws = fs.createWriteStream(filePath)
  const stream = result[i].createPNGStream()
  stream.pipe(ws)
  ws.on('finish', () => console.log(`Done ${i}.png`))
}
```

## API

### Parser

```js
parser(data: ArrayBuffer | Uint8Array): Promise<VideoEntity>
```

### Render

```js
render(videoEntity: Video, opts?: PlayerConfigOptions): Promise<Canvas[]>
```

For more details on available Canvas methods, please refer to the [node-canvas documentation](https://github.com/Automattic/node-canvas)

#### PlayerConfigOptions

```ts
interface PlayerConfig {
  /**
   * Playback mode. Default: 'forwards'.
   */
  playMode: 'forwards' | 'fallbacks'
  /**
   * The frame number where playback starts. Default: 0
   */
  startFrame: number
  /**
   * The frame number where playback ends. Default: 0
   * NOTE: If the value is 0 or less, playback will proceed to the very end
   */
  endFrame: number
}
```

## Copyright

The test file example/taffy.svga is the property of [永雏塔菲](https://space.bilibili.com/1265680561) and [上海幻电信息科技有限公司](https://bilibili.com). It is used here for demonstration purposes only. If there is any copyright infringement, please contact me, and the file will be removed immediately.
