import JSZip from "jszip";

async function handleZipFile(zipData) {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipData);
  const urls = [];
  const fileOrder = [];

  for (const [_, file] of Object.entries(loadedZip.files)) {
    if (!file.dir) {
      fileOrder.push(_);
    }
  }

  for (const fileName of fileOrder) {
    const file = loadedZip.files[fileName];
    const content = await file.async("arraybuffer");
    const speech = new Blob([content], { type: "audio/mpeg" });
    const audioBlobUrl = URL.createObjectURL(speech);
    urls.push(audioBlobUrl);
  }

  return urls;
}

export default handleZipFile;
