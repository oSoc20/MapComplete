import { TagsFilter } from "./TagsFilter";
import * as OsmToGeoJson from "osmtogeojson";
import * as $ from "jquery";
import { Basemap } from "./Basemap";
import { UIEventSource } from "../UI/UIEventSource";

/**
 * Interfaces routing.anyways.eu to get routes between waypoints
 */
export class Routing {
    private _queryPrefix = "https://routing.anyways.eu/api/route?";
    private _queryOptions = "&profile=pedestrian.shortest";
    private _queryApiKey = "&api-key=mwK4irCD1whXx1XEpLQN6qotuM6P-Rh8";

    private buildQuery(locations: { lat: number, lng: number }[]) {
        return this._queryPrefix
            + locations.map(loc => { return "loc=" + loc.lng + "," + loc.lat; }).join("&")
            + this._queryOptions + this._queryApiKey;
    }


    queryRoute(locations: { lat: number, lng: number }[], continuation: ((any) => void), onFail: ((reason) => void)): void {
        let query = this.buildQuery(locations);

        $.getJSON(query,
            function (json, status) {
                if (status !== "success") {
                    console.log("Query failed")
                    onFail(status);
                }

                if (json.elements === [] && json.remarks.indexOf("runtime error") > 0) {
                    console.log("Timeout or other runtime error");
                    return;
                }

                continuation(json);
            }).fail(onFail)

            ;
    }


}