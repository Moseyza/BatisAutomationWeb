export function getNewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}


export function getPersianDate(date: string,format: string, formatPersian = true){
      const persianDate =  require('@/../public/persian-date.js');
      const pd = new persianDate(new Date(date));
      pd.formatPersian = formatPersian;
      return pd.format(format);
  
}

export function converBase64toBlob(content: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 512;
  const byteCharacters = window.atob(content); //method which converts base64 to binary
  const byteArrays = [
  ];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, {
    type: contentType
  }); //statement which creates the blob
  return blob;
}


  
  export function saveFile(data: Blob, fileName: string) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const    url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

export function ReadFileAndAddToRecipient(param: any)
{
    alert(param.name);
}