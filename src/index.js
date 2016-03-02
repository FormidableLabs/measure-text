/* eslint-env browser */
import units from "units-css";

const DEFAULT_CANVAS = document.createElement("canvas");
const DEFAULT_FONT_WEIGHT = 400;
const DEFAULT_FONT_STYLE = "normal";

const measureHeight = (size, lineHeight) => {
  // If the line-height is unitless,
  // multiply it by the font size.
  if (!lineHeight.unit) {
    return units.parse(
      `${size.value * lineHeight.value}${size.unit}`
    );
  }

  // units-css requires the user to provide
  // DOM nodes for these units. We don't want
  // to pollute our API with that for the time being.
  const unitBlacklist = ["%", "ch", "cm", "em", "ex"];
  if (unitBlacklist.indexOf(lineHeight.unit) !== -1) { // eslint-disable-line no-magic-numbers
    throw new Error(
      `We do not currently support the unit ${lineHeight.unit}
      from the provided line-height ${lineHeight.value}.
      Unsupported units include ${unitBlacklist.join(", ")}.`
    );
  }

  // Otherwise, the height is equivalent
  // to the provided line height.
  // Non-px units need conversion.
  if (lineHeight.unit === "px") {
    return lineHeight;
  }
  return units.parse(
    units.convert(lineHeight, "px")
  );
};

const measureText = ({
  text,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight = DEFAULT_FONT_WEIGHT,
  fontStyle = DEFAULT_FONT_STYLE,
  canvas = DEFAULT_CANVAS
}) => {
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontWeight} ${fontStyle} ${fontSize} ${fontFamily}`;

  const measure = (line) => {
    return {
      text: line,
      width: units.parse(`${ctx.measureText(line).width}px`),
      height: measureHeight(
        units.parse(fontSize),
        units.parse(lineHeight)
      )
    };
  };

  // If multiline, measure the bounds
  // of all of the lines combined
  if (Array.isArray(text)) {
    return text
      .map(measure)
      .reduce((prev, curr) => {
        const width = curr.width.value > prev.width.value
          ? curr.width : prev.width;
        const height = units.parse(
          `${prev.height.value + curr.height.value}${curr.height.unit}`
        );
        const longest = curr.text.length > prev.text.length
          ? curr.text : prev.text;
        return { width, height, text: longest };
      });
  }

  return measure(text);
};

export default measureText;
