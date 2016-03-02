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

describe("measure-text", () => {
  it(`should measure a single line of text provided a
      px font size and a unitless line height`, () => {
    const measurement = measureText({
      text: "The quick brown fox jumps over the lazy dog",
      fontFamily: "Helvetica Neue",
      fontSize: "24px",
      lineHeight: "1.2",
      fontWeight: 400,
      fontStyle: "normal",
      canvas: new MockCanvas()
    });

    expect(measurement).to.have.deep.property("width.value", 42);
    expect(measurement).to.have.deep.property("height.value", 24 * 1.2);
    expect(measurement).to.have.deep.property("width.unit", "px");
    expect(measurement).to.have.deep.property("height.unit", "px");
  });

  it(`should measure multiline text provided a
      px font size and a unitless line height`, () => {
    const measurement = measureText({
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
    expect(measurement).to.have.deep.property("width.value", 42);
    expect(measurement).to.have.deep.property("height.value", (24 * 1.2) * 3);
    expect(measurement).to.have.deep.property("width.unit", "px");
    expect(measurement).to.have.deep.property("height.unit", "px");
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

    expect(measurement).to.have.deep.property("height.value", 2 * 1.3);
    expect(measurement).to.have.deep.property("height.unit", "em");
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

    expect(measurement).to.have.deep.property("height.value", 40);
    expect(measurement).to.have.deep.property("height.unit", "px");
  });
});
