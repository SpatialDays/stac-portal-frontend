
import {readFromFile} from "../readfromfile"

export class PlanetProvider {

    getPathsAndId = async (file, files) => {
        const filePaths = file.data.files.map((file) => {
            let path = file.path;
            // Get the last index after slash
            const index = path.lastIndexOf("/");
            // Get the substring after the last slash
            path = path.substring(index + 1);
            return path;
        });

        // Get the associated files and Item ID
        let associatedFiles = files.filter(
            (file) =>
                filePaths.includes(file.originalName) && !file.started && !file.name
        );
        let itemID = file.data.files[0].annotations["planet/item_id"];
        return [itemID, associatedFiles];
    }

    getAdditionalInfo = async (item) => {
        // Find file that ends with {itemID}_metadata.json
        const metadataFileName = item.itemID + "_metadata.json";
        const metadataFile = item.files.find((file) =>
            file.name.includes(metadataFileName)
        );

        // Read the file
        const metadata = await readFromFile(metadataFile);

        // Parse to JSON
        const metadataJSON = JSON.parse(metadata);

        let timeAcquired = metadataJSON.properties.acquired;

        // TODO: Come back here later
        let additionalData = {
            //cloudCover: metadataJSON.properties.cloud_cover,
            cloudCover: metadataJSON.properties.cloud_percent,
            sunElevation: metadataJSON.properties.sun_elevation,
            sunAzimuth: metadataJSON.properties.sun_azimuth,
            offNadirAngle: metadataJSON.properties.view_angle,
            gsd: metadataJSON.properties.gsd,
        };

        return [timeAcquired, additionalData];
    }




}