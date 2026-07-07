// agent/scanProject.js
// Scans a video-projects/<name>/ folder and builds the data array Remotion needs.
//
// Expected folder layout (all optional except backgrounds/):
//
// video-projects/<name>/
//   backgrounds/        01.jpg, 02.jpg, ...   (required — one per scene, sorted by filename)
//   characters/         01.png, 02.png, ...   (optional — Joon/Pangiya pose per scene, same count as backgrounds)
//   voice/              01.mp3, 02.mp3, ...   (optional — if present, mode = "narrated")
//   captions.txt        (optional — one line per scene, slideshow mode; also usable as subtitles in narrated mode)
//                        each line can end in "|<seconds>" to override that scene's duration in slideshow mode,
//                        e.g. "Nobody warns you|4"
//   music.mp3            (optional — background music, slideshow mode)
//
// Mode detection: if voice/ exists and has audio files -> "narrated". Otherwise -> "slideshow".

const fs = require("fs");
const path = require("path");
const { getAudioDurationSeconds } = require("./probeDuration");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".aac"];
const DEFAULT_FPS = 30;
const DEFAULT_SLIDE_SECONDS = 3;

function listSortedFiles(dirPath, extensions) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => extensions.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => path.join(dirPath, f));
}

function readCaptions(projectDir, count) {
  const captionsPath = path.join(projectDir, "captions.txt");
  if (!fs.existsSync(captionsPath)) {
    return new Array(count).fill({ text: "", overrideSeconds: null });
  }
  const lines = fs
    .readFileSync(captionsPath, "utf-8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  return new Array(count).fill(null).map((_, i) => {
    const line = lines[i] || "";
    const [text, secondsStr] = line.split("|").map((s) => s.trim());
    const overrideSeconds = secondsStr ? parseFloat(secondsStr) : null;
    return { text: text || "", overrideSeconds };
  });
}

async function scanProject(projectDir, fps = DEFAULT_FPS) {
  const backgroundsDir = path.join(projectDir, "backgrounds");
  const charactersDir = path.join(projectDir, "characters");
  const voiceDir = path.join(projectDir, "voice");
  const musicPath = path.join(projectDir, "music.mp3");

  const backgrounds = listSortedFiles(backgroundsDir, IMAGE_EXTENSIONS);
  if (backgrounds.length === 0) {
    throw new Error(
      `No background images found in ${backgroundsDir}. Every project needs at least one file in backgrounds/.`
    );
  }

  const characters = listSortedFiles(charactersDir, IMAGE_EXTENSIONS);
  const voiceFiles = listSortedFiles(voiceDir, AUDIO_EXTENSIONS);
  const mode = voiceFiles.length > 0 ? "narrated" : "slideshow";
  const captions = readCaptions(projectDir, backgrounds.length);

  const scenes = [];

  for (let i = 0; i < backgrounds.length; i++) {
    const backgroundPath = backgrounds[i];
    const characterPath = characters[i] || null;
    const caption = captions[i] || { text: "", overrideSeconds: null };

    let durationInFrames;
    let voicePath = null;

    if (mode === "narrated") {
      voicePath = voiceFiles[i] || null;
      if (!voicePath) {
        throw new Error(
          `Narrated mode detected (voice/ has audio), but scene ${i + 1} has no matching voice file. ` +
            `Make sure backgrounds/ and voice/ have the same number of files.`
        );
      }
      const seconds = await getAudioDurationSeconds(voicePath);
      // small buffer so the scene doesn't cut off the instant the line ends
      durationInFrames = Math.round((seconds + 0.4) * fps);
    } else {
      const seconds = caption.overrideSeconds || DEFAULT_SLIDE_SECONDS;
      durationInFrames = Math.round(seconds * fps);
    }

    scenes.push({
      index: i,
      backgroundPath,
      characterPath,
      voicePath,
      text: caption.text,
      durationInFrames,
    });
  }

  return {
    mode,
    fps,
    musicPath: fs.existsSync(musicPath) ? musicPath : null,
    scenes,
    totalDurationInFrames: scenes.reduce((sum, s) => sum + s.durationInFrames, 0),
  };
}

module.exports = { scanProject };
