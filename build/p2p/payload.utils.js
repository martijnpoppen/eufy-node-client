"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intToBufferLE = exports.intToBufferBE = exports.buildCommandWithStringTypePayload = exports.buildCommandHeader = exports.buildIntStringCommandPayload = exports.buildStringTypeCommandPayload = exports.buildIntCommandPayload = exports.buildCheckCamPayload = exports.buildLookupWithKeyPayload = exports.MAGIC_WORD = void 0;
exports.MAGIC_WORD = 'XZYH';
exports.buildLookupWithKeyPayload = (socket, p2pDid, dskKey) => {
    const p2pDidBuffer = p2pDidToBuffer(p2pDid);
    const port = socket.address().port;
    const portAsBuffer = exports.intToBufferBE(port);
    const portLittleEndianBuffer = Buffer.from([portAsBuffer[2], portAsBuffer[1]]);
    const ip = socket.address().address;
    const splitIp = ip.split('.');
    const ipAsBuffer = Buffer.from(splitIp);
    const splitter = Buffer.from([0x00, 0x00]);
    const magic = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x04, 0x00, 0x00]);
    const dskKeyAsBuffer = Buffer.from(dskKey);
    const fourEmpty = Buffer.from([0x00, 0x00, 0x00, 0x00]);
    return Buffer.concat([p2pDidBuffer, splitter, portLittleEndianBuffer, ipAsBuffer, magic, dskKeyAsBuffer, fourEmpty]);
};
exports.buildCheckCamPayload = (p2pDid) => {
    const p2pDidBuffer = p2pDidToBuffer(p2pDid);
    const magic = Buffer.from([0x00, 0x00, 0x00]);
    return Buffer.concat([p2pDidBuffer, magic]);
};
exports.buildIntCommandPayload = (value, actor, channel = 255) => {
    const headerBuffer = Buffer.from([0x04, 0x00]);
    const magicBuffer = Buffer.from([0x00, 0x00, 0x01, 0x00, channel, 0x00, 0x00, 0x00]);
    const valueBuffer = Buffer.from([value]);
    const magicBuffer2 = Buffer.from([0x00, 0x00, 0x00]);
    const actorBuffer = Buffer.from(actor);
    const rest = Buffer.alloc(88);
    return Buffer.concat([headerBuffer, magicBuffer, valueBuffer, magicBuffer2, actorBuffer, rest]);
};
exports.buildStringTypeCommandPayload = (strValue, actor, channel = 255) => {
    const magic = Buffer.from([
        0x05,
        0x01,
        0x00,
        0x00,
        0x01,
        0x00,
        channel,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
    ]);
    const strValueBuffer = stringWithLength(strValue, 128);
    const valueStrSubBuffer = stringWithLength(actor, 128);
    return Buffer.concat([magic, strValueBuffer, valueStrSubBuffer]);
};
exports.buildIntStringCommandPayload = (value, valueSub = 0, strValue = '', strValueSub = '', channel = 0) => {
    const emptyBuffer = Buffer.from([0x00, 0x00]);
    const magicBuffer = Buffer.from([0x01, 0x00]);
    const channelBuffer = Buffer.from([channel, 0x00]);
    const someintBuffer = Buffer.allocUnsafe(4);
    someintBuffer.writeUInt32LE(valueSub, 0);
    const valueBuffer = Buffer.allocUnsafe(4);
    valueBuffer.writeUInt32LE(value, 0);
    const strValueBuffer = strValue.length === 0 ? Buffer.from([]) : stringWithLength(strValue);
    const strValueSubBuffer = strValueSub.length === 0 ? Buffer.from([]) : stringWithLength(strValueSub);
    const headerBuffer = Buffer.allocUnsafe(2);
    headerBuffer.writeUInt16LE(someintBuffer.length + valueBuffer.length + strValueBuffer.length + strValueSubBuffer.length, 0);
    return Buffer.concat([
        headerBuffer,
        emptyBuffer,
        magicBuffer,
        channelBuffer,
        emptyBuffer,
        someintBuffer,
        valueBuffer,
        strValueBuffer,
        strValueSubBuffer,
    ]);
};
exports.buildCommandHeader = (seqNumber, commandType) => {
    const dataTypeBuffer = Buffer.from([0xd1, 0x00]);
    const seqAsBuffer = exports.intToBufferBE(seqNumber, 2);
    const magicString = Buffer.from(exports.MAGIC_WORD);
    const commandTypeBuffer = exports.intToBufferLE(commandType, 2);
    return Buffer.concat([dataTypeBuffer, seqAsBuffer, magicString, commandTypeBuffer]);
};
exports.buildCommandWithStringTypePayload = (value, channel = 0) => {
    // type = 6
    //setCommandWithString()
    const headerBuffer = Buffer.allocUnsafe(2);
    const emptyBuffer = Buffer.from([0x00, 0x00]);
    const magicBuffer = Buffer.from([0x01, 0x00]);
    const channelBuffer = Buffer.from([channel, 0x00]);
    const jsonBuffer = Buffer.from(value);
    headerBuffer.writeUInt16LE(jsonBuffer.length, 0);
    return Buffer.concat([headerBuffer, emptyBuffer, magicBuffer, channelBuffer, emptyBuffer, jsonBuffer]);
};
const intToArray = (inp) => {
    const digit = parseInt(inp.toString(), 10);
    let str = digit.toString(16);
    switch (str.length) {
        case 1:
            str = '00000' + str;
            break;
        case 2:
            str = '0000' + str;
            break;
        case 3:
            str = '000' + str;
            break;
        case 4:
            str = '00' + str;
            break;
        case 5:
            str = '0' + str;
            break;
    }
    const first = parseInt(str.substr(0, 2), 16);
    const second = parseInt(str.substr(2, 2), 16);
    const third = parseInt(str.substr(4, 2), 16);
    return [first, second, third];
};
exports.intToBufferBE = (inp, bufferLength = null) => {
    const array = intToArray(inp);
    return Buffer.from(applyLength(array, bufferLength, true));
};
exports.intToBufferLE = (inp, bufferLength = null) => {
    const array = intToArray(inp);
    array.reverse();
    return Buffer.from(applyLength(array, bufferLength));
};
const applyLength = (inp, bufferLength = null, bigendian = false) => {
    if (!bufferLength) {
        return inp;
    }
    if (bufferLength < inp.length && !bigendian) {
        return inp.slice(0, bufferLength);
    }
    else if (bufferLength < inp.length && bigendian) {
        return inp.slice(inp.length - bufferLength);
    }
    else if (bufferLength > inp.length) {
        for (let i = 0; i <= bufferLength - inp.length; i++) {
            inp.push(0);
        }
        return inp;
    }
    return inp;
};
const p2pDidToBuffer = (p2pDid) => {
    const p2pArray = p2pDid.split('-');
    const buf1 = Buffer.from(p2pArray[0]);
    const fst = exports.intToBufferBE(p2pArray[1]);
    const numeric = Buffer.concat([Buffer.from([0x00, 0x00]), fst]);
    const buf2 = Buffer.from(numeric);
    const buf3 = Buffer.from(p2pArray[2]);
    const buf4 = Buffer.from([0x00, 0x00, 0x00]);
    return Buffer.concat([buf1, buf2, buf3, buf4], 20);
};
const stringWithLength = (input, targetByteLength = 128) => {
    const stringAsBuffer = Buffer.from(input);
    const postZeros = Buffer.alloc(targetByteLength - stringAsBuffer.byteLength);
    return Buffer.concat([stringAsBuffer, postZeros]);
};
