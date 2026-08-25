# Changelog

## [1.7.0](https://github.com/sorfeb/personal_web/compare/v1.6.0...v1.7.0) (2026-08-25)


### Features

* **about:** replace the static copy with Guide-style tab panels ([cf5549a](https://github.com/sorfeb/personal_web/commit/cf5549a2721bb9ce1f15f9d328918a5757354991))
* **about:** Xbox 360 Guide-style tab panels, plus a shared Tabs primitive ([695d0f4](https://github.com/sorfeb/personal_web/commit/695d0f42b508d3f2657240e2aef80ab3060f33ec))
* **chat:** multi-room schema, rate limiting, and moderation ([b2431de](https://github.com/sorfeb/personal_web/commit/b2431de2a80bfe14d457f88df12335ec30b6ce6b))
* **chat:** multi-room schema, rate limiting, and moderation ([4263dfd](https://github.com/sorfeb/personal_web/commit/4263dfd525c4779ecfdc6405aadba3816023a9d9))
* **chat:** reclaim the chat room from the dashboard ([00a6623](https://github.com/sorfeb/personal_web/commit/00a6623aa871a6dab66632472bd56602034f4f37))
* **chat:** reclaim the chat room from the dashboard ([3a43696](https://github.com/sorfeb/personal_web/commit/3a43696d7dfc667efe81c8c10bbb66f04886af95))
* **data:** add the public roadmap ([dee5aa7](https://github.com/sorfeb/personal_web/commit/dee5aa7c1a5e4dbebe5cfc4b90fc4da68e2fc832))
* **ui:** add Tabs primitive with the WAI-ARIA tabs pattern ([e4c1ef3](https://github.com/sorfeb/personal_web/commit/e4c1ef34df641c3a285af6f82609fb9ce30d4094))
* **ui:** center glyph letters on cap height and scale them to the chip ([bf97785](https://github.com/sorfeb/personal_web/commit/bf97785be3044e14a6d6aefa1dc8f5264ca53ec6))
* **ui:** give glyph chips a hard-edged specular cap ([168e213](https://github.com/sorfeb/personal_web/commit/168e2138a42f2721839f07f66b7cd2f5cb5443fc))
* **ui:** shade controller glyphs like lit spheres ([d04ab39](https://github.com/sorfeb/personal_web/commit/d04ab3907a184496538c6f9b342a8a3a36037d1f))
* **ui:** shade controller glyphs like lit spheres ([e925526](https://github.com/sorfeb/personal_web/commit/e925526d2ff7d3bd39ccb734b56085bb1669d6f6))
* **wmp:** add skin switching and install the cerulean skin ([1df836f](https://github.com/sorfeb/personal_web/commit/1df836f9498be43d30412386046216f0aa51d441))


### Bug Fixes

* **chat:** port Phase 2 to Prisma v7 ([59fc73a](https://github.com/sorfeb/personal_web/commit/59fc73a12d2ad6bbef909b8c654bc8873742c4cd))
* **db:** drop the chat_rooms migration from the baseline branch ([fdbf699](https://github.com/sorfeb/personal_web/commit/fdbf69974f0e57526662c0d93f04abe87f7f7532))
* **gamepad:** OR-merge restoreFocusOnPop across scope contributions ([a1e473a](https://github.com/sorfeb/personal_web/commit/a1e473a67b96b67c1ac94b3b2120b74468c36246))
* **ui:** make the selected tab read as raised, not recessed ([63ce676](https://github.com/sorfeb/personal_web/commit/63ce676b27f7e7978e2ffa31706e4d799c038b1b))


### Refactoring

* **design-system:** migrate SegmentedControl to ui/Tabs ([fb371b3](https://github.com/sorfeb/personal_web/commit/fb371b3f1cb2d076c9d2ffd8ccc6b6bdd23ce1e4))
* **page-layout:** export PAGE_SCOPE_ID ([7ae05e4](https://github.com/sorfeb/personal_web/commit/7ae05e45f5e573e45219abbf32933bbaf92229f6))
* **wmp:** interpret WMS skins generically instead of parsing headspace ([86fcc6c](https://github.com/sorfeb/personal_web/commit/86fcc6cfad429e44932d40e4146d88905b9d658d))

## [1.6.0](https://github.com/sorfeb/personal_web/compare/v1.5.1...v1.6.0) (2026-08-22)


### Features

* **games:** ship the real box art for DOOM, Wolfenstein 3D and Commander Keen ([1fb473d](https://github.com/sorfeb/personal_web/commit/1fb473d26736dd0dd139ea6ce13969483bb4931a))
* **ui:** contain game cover art over a blurred copy of itself ([1886806](https://github.com/sorfeb/personal_web/commit/188680665baf18bddd8dff58ec548cf1b5072653))

## [1.5.1](https://github.com/sorfeb/personal_web/compare/v1.5.0...v1.5.1) (2026-08-22)


### Bug Fixes

* **toast:** keep the badge and decorative layers inside the pill ([b89dfb5](https://github.com/sorfeb/personal_web/commit/b89dfb5baef8d8aada01676e9033ee0efc120827))
* **toast:** keep the badge and decorative layers inside the pill ([0d8b1e4](https://github.com/sorfeb/personal_web/commit/0d8b1e46c9ce90b5c5b1e6ec077f4875a7f9b475))

## [1.5.0](https://github.com/sorfeb/personal_web/compare/v1.4.1...v1.5.0) (2026-08-22)


### Features

* **games:** original cover art replaces the line-art icons on the games blade ([1a56f3c](https://github.com/sorfeb/personal_web/commit/1a56f3c152992dd2455237c540795f12d8622233))
* **ui:** game variant on XboxCard shows cover art with a bottom-aligned title ([e82cd79](https://github.com/sorfeb/personal_web/commit/e82cd794e1fd0e675c443b1fdbf0cfd7364c26aa))

## [1.4.1](https://github.com/sorfeb/personal_web/compare/v1.4.0...v1.4.1) (2026-08-22)


### Bug Fixes

* **wmp:** revive minimize/close, fix loading rectangle, render minimized state ([d26b269](https://github.com/sorfeb/personal_web/commit/d26b269bb25b58dfda9f89364571f4707d15ce2e))
* **wmp:** revive minimize/close, fix loading rectangle, render minimized state ([83aa795](https://github.com/sorfeb/personal_web/commit/83aa795f24f32018e19ba2a5c4c1924bf04691fb))


### Refactoring

* **recruiter-hint:** drop the pill, leave /card reachable by URL only ([bc8c91a](https://github.com/sorfeb/personal_web/commit/bc8c91ad8caa8d3b18ae2ee4a230a98f162af86e))
* **recruiter-hint:** move the recruiter shortcut into /profile as a chrome pill ([fb23cdb](https://github.com/sorfeb/personal_web/commit/fb23cdb5348999cbc0c2bcece7d5e6406a298854))
* **recruiter-hint:** remove the recruiter pill, leave /card reachable by URL only ([2ca3dfe](https://github.com/sorfeb/personal_web/commit/2ca3dfef474f3b50b54c43693e47add798daf6bd))

## [1.4.0](https://github.com/sorfeb/personal_web/compare/v1.3.0...v1.4.0) (2026-08-21)


### Features

* **games:** route-local volume pill with game badge ([2c9d000](https://github.com/sorfeb/personal_web/commit/2c9d0002608c595d47e5bf35e4e01a84a008ea01))
* **games:** route-local volume pill with game badge ([517830c](https://github.com/sorfeb/personal_web/commit/517830cb52186ce0aa67f058a26e1761c9519901))
* **my-playlists:** replicate the Xbox 360 Now Playing screen layout ([46ef765](https://github.com/sorfeb/personal_web/commit/46ef765198f3f9a6b3c665374d512139f7c2d682))
* **my-playlists:** replicate the Xbox 360 Now Playing screen layout ([d79dc10](https://github.com/sorfeb/personal_web/commit/d79dc1038fa12610e0fc0b9ee4e3cd44ac5bedab))
* **wmp:** curated three-playlist album for the YouTube engine (SOR-70) ([71126c0](https://github.com/sorfeb/personal_web/commit/71126c09a0a02b9f5d902da21177757676a1d94c))
* **wmp:** curated three-playlist album replaces placeholder tracks (SOR-70) ([2e580f2](https://github.com/sorfeb/personal_web/commit/2e580f21d24639c3cc78f82b0564b132165ec1ad))

## [1.3.0](https://github.com/sorfeb/personal_web/compare/v1.2.0...v1.3.0) (2026-08-19)


### Features

* **games:** DOS games blade — DOOM, Wolfenstein 3D and Commander Keen on a virtual CRT ([474bced](https://github.com/sorfeb/personal_web/commit/474bced0cb90d54659cf2c595000e2c6998623f0))
* **games:** Games blade with playable DOS shareware channels ([7bb41c7](https://github.com/sorfeb/personal_web/commit/7bb41c74a172f576ed0b76e96b20b3c352c373c8))
* **games:** self-hosted js-dos runtime and emulator embed page ([5175bd0](https://github.com/sorfeb/personal_web/commit/5175bd0a76a33eefa5b8714b9583a39617b140c4))
* **tv:** TVFrame — CRT television around arbitrary 4:3 content ([1833c9e](https://github.com/sorfeb/personal_web/commit/1833c9ed4ff08bc38de6e7940ceaa2bbdea7fa73))


### Bug Fixes

* **toast:** dock toasts near the bottom edge, let the container own layout ([90ef6d1](https://github.com/sorfeb/personal_web/commit/90ef6d1cf425a898bea7f2cf73eb5d48046c939b))
* **toast:** dock toasts near the bottom edge, let the container own layout ([4738bb1](https://github.com/sorfeb/personal_web/commit/4738bb1c75d70f1bdea6e095a13f8d1ffec7c176))

## [1.2.0](https://github.com/sorfeb/personal_web/compare/v1.1.0...v1.2.0) (2026-08-18)


### Features

* **achievements:** achievements list blade in the Guide (SOR-143) ([78e2ed4](https://github.com/sorfeb/personal_web/commit/78e2ed455e9bb04d8a77bc0e6463f8e27219c721))
* **achievements:** catalog, client unlock engine, guest localStorage (SOR-140) ([f7c124c](https://github.com/sorfeb/personal_web/commit/f7c124c36c3bcf0e9848170cfeff786ad0a73ff6))
* **achievements:** gamerscore system — guest progress, login merge, achievements blade (SOR-139) ([7a391fe](https://github.com/sorfeb/personal_web/commit/7a391fef7cc55db1606cf55426437b66e58a2d05))
* **achievements:** server persistence, login merge, signed-in write-through (SOR-141) ([bd74a80](https://github.com/sorfeb/personal_web/commit/bd74a80da7955b5cf7e43661c386915d6600502a))
* **achievements:** wire unlock triggers across the site (SOR-142) ([12fb129](https://github.com/sorfeb/personal_web/commit/12fb1295d8870def8f86be7da54896f77e235594))

## [1.1.0](https://github.com/sorfeb/personal_web/compare/v1.0.0...v1.1.0) (2026-08-16)


### Features

* **input:** keyboard-navigable dashboard and gamepad input layer ([29ffe0b](https://github.com/sorfeb/personal_web/commit/29ffe0b0881e6e4bf4845076489d82bf9d36fb60))

## [1.0.0](https://github.com/sorfeb/personal_web/compare/v0.1.0...v1.0.0) (2026-08-14)


### Features

* add Windows Media Player skin parser foundation ([df11af6](https://github.com/sorfeb/personal_web/commit/df11af6881bfb984739fdb09cf9999c1008a9a67))
* add WMP player React components and Music page integration ([b5acb05](https://github.com/sorfeb/personal_web/commit/b5acb059cb9dc5cb05be38d0f03310a5dbd4fafc))
* **api:** add audioRouter and self-hosted audio catalog ([23aeec8](https://github.com/sorfeb/personal_web/commit/23aeec8f7a496dba6c7868cb60a8566db1e41d9e))
* **api:** add getPlaylistTracks Spotify endpoint ([bce5d66](https://github.com/sorfeb/personal_web/commit/bce5d66333fcb13c9d38cf765f3b75a8a2896ef6))
* **api:** add Last.fm client and lastfm tRPC router (cached reads) ([dcbd869](https://github.com/sorfeb/personal_web/commit/dcbd869ce3b69c1c94fb08710a510f75f4d2ca45))
* **api:** register audioRouter in tRPC app router ([544fd84](https://github.com/sorfeb/personal_web/commit/544fd84fb610d2157c408e1add212308eaf3c8c9))
* **card:** add card-pilot route for the gamercard redesign ([10cb1c1](https://github.com/sorfeb/personal_web/commit/10cb1c1f47ca667392a69d4fd2faf9e447c78e64))
* **card:** add Gear section with device support status ([c5368ea](https://github.com/sorfeb/personal_web/commit/c5368eacfd98172dc15eb466c91ca3f04b1ca00f))
* **card:** add homepage resources to model concepts ([0f9283f](https://github.com/sorfeb/personal_web/commit/0f9283f458b6417cf58f317f5308fc0b73e51d33))
* **card:** add niche-interests Likes section ([6ef540d](https://github.com/sorfeb/personal_web/commit/6ef540d82a01414b66eb29f284ea0a885a3d915f))
* **card:** add rationale field to concepts ([a8a7b24](https://github.com/sorfeb/personal_web/commit/a8a7b24ad8490a403e26c02f302f9146e466556d))
* **card:** add recruiter-skim /card route with dashboard discovery hint ([6918539](https://github.com/sorfeb/personal_web/commit/6918539e030b5eab4a999a68761876494090e0fa))
* **card:** add superwhisper to gear ([64c508e](https://github.com/sorfeb/personal_web/commit/64c508e09c023f35b76b106cb06efb65023ea841))
* **card:** add VS Code and Warp to colophon ([8e7e974](https://github.com/sorfeb/personal_web/commit/8e7e974827cbb5f3d90fb24919f6e17fe6c63ee7))
* **card:** link colophon models to version-specific model cards ([ddc0dde](https://github.com/sorfeb/personal_web/commit/ddc0ddecbd8c7364884652e4dc2c45002bbc1c49))
* **card:** link the colophon through to the release history page ([a9e2744](https://github.com/sorfeb/personal_web/commit/a9e2744b5e79b422287733e71d82d99df02964f2))
* **card:** link the colophon through to the release history page ([03edde6](https://github.com/sorfeb/personal_web/commit/03edde62882401799b190fe85a2b6a82c2077988))
* **card:** promote Gamercard to /card with concept-graph About pane ([de41929](https://github.com/sorfeb/personal_web/commit/de419291bac5eacbb12952fa32ba3080a2654122))
* **card:** surface concept graph on the business card ([ab55bf2](https://github.com/sorfeb/personal_web/commit/ab55bf2a763256f9ef4031751ef4ac8539f1fcb3))
* **card:** Xbox 360 Profile-screen gamercard pilot route ([d0c15de](https://github.com/sorfeb/personal_web/commit/d0c15dea825b6dfdaf1ede5fb2e3802272bf1e59))
* concept graph — wikilink passages, chips, and backlink popovers on /card ([8d18711](https://github.com/sorfeb/personal_web/commit/8d187118785f3c728732a13ddea875bfe0b6f5ec))
* **dashboard:** add Music card to home cards list ([756d3a3](https://github.com/sorfeb/personal_web/commit/756d3a3120c989027d805f7233b3101f0a02f8f0))
* **data:** add gamercard content source and vCard builder ([b5f84a0](https://github.com/sorfeb/personal_web/commit/b5f84a0fd07966f63fe6ff35e4bbc498dbea6429))
* **data:** add OKF-aligned concept registry with wikilink parsing ([2d0a62e](https://github.com/sorfeb/personal_web/commit/2d0a62e8860fb6b87c29bee7dcdf1fdc6d750d59))
* **db:** add LastfmTrack cache model for music vibe-map enrichment ([274525f](https://github.com/sorfeb/personal_web/commit/274525f184f245084cd048cd1f9b9b396d452731))
* **design-system:** stylelint token enforcement + shared Button primitive ([a4f9f3b](https://github.com/sorfeb/personal_web/commit/a4f9f3b827033cf81a98c67d511a80a1364c1206))
* **design-system:** token enforcement via stylelint + shared Button primitive ([42e35c7](https://github.com/sorfeb/personal_web/commit/42e35c7892f1b07233004558eccb8d97dd4acb82))
* **engine:** add SpotifyEmbed playback engine for Spotify integration ([245255f](https://github.com/sorfeb/personal_web/commit/245255f106580b096d1d82939e8b9b972e5e6223))
* Gear, colophon apps, model cards, and concept rationale ([c0f10be](https://github.com/sorfeb/personal_web/commit/c0f10beb123f31fd486da4fdecc9b78ab1f1667c))
* **hooks:** add no-useeffect replacement hooks + lint scanner ([3f889e7](https://github.com/sorfeb/personal_web/commit/3f889e79336399e4581c1ee93c856bd62b2948eb))
* **hooks:** add useScrollSpy for section tracking ([8f0bc0d](https://github.com/sorfeb/personal_web/commit/8f0bc0df2151a6a7a55589ea76c170d1200c3b88))
* implement global floating WMP player ([a5d7037](https://github.com/sorfeb/personal_web/commit/a5d7037e431f0e4c5a25eda84c1ccd56429fbece))
* **lastfm:** backend scaffold for music vibe-map enrichment (SOR-28) ([a6e7bb1](https://github.com/sorfeb/personal_web/commit/a6e7bb133af8f61b7776d35fd234a996b2b22d1a))
* migrate from Stack Auth to Better Auth ([252f8ac](https://github.com/sorfeb/personal_web/commit/252f8ac01f37a24eca1e3165c8e6c3f7b2022ac4))
* **music:** integrate real Spotify tracks with WMP player ([844db15](https://github.com/sorfeb/personal_web/commit/844db1536b15c0271acf70c616e4785c470777e6))
* niche-interests Likes section on /card ([4985348](https://github.com/sorfeb/personal_web/commit/49853487ced0b80ce41d86f860795b22295b7257))
* **pages:** integrate multi-source WMP player into music pages ([6dfe1d3](https://github.com/sorfeb/personal_web/commit/6dfe1d3f837e4f6ad7c75eae912e144f1060c9c7))
* **playlists:** add interactive playlist selection with WMP integration ([074c560](https://github.com/sorfeb/personal_web/commit/074c560582ea2694df95902c5ef249b36919522c))
* promote Gamercard to /card with concept-graph About pane ([a5562c9](https://github.com/sorfeb/personal_web/commit/a5562c91cd5d724aed6f6e1113942bdd7bf0221f))
* **release:** automate semantic versioning with 360-styled changelog page ([e235044](https://github.com/sorfeb/personal_web/commit/e2350442f39ffe6b4ed1b2b5c747a437e315a5be))
* **release:** semantic versioning + Xbox 360 system-update changelog page ([be9c6a7](https://github.com/sorfeb/personal_web/commit/be9c6a76dceaaa97f55b1881b6839881701a406f))
* **scripts:** add Last.fm enrichment CLI ([566a346](https://github.com/sorfeb/personal_web/commit/566a3465e0fdbc74e93a12a88b134e483fb1d75d))
* **seo:** add page-level metadata to all 17 routes ([448bc0b](https://github.com/sorfeb/personal_web/commit/448bc0ba82ec5b5efd02ba2fb617dd4f629e7c34))
* **seo:** migrate root layout to Next.js Metadata API ([64439c4](https://github.com/sorfeb/personal_web/commit/64439c4b3b5a348e222ca431ded2af341fb672f0))
* **state:** update WMPPlayerContext and useWMPPlayer for new Track types ([33a4369](https://github.com/sorfeb/personal_web/commit/33a43690c83c17fa2b3d438cf6422bf8bd3e7319))
* **types:** refactor Track into discriminated union for multi-source playback ([b90102e](https://github.com/sorfeb/personal_web/commit/b90102e8b569cb776bdbcabfbb448e4937038a5f))
* **ui:** add concept graph components with shared popover ([24f92ca](https://github.com/sorfeb/personal_web/commit/24f92cae69b9a0e63fc144b6a5d63be96c9e5aea))
* **ui:** add GamerCard Xbox 360 profile-screen components ([6531a1b](https://github.com/sorfeb/personal_web/commit/6531a1b7427ad05c29485f898877432cfd156e5b))
* **ui:** update WMP player components for multi-source playback ([280e26f](https://github.com/sorfeb/personal_web/commit/280e26f7c42c9aab77534638349a54f549fdce7c))
* **wmp:** add playlist drawer and harden control wiring ([df25f55](https://github.com/sorfeb/personal_web/commit/df25f5591e7edb196582931a8265817c003f2701))
* **wmp:** add WMPGuideButton to dashboard header ([116590b](https://github.com/sorfeb/personal_web/commit/116590b4bec70e8000cb203d61e32a663a9a2da3))
* **wmp:** add YouTube engine for full-length playback in WMP skin ([b84714e](https://github.com/sorfeb/personal_web/commit/b84714e9463b76ac8ad2cfb5f8d53c8e7ba1923c))
* **wmp:** full-length YouTube playback in the WMP skin (SOR-70) ([b2aa777](https://github.com/sorfeb/personal_web/commit/b2aa7776f45250f8f6ba9d453abdba2da46236ff))


### Bug Fixes

* apply transparency to remove magenta and red backgrounds ([afa8e53](https://github.com/sorfeb/personal_web/commit/afa8e534d2f37659a051035b789a6b240f7036e0))
* **auth:** trust production origins for better-auth ([c2dff78](https://github.com/sorfeb/personal_web/commit/c2dff78050ba0bce10933a928ce1d7640e9f8200))
* **auth:** trust production origins for better-auth ([3c3de0a](https://github.com/sorfeb/personal_web/commit/3c3de0a014216532be7f60483670dcd2c272d7c8))
* **build:** commit .npmrc so Vercel installs with legacy-peer-deps ([965b944](https://github.com/sorfeb/personal_web/commit/965b94493e3d221061698360013ecac9e2cc923b))
* **build:** commit .npmrc so Vercel installs with legacy-peer-deps ([cbdc098](https://github.com/sorfeb/personal_web/commit/cbdc0981f9c9f9e7654f22c27d48c1aecebb2385))
* **card:** drop Red Wing placeholder from likes ([a96f468](https://github.com/sorfeb/personal_web/commit/a96f468ef0de5cff003d865a047121f8420c8262))
* **card:** mobile scrolling + selection guards on gamercard chrome ([4bb15cb](https://github.com/sorfeb/personal_web/commit/4bb15cb7ae7d175ea3483157fa85902143040602))
* **deps:** remove ajv override that broke ESLint ([ffe6f63](https://github.com/sorfeb/personal_web/commit/ffe6f630e184afefb9f22151a46e4cd93e247d5f))
* handle WMP bindings in slider min/max values ([3a49990](https://github.com/sorfeb/personal_web/commit/3a49990db5e91dabfa7e734369d4e745da5c244c))
* hide invisible text elements and translate WMP bindings ([8c5a7a4](https://github.com/sorfeb/personal_web/commit/8c5a7a401a9bc097a956e83cb2a27b5033d25a89))
* **lint:** resolve errors surfaced by the revived ESLint ([68a1186](https://github.com/sorfeb/personal_web/commit/68a11867e44672330390e698296f58fd109a1d95))
* load image dimensions to properly size elements ([473cd11](https://github.com/sorfeb/personal_web/commit/473cd113084d76d50e01a400b4ce5632cdb0a81f))
* revive ESLint and fix home-page prerender — production builds pass again ([fa1fcb6](https://github.com/sorfeb/personal_web/commit/fa1fcb6c6209f47b83eb0086758b1f4111f711fd))
* use useVolume hook instead of VolumeContext ([e8853a1](https://github.com/sorfeb/personal_web/commit/e8853a1bc9d1eaea1818125ef409a1a2c3cb281b))


### Performance

* **images:** optimize ~4MB of static assets and migrate to next/image ([0259858](https://github.com/sorfeb/personal_web/commit/02598586d21f7e4c29a0ca87b5ddd899caa5da33))
* **images:** optimize ~4MB of static assets and migrate to next/image ([9c43077](https://github.com/sorfeb/personal_web/commit/9c430777f32147399d94ca60764116a751b7f296))


### Refactoring

* **api:** simplify Spotify router for new multi-source architecture ([25a2d29](https://github.com/sorfeb/personal_web/commit/25a2d2964db0a0392498b71b4a352250c66d4b76))
* **ui:** block image dragging at the root instead of per image ([8c46c8e](https://github.com/sorfeb/personal_web/commit/8c46c8ed020a5cecc4e20c05f2c075447c20bdcf))
* **useeffect:** adopt no-useeffect skill across the codebase ([83f5756](https://github.com/sorfeb/personal_web/commit/83f57569e35cdb9fd8c63cd944b700ae1ad4db53))
* **useeffect:** migrate all component/page/context useEffect calls ([cf2b30e](https://github.com/sorfeb/personal_web/commit/cf2b30e017b2f2cfad0d2b7618e5587871dc8e40))


### Styling

* **card:** contain overscroll in gamercard scroll containers ([56a44d0](https://github.com/sorfeb/personal_web/commit/56a44d062a50810f34eabb1b7ae963434f0835f8))
* **ui:** add app-shell interaction guards ([8b0e3ab](https://github.com/sorfeb/personal_web/commit/8b0e3ab747ec381e6f148a023a1ca35c17b51eb8))
* **ui:** app-shell scroll, selection and UA polish ([9beda85](https://github.com/sorfeb/personal_web/commit/9beda85e3c3bb15c9bebaca070d5d94fa67d7b91))
* **ui:** app-shell scroll, selection and UA polish ([8e9b549](https://github.com/sorfeb/personal_web/commit/8e9b549494a0915e56dbe61aa5aabd431fc9eddb))
* **ui:** interaction guards + gamercard mobile scroll fix ([2809ef5](https://github.com/sorfeb/personal_web/commit/2809ef5569061ef01d9a1df82a114e78ad6c78e1))

## Changelog

All notable changes to this site are documented here. Versions follow
[Semantic Versioning](https://semver.org) and entries are generated from
Conventional Commits by [release-please](https://github.com/googleapis/release-please).
