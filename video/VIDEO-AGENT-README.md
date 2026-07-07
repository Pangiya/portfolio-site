# Video Agent — Automated Compiler for Pangiya Content

Drop images/audio into a folder, run one command, get a rendered video. This agent handles the
"compile everything into a video" step — it does not write captions or scripts for you (that's
what the `pangiya-tiktok-pipeline` skill is for, in chat or Claude Code).

## What it does

- **Detects the format automatically.** If a project's `voice/` folder has audio files, it builds
  a narrated video (background + character pose + voice, duration set by the audio length). If not,
  it builds a slideshow (background + Ken Burns zoom + animated caption, duration set by you or a
  3-second default).
- **Copies your assets into Remotion's `public/` folder** and builds the scene data automatically —
  you never touch a data file by hand.
- **Renders the final `.mp4`** into `out/<project-name>.mp4` by invoking `npx remotion render` for you.

## One-time setup (do this once)

1. Install the one new dependency this needs, for reading audio file lengths:
   ```bash
   npm install music-metadata
   ```

2. Open your existing `src/Root.tsx` and add the `<Composition>` block from
   `src/auto/RootRegistration.snippet.tsx` into it (along with its two imports at the top).
   Your Root.tsx likely already has a similar block for the Hello World scaffold — this just adds
   a second composition called `AutoVideo` alongside it.

3. (Optional but recommended) Add this line inside the `"scripts"` section of your `package.json`:
   ```json
   "agent": "node agent/buildVideo.js"
   ```
   This lets you run `npm run agent -- <project-name>` instead of the longer `node` command.

## Folder structure per video project

Everything lives under `video-projects/<your-project-name>/`:

```
video-projects/
  segment-12/
    backgrounds/        01.jpg, 02.jpg, ...    (required — one image per scene)
    characters/         01.png, 02.png, ...    (optional — Joon/Pangiya pose per scene)
    voice/              01.mp3, 02.mp3, ...    (optional — presence of this = narrated mode)
    captions.txt         (optional — one line per scene; slideshow mode uses this as the caption)
    music.mp3            (optional — background music, mixed under everything)
```

**File ordering matters.** Files are sorted by filename, so use zero-padded numbers (`01.jpg`,
`02.jpg`, not `1.jpg`, `2.jpg`) to keep the order predictable once you get past 9 scenes.

**`captions.txt` format:** one line per scene, in order. Add `|<seconds>` at the end of a line to
override that scene's duration in slideshow mode (default is 3 seconds), e.g.:
```
Nobody warns you
about this part|4
of getting stronger
```

Two example project folders are included (`example-slideshow/`, `example-narrated/`) with
placeholder `.txt` notes inside each empty folder explaining what goes there — delete the
placeholders once you drop in real files.

## Running it

```bash
node agent/buildVideo.js segment-12
```
or, if you added the npm script:
```bash
npm run agent -- segment-12
```

You'll see it print the detected mode, scene count, and estimated length, then render. The
finished video lands at `out/segment-12.mp4`.

## What this doesn't do (yet)

- It doesn't write the caption text or pick background search terms for you — ask me for that in
  chat or Claude Code, using the `pangiya-tiktok-pipeline` skill, then drop the result into
  `captions.txt`.
- It doesn't add music automatically for narrated videos — `music.mp3` works in both modes if you
  want it, just know it'll play under the narration too, so keep the volume low if you use both.
- It doesn't post anywhere — this only gets you to a finished `.mp4` in `out/`.

## If something breaks

- **"No background images found"** — check the exact folder name is `backgrounds` (not `background`
  or `Backgrounds`) and that the files have `.jpg`, `.jpeg`, `.png`, or `.webp` extensions.
- **"scene N has no matching voice file"** — in narrated mode, `backgrounds/` and `voice/` need the
  same number of files, matched by sort order.
- **Render fails with a Remotion error** — this is the point where testing inside your actual
  Claude Code session (with real repo access) is more useful than more back-and-forth here — it can
  see the exact error and your real `Root.tsx`, and fix it directly rather than guessing blind.
