// src/lib/hexParser.js
export function parseHex(hexString) {
  const flash = new Uint8Array(0x8000); // 32KB flash for ATmega328P
  const lines = hexString.split('\n');

  for (const line of lines) {
    if (line.startsWith(':')) {
      const byteCount = parseInt(line.substr(1, 2), 16);
      const address = parseInt(line.substr(3, 4), 16);
      const recordType = parseInt(line.substr(7, 2), 16);

      if (recordType === 0) { // Data record
        for (let i = 0; i < byteCount; i++) {
          const byteValue = parseInt(line.substr(9 + i * 2, 2), 16);
          flash[address + i] = byteValue;
        }
      }
    }
  }

  // Convert byte array to 16-bit words for avr8js CPU (Little-Endian)
  const program = new Uint16Array(flash.length / 2);
  for (let i = 0; i < program.length; i++) {
    program[i] = flash[i * 2] | (flash[i * 2 + 1] << 8);
  }
  return program;
}