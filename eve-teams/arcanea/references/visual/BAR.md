# Visual quality bar

Status: PARTIAL. Written 2026-10-21. The research run could open only three hosts (developer.apple.com, anthropic.com, github.com). Every studio, brand and video site tried failed to resolve. Only the liquid-glass surface and part of the logo and gradient surfaces are fully backed by opened pages. The other slots are marked OPEN and must be filled by a run with wider network access. No reference below is listed unless it was opened with WebFetch on 2026-10-21. Nothing here reproduces canon, images or long quotes; it is links and analysis only.

## How the team uses this file

1. Take the draft asset and name which of the six surfaces it belongs to: logo mark, liquid-glass UI, gradient system, character turnaround, key art, trailer frame.
2. Open that surface's section and name the three references the draft is being judged against. If a slot is marked OPEN, do not substitute from memory; fill it first.
3. State the one dimension the draft must beat, run the one-line test, and record pass or fail with the measured number.
4. A draft ships only if it passes its surface test and does not obviously lose to any of the three references on first impression.

## 1. Logo mark

Verified references (1 of 3):

1. Apple App Icon guidance, Human Interface Guidelines. Apple. URL: https://developer.apple.com/design/human-interface-guidelines/app-icons (opened 2026-10-21 through Apple's data feed of the same page: https://developer.apple.com/tutorials/data/design/human-interface-guidelines/app-icons.json). Change log shows a June 8, 2026 refinement of Liquid Glass guidance. Analysis: it demands one core idea in few shapes, filled overlapping forms instead of outlines, no thin lines or sharp corners, and consistency across default, dark, clear and tinted appearances. That is a usable minimum bar for a mark that must survive tiny sizes and system-applied effects.
2. OPEN. Needs a strong current official brand guideline page or case study.
3. OPEN.

Dimension to beat: silhouette read at 64 px and 32 px in one flat color.
Test: render the mark as a solid single-color shape at 64 px and 32 px on both a light and a dark field, show it to five people for two seconds each, and require that at least four can draw its basic shape from memory.

## 2. Liquid-glass UI

Verified references (3 of 3, all Apple, all opened 2026-10-21):

