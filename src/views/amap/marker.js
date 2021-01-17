let marker = null;
export function amapSetMarker(lnglat, map) {
    // if(marker) {
    //     map.remove(marker);
    //     marker = null;
    // }
    amapClearMarker(map);
    marker = new AMap.Marker({
        position: [lnglat.lng, lnglat.lat],
    });
    map.add(marker);
    // 覆盖物居中
    map.setFitView();
}

export function amapClearMarker(map) {
    if (marker) {
        map.remove(marker);
        marker = null;
    }
}