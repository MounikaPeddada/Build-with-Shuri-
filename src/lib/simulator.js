// src/lib/simulator.js
import { CPU, avrInstruction, AVRTimer, AVRIOPort, portBConfig, portCConfig, portDConfig, timer0Config } from 'avr8js';

export class ArduinoSimulator {
  // Accept program as the first argument
  constructor(program, onPinChange) {
    this.onPinChange = onPinChange;
    
    this.cpu = new CPU(program);
    this.timer = new AVRTimer(this.cpu, timer0Config);
    this.portB = new AVRIOPort(this.cpu, portBConfig);
    this.portC = new AVRIOPort(this.cpu, portCConfig);
    this.portD = new AVRIOPort(this.cpu, portDConfig);

    this.portB.addListener((value, oldValue) => {
      const PB5 = 0b00100000; // Bit 5 is Arduino Pin 13
      if ((value & PB5) !== (oldValue & PB5)) {
        const isHigh = (value & PB5) !== 0;
        if (this.onPinChange) {
          this.onPinChange(13, isHigh);
        }
      }
    });

    this.isRunning = false;
    this.animationId = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  loop = () => {
    if (!this.isRunning) return;
    
    try {
      for (let i = 0; i < 266000; i++) {
        avrInstruction(this.cpu);
        this.cpu.tick();
      }
    } catch (e) {
      console.error("CPU crashed:", e);
      this.isRunning = false;
      return;
    }
    
    this.animationId = requestAnimationFrame(this.loop);
  };
}