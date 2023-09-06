export const videoDuration = (duration: number) => {
  if (duration === undefined || duration === null) return '--';
  const newVal = Math.round(duration);
  //  parseInt(`${duration}`, 10);

  if (newVal >= 60) {
    const minute = parseInt(`${newVal / 60}`, 10);
    const second = `${newVal % 60}`.padStart(2, '0');
    return `${minute}:${second}`.padStart(5, '0');
  } else {
    const second = `${newVal}`.padStart(2, '0');
    return `00:${second}`;
  }
};
