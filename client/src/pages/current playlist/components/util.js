export const getTotalTrackDuration = (songs) => {
  let totalDuration = 0; // in ms
  for (let i = 0; i < songs.length; i++) {
    if (typeof (songs[i].duration) === 'string') {
      const splitArray = songs[i].duration.split(':');

      if (splitArray.length === 2) {
        const minutes = parseInt(splitArray[0]);
        const seconds = parseInt(splitArray[1]);

        totalDuration += 1000 * ((minutes * 60) + seconds);
      } else if (splitArray.length === 3) {
        const hours = parseInt(splitArray[0]);
        const minutes = parseInt(splitArray[1]);
        const seconds = parseInt(splitArray[2]);

        totalDuration += 1000 * ((hours * 60 * 60) + (minutes * 60) + seconds);
      }
    } else if (typeof (songs[i].duration) === 'number') {
      totalDuration += songs[i].duration;
    }
  }

  const parsedDuration = new Date(totalDuration).toISOString().slice(11, 19);
  return removeHours(parsedDuration);
};

const removeHours = (str) => {
  if (str.startsWith("00:")) {
    return str.slice(3); // Remove the first 3 characters "00:"
  }

  return str; // If the string doesn't start with "00:", return it as is
};
