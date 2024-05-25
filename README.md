<h1>THIS PACKAGE IS NOW [hmpl](https://github.com/hmpljs/hmpl)</h1>
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
<br/>

> As of version 0.0.4, the package switches to a `fetch` function!

## About

cample-html is a small library for working with server-side html. It is based on requests sent to the server via fetch and processed into ready-made HTML.

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

<script src="https://unpkg.com/cample-html@0.0.4"></script>
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

<script src="https://unpkg.com/cample-html@0.0.4"></script>
```

## Example #2

```javascript
const templateFn = CampleHTML.createTemplate(
  `<template data-cample data-src="/api/test" data-method="get"></template>`
);

// (After the response arrives from the server) { element = template (HTMLTemplateElement type), status = 200 }
const elementObj = templateFn({
  credentials: "same-origin",
  get: (prop, value) => {
    if (prop === "element") {
      console.log(value);
    }
  },
});
```

### Why cample-html?

cample-html is easy to use and effective in practice. You can literally download reusable HTML from the server in just a couple of clicks, which will reduce a huge amount of code and also simplify the creation of the user interface. Also, this product is open-source under the [MIT license](https://github.com/cample-html/cample-html/blob/master/LICENSE), which allows it to be used for commercial purposes.

Here are a few small advantages that the module has:

- Light weight
- Ability to work with template mounting directly via js
- Request Status Update
- Fairly safe HTML processing without outerHTML and similar functions, which minimizes the likelihood of errors
- Fully documented

And other advantages that will be visible when working with the module.

## Installation

Cample-html can be installed in several ways, which are described in this article. This tool is a simple javascript file that is connected in the usual way through a `script`, or using the `import` construct in an environment that supports this (webpack build, parcel build etc.). The first and easiest way is to install using a CDN.

### Package Manager

This method involves downloading through npm or other package managers.

```bash
npm i cample-html
```

> [Node.js](https://nodejs.org) is required for npm.

Along the path node-modules/cample-html/dist you can find two files that contain a regular js file and a minified one.

### Manual download

You can install the package by simply [downloading](https://unpkg.com/cample-html@0.0.4/dist/cample-html.min.js) it as a file and moving it to the project folder.

```html
<script src="./cample-html.min.js"></script>
```

If, for some reason, you do not need the minified file, then you can download the full file from this [link](https://unpkg.com/cample-html@0.0.4/dist/cample-html.js).

```html
<script src="./cample-html.js"></script>
```

The non-minified file is larger in size, but it is there as it is with all the formatting.

### CDN

This method involves connecting the file through a third-party resource, which provides the ability to obtain a javascript file from npm via a link.

```html
<script
  src="https://unpkg.com/cample-html@0.0.4"
></script>
<!--
  integrity="sha384-..."
  crossorigin="anonymous"
-->
```

This resource could be unpkg, skypack or other resources. The examples include unpkg simply because it is one of the most popular and its url by characters is not so long.

## Getting started

After installation using any convenient method described in [Installation](/?id=installation), you can start working with the server in the following way:

```html
<div>
  <template data-cample data-src="/api/test" data-method="get"></template>
</div>
```

Or, if the html method is not suitable, then in cample-html there is a `CampleHTML` object that provides a list of functions and methods that allow you to conveniently work with the server. Usage example:

```javascript
const templateFn = CampleHTML.createTemplate(
  `<template data-cample data-src="/api/test" data-method="get"></template>`
);

// (After the response arrives from the server) { element = template (HTMLTemplateElement type), status = 200 }
const elementObj = templateFn({
  credentials: "same-origin",
  get: (prop, value) => {
    if (prop === "element") {
      console.log(value);
    }
  },
});
```

These will be the two main ways to interact with the server. In future versions, the functionality will be expanded, but the methods themselves will not change.

## Changelog

[Changelog](https://github.com/cample-html/cample-html/releases)

## Inspiration

If you like cample-html, it will be very cool if you rate the repository with a star ★

## Contact

Email - camplejs@gmail.com

## License

[Licensed under MIT](https://github.com/cample-html/cample-html/blob/master/LICENSE)
