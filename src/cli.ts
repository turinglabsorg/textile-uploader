#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
import { TextileUploader } from './main'
require('dotenv').config()
const fs = require('fs')

// Uploading file to Textile using the CLI
if (argv.u !== undefined) {
    if (process.env.TEXTILE_PUB !== undefined && process.env.TEXTILE_PRV !== undefined && process.env.TEXTILE_BUCK !== undefined) {
        console.log('Uploading ' + argv.u + ' to bucket "' + process.env.TEXTILE_BUCK + '"')
        let textile = new TextileUploader(process.env.TEXTILE_PUB, process.env.TEXTILE_PRV, process.env.TEXTILE_BUCK)
        fs.readFile(argv.u, (err, content) => {
            if (!err) {
                const filename = argv.u.split("/").pop().replace(/\s+/g, '-');
                textile.upload(content, filename).then(hash => {
                    if (hash.ipfs.indexOf('ipfs') !== -1) {
                        console.log('File uploaded successfully')
                        console.log('See it at https://ipfs.io' + hash.ipfs)
                        console.log('Or at', hash.links.ipns + '/' + hash.filename)
                    } else {
                        console.log('Something goes wrong.')
                    }
                })
            } else {
                console.log('Can\'t read file ' + argv.u)
            }
        })
    } else {
        console.log('Must setup your .env file with TEXTILE_BUCK, TEXTILE_PRV and TEXTILE_PUB')
    }
}
