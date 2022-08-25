class DefaultRenderer {
    render(
        { count, position },
        stats
    ) {
        // change color if this cluster has more markers than the mean cluster
        const color =
            count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";

        // create svg url with fill color
        const svg = window.btoa(`
   <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
     <circle cx="120" cy="120" opacity=".6" r="70" />
     <circle cx="120" cy="120" opacity=".3" r="90" />
     <circle cx="120" cy="120" opacity=".2" r="110" />
   </svg>`);

        // create marker using svg icon
        return new google.maps.Marker({
            position,
            icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
            },
            label: {
                text: null,
                color: "rgba(255,255,255,0.9)",
                fontSize: "12px",
            },
            title: `Cluster of ${count} markers`,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        });
    }
}

class OverspeedRenderer {
    render(
        { count, position }
    ) {
        // change color if this cluster has more markers than the mean cluster
        const color = "#FF0000"

        // create svg url with fill color
        const svg = window.btoa(`
   <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
     <circle cx="120" cy="120" opacity=".6" r="70" />
     <circle cx="120" cy="120" opacity=".3" r="90" />
     <circle cx="120" cy="120" opacity=".2" r="110" />
   </svg>`);

        // create marker using svg icon
        return new google.maps.Marker({
            position,
            icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
            },
            label: {
                text: String(count),
                color: "rgba(255,255,255,0.9)",
                fontSize: "12px",
            },
            title: `Cluster of ${count} markers`,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        });
    }
}

class BridgeRenderer {
    render(
        { count, position },
        stats
    ) {
        // change color if this cluster has more markers than the mean cluster
        const color = "#10c3ab"

        // create svg url with fill color
        const svg = window.btoa(`
   <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
     <circle cx="120" cy="120" opacity=".6" r="70" />
     <circle cx="120" cy="120" opacity=".3" r="90" />
     <circle cx="120" cy="120" opacity=".2" r="110" />
   </svg>`);

        // create marker using svg icon
        return new google.maps.Marker({
            position,
            icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
            },
            label: {
                text: String(count),
                color: "rgba(255,255,255,0.9)",
                fontSize: "12px",
            },
            title: `Cluster of ${count} markers`,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        });
    }
}

class TrackingRenderer {
    render(
        { count, position }
    ) {
        // change color if this cluster has more markers than the mean cluster
        const color = "#ff00ff"

        return new google.maps.Marker({
            position,
            icon: {
                /* url: `data:image/svg+xml;base64,${svg}`, */
                url: getIcon('running'),
                scaledSize: new google.maps.Size(20, 28),
            },
            title: `Cluster of ${count} markers`,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        });
    }
}

function getIcon(icon) {
    const mapIcon = import.meta.globEager(
        "../../assets/icons/map/pins_png/*.svg"
    );
    const iconUrl =
        mapIcon[`../../assets/icons/map/pins_png/icone-${icon}.svg`];
    return iconUrl.default;
};



export { DefaultRenderer, OverspeedRenderer, BridgeRenderer, TrackingRenderer }