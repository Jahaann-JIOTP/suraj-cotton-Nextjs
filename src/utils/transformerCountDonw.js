const oneStep = 60 * 60 * 1000;
export const countDownTimer = (hours) => {
  let current = hours;

  const timer = setInterval(() => {
    const reaminghrs = current;
    current--;

    if (current < 0) {
      clearInterval(timer); // Stop the timer when done
    }
    return reaminghrs;
  }, 2000);
};
