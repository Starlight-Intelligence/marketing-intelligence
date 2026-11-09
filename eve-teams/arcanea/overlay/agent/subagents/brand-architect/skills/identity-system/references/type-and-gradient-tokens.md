# Token formats

## Type

```text
type.<role>      family, weight, size (rem), line height, tracking, case
```

Roles are functional (display, heading, body, caption, label, numeral), never named after a single page.

## Gradients

```text
gradient.<name>
  stop.<stop-name>   color token, position (%), role
  angle            degrees, or the path for a mesh gradient
  motion           which stops move, range, duration (s), easing, loop or once
  reduced-motion   the still frame shown when motion is off
  surfaces         where the gradient is allowed: background, glass fill, type, stroke
```

Rules for every gradient:

- Every stop has a name and a role. A stop with no role is decoration and gets cut.
- Motion is slow enough to read as light moving, not as an animation playing: state the duration.
- The reduced-motion frame is designed, not whatever frame the loop stops on.
- Type sits on a gradient only where contrast holds across the full motion range. State the worst-case contrast.

Color values come from the brand context. When it doesn't hold them, the spec lists the token names and marks the values as missing.
