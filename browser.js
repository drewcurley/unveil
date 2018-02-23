var settings = {
  th: 200,
  animated: true,
  ani: 'data-src-animated',
  ret: 'data-src-retina',
  src: 'data-src',
  srcset: 'data-srcset'
};

var retina = window.devicePixelRatio > 1,
    attrib = retina ? settings.ret : settings.src,
    loaded;

var unveil = function(image) {
  var node = image.tagName,
      source = image.getAttribute(attrib),
      srcset = image.getAttribute(settings.srcset),
      source = source || image.getAttribute(settings.src) ||  image.getAttribute(settings.ret);
  if (settings.animated == true) {
    source = image.getAttribute(settings.ani) || source;
  }
  if (source || node == "PICTURE") {
    var parent = image.parentElement,
        parentWidth = parent.offsetWidth,
        upscale = (parentWidth > 100) ? 1.25 : 1.75;

    if (node == 'IMG') {
      image.setAttribute("src", source);
      if (srcset) {
        image.setAttribute("srcset", srcset);
      }
    } else if (node == 'PICTURE') {
      var img = image.querySelector('img');
      var imgSrc = img.getAttribute(attrib) || img.getAttribute(settings.src) ||  img.getAttribute(settings.ret);
      img.setAttribute("src", imgSrc);      
      var sources = image.querySelectorAll('source');
      Array.prototype.forEach.call(sources, function(e){
        var media = e.getAttribute('media'),
            mediaWidth = media.slice(12,-3);
        if ((parentWidth * upscale) >= mediaWidth) {
          e.setAttribute('srcset', e.getAttribute(settings.srcset));
        }
      });
    } else {
      image.style.backgroundImage = 'url('+source+')';
    }
    if (typeof callback === "function") callback.call(this);
  }    
  //image.setAttribute('data-unveil', false);
  images = document.querySelectorAll('[data-unveil="true"]');
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

var inview = function(image) {
  try {
    window.foo = image;

    if (!(image.parentElement.offsetWidth > 0 && image.parentElement.offsetHeight > 0)) return false;

    var wt = window.pageYOffset,
        wb = wt + window.innerHeight,
        et = offset(image).top,
        eb = et + image.height || et + image.offsetHeight;

    return eb >= wt - settings.th && et <= wb + settings.th;
  }
  catch (e) {
    return false
  }
}

function addListenerMulti(element, eventNames, listener) {
  var events = eventNames.split(' ');
  for (var i=0, iLen=events.length; i<iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }
}


var images = document.querySelectorAll('[data-unveil="true"]');
var originalSet = images;

addListenerMulti(window, 'load scroll lookup', function(){
  Array.prototype.forEach.call(images,function(image){
    if (inview(image)) {
      unveil(image);
    }
  });
});

let resizeTimer = '';

addListenerMulti(window, 'resize', function(){
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    Array.prototype.forEach.call(originalSet,function(image){
      if (inview(image)) {
        unveil(image);
      }
    });         
  }, 250);
  
});


Array.prototype.forEach.call(images,function(image){
  if (inview(image)) {
    unveil(image);
  }
});