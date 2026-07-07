#!/usr/bin/env node
// agent/buildVideo.js
// Usage: node agent/buildVideo.js <project-name>
//   (or: npm run agent -- <project-name>)
//
// Reads video-projects/<project-name>/, copies its assets into public/generated/<project-name>/
// (Remotion can only reference files inside public/ via staticFile()), builds the scene data,
// and renders the final video with Remotion.

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const { scanProject } = require("./scanProject");

const REPO_ROOT = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.join(REPO_ROOT, "video-projects");
const PUBLIC_DIR = path.join(REPO_ROOT, "public");
const OUTPUT_DIR = path.join(REPO_ROOT, "out");

function copyIntoPublic(filePath, projectName, subfolder) {
  if (!filePath) return null;
  const destDir = path.join(PUBLIC_DIR, "generated", projectName, subfolder);
  fs.mkdirSync(destDir, { recursive: true });
  const destName = path.basename(filePath);
  const destPath = path.join(destDir, destName);
  fs.copyFileSync(filePath, destPath);
  // Path relative to public/, forward slashes — what staticFile() expects
  return path.relative(PUBLIC_DIR, destPath).split(path.sep).join("/");
}

async function main() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.error("Usage: node agent/buildVideo.js <project-name>");
    if (fs.existsSync(PROJECTS_DIR)) {
      console.error(`Available projects: ${fs.readdirSync(PROJECTS_DIR).join(", ") || "(none yet)"}`);
    }
    process.exit(1);
  }

  const projectDir = path.join(PROJECTS_DIR, projectName);
  if (!fs.existsSync(projectDir)) {
    console.error(`Project folder not found: ${projectDir}`);
    process.exit(1);
  }

  console.log(`Scanning project "${projectName}"...`);
  const data = await scanProject(projectDir);
  console.log(
    `Detected mode: ${data.mode} | ${data.scenes.length} scene(s) | ~${(
      data.totalDurationInFrames / data.fps
    ).toFixed(1)}s total`
  );

  console.log("Copying assets into public/generated/...");
  const scenesForRemotion = data.scenes.map((scene) => ({
    index: scene.index,
    background: copyIntoPublic(scene.backgroundPath, projectName, "backgrounds"),
    character: copyIntoPublic(scene.characterPath, projectName, "characters"),
    voice: copyIntoPublic(scene.voicePath, projectName, "voice"),
    text: scene.text,
    durationInFrames: scene.durationInFrames,
  }));
  const music = copyIntoPublic(data.musicPath, projectName, "music");

  const remotionProps = {
    mode: data.mode,
    fps: data.fps,
    scenes: scenesForRemotion,
    music,
    totalDurationInFrames: data.totalDurationInFrames,
  };

  const tmpPropsPath = path.join(os.tmpdir(), `pangiya-props-${projectName}-${Date.now()}.json`);
  fs.writeFileSync(tmpPropsPath, JSON.stringify(remotionProps, null, 2));

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputPath = path.join(OUTPUT_DIR, `${projectName}.mp4`);

  console.log("Rendering with Remotion (this can take a minute)...");
  const cmd = `npx remotion render src/index.ts AutoVideo "${outputPath}" --props="${tmpPropsPath}"`;
  execSync(cmd, { stdio: "inherit", cwd: REPO_ROOT });

  console.log(`\nDone! Video saved to: ${outputPath}`);
}

main().catch((err) => {
  console.error("Video agent failed:", err.message);
  process.exit(1);
});
