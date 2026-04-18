# Magenta Was the Alpha Channel: Reverse-Engineering a Windows Media Player Skin with React

*This is a living post — the feature branch is still in progress. I'll update it with screenshots and final results once the skin is fully rendering and stable.*

---

It's past midnight and I'm reading XML written by someone at Microsoft in 2003.

```xml
<theme id="headspace" author="Microsoft Corporation">
  <view width="760" height="394" titleBar="false" resizable="false">
    <buttonGroup mappingImage="minimize_close_map.bmp">
      <buttonElement mappingColor="#FF00CC" upToolTip="Minimize" />
      <buttonElement mappingColor="#CC0066" upToolTip="Close" />
    </buttonGroup>
```

I'm building a portfolio website styled like an Xbox 360 dashboard — blades, ambient sound design, the whole thing. And somewhere in that rabbit hole I decided the music section needed a real, working Windows Media Player skin. Not a mockup. Not a recreation loosely inspired by WMP. An actual `.wms` skin file, parsed at runtime, rendered in React, playing Spotify previews.

This is the story of how that went — including the parts that broke.

---

## Track 01: What Is a .wms File, Exactly

WMP skins were introduced in Windows Media Player 7 (2000). The format — `.wms` — is XML. Every element in the player UI is declared in that XML: its position, its dimensions, its bitmap sources, its behavior. The skin ships with a folder of `.bmp` files that provide all the visual assets. Together, they define a complete, swappable player UI that WMP would load and render instead of its default chrome.

Opening `headspace.wms` for the first time felt like reading a blueprint for a building that had already been demolished. The element tree was meticulously structured — `<view>`, `<subview>`, `<buttonGroup>`, `<slider>`, `<text>` — with attributes like `wmpprop:currentmedia.durationstring` that bound UI text directly to playback state. This wasn't some cobbled-together format. Someone had designed a real SDK.

The decision to write a **runtime parser** rather than pre-processing the skin at build time was deliberate. WMP loaded skins dynamically. That's why it let you switch between them without restarting. I wanted the same property: parse the XML on mount, build the element tree in JavaScript, render from that. If I ever wanted to add more skins, it would cost nothing.

The `skinParser.ts` I ended up with uses the browser's native `DOMParser` — no external XML library needed. It walks the element tree recursively, mapping WMP tag names to typed objects, preserving attribute values including those `wmpprop:` binding strings for later resolution. When it returned a structured JavaScript object from that 2003 XML for the first time, I genuinely said something out loud.

---

## Magenta Was the Alpha Channel

This is the section I want you to sit with.

Windows Media Player skins predate widespread PNG support. Their visual assets are `.bmp` files — and BMP, in its classic form, has no alpha channel. No transparency. Every pixel has a fully opaque color, full stop.

But skins need transparency. Buttons need to float over backgrounds. Non-rectangular shapes need to cut out cleanly. So the WMP skin SDK used a technique borrowed directly from film production: **chroma keying**.

In cinema, green screen (or blue screen, or in older methods, red screen) works by declaring a specific color to mean "nothing is here." The composite system sees that color and replaces it with whatever's behind. The WMP skin format did the exact same thing, but with magenta — `#FF00FF`. And sometimes red: `#FF0000`. Any pixel painted that color in a skin asset was meant to be transparent.

In 2024, "the skin renderer" was me, in TypeScript, using the Canvas 2D API.

**[Screenshot: before/after — magenta-haloed button strips vs. clean transparent sprites]**

Here's what `assetLoader.ts` does with every BMP it loads:

```typescript
// Draw image to canvas
ctx.drawImage(img, 0, 0);

// Get pixel data
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

// Make magenta (#FF00FF) and red (#FF0000) transparent
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const isMagenta = Math.abs(r - 255) <= 5 && Math.abs(g - 0) <= 5 && Math.abs(b - 255) <= 5;
  const isRed = Math.abs(r - 255) <= 5 && Math.abs(g - 0) <= 5 && Math.abs(b - 0) <= 5;

  if (isMagenta || isRed) {
    data[i + 3] = 0; // Set alpha to 0 (transparent)
  }
}

ctx.putImageData(imageData, 0, 0);
const processedUrl = canvas.toDataURL('image/png');
```

