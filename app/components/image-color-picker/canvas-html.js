// @flow

export const canvasHtml = (imageBlob: string, imageType: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <script>
    function fetchColorFromCanvas() {
      const options = {
        imageElement: document.getElementById("__colorPickerCanvasImage")
      }
      var rgba = getColorPalettes(options);
      var message = {"message":'rgbValues',"payload":rgba};
      window.postMessage(JSON.stringify(message));
    }

    function getColorPalettes({imageElement, 
        count=3, 
        defaultPalette=[0, 0, 0, 1], 
        paletteType='dominant', 
        colorType='rgba'}
      ) {       
      const canvas = document.createElement('canvas');
      const	canvasContext = canvas.getContext && canvas.getContext('2d');

      if (!canvasContext) return defaultPalette;
      
      let imageWidth = canvas.width = imageElement.naturalWidth 
        || imageElement.offsetWidth 
        || imageElement.width;                

      const imageHeight = canvas.height = imageElement.naturalHeight 
        || imageElement.offsetHeight 
        || imageElement.height;                   

      canvasContext.drawImage(imageElement, 0, 0);
      if (paletteType === 'average')
        return getAveragePalette({imageWidth, imageHeight, canvasContext, colorType});
      else
        return getDominantPalettes(getAllPalettes(imageWidth, imageHeight, canvasContext), count, colorType);
    }

    function getAveragePalette({imageWidth, imageHeight, canvasContext, colorType = 'rgb'}) {
      const blockSize = 5
      let i = -4;
      let rgb = {r:0,g:0,b:0,a:1};
      let count = 0;
      
      try {
        data = canvasContext.getImageData(0, 0, imageWidth, imageHeight);
      } catch(e) {
        console.log(e);
      }
    
      while ((i += blockSize * 4) < data.data.length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
      }
      rgb.r = ~~(rgb.r/count);
      rgb.g = ~~(rgb.g/count);
      rgb.b = ~~(rgb.b/count);
      if (colorType === 'hex')
        return [[rgbToHex([rgb.r, rgb.g, rgb.b])]]
      else
        return [[rgb.r, rgb.g, rgb.b, rgb.a]];
    }

    function rgbToHex(rgba) {
      let hexColor = '#';
      rgba.slice(0, 3).forEach(c => {
        let hex = c.toString(16);
        hexColor += hex.length == 1 ? "0" + hex : hex;  
      });
      return hexColor
    }

    function getAllPalettes(width, height, context) {
      let distinctPalettes = [];        
      for (var i=0; i<=height; i++) { 
        for (var j=0; j<=width; j++) { 
          try {
            data = context.getImageData(i, j, 1, 1);
            if (data.data.toString().trim() != "0,0,0,0") {
              distinctPalettes.push(data.data);
            }
          } catch(e) {
            console.log(e);
          }
        }
      }  
      return distinctPalettes;
    }

    function getDominantPalettes(allPalettes, distinctCount, colorType = 'rgb') {
      const combinations = getPaletteOccurrences(allPalettes);
      let palettes = combinations[0];
      let occurrences = combinations[1];
      const dominantPalettes = [];

      while (distinctCount) {               
        let dominant = 0, dominantKey = 0;  
        occurrences.forEach((v, k) => {           
          if (v > dominant) {
            dominant = v;              
            dominantKey = k;                               
          }
        });
        if (colorType === 'hex')
          dominantPalettes.push(rgbToHex(palettes[dominantKey]));
        else
          dominantPalettes.push(palettes[dominantKey]);
          
        palettes.splice(dominantKey, 1);            
        occurrences.splice(dominantKey, 1);
        distinctCount--;
      }
      return dominantPalettes;
    }        

    function getPaletteOccurrences(palettes) {
      let paletteList = [], occurrenceList = [], previousPalette;
      palettes.sort();
      palettes.forEach((palette, key) => {
        if (palette.toString() !== previousPalette) {
          paletteList.push(palette);
          occurrenceList.push(1);
        } else {
          occurrenceList[occurrenceList.length-1]++;
        }
        previousPalette = palettes[key].toString();
      });
      return [paletteList, occurrenceList];
    }

    const interval = setInterval(() => {
      var img = document.getElementById('__colorPickerCanvasImage');
      if (img.src.length !== 0) {
        fetchColorFromCanvas();
        clearInterval(interval);
      }
    },10);        

    </script>
    <body>
      <img src='data:image/${imageType};base64,${imageBlob}' 
        id='__colorPickerCanvasImage' onload='fetchColorFromCanvas()'/>
    </body>
    </html>
  `
}
