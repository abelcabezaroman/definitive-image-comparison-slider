# Dics: Definitive Image Comparison Slider

<a href="http://codictados.com"><img
src="http://codictados.com/wp-content/uploads/2015/07/logo263x781.png"
alt="Codictados"></a>

Made by Abel Cabeza Román, a Codictados developer.

## Description

Light Vanilla Javascript library to compare multiples images with
sliders. Also, you can add text and filters to your images.

## Installation

Download the library.

```bash
npm i definite-image-comparison-slider
```

And import it to your project.

```html
<link rel="stylesheet" href="../lib/src/dics.css">
<script src="src/original/dics.original.js"></script>
```

## Usage

You only have to create a container and add your images. You can add all
images you want!! If you add the `alt` attribute, you will view the text
in the image comparison.

```html
<div data-function="b-dics">
    <img src="01.jpg">
    <img src="02.jpg" alt="Japan Yellow">
    <img src="03.jpg" alt="Japan Orange">
    <img src="04.jpg" alt="Japan Black & White">
</div>
```

Finally, you need to initialize the component like this.

```javascript
new Dics({
    container: document.querySelector('[data-function="b-dics"]')
});
```

## Options

If you want you can include different options.

| Option | Description | Example |
| --- | --- | --- |
| container | **REQUIRED**: HTML container | `document.querySelector('[data-function="b-dics"]')` |
| filters | Array of CSS string filters  |`['blur(3px)', 'grayscale(1)', 'sepia(1)', 'saturate(3)']` |
| hideTexts | Hide All texts, even if you add the alt attribute |`true`,`false`|
| textPosition | Set the prefer text position  |`'center'`,`'top'`, `'right'`, `'bottom'`, `'left'` |
| linesOrientation | Orientation fo lines  |`'horizontal'`,`'vertical'` |
| rotate | Rotate the image container (not too useful but it's a beatiful effect. String of rotate CSS rule)  |`'45deg'`|


## Contributing
Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.