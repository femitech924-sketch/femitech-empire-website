# Service preview video assets

The project currently contains the six portfolio PNGs used as service-preview posters, but no service-preview video files. No video sources are referenced by the site until the actual clips are supplied; the video elements currently display these verified static posters instead of making requests to nonexistent files.

Please supply six separate, service-specific video clips (about 5–8 seconds each), encoded as web-friendly H.264 MP4 with no audio, seamless loop points where practical, and no unrelated logos, watermarks, or generated text. The clips should show the actual creative process and finished result for:

- Graphics Design — poster: `assets/file_0000000029b48210ac82bbed2769c0e3.png`
- Website Design — poster: `assets/file_00000000733c81f4b21dc0990f3012a0.png`
- Video Editing — poster: `assets/file_00000000b5e481f4b728194098b1818d.png`
- AI Content Creation — poster: `assets/file_00000000e6d48210acc3e4a6afa0f53e.png`
- Digital Ads — poster: `assets/file_00000000f7c081f4990cbb176b6b0177.png`
- Jingles & Promo Videos — poster: `assets/file_00000000b5e481f4b728194098b1818d.png`

Once supplied, each clip can be connected as its own `<source>` in the matching service preview. The current setup uses muted, looping, inline video elements with `preload="none"`, pauses them offscreen, and does not play them when reduced motion is requested. Existing portfolio PNGs remain intact and continue to power Selected Works.
