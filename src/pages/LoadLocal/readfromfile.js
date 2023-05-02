

export const readFromFile = async (file) => {
    const reader = new FileReader();
    const fileBlob = file.blob;
    const promise = new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const content = reader.result;
        resolve(content);
      };
      reader.onerror = (e) => {
        reject(e);
      };
    });
    reader.readAsText(fileBlob);
    const readmeContent = await promise;
    return readmeContent;
  };