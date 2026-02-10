import { inflateSync } from 'node:zlib'
import protobuf from 'protobufjs'
import { Movie, RawImages } from '../types'
import * as Utils from '../utils'
import SVGA_PROTO from './svga-proto'
import { VideoEntity } from './video-entity'

// const uint8ArrayToString = (u8a: Uint8Array): string => {
//   let dataString = ''
//   for (let i = 0; i < u8a.length; i++) {
//     dataString += String.fromCharCode(u8a[i])
//   }
//   return dataString
// }

const proto = protobuf.Root.fromJSON(SVGA_PROTO)
const message = proto.lookupType('com.opensource.svga.MovieEntity')

export const parser = async (data: ArrayBuffer | Uint8Array) => {
  const dataHeader =
    data instanceof Uint8Array
      ? new Uint8Array(data.buffer, data.byteOffset, 4)
      : new Uint8Array(data, 0, 4)
  if (Utils.getVersion(dataHeader) !== 2)
    throw new Error('this parser only support version@2 of SVGA')
  const inflateData = inflateSync(data)
  const movie = message.decode(inflateData) as unknown as Movie
  const images: RawImages = {}
  for (const key in movie.images) {
    const image = movie.images[key]
    // const value = uint8ArrayToString(image)
    // images[key] = btoa(value)
    images[key] = image
  }
  return new VideoEntity(movie, images)
}
