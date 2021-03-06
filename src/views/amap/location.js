import { Message } from "element-ui";
let geocoder = null;
export function addressSetMapCenter(address, map) {
    if (!geocoder) {
        geocoder = new AMap.Geocoder();
    }
    geocoder.getLocation(address, function(status, result) {
        if (status === "complete" && result.info == "OK") {
            let lat = result.geocodes[0].location.lat;
            let lng = result.geocodes[0].location.lng;
            map.setCenter([lng, lat]);
        } else {
            Message.error("根据地址查询位置失败,请重试");
        }
    });
}