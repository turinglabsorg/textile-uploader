"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextileUploader = void 0;
const tslib_1 = require("tslib");
;
global.WebSocket = require('isomorphic-ws');
const hub_1 = require("@textile/hub");
const setup = (buck, key, identity) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const buckets = yield hub_1.Buckets.withKeyInfo(key);
    yield buckets.getToken(identity);
    const result = yield buckets.getOrCreate(buck);
    const links = yield buckets.links(result.root.key);
    if (!result.root) {
        throw new Error('Failed to open bucket');
    }
    return {
        buckets: buckets,
        bucketKey: result.root.key,
        links: links
    };
});
class TextileUploader {
    constructor(pub, prv, buck) {
        this.textilepub = pub;
        this.textileprv = prv;
        this.textilebuck = buck;
    }
    upload(content, filename) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const identity = yield hub_1.PrivateKey.fromRandom();
            let bucket = yield setup(this.textilebuck, {
                key: this.textilepub,
                secret: this.textileprv
            }, identity);
            console.log('Bucket connected successfully');
            console.log('Uploading file to bucket ' + filename);
            try {
                const upload = {
                    path: '/' + filename,
                    content
                };
                let push = yield bucket.buckets.pushPath(bucket.bucketKey, filename, upload);
                return { ipfs: push.path.path, links: bucket.links, filename: filename };
            }
            catch (e) {
                return { ipfs: 'Error', links: bucket.links };
            }
        });
    }
}
exports.TextileUploader = TextileUploader;
//# sourceMappingURL=main.js.map