/*

So how animate should work from the back up to the front.

First an animation is requested. -> "Request"
  - While loading just do standing.
  + Get Json for frames 

  Get frame compoistion of "Request"
    - Go grab the frames you need. -> AnimateFrames.
    - Format should be [{frameName:null, frameTime: 100, frameData:{ "name": "jumpUp2", png:"pngMap", "x": 448, "y": 64, "width": 64, "height": 64 }}]
    - go through array and grab all the frameNames.
      - Go load the frameNames via AnimateFrames. -> This should return the png(s) that will be used, and frameData

  - After getting all the frame data Array, and pngs of sprite sheets.

  Looking at 0 pos of the array, look at what the frameData says and to do a setTime in frameTime
*/
let cachePng;
function createImg(url, apiCalld) {
  if (!cachePng) {
    cachePng = {};
  }
  if (cachePng[url]) {
    return cachePng[url];
  }
  if (!apiCalld) {
    return;
  }
  const thisImage = new Image();
  thisImage.src = apiCalld + url;
  cachePng[url] = thisImage;
  return thisImage;
}
export default createImg;
