# unveil
Custom lazy loader including support for srcset images with parental container limiting

## What is needed to run
Nothing but good ol' vanilla JS.  That's what makes it magic!  Ok, you might need some images too...

## Usage

Unveil triggers off data-attributes in your code to determine whether the lazy loader attaches to it, and what sources to pull.  Please review the following examples.

```html
<img data-src="//placehold.it/500x200" src="" data-unveil="true" /> 

<!-- yes, that's supposed to be a broken image on purpose -->
```

Unveil runs on the page's reload, scroll, and resize events.  If images are brought in after page load, then simply push those elements onto the array that unveil already created.

```html
let newImages = newDiv.querySelectorAll('[data-unveil="true"]');

image.push(document.querySelectorAll(newImages));
```

Unveil works on srcset images as well.  When it runs, it will figure out how big the image's parent container is, and will strip off sources that exceed that amount by 1.5x.  That way you always get crisp images without the bloat.

**to do** Right now the slicing off of sources that are too big are only for pixel based media query picture element srcsets.  I will add greater support when I get the chance.  In the meantime, it will still work on all srcsets, just without the slicing of sources that are too big.

```html
<picture data-unveil="true">
    <source data-srcset="//placehold.it/1280x720" src="" media="(min-width: 1280px)">
    <source data-srcset="//placehold.it/640x480" src="" media="(min-width: 640px)">
    <source data-srcset="//placehold.it/320x240" src="" media="(min-width: 320px)">
    <source data-srcset="//placehold.it/48x36" src="" media="(min-width: 48px)">
    <img data-src="//placehold.it/640x480">
</picture>

<img data-srcset="elva-fairy-320w.jpg 320w,
             elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
     data-src="elva-fairy-800w.jpg">
```
