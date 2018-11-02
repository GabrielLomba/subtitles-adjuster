const HOUR_MINUTE_SECONDS_LIMIT = 60;
const MILLISSECONDS_LIMIT = 1000;

const SRT_TIMING_REGEX = /^\d\d:[0-5]\d:[0-5]\d,\d\d\d --> \d\d:[0-5]\d:[0-5]\d,\d\d\d$/;

function isTimingLine(line) {
  return line.trim().match(SRT_TIMING_REGEX);
}

function getFormattedTime(timeParts) {
  const [hour, minutes, seconds, millisseconds] = timeParts;

  const paddedHour = String(hour).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  const paddedMillisseconds = String(millisseconds).padStart(3, '0');

  return `${paddedHour}:${paddedMinutes}:${paddedSeconds},${paddedMillisseconds}`;
}

function getAdjustedTime(timeStr, msChange) {
  const timeParts = timeStr.split(/[:,]/).map(Number);

  let carry = msChange;
  let limit = MILLISSECONDS_LIMIT;
  let i = timeParts.length - 1;

  do {
    timeParts[i] += carry;

    if (timeParts[i] > limit) {
      carry = Math.floor(timeParts[i] / limit);
      timeParts[i] %= limit;
    } else {
      carry = 0;
    }

    --i;
    limit = HOUR_MINUTE_SECONDS_LIMIT;
  } while (i >= 0 && carry > 0);

  return getFormattedTime(timeParts);
}

export const processTimingChange = (fileData, timingMsChange) => {
  const fileLines = fileData.split('\n');

  for (let i = 0; i < fileLines.length; ++i) {
    const line = fileLines[i];

    if (isTimingLine(line)) {
      const parts = line.split(' ');
      const [beginning, , end] = parts;

      parts[0] = getAdjustedTime(beginning, timingMsChange);
      parts[2] = getAdjustedTime(end, timingMsChange);

      fileLines[i] = parts.join(' ');
    }
  }
}
