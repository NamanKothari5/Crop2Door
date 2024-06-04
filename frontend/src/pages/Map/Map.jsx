import React, { useEffect } from "react";
import { useGetPathQuery } from "../../redux/api/orderApi";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import turf, { distance } from "turf"; // Importing turf is unnecessary if you're not using it in this component
const getPath = async (points) => {
  const query = points.map((coord) => coord.join(",")).join(";");

  const response = await fetch(
    `${import.meta.env.VITE_APP_MAPBOX_BASE_URL}/directions/v5/mapbox/driving/${query}?annotations=distance&geometries=geojson&steps=true&language=en&overview=full&access_token=${import.meta.env.VITE_APP_MAPBOX_TOKEN}`
  );

  if (response.ok) {
    const jsonData = await response.json();
    const path = [];
    jsonData.routes[0].legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        path.push(...step.geometry.coordinates);
      });
    });
    return path;
  } else throw Error("Error retrieving coordinates");
};
const Map = (props) => {
  const id = props.orderID;
  const showFullPath = props.showFullPath;
  const { data } = useGetPathQuery(id);
  
  useEffect(() => {
    if (data) {
      mapboxgl.accessToken =
        `${import.meta.env.VITE_APP_MAPBOX_TOKEN}`;
      const initializeMap = async () => {
        console.log(data);
        const points = data.finalPath;
        const pathDistance=data.distance
        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v12",
          center: points[0],
          zoom: 10,
        });

        const path = await getPath(points);

        const dataProperties = {
          type: "FeatureCollection",
          features: [],
        };
        dataProperties.features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: path,
          },
        });

        points.slice(0, -1).forEach((point) => {
          dataProperties.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: point,
            },
          });
        });

        map.on("load", () => {
          map.addSource("route", {
            type: "geojson",
            data: dataProperties,
          });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "green",
              "line-width": 8,
            },
          });

          map.addLayer({
            id: "pickup-points",
            type: "circle",
            source: "route",
            paint: {
              "circle-radius": 12,
              "circle-color": "#B42222",
            },
            filter: ["==", "$type", "Point"],
          });
        });

        const lastPoint = points[points.length - 1];

        map.addLayer({
          id: "last-point",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: lastPoint,
              },
            },
          },
          paint: {
            "circle-radius": 12,
            "circle-color": "#00FF00", // Different color for the last point
          },
        });
        if (showFullPath) {
          map.on('load', () => {
            console.log(pathDistance);
            const animationDuration = pathDistance;
            const cameraAltitude = 0.5*pathDistance;
            const routeDistance = turf.lineDistance(turf.lineString(path));
            const cameraRouteDistance = turf.lineDistance(
              turf.lineString(path)
            );

            let start;

            function frame(time) {
              if (!start) start = time;
              
              const phase = (time - start) / animationDuration;

              if (phase > 1) {

                setTimeout(() => {
                  start = 0.0;
                }, 1500);
              }
              
              const alongRoute = turf.along(
                turf.lineString(path),
                routeDistance * phase
              ).geometry.coordinates;

              const alongCamera = turf.along(
                turf.lineString(path),
                cameraRouteDistance * phase
              ).geometry.coordinates;

              const camera = map.getFreeCameraOptions();

              camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
                {
                  lng: alongCamera[0],
                  lat: alongCamera[1]
                },
                cameraAltitude
              );

              camera.lookAtPoint({
                lng: alongRoute[0],
                lat: alongRoute[1]
              });

              map.setFreeCameraOptions(camera);

              window.requestAnimationFrame(frame);
            }

            window.requestAnimationFrame(frame);
          });
        }
        return () => map.remove();
      };

      initializeMap();
    }
  }, [data, showFullPath]);

  return <div id="map" style={{ width: "100%", height: "80vh" }} />;
};

export default Map;
