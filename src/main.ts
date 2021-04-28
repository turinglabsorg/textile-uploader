; (global as any).WebSocket = require('isomorphic-ws')
import { Buckets, Identity, KeyInfo, PrivateKey } from '@textile/hub'

const setup = async (buck: string, key: KeyInfo, identity: Identity) => {
  const buckets = await Buckets.withKeyInfo(key)
  await buckets.getToken(identity)
  const result = await buckets.getOrCreate(buck)
  const links = await buckets.links(result.root.key)

  if (!result.root) {
    throw new Error('Failed to open bucket')
  }
  return {
    buckets: buckets,
    bucketKey: result.root.key,
    links: links
  }
}

export class TextileUploader {
  textilepub: string
  textileprv: string
  textilebuck: string

  constructor(pub, prv, buck) {
    this.textilepub = pub
    this.textileprv = prv
    this.textilebuck = buck
  }

  public async upload(content, filename) {
    // Creating new random identity
    const identity = await PrivateKey.fromRandom()

    // Connecting to bucket
    let bucket = await setup(
      this.textilebuck,
      {
        key: this.textilepub,
        secret: this.textileprv
      }, 
      identity
    )
    console.log('Bucket connected successfully')

    // Extracting and cleaning file name
    console.log('Uploading file to bucket ' + filename)

    // Finally upload the content
    try {
      const upload = {
        path: '/' + filename,
        content
      }
      let push = await bucket.buckets.pushPath(bucket.bucketKey, filename, upload)
      return { ipfs: push.path.path, links: bucket.links, filename: filename }
    } catch (e) {
      return { ipfs: 'Error', links: bucket.links }
    }
  }
}



