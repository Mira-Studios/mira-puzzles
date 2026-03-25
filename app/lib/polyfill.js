const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

export function utf8ToBytes(input) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(input);
  }

  // Minimal UTF-8 encoder polyfill
  const bytes = [];
  for (let i = 0; i < input.length; i += 1) {
    let codePoint = input.charCodeAt(i);
    if (codePoint >= 0xd800 && codePoint <= 0xdbff && i + 1 < input.length) {
      const next = input.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        codePoint = 0x10000 + ((codePoint - 0xd800) << 10) + (next - 0xdc00);
        i += 1;
      }
    }
    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint <= 0xffff) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    }
  }
  return new Uint8Array(bytes);
}

export function sha256HexFallback(message) {
  const words = bytesToWords(message);
  const hash = sha256Words(words);
  return wordsToHex(hash);
}

function bytesToWords(message) {
  const l = message.length;
  const bitLen = l * 8;
  const paddedLen = ((l + 9 + 63) >> 6) << 6;
  const words = new Uint32Array(paddedLen / 4);

  for (let i = 0; i < l; i += 1) {
    words[i >> 2] |= message[i] << (24 - (i % 4) * 8);
  }
  words[l >> 2] |= 0x80 << (24 - (l % 4) * 8);

  const high = Math.floor(bitLen / 0x100000000);
  const low = bitLen >>> 0;
  words[(paddedLen / 4) - 2] = high;
  words[(paddedLen / 4) - 1] = low;

  return words;
}

function wordsToHex(words) {
  let out = "";
  for (let i = 0; i < words.length; i += 1) {
    out += words[i].toString(16).padStart(8, "0");
  }
  return out;
}

function sha256Words(words) {
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let i = 0; i < words.length; i += 16) {
    for (let t = 0; t < 16; t += 1) {
      w[t] = words[i + t];
    }
    for (let t = 16; t < 64; t += 1) {
      w[t] = add32(sig1(w[t - 2]), w[t - 7], sig0(w[t - 15]), w[t - 16]);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let t = 0; t < 64; t += 1) {
      const t1 = add32(h, SIG1(e), ch(e, f, g), K[t], w[t]);
      const t2 = add32(SIG0(a), maj(a, b, c));
      h = g;
      g = f;
      f = e;
      e = add32(d, t1);
      d = c;
      c = b;
      b = a;
      a = add32(t1, t2);
    }

    h0 = add32(h0, a);
    h1 = add32(h1, b);
    h2 = add32(h2, c);
    h3 = add32(h3, d);
    h4 = add32(h4, e);
    h5 = add32(h5, f);
    h6 = add32(h6, g);
    h7 = add32(h7, h);
  }

  return new Uint32Array([h0, h1, h2, h3, h4, h5, h6, h7]);
}

function rotr(x, n) {
  return (x >>> n) | (x << (32 - n));
}

function ch(x, y, z) {
  return (x & y) ^ (~x & z);
}

function maj(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}

function SIG0(x) {
  return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
}

function SIG1(x) {
  return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
}

function sig0(x) {
  return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
}

function sig1(x) {
  return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);
}

function add32(...args) {
  let sum = 0;
  for (let i = 0; i < args.length; i += 1) {
    sum = (sum + args[i]) >>> 0;
  }
  return sum;
}
