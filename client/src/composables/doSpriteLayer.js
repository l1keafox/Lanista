import createImg from "./cacheSpriteSheet";
function getOutfitURL(clothes, key,apiCall) {
  if (!clothes || !clothes.skin)
    return createImg(
      `/assets/char_a_p1/1out/char_a_p1_1out_bksm_v02.png`,
      apiCall
    );
  if (clothes && clothes.sex == "m") {
    return createImg(
      `/assets/char_a_${key}/1out/char_a_${key}_1out_boxr_v01.png`,
      apiCall
    );
  } else {
    return createImg(
      `/assets/char_a_${key}/1out/char_a_${key}_1out_undi_v01.png`,
      apiCall
    );
  }
  return null;
}

function getSkinURL(clothes, key,apiCall) {
  if (!clothes || !clothes.skin)
    return createImg(
      `/assets/char_a_p1/char_a_p1_0bas_humn_v00.png`,
      apiCall
    );
  //  return `char_a_p1/char_a_p1_0bas_humn_v${rando}.png`;
  return createImg(
    `/assets/char_a_${key}/char_a_${key}_0bas_${clothes.skin}.png`,
    apiCall
  );
  
}
function getHairURL(clothes, key,apiCall) {
  if (!clothes || !clothes.hair)
    return createImg(
      `/assets/char_a_p1/4har/char_a_p1_4har_dap1_v12.png`,
      apiCall
    );
  // pONE1 is an special battle it wil
  if(key === 'pONE1' || key === 'pONE2' || key == 'pONE3'){
    // return createImg(
    // 	`/assets/char_a_${key}/4har/char_a_${key}_4har_dap1_v${clothes.hair}.png`,
    // 	apiCall.value
    // );

  } else {
    return createImg(
      `/assets/char_a_${key}/4har/char_a_${key}_4har_${clothes.style}_v${clothes.hair}.png`,
      apiCall
    );
  }
}
function getHelmURL(clothes, key,apiCall) {
  if (!clothes || !clothes.hair)
    return createImg(
      `/assets/char_a_p1/4har/char_a_p1_4har_dap1_v02.png`,
      apiCall
    );
  // pONE1 is an special battle it wil
  if(key === 'pONE1' || key === 'pONE2' || key == 'pONE3'){
    return createImg(
      `/assets/char_a_${key}/5hat/char_a_${key}_5hat_pfht_v05.png`,
      apiCall
    );

  } else {

  }
}

function getMainhand(clothes, key,apiCall){
  
  if(key === 'pONE1' || key === 'pONE2' || key == 'pONE3'){
    return createImg(
      `/assets/char_a_${key}/6tla/char_a_${key}_6tla_sw01_v01.png`,
      apiCall
    );
  }
}
// This is the array of which the canvas will be painted via image.
function getOffhand(clothes, key,apiCall){
  if(key === 'pONE1' || key === 'pONE2' || key == 'pONE3'){
    // return createImg(
    // 	`/assets/char_a_${key}/7tlb/char_a_${key}_7tlb_sh01_v01.png`,
    // 	apiCall.value
    // );
  }
}


function createLayers(clothes, key,apiCall){

  return [
		getSkinURL(clothes, key,apiCall), //		skinLayer, 0bot (sub-layer, fully behind the character sprite)
		getOutfitURL(clothes, key,apiCall), //   createImg(`/assets/${clothes.skin}`); // 1out (outfit, lowest layer)
		null, //   createImg(`/assets/${clothes.skin}`); // 2clo (cloaks, capes, and mantles)
		null, //   createImg(`/assets/${clothes.skin}`); // 3fac (face items, like glasses and masks)
		getHairURL(clothes, key,apiCall), //4har (hair)
		getHelmURL(clothes, key,apiCall), //4.5har (helmet)
		null, //   createImg(`/assets/${clothes.skin}`); //5hat (hats and hoods)
		getMainhand(clothes,  key,apiCall), //   createImg(`/assets/${clothes.skin}`); //6tla (primary tool layer, weapons and such)
		getOffhand(clothes,  key,apiCall), //   createImg(`/assets/${clothes.skin}`); //7tlb (secondary tool layer, shields and off-hand weapons, highest layer)
	];
}
export default createLayers;