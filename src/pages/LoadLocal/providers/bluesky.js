import {readFromFile} from "../readfromfile"

export class BlueskyProvider {

  getPathsAndId = async (file, files) => {
    let itemID = file.originalName.split('.').slice(0, -1).join('.')

    // There should be a tiff with the data and a jpg with the quicklook, but
    // nothing in the metadata actually tells us this so we guess where the data
    // is. We don't want to process the quicklook here.
    let other_links = [itemID + ".tif"]

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

    const metadataFile = item.files.find(
      (file) => file.originalName === item.itemID + ".xml"
    );
    
    const metadata = await readFromFile(metadataFile);

    // Parse to XML
    const parser = new DOMParser();
    const xml = parser.parseFromString(metadata, "text/xml");
    let timeAcquired = xml.getElementsByTagName("gco:DateTime")[0]
      .textContent;

    if (timeAcquired.length === "2019-02-16T00:00:00".length) {
      timeAcquired = timeAcquired + ".000z";
    }

    // there isn't much in the bluesky metadata so we cant fill out any of the usual fields.
    // even the timeAcquired is probably only accurate to the day
    let additionalData = {};

    return [timeAcquired, additionalData];
  }

}
