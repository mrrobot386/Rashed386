import { floatTo16BitPCM, resampleTo16kHZ, base64ToArrayBuffer, arrayBufferToBase64 } from '../../src/audio/pcmUtils';

describe('pcmUtils', () => {
  it('converts float audio buffers to 16-bit PCM bytes', () => {
    const floatBuffer = new Float32Array([0.0, 0.5, -0.5, 1.0, -1.0]);
    const pcmBuffer = floatTo16BitPCM(floatBuffer);
    expect(pcmBuffer.byteLength).toBe(floatBuffer.length * 2);

    const int16View = new Int16Array(pcmBuffer);
    expect(int16View[0]).toBe(0);
    expect(int16View[1]).toBeGreaterThan(16000);
    expect(int16View[2]).toBeLessThan(-16000);
  });

  it('resamples from 48kHz down to 16kHz', () => {
    const input48k = new Float32Array(480);
    const output16k = resampleTo16kHZ(input48k, 48000);
    expect(output16k.length).toBe(160);
  });

  it('round-trips ArrayBuffer to base64 and back', () => {
    const buffer = new Uint8Array([1, 2, 3, 4, 255, 128]).buffer;
    const base64 = arrayBufferToBase64(buffer);
    expect(typeof base64).toBe('string');
    const recovered = base64ToArrayBuffer(base64);
    const recoveredView = new Uint8Array(recovered);
    expect(recoveredView[0]).toBe(1);
    expect(recoveredView[4]).toBe(255);
  });
});
