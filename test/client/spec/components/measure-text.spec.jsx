// Help PhantomJS out
require("babel-polyfill");

import measureText from "../../../../src/index";

class MockCtx {
  measureText() {
    return { width: 42 };
  }
}

class MockCanvas {
  getContext() {
    return new MockCtx();
  }
}

describe("components/measure-text", () => {
  it("should measure a single line of text", () => {
    const measurement = measureText({
      text: "The quick brown fox jumps over the lazy dog",
      fontFamily: "Helvetica Neue",
      fontSize: "24px",
      lineHeight: "1.2",
      fontWeight: 400,
      fontStyle: "normal",
      canvas: new MockCanvas()
    });
    expect(measurement).to.have.deep.property("width", "42px");
    expect(measurement).to.have.deep.property("height", `${24 * 1.2}px`);
  });

  it("should measure all lines of text in an array", () => {
    const measurements = measureText({
      text: [
        "The quick brown fox jumps over the lazy dog",
        "The lazy fox jumps over the quick brown dog",
        "The dog jumps over the quick, lazy brown fox"
      ],
      fontFamily: "Helvetica Neue",
      fontSize: "24px",
      lineHeight: "1.2",
      fontWeight: "bold",
      fontStyle: "italic",
      canvas: new MockCanvas()
    });

    measurements.forEach((measurement) => {
      expect(measurement).to.have.deep.property("width", "42px");
      expect(measurement).to.have.deep.property("height", `${24 * 1.2}px`);
    });
  });

  it(`should calculate height when provided a
      px font size and a unitless line height`, () => {
    const measurements = measureText({
      text: [
        "The quick brown fox jumps over the lazy dog",
        "The lazy fox jumps over the quick brown dog",
        "The dog jumps over the quick, lazy brown fox"
      ],
      fontFamily: "Helvetica Neue",
      fontSize: "16px",
      lineHeight: "1.45",
      fontWeight: "300",
      fontStyle: "normal",
      canvas: new MockCanvas()
    });

    measurements.forEach((measurement) => {
      expect(measurement).to.have.deep.property("height", `${16 * 1.45}px`);
    });
  });

  it(`should calculate height when provided a
      em font size and a unitless line height`, () => {
    const measurement = measureText({
      text: "The quick brown fox jumps over the lazy dog",
      fontFamily: "Georgia",
      fontSize: "2em",
      lineHeight: 1.3,
      fontWeight: 700,
      fontStyle: "italic",
      canvas: new MockCanvas()
    });

    expect(measurement).to.have.deep.property("height", `${2 * 1.3}em`);
  });

  it(`should calculate height when provided a
      line height with units`, () => {
    const measurement = measureText({
      text: "The quick brown fox jumps over the lazy dog",
      fontFamily: "Georgia",
      fontSize: "30px",
      lineHeight: "40px",
      fontWeight: 400,
      fontStyle: "normal",
      canvas: new MockCanvas()
    });

    expect(measurement).to.have.deep.property("height", "40px");
  });
});