Load the BMP. Draw it to a Canvas. Iterate every pixel. Find the magenta or red ones. Set their alpha to zero. Export as PNG.

You cannot do this with CSS alone. There is no `mix-blend-mode` or `mask` value that will selectively erase pixels baked into a bitmap file. You have to read the pixel data directly.

I added a tolerance of ±5 per channel because BMP compression can introduce slight color drift — the kind of thing you discover when certain buttons still render with a faint pink halo and you start squinting at hex values in the devtools canvas inspector.

---

## The Pitfalls (What Actually Broke)

The parser and the transparency loop were just the beginning. The next few commits tell the real story.

### Pitfall 1: Everything Was a Square

After asset loading worked, elements rendered with wrong dimensions — buttons appeared as tiny squares, backgrounds didn't fit their containers, sliders looked like blobs. The fix: the original `assetLoader` was returning just a URL string. It needed to also capture `naturalWidth` and `naturalHeight` from the loaded image, then use those as fallback dimensions whenever the skin XML didn't specify explicit width/height. This meant updating the type from `string` to an `ImageInfo` object across `WMPButton`, `WMPSlider`, and `WMPSubview` simultaneously.

**[Screenshot: broken square rendering vs. correct layout]**

### Pitfall 2: Raw Binding Strings Appearing as UI Text

The skin XML has text elements that contain `wmpprop:` binding expressions — things like `wmpprop:visEffects.currentPresetTitle` or `wmpprop:currentmedia.durationstring`. In WMP, the player evaluated these at runtime and displayed the actual values. In my first rendering pass, I was displaying the raw binding strings verbatim. The player had a label that said, literally, `wmpprop:currentmedia.durationstring`. 

The fix was two-part: translate known bindings to actual `playerState` values in `WMPSubview`, and suppress rendering entirely for elements marked `visible=false` or text elements with empty content. Some skin elements are tooltip labels — "Close visualization chooser", "Close playlist" — that WMP only shows on hover via its own tooltip system. Without filtering, they rendered as permanent floating text over the player.

### Pitfall 3: NaN in the Seek Slider

`WMPSlider` calculates thumb position as a ratio: `(currentValue - min) / (max - min)`. Clean enough, until `min` and `max` come from the skin XML as `wmpprop:` binding strings instead of numbers. `parseInt("wmpprop:player.currentPositionString")` returns `NaN`. The CSS `left` property received `NaN`, and the browser logged a wall of errors.

The fix: parse slider `min`/`max` as strings first, check whether they contain WMP bindings, and if so resolve them against `playerState` (e.g., map the duration binding to `playerState.duration`). Wrap all thumb position math in `Number.isFinite()` guards.

### Pitfall 4: Volume Context Mismatch

The initial `useWMPPlayer` hook imported from `VolumeContext` directly. The project uses a `useVolume` hook as the intended access pattern — a one-line fix, but the kind of thing that only surfaces when you actually wire up the player to the rest of the app.

---

## Hit Detection at the Pixel Level

Here is a problem you don't encounter in normal React development: the buttons in a WMP skin are not DOM elements. They have no bounding boxes in the HTML sense. They are painted regions within a larger bitmap, and you need to know when the user clicks on them.

Every `buttonGroup` in the WMS file references a `mappingImage` — a separate BMP that looks, at first glance, like a solid-colored blob. Look more carefully: it's a flat-colored map of clickable regions. Each button in the group is painted a distinct, flat color on this map. The close button is `#CC0066`. The minimize button is `#FF00CC`. No gradients, no anti-aliasing. Pure sentinel colors.

The detection logic in `regionMapper.ts`: on mousemove over the player, sample the pixel at the cursor's position in the mapping image. Convert it to hex. Look up that hex in a table that maps colors to action names. On click, fire the corresponding handler.

