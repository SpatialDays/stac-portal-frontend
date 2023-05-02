import {readFromFile} from "../readfromfile"
import { providerToManifest } from "../consts";

export class MaxarProvider {

    getPathsAndId = async (file, files) => {
        // Read the manifest and group the associated files
        const products = file.data.getElementsByTagName("productFile");
        const filePaths = Array.from(products).map(
            (file) => file.getElementsByTagName("filename")[0].innerHTML
        );
        const relativeDirectory =
            products[0].getElementsByTagName("relativeDirectory")[0].innerHTML;
        let itemID = relativeDirectory.split("/")[0];

        // Get the associated files and Item ID
        let associatedFiles = files.filter(
            (file) =>
                filePaths.includes(file.originalName) &&
                !file.started &&
                !file.name &&
                file.path.includes(itemID)
        );
        return [itemID, associatedFiles];
    }

    getAdditionalInfo = async (item) => {
        const metadataFileName = providerToManifest(item.provider);
        const metadataFile = item.files.find(
            (file) => file.name === item.itemID + "_" + metadataFileName
        );
        const metadata = await readFromFile(metadataFile);

        // Parse to XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(metadata, "text/xml");
        let timeAcquired = xml.getElementsByTagName("earliestAcquisitionTime")[0]
            .textContent;

        // Parse the Readme.xml
        const readmeXML = item.files.find((file) =>
            file.name.includes("README.XML")
        );
        const readmeXMLContent = await readFromFile(readmeXML);
        const readmeXMLData = parser.parseFromString(readmeXMLContent, "text/xml");

        let additionalData = {
            cloudCover:
                readmeXMLData.getElementsByTagName("CLOUDCOVER")[0]?.textContent,
            sunElevation: xml.getElementsByTagName("sunElevation")[0].textContent,
            sunAzimuth: xml.getElementsByTagName("sunAzimuth")[0].textContent,
            offNadirAngle: xml.getElementsByTagName("offNadirAngle")[0].textContent,
        };

        return [timeAcquired, additionalData];
    }



}
