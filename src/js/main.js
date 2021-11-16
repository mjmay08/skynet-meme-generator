import { SkynetClient } from "skynet-js";


/**
* CAN\VAS Plugin - Adding line breaks to canvas
* @arg {string} [str=Hello World] - text to be drawn
* @arg {number} [x=0]             - top left x coordinate of the text
* @arg {number} [y=textSize]      - top left y coordinate of the text
* @arg {number} [w=canvasWidth]   - maximum width of drawn text
* @arg {number} [lh=1]            - line height
* @arg {number} [method=fill]     - text drawing method, if 'none', text will not be rendered
*/

CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
    // local variables and defaults
    var textSize = parseInt(this.font.replace(/\D/gi, ''));
    var textParts = [];
    var textPartsNo = 0;
    var words = [];
    var currLine = '';
    var testLine = '';
    str = str || '';
    x = x || 0;
    y = y || 0;
    w = w || this.canvas.width;
    lh = lh || 1;
    method = method || 'fill';

    // manual linebreaks
    textParts = str.split('\n');
    textPartsNo = textParts.length;

    // split the words of the parts
    for (var i = 0; i < textParts.length; i++) {
        words[i] = textParts[i].split(' ');
    }

    // now that we have extracted the words
    // we reset the textParts
    textParts = [];

    // calculate recommended line breaks
    // split between the words
    for (var i = 0; i < textPartsNo; i++) {

        // clear the testline for the next manually broken line
        currLine = '';

        for (var j = 0; j < words[i].length; j++) {
            testLine = currLine + words[i][j] + ' ';

            // check if the testLine is of good width
            if (this.measureText(testLine).width > w && j > 0) {
                textParts.push(currLine);
                currLine = words[i][j] + ' ';
            } else {
                currLine = testLine;
            }
        }
// replace is to remove trailing whitespace
        textParts.push(currLine);
    }

    // render the text on the canvas
    for (var i = 0; i < textParts.length; i++) {
        if (method === 'fill') {
            this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y+(textSize*lh*i));
        } else if (method === 'stroke') {
            this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y+(textSize*lh*i));
        } else if (method === 'none') {
        console.log("textsize: " + textSize + " lh: " + lh + " textPartsLength: " + textParts.length);
        return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
        } else {
    console.warn('drawBreakingText: ' + method + 'Text() does not exist');
            return false;
        }
    }

    return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
}; 
  
  
  
  
  var canvas = document.createElement('canvas');
  var canvasWrapper = document.getElementById('canvasWrapper');
  canvasWrapper.appendChild(canvas);
  canvas.width = 500;
  canvas.height = 500;
  var ctx = canvas.getContext('2d');
  var padding = 15;
  var textTop = 'I don\'t always make a meme';
  var textBottom = 'but when i do, i upload to skynet';
  var textSizeTop = 10;
  var textSizeBottom = 10;
  //var image = document.createElement('img', { crossorigin: "anonymous" });
  var image = new Image();
  image.crossOrigin = "Anonymous";
  image.className ="final"

  document.fonts.onloadingdone = () => {
    draw();
  };
  
  
  image.onload = function (ev) {
    console.log("image loaded");
    // delete and recreate canvas do untaint it
    canvas.outerHTML = '';
    canvas = document.createElement('canvas');
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    //document.getElementById('trueSize').click();
    //document.getElementById('trueSize').click();
    
    draw();
  };
  
  document.getElementById('imgURL').oninput = function(ev) {
    console.log(this.value);
    image.src = "https://" + this.value + ".siasky.net";
  };
  
  document.getElementById('imgFile').onchange = function(ev) {
    var reader = new FileReader();
    reader.onload = function(ev) {
      image.src = reader.result;
    };
    reader.readAsDataURL(this.files[0]);
  };
  
  
  
  document.getElementById('textTop').oninput = function(ev) {
    textTop = this.value;
    draw();
  };
  
  document.getElementById('textBottom').oninput = function(ev) {
    textBottom = this.value;
    draw();
  };
  
  
  
  document.getElementById('textSizeTop').oninput = function(ev) {
    textSizeTop = parseInt(this.value);
    draw();
    document.getElementById('textSizeTopOut').innerHTML = this.value;
  };
  document.getElementById('textSizeBottom').oninput = function(ev) {
    textSizeBottom = parseInt(this.value);
    draw();
    document.getElementById('textSizeBottomOut').innerHTML = this.value;
  };
  
  
  /*
  document.getElementById('trueSize').onchange = function(ev) {
    if (document.getElementById('trueSize').checked) {
      canvas.classList.remove('fullwidth');
    } else {
      canvas.classList.add('fullwidth');
    }
  };
  */
  
  
  document.getElementById('export').onclick = function () {
    document.getElementById('export').innerHTML = "Saving...";
    document.getElementById('export').disabled = true;
    var img = canvas.toDataURL('image/png');
    //MITCHELL
    var blobBin = atob(img.split(',')[1]);
    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var blob=new Blob([new Uint8Array(array)], {type: 'image/png'});
    var file = new File([blob], "meme", { type: 'image/png'});
    var client = new SkynetClient();
    client.portalUrl().then((portalUrl) => {
        client.uploadFile(file).then((skylink) => {
            var skylinkList = document.getElementById('skylink');
            var node = document.createElement('li');

            var finalLink = portalUrl + "/" + skylink.skylink.substring(6);
            var a = document.createElement('a');
            a.style = "font-size: 18px";
            var linkText = document.createTextNode(finalLink);
            a.appendChild(linkText);
            a.title = finalLink;
            a.href = finalLink;

            node.appendChild(a);
            skylinkList.appendChild(node);
            document.getElementById('export').innerHTML = "Save to Skynet!";
            document.getElementById('export').disabled = false;
        },
        (error) => {
            console.log(error);
            document.getElementById('export').innerHTML = "Save to Skynet!";
            document.getElementById('export').disabled = false;
        })
    },
    (error) => {
        console.log(error);
        document.getElementById('export').innerHTML = "Save to Skynet!";
        document.getElementById('export').disabled = false;
    });
  };
  
  
  
  
  
  function style(font, size, align, base) {
    ctx.font = size + 'px ' + font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
  }
  
  function draw() {
    // uppercase the text
    var top = textTop.toUpperCase();
    var bottom = textBottom.toUpperCase();
    
    // set appropriate canvas size
    canvas.width = image.width;
    canvas.height = image.height;
    
    // draw the image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // styles
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = canvas.width*0.004;
    
    var _textSizeTop = textSizeTop/100*canvas.width;
    var _textSizeBottom = textSizeBottom/100*canvas.width;
    
    // draw top text
    style('Impact', _textSizeTop, 'center', 'bottom');
    console.log(_textSizeTop+padding);
    console.log(ctx.drawBreakingText(top, 0, 0, null, 1, 'none'));
    ctx.drawBreakingText(top, canvas.width/2, _textSizeTop+padding, null, 1, 'fill');
    ctx.drawBreakingText(top, canvas.width/2, _textSizeTop+padding, null, 1, 'stroke');
  
    // draw bottom text
    style('Impact', _textSizeBottom, 'center', 'top');
    var height = ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none').textHeight;
    console.log(ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none'));
    ctx.drawBreakingText(bottom, canvas.width/2, canvas.height-padding-height, null, 1, 'fill');
    ctx.drawBreakingText(bottom, canvas.width/2, canvas.height-padding-height, null, 1, 'stroke');
  }
  
  
  
  
  
  image.src = 'https://6g0068gbejbq6rg3vpbp11ng0t75j6kjajeefve9cihljis6ra861l0.siasky.net';
  document.getElementById('textSizeTop').value = textSizeTop;
  document.getElementById('textSizeBottom').value = textSizeBottom;
  document.getElementById('textSizeTopOut').innerHTML = textSizeTop;
  document.getElementById('textSizeBottomOut').innerHTML = textSizeBottom;

  var setNewImage = function() {
    console.log("clicked");
    image.src = this.src;
  }

  var image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://6g0068gbejbq6rg3vpbp11ng0t75j6kjajeefve9cihljis6ra861l0.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;

  image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://0g09lmln2b9mci3qevad6v7baif7r178tj0a5jmcefe01ajvi6jh8l0.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;

  image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://400f6cptoa4sr85orpschc1sht5moblrit004h4befia4q9iu058ml8.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;
/*
  image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://7g1308p3dg57409hc2lr6ooa9iovjnejfvjm6vipj79np4p6d60m238.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;

  image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://7g1clti6sgcrhv0uborn8gaf5m2mkic7o98bnu779a45bmg0k5cdl60.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;

  image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://ng0kstgb08fbp8hsmjn5jh4ofrt49and27vtvt33j3ig3eekiv92rsg.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;
*/
  image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://hg09i86uf1ldccvi5l3cdb51s760pll2k4h703ueet93i33k09dch3o.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;

  image1 = document.createElement('img');
  image1.className="thumbnails";
  image1.src = "https://ng0hd5gdk9o0j2imt22o9mh01h5meoa1vpgsuv2sm88e8jrr5cuh280.siasky.net";
  document.getElementById('examples').appendChild(image1);
  image1.onclick = setNewImage;


 