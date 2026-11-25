// The clock of a visual that goes through steps.
//
// On a lesson page a visual runs by itself: time passes, and each step
// starts at its time. On a slide the teacher is in charge: time stops at
// the end of the current step and waits, and the arrow keys of the deck
// move to the next step or back. The visual is written once, as a function
// of the time, and works both ways.
//
//   const timeline = figure.timeline([0, 3, 6, 9]);   when each step starts
//   stage.onFrame = (seconds) => {
//     const time = timeline.advance(seconds);
//     ...draw the visual at `time`...
//   };

// How long before the next step the clock stops when it is waiting.
const JUST_BEFORE = 0.001;

export class Timeline {
  private time = 0;
  // The step the teacher has reached. Used only when `waitsAtEachStep`.
  private reachedStep = 0;
  private readonly stepStartTimes: number[];
  private readonly waitsAtEachStep: boolean;

  constructor(stepStartTimes: number[], waitsAtEachStep: boolean) {
    this.stepStartTimes = stepStartTimes;
    this.waitsAtEachStep = waitsAtEachStep;
  }

  // The step the teacher has reached, and how many steps there are.
  get step(): number {
    return this.reachedStep;
  }

  get stepCount(): number {
    return this.stepStartTimes.length;
  }

  // Moves the clock on by `seconds` and returns the time.
  advance(seconds: number): number {
    this.time += seconds;
    if (this.waitsAtEachStep) {
      const nextStepStart = this.stepStartTimes[this.reachedStep + 1];
      if (nextStepStart !== undefined) this.time = Math.min(this.time, nextStepStart - JUST_BEFORE);
    }
    return this.time;
  }

  restart(): void {
    this.time = 0;
    this.reachedStep = 0;
  }

  // Goes to the start of the next step. Returns false at the last step.
  nextStep(): boolean {
    if (this.reachedStep >= this.stepStartTimes.length - 1) return false;
    this.reachedStep += 1;
    this.time = this.stepStartTimes[this.reachedStep];
    return true;
  }

  // Goes back to the start of the step before. Returns false at the first.
  previousStep(): boolean {
    if (this.reachedStep === 0) return false;
    this.reachedStep -= 1;
    this.time = this.stepStartTimes[this.reachedStep];
    return true;
  }

  // Lets the clock run to the end, as for a printed page.
  showEveryStep(): void {
    this.reachedStep = this.stepStartTimes.length - 1;
  }
}

// The start times of steps that all last the same time: evenSteps(3, 3)
// is [0, 3, 6].
export function evenSteps(count: number, secondsEach: number): number[] {
  return Array.from({ length: count }, (_, step) => step * secondsEach);
}
