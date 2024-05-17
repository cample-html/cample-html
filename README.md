<p align="center">
    <a href="https://www.npmjs.com/package/cample-html">
        <img width="200" height="200" src="https://github.com/Camplejs/media/blob/main/logo_transparent.png" alt="cample" >
    </a>
</p>
<h1 align="center">cample-html - work with server-side HTML with ease</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/cample-html?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/cample-html)
[![discussions](https://img.shields.io/badge/discussions-0183ff?style=for-the-badge&logo=github&labelColor=555555)](https://github.com/cample-html/cample-html/discussions)
[![license](https://img.shields.io/badge/MIT-0183ff?style=for-the-badge&label=license&logoColor=FFF&labelColor=555555)](https://github.com/cample-html/cample-html/blob/master/LICENSE)

</div>

<div align="center"><a href="https://cample-html.github.io">Website</a> • <a href="https://cample-html.github.io/#/?id=template">Documentation</a>
</div>

## About

cample-html is a small library for working with server-side html. It is based on requests sent to the server via XMLHttpRequest and processed into ready-made HTML.

## Example #1

### HTML before

```html
<div>
  <template
    data-cample
    data-src="/api/test"
    data-method="get"
  ></template>
</div>

<script src="https://unpkg.com/cample-html@0.0.2"></script>
```

### Server route - /api/test

```html
<div>123</div>
```

### HTML after

```html
<div>
  <div>123</div>
</div>

<script src="https://unpkg.com/cample-html@0.0.2"></script>
```

## Example #2

```javascript
const templateFn = CampleHTML.createTemplate(
  `<template data-cample data-src="/api/test" data-method="get"></template>`
);

// (After the response arrives from the server) { element = template (HTMLTemplateElement type), status = 200 }
const elementObj = templateFn({ withCredentials:false, timeout:0 });
```

## Installation

Install via NPM:

```bash
npm i cample-html
```

Along the path `node-modules/cample-html/dist` you can find two files that contain a regular js file and a minified one.

## Changelog

[Changelog](https://github.com/cample-html/cample-html/releases)

## Inspiration

If you like cample-html, it will be very cool if you rate the repository with a star ★

## Contact

Email - camplejs@gmail.com

## License

[Licensed under MIT](https://github.com/cample-html/cample-html/blob/master/LICENSE)
