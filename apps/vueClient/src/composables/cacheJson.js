
let cacheJson;

async function getJson(url,api){
  if(!cacheJson){
    cacheJson = {}
  }
  if(cacheJson[url]){
    return cacheJson[url];
  }
  if(!api){
    return;
  }
  const json = await fetch(
    api + `${url}.json`,
    {
        headers: { "Content-Type": "application/json" },
      }      
  );

  cacheJson[url] = await json.json();

  return cacheJson[url];
}

export default getJson;