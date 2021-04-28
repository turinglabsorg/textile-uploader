# Textile Uploader

This is a simple command line uploader to a textile folder without using the "hub" package provided directly from Textile.io. The idea was to test and create super simplified library which can be used from the command line and as a Typescript package for your projects.

Don't forget to read the official documentation here: https://textileio.github.io/js-textile/docs/

## How to install as a CLI

To use it simply download the package globally with:

```
npm install -g textile-uploader
```

Now you must generate your private keys from the cloud (https://cloud.hub.textile.io) or from the hub package. After you've created an api key you must create a `.env` file in the same folder where you have the file to upload. The `.env` should look like this:

```
TEXTILE_PUB=PubKey
TEXTILE_PRV=PrivKey
TEXTILE_BUCK=BuckName
```

Now simply upload the file like:

```
tup -u=test.txt
```

You should see something like that:

```
Uploading test.txt to bucket "forbice"
Bucket connected successfully
Uploading file to bucket test.txt
File uploaded successfully
See it at https://ipfs.io/ipfs/bafkreifkh3aw42wmqcoywkaymyrhmjlkx7jpdncbznivosjt6pkl2ek5ce
Or at https://hub.textile.io/ipns/bafzbeigmp2gjeainxnip5kj63kdypzdn5jvn43zd4i3sy6wj54sevwjcya/test.txt
```

## How to use as library

If you want to use as module for your scripts just install it:

```
npm install --save textile-uploader
```

and import it in a typescript file and create a new instance of the class. To upload a file call the `upload` function by passing a buffer and the desired file name:

```
import { TextileUploader } from 'textile-uploader'

const textile = new TextileUploader(process.env.TEXTILE_PUB, process.env.TEXTILE_PRV, process.env.TEXTILE_BUCK)

const content = Buffer.from("Hello world.")
const filename = "HelloWorld.txt"

textile.upload(content, filename).then(result => {
    console.log(result)
})
```

Done!

Thanks to Textile.io for the incredible work.