1. Materials, Human Interface Guidelines. Apple. URL: https://developer.apple.com/design/human-interface-guidelines/materials (opened through the data feed https://developer.apple.com/tutorials/data/design/human-interface-guidelines/materials.json). Date on page: change log lists June 9, 2025 (guidance added) and September 9, 2025 (guidance updated, the latest entry); footer copyright reads 2026. Analysis: it defines glass as a functional layer for controls and navigation that floats above content, and it keeps the content layer on standard materials. It is the cleanest statement of where glass belongs and where it does not.
2. Adopting Liquid Glass, Technology Overviews. Apple. URL: https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass (opened through https://developer.apple.com/tutorials/data/documentation/technologyoverviews/adopting-liquid-glass.json). No release date on the page; the only date is a 2026 copyright line. Analysis: it is the implementation checklist and shows restraint as a rule, including removing custom backgrounds behind bars and testing with system accessibility settings.
3. Meet Liquid Glass, WWDC25 session 219. Apple Human Interface design team. URL: https://developer.apple.com/videos/play/wwdc2025/219/ (opened 2026-10-21). The page gives no exact date beyond the WWDC 2025 label. Analysis: it explains the dynamics, adaptivity and variant rules in the designers' own order, and is the best source for why the rules exist.

Current Apple rules read on those pages, paraphrased:

- Glass belongs to the navigation and controls layer. Do not put it in the content layer. The one exception is transient controls such as sliders and toggles, which may take a glass look only while being touched.
- Use it sparingly. On custom controls, reserve it for the most important functional elements, because overuse pulls attention from content.
- Do not stack glass on glass. Elements on top of glass should use fills, transparency and vibrancy so they read as part of the material.
- The regular variant blurs and adjusts luminosity behind it for legibility, works at any size over any content, and suits text-heavy pieces such as alerts, sidebars and popovers.
- The clear variant is highly translucent, has no adaptive behavior, and is for visually rich backgrounds such as photo and video. Do not mix the two variants. Apple suggests a dark dimming layer at 35 percent opacity when the content beneath is bright, and none when it is already dark or uses system media controls that dim.
- Glass has no color of its own and takes color from what is behind it. Tint only the primary action, put the color on the background rather than the glyph, and never tint several controls at once.
- Scroll edge effects, a soft fade or a harder style for pinned headers, keep content legible as it passes under glass.
- Keep resting-state content from intersecting glass at load, use concentric corner shapes, and register custom bars so scrolling content stays legible.
- Appearance changes with system settings, including reduced transparency and increased contrast, so custom colors need light, dark and increased-contrast variants. Hard-coded layout metrics should be avoided.
- Wrap multiple custom glass effects in a shared container for rendering performance, and profile on each platform.

Supporting page also opened: Color, Human Interface Guidelines, https://developer.apple.com/design/human-interface-guidelines/color (change log latest entry December 16, 2025, updated Liquid Glass guidance). It gives the tint and color rules above and offers qualitative contrast advice only, no numeric ratios.

Dimension to beat: text and glyph contrast on blurred, busy backgrounds with Reduce Transparency both off and on.
Test: place the worst-case bright and dark background crops behind each glass element, measure label contrast with a checker, and require at least 4.5 to 1 for body text and 3 to 1 for large text or glyphs in all four states (light, dark, reduced transparency, increased contrast).

## 3. Gradient system

Verified references (1 of 3 usable; 1 reused page):

1. Color, Human Interface Guidelines. Apple. URL: https://developer.apple.com/design/human-interface-guidelines/color (opened 2026-10-21 through https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color.json). Latest change log entry December 16, 2025. Analysis: it carries no gradient recipe, but its color management note warns that wide-gamut gradients can clip on standard displays and asks for fallback variants. That makes gamut safety a legitimate bar for any gradient system.
2. App Icon guidance, same page as logo reference 1 (reused, not a new page). Analysis: it allows gradient or solid backgrounds, requires full-bleed opaque backgrounds, and sends mesh gradients as raster PNG, which is a practical production rule.
3. OPEN. Needs an official brand guideline page with a documented gradient system.

Dimension to beat: gradient banding and gamut clipping.
Test: export each gradient at 8-bit sRGB and at Display P3, view both on a standard display at full size, and require zero visible banding steps and no hue shift between the two exports greater than a just-noticeable difference.

## 4. Character turnaround

Verified references (0 of 3). OPEN, OPEN, OPEN. No studio or publisher host could be opened, so none of the required official AAA or anime sheets (Riot, Capcom, Trigger, ufotable, Hoyoverse, Sony, Blizzard, Wit, MAPPA) is claimed here. The team must not substitute fan or portfolio sheets.

Dimension to beat: on-model consistency across views and silhouette distinctness.
Test: overlay front, side and back views at matched scale and check that landmarks (eye line, shoulder, waist, hem, hand height) agree within 2 percent of figure height, then fill all three views solid black and confirm the character is identifiable against the cast.

## 5. Key art

Verified references (0 of 3). OPEN, OPEN, OPEN. Candidates must be current official posters or key visuals from studio or publisher pages and opened first.

Dimension to beat: focal hierarchy at thumbnail scale.
Test: shrink the piece to 200 px wide, blur it lightly, and confirm that the character's face or main silhouette is still the highest-contrast area and the title lockup stays legible.

## 6. Trailer frame

Verified references (0 of 3). OPEN, OPEN, OPEN. Candidates must be official trailers on studio channels, opened first.

Dimension to beat: single-frame legibility with and without sound.
Test: pull five random stills from the cut, show each for one second to a viewer who has not seen the piece, and require that at least four of five let them name the subject and the mood.

## References I could not open

Hosts that failed to resolve or were blocked on 2026-10-21 (attempted, not verified, so not used as references):

- Riot Games and League of Legends: riotgames.com, www.riotgames.com, www.leagueoflegends.com, nexus.leagueoflegends.com, www.artstation.com/riotgames, x.com/riotgames.
- Studio Trigger: www.st-trigger.co.jp. ufotable: ufotable.com.
- Hoyoverse: genshin.hoyoverse.com, www.hoyoverse.com.
- Blizzard: www.blizzard.com. Capcom: www.capcom-games.com. Sony: www.playstation.com.
- Brand and design case studies: www.underconsideration.com (Brand New), www.pentagram.com, brand.linear.app, linear.app/brand, brand.github.com (github.com/logos redirected to it and the redirect target did not resolve), www.behance.net, dribbble.com, medium.com.
- Video and press: www.youtube.com, youtube.com, vimeo.com, www.crunchyroll.com, www.animenewsnetwork.com.
- General: en.wikipedia.org, www.apple.com newsroom, web.archive.org, www.reddit.com, developer.mozilla.org.

Web search found no official model sheets from any of the named studios, so there are no search-only candidates either. Next step: rerun surfaces 1, 3, 4, 5 and 6 from an environment that can reach the open web, and update this file with opened URLs only.
