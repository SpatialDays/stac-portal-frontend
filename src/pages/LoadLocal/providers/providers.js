import {MaxarProvider} from "./maxar"
import {PlanetProvider} from "./planet"
import {StacProvider} from "./stac"
import {BlueskyProvider} from "./bluesky"


export const findProvider = (name) => {
    if (name === "Maxar") {
        return new MaxarProvider();
    } else if (name === "Planet") {
        return new PlanetProvider();
    } else if (name === "Stac") {
        return new StacProvider();
    } else if (name === "Bluesky") {
        return new BlueskyProvider();

    }

    return null;
}

