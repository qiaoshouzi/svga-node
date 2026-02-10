import { parser } from './parser'
import fs from 'node:fs'
import path from 'node:path'
import { render } from './render'

const outputFolder = path.join(import.meta.dirname, '../output')
if (fs.existsSync(outputFolder)) fs.rmSync(outputFolder, { recursive: true, force: true })
fs.mkdirSync(outputFolder, { recursive: true })

const main = async () => {
  // const url = ''
  // const resp = await fetch(url)
  // const buffer = await resp.arrayBuffer()
  // await parser(buffer)

  const filePath = path.join(import.meta.dirname, '../example/taffy.svga')
  const buffer = fs.readFileSync(filePath)
  const svga = await parser(buffer)
  // console.log(svga.frames)
  const result = await render(svga)
  for (const i in result) {
    const filePath = path.join(outputFolder, `${i}.png`)
    const ws = fs.createWriteStream(filePath)
    const stream = result[i].createPNGStream()
    stream.pipe(ws)
    ws.on('finish', () => console.log(`Done ${i}.png`))
  }
}
main()
