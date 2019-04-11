const fs = require('fs');
const destroy = require('destroy');
const crypto = require('crypto');

const algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
const keyEncode = 'OIUK1VUAR63SCTO4L4Q9UVMWOWIR2UEZ';
const IV = Buffer.from(crypto.randomBytes(16));

module.exports = {
    deleteFile: (filePath) => {
        if (fs.existsSync(filePath)) {
            const stream = fs.unlinkSync(filePath);
            destroy(stream);
        }
    },
    endCrypted: (data) => {
        const cipher = crypto.createCipheriv(algorithm, keyEncode, IV);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    },
    deCrypted: (encrypted) => {
        const decipher = crypto.createDecipheriv(algorithm, keyEncode, IV);
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    },
};
