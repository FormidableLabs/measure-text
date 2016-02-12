/* eslint-env browser */
// import memoize from "lodash.memoize";
import isFinite from "lodash.isFinite";

const globalCanvas = document.createElement("canvas");

const isNumericOnly = (string) => /^[0-9.,]+$/.test(string);

const parseUnitless = (value) => {
  if (isFinite(value)) {
    return value;
  }
  if (isNumericOnly(value)) {

    return parseFloat(value);
  }
  return null;
};

const parseUnit = (value) => {
  // http://stackoverflow.com/questions/2868947/split1px-into-1px-1-px-in-javascript
  const matches = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const [, number, unit] = matches;
  return { number: parseFloat(number), unit };
};

const calculateHeight = (size, lineHeight) => {
  const {
    number: sizeNumber,
    unit: sizeUnit
  } = parseUnit(size);

  // If the line-height is unitless,
  // multiply it by the font size.
  const unitless = parseUnitless(lineHeight);
  if (unitless) {
    return `${sizeNumber * unitless}${sizeUnit}`;
  }

  // Otherwise, it's as simple as
  // returning the line height.
  return lineHeight;
};

const measureText = ({
  text,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight = 400,
  fontStyle = "normal",
  canvas: userCanvas
}) => {
  const canvas = userCanvas ? userCanvas : globalCanvas;
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontWeight} ${fontStyle} ${fontSize} ${fontFamily}`;

  const measure = (line) => {
    return {
      width: ctx.measureText(line).width,
      height: calculateHeight(fontSize, lineHeight)
    };
  };

  return Array.isArray(text)
    ? text.map(measure)
    : measure(text);
};

export default measureText;
