# measure-text
An efficient text measurement function for the browser.

## API

```es6
const measurement = measureText({
  text: "The quick brown fox jumps over the lazy dog",
  fontFamily: "Georgia",
  fontSize: "2em",
  lineHeight: 1.3,
  fontWeight: 700,
  fontStyle: "italic"
});
```

`measureText` accepts the following parameter object:
- `text: string|Array<string>` the text to measure. Measures multiline text if provided an array.
- `fontFamily: string` the font family of the text.
- `fontSize: string` the size of the font. All CSS units work here.
- `lineHeight: string|number` the line height of the text. `measureText` assumes the `lineHeight` to be a unitless CSS value if provided either a number or a string with no unit. Any other string acts as a CSS value.
  - The following units are not supported: "%", "ch", "cm", "em", "ex"
- `fontWeight: string|number` the weight of the text. Accepts numeric and textual weights.
- `fontStyle: string` the style of the font.
- `canvas: HTMLCanvasElement` a canvas instance to use instead of the default global canvas.