This is exactly the technique used in point-and-click adventure games from the early 1990s for interactive scene regions. Microsoft's skin SDK included these region map assets alongside every visual asset, which means they had already solved the problem. I wasn't inventing the solution. I was rediscovering it.

**[Screenshot: region map BMP alongside the rendered skin — the sentinel-colored zones visible]**

---

## The State Machine Underneath

A media player sounds simple until you start enumerating its states.

Playing, paused, stopped, buffering — those are the obvious four. Then: what happens when the user seeks while playing? When the playlist ends and loops? When a track starts but has no duration yet? When the user drags the seek bar, should audio follow in real time or wait for drop? When Spotify hands you a 30-second preview and the track "ends" at 30 seconds — stopped or completed?

These states interact. `useState` collapses under the complexity. I ended up with a `useReducer` with 27 distinct action types.

I did not plan for 27 actions. I discovered them. Each one marks a moment when a simpler model broke. The reducer grew honest over time.

What it bought me: every UI interaction dispatches a named action. Every state transition is explicit and traceable. Debugging means reading the action log, not reasoning backward from a tangle of refs and effects.

The state lives in `useWMPPlayer`, exposed globally via `WMPPlayerContext`, rendered through a React Portal so the player persists across route changes without remounting. Portals are one of those React features that sounds niche until you build a floating media player on a multi-page Next.js 15 app.

---

## Spotify in a 2003 Wrapper

Spotify's Web API provides 30-second preview URLs for most tracks. They're direct audio files — no streaming protocol, no DRM, just a URL you can drop into an `<audio>` element's `src`.

The tRPC endpoint fetches a playlist using Client Credentials OAuth, filters to tracks that have a `preview_url`, and returns them shaped as `Track` objects. The WMP player doesn't know or care where the URLs came from. The Headspace skin's audio pipeline was written against a generic interface. When Spotify preview URLs arrived, the player swallowed them without modification.

One wrinkle: many Spotify tracks don't have preview URLs at all. The music page auto-advances to the next playlist if the current one yields zero playable tracks. It's a pragmatic workaround for an API limitation, and it's still not perfect — something to address before this branch lands.

**[Screenshot: Headspace skin mid-playback on a Spotify track — equalizer animation active]**

---

## Where It Stands

The player loads, parses the skin, detects button clicks, and plays Spotify previews. The known remaining work:

- The visualizer region and some secondary drawers still have layout quirks
- Skin-switching (loading a different `.wms`) is supported by the architecture but untested end-to-end
- Mobile layout needs attention — the 760px fixed-width skin doesn't adapt gracefully below tablet
- The 30-second preview limitation is a UX story that needs better communication to the user

I'll update this post when those are resolved, with screenshots of the finished state. The interesting technical ground is already covered above — what's left is fit and finish, and the occasional bug you only find when a real user clicks something you didn't expect.

---

## What This Cost and Why It Was Worth It

The honest accounting: roughly 1,850 lines of TypeScript for a player that plays 30-second clips. Six fix commits after the initial implementation. Several nights staring at Canvas pixel data and CSS property `NaN` errors.

The point is that old SDKs are documentation. The `.wms` format encodes decisions made by engineers solving real problems in 2001: how do you ship a skinable UI when PNG isn't ubiquitous? You use magenta as your alpha channel — the same way filmmakers used green screens. How do you define click regions for arbitrary non-rectangular bitmap shapes? You ship a companion map image with sentinel colors — the same way game devs defined interactive zones.

These solutions are elegant in the way constrained solutions often are. Reading a 2003 skin SDK carefully is a form of technical history. And a portfolio that contains a working Windows Media Player skin communicates something that a list of framework names cannot.

The Headspace skin is still running. It doesn't know what year it is.

---

*Branch: `feat/wmp-skin-player` — still in progress. Post will be updated with final screenshots and any remaining interesting bugs.*
