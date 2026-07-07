// agent/probeDuration.js
// Reads an audio file's duration in seconds using music-metadata (pure JS, no ffmpeg binary needed).
// Required lazily so slideshow-only projects (no voice/ folder) still work even if this
// dependency hasn't been installed yet — it's only needed for narrated mode.

async function getAudioDurationSeconds(filePath) {
  let parseFile;
  try {
    ({ parseFile } = require("music-metadata"));
  } catch (err) {
    throw new Error(
      "Narrated mode needs the 'music-metadata' package to read voice clip lengths. " +
        "Run: npm install music-metadata"
    );
  }
  const metadata = await parseFile(filePath);
  const duration = metadata.format.duration;
  if (!duration) {
    throw new Error(`Could not read duration for audio file: ${filePath}`);
  }
  return duration;
}

module.exports = { getAudioDurationSeconds };
