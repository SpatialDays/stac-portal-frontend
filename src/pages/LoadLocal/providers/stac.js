
import {readFromFile} from "../readfromfile"

export class StacProvider {

  getPathsAndId = async (file, files) => {
    let itemID = file.data.id;
    let other_links = [];

    for (const [, value] of Object.entries(file.data.assets)) {
      let url = value.href;
      if (url.startsWith("http")) {
        url = url.split('/').pop();
      }

      other_links.push(url);
    }

    let associatedFiles = files.filter(
      (file) =>
        other_links.includes(file.originalName) &&
        !file.started &&
        !file.name &&
        file.path.includes(itemID)
    );

    return [itemID, associatedFiles];
  }

  getAdditionalInfo = async (item) => {
    const metadataFileName = item.itemID + ".json";
    const metadataFile = item.files.find((file) =>
      file.name.includes(metadataFileName)
    );

    // Read the file
    const metadata = await readFromFile(metadataFile);

    // Parse to JSON
    const metadataJSON = JSON.parse(metadata);

    const additionalInfo = metadataJSON.properties;
    let timeAcquired = metadataJSON.properties.datetime;
    // check if we have a length to be missing milliseconds.
    // If we we can add them on.
    if (timeAcquired.length == "2019-02-16T00:00:00Z".length) {
      timeAcquired = timeAcquired.substring(0,19) + ".000" + timeAcquired[19];
    }

    return [timeAcquired, additionalInfo];
  }

}