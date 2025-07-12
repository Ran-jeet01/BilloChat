// // import React, { useState, useEffect, useRef } from "react";
// // import { useChat } from "./ChatContext";
// // import {
// //   MapContainer,
// //   TileLayer,
// //   Marker,
// //   Popup,
// //   Tooltip,
// //   Circle,
// //   useMapEvents,
// // } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";
// // import L from "leaflet";
// // import {
// //   Menu,
// //   X,
// //   ChevronLeft,
// //   Locate,
// //   LocateFixed,
// //   MapPin,
// // } from "lucide-react";

// // // Custom dart icon
// // const dartIcon = new L.Icon({
// //   iconUrl:
// //     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41],
// //   popupAnchor: [1, -34],
// //   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// //   shadowSize: [41, 41],
// // });

// // // Component to handle map click events
// // const MapClickHandler = ({ isDartMode, addDart }) => {
// //   useMapEvents({
// //     click: (e) => {
// //       if (isDartMode) {
// //         addDart(e.latlng);
// //       }
// //     },
// //   });
// //   return null;
// // };

// // const MapComponent = () => {
// //   const {
// //     menuOpen,
// //     setMenuOpen,
// //     userPosition,
// //     setUserPosition,
// //     accuracy,
// //     setAccuracy,
// //     isTracking,
// //     setIsTracking,
// //     dartLocations,
// //     setDartLocations,
// //     isDartMode,
// //     setIsDartMode,
// //     mapRef,
// //     watchIdRef,
// //     setShowMap,
// //   } = useChat();

// //   // Initialize map with user's location
// //   useEffect(() => {
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         const { latitude, longitude, accuracy } = position.coords;
// //         setUserPosition([latitude, longitude]);
// //         setAccuracy(accuracy);
// //       },
// //       (error) => {
// //         console.error("Error getting location:", error);
// //         setUserPosition([51.505, -0.09]); // Default to London
// //       }
// //     );

// //     return () => {
// //       if (watchIdRef.current) {
// //         navigator.geolocation.clearWatch(watchIdRef.current);
// //       }
// //     };
// //   }, []);

// //   // Add new dart to the map
// //   const addDart = (latlng) => {
// //     const newDart = {
// //       id: Date.now(),
// //       position: [latlng.lat, latlng.lng],
// //       timestamp: new Date().toLocaleTimeString(),
// //     };
// //     setDartLocations([...dartLocations, newDart]);
// //   };

// //   // Toggle continuous location tracking
// //   const toggleTracking = () => {
// //     if (isTracking) {
// //       stopTracking();
// //     } else {
// //       startTracking();
// //     }
// //   };

// //   const startTracking = () => {
// //     if (navigator.geolocation) {
// //       watchIdRef.current = navigator.geolocation.watchPosition(
// //         (position) => {
// //           const { latitude, longitude, accuracy } = position.coords;
// //           setUserPosition([latitude, longitude]);
// //           setAccuracy(accuracy);
// //           if (mapRef.current && isTracking) {
// //             mapRef.current.flyTo([latitude, longitude], 15);
// //           }
// //         },
// //         (error) => {
// //           console.error("Error watching position:", error);
// //           setIsTracking(false);
// //         },
// //         {
// //           enableHighAccuracy: true,
// //           maximumAge: 10000,
// //           timeout: 5000,
// //         }
// //       );
// //       setIsTracking(true);
// //     }
// //   };

// //   const stopTracking = () => {
// //     if (watchIdRef.current) {
// //       navigator.geolocation.clearWatch(watchIdRef.current);
// //       watchIdRef.current = null;
// //     }
// //     setIsTracking(false);
// //   };

// //   const toggleDartMode = () => {
// //     setIsDartMode(!isDartMode);
// //   };

// //   const removeDart = (id) => {
// //     setDartLocations(dartLocations.filter((dart) => dart.id !== id));
// //   };

// //   if (!userPosition) {
// //     return (
// //       <div className="h-screen w-full flex items-center justify-center">
// //         Loading map...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="relative h-screen w-full">
// //       <MapContainer
// //         center={userPosition}
// //         zoom={15}
// //         className="h-full w-full z-0"
// //         whenCreated={(map) => {
// //           mapRef.current = map;
// //         }}
// //       >
// //         <TileLayer
// //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         />

// //         {/* Map click handler */}
// //         <MapClickHandler isDartMode={isDartMode} addDart={addDart} />

// //         {/* User's current location */}
// //         {userPosition && (
// //           <>
// //             <Marker position={userPosition}>
// //               <Tooltip
// //                 permanent
// //                 direction="top"
// //                 offset={[0, -10]}
// //                 className="custom-tooltip"
// //               >
// //                 <div className="font-medium">Your Location</div>
// //                 <div className="text-xs text-green-500">
// //                   {isTracking ? "Live updating" : "Last known position"}
// //                 </div>
// //                 {accuracy && (
// //                   <div className="text-xs text-gray-600">
// //                     Accuracy: {Math.round(accuracy)} meterse
// //                   </div>
// //                 )}
// //               </Tooltip>
// //             </Marker>

// //             {accuracy && (
// //               <Circle
// //                 center={userPosition}
// //                 radius={accuracy}
// //                 color="#3182ce"
// //                 fillColor="#3182ce"
// //                 fillOpacity={0.2}
// //               />
// //             )}
// //           </>
// //         )}

// //         {/* Dart markers */}
// //         {dartLocations.map((dart) => (
// //           <Marker
// //             key={dart.id}
// //             position={dart.position}
// //             icon={dartIcon}
// //             eventHandlers={{
// //               click: () => removeDart(dart.id),
// //             }}
// //           >
// //             <Popup>
// //               <div className="space-y-1">
// //                 <div className="font-medium">Dart Location</div>
// //                 <div className="text-xs text-gray-500">
// //                   Placed at: {dart.timestamp}
// //                 </div>
// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     removeDart(dart.id);
// //                   }}
// //                   className="mt-1 text-xs text-red-500 hover:text-red-700"
// //                 >
// //                   Remove Dart
// //                 </button>
// //               </div>
// //             </Popup>
// //           </Marker>
// //         ))}
// //       </MapContainer>

// //       {/* Control buttons */}
// //       <div className="absolute top-4 right-10 z-10 flex items-center">
// //         {/* Dart mode toggle */}
// //         <button
// //           onClick={toggleDartMode}
// //           className={`p-2 rounded-full shadow-md mr-2 ${
// //             isDartMode ? "bg-red-500 text-white" : "bg-white hover:bg-gray-100"
// //           }`}
// //           title={isDartMode ? "Exit dart mode" : "Place darts on map"}
// //         >
// //           <MapPin className="w-5 h-5" />
// //         </button>

// //         {/* Location tracking button */}
// //         <button
// //           onClick={toggleTracking}
// //           className={`p-2 rounded-full shadow-md mr-2 ${
// //             isTracking ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
// //           }`}
// //           title={isTracking ? "Stop tracking" : "Track my location"}
// //         >
// //           {isTracking ? (
// //             <LocateFixed className="w-5 h-5" />
// //           ) : (
// //             <Locate className="w-5 h-5" />
// //           )}
// //         </button>

// //         {/* Menu Button */}
// //         <div className="relative mr-4">
// //           <button
// //             onClick={() => setMenuOpen(!menuOpen)}
// //             className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
// //           >
// //             {menuOpen ? (
// //               <X className="w-5 h-5" />
// //             ) : (
// //               <Menu className="w-5 h-5" />
// //             )}
// //           </button>

// //           {menuOpen && (
// //             <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 w-48 z-20">
// //               <button
// //                 onClick={toggleDartMode}
// //                 className={`block w-full text-left text-sm p-2 hover:bg-gray-100 flex items-center ${
// //                   isDartMode ? "text-red-500" : ""
// //                 }`}
// //               >
// //                 <MapPin className="w-4 h-4 mr-2" />
// //                 {isDartMode ? "Exit Dart Mode" : "Dart Mode"}
// //               </button>
// //               <button
// //                 onClick={toggleTracking}
// //                 className="block w-full text-left text-sm p-2 hover:bg-gray-100 flex items-center"
// //               >
// //                 {isTracking ? (
// //                   <LocateFixed className="w-4 h-4 mr-2" />
// //                 ) : (
// //                   <Locate className="w-4 h-4 mr-2" />
// //                 )}
// //                 {isTracking ? "Stop Tracking" : "Track Location"}
// //               </button>
// //               {dartLocations.length > 0 && (
// //                 <button
// //                   onClick={() => setDartLocations([])}
// //                   className="block w-full text-left text-sm p-2 hover:bg-gray-100 text-red-500"
// //                 >
// //                   Clear All Darts
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* Back Button */}
// //         <button
// //           onClick={() => setShowMap(false)}
// //           className="bg-white px-3 py-2 rounded-full shadow-md hover:bg-gray-100 text-sm flex items-center"
// //         >
// //           <ChevronLeft className="w-4 h-4 mr-1" />
// //           Back to chat
// //         </button>
// //       </div>

// //       {/* Dart mode indicator */}
// //       {isDartMode && (
// //         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-10">
// //           Click on map to place a dart
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MapComponent;

// import React, { useState, useEffect, useRef } from "react";
// import { useChat } from "./ChatContext";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Tooltip,
//   useMapEvents,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { ChevronLeft, Locate, LocateFixed, MapPin } from "lucide-react";

// // Custom dart icon
// const dartIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// const MapComponent = () => {
//   const {
//     userPosition,
//     setUserPosition,
//     accuracy,
//     setAccuracy,
//     isTracking,
//     setIsTracking,
//     mapRef,
//     watchIdRef,
//     setShowMap,
//   } = useChat();

//   const [sharedDart, setSharedDart] = useState(null);
//   const [isDartMode, setIsDartMode] = useState(false);

//   // Get user location on load
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude, accuracy } = position.coords;
//         setUserPosition([latitude, longitude]);
//         setAccuracy(accuracy);
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//         setUserPosition([51.505, -0.09]); // Default to London
//       }
//     );

//     return () => {
//       if (watchIdRef.current) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//       }
//     };
//   }, []);

//   // Simulated dart placement
//   const updateSharedDart = async (latlng) => {
//     setSharedDart({
//       position: latlng,
//       placedBy: "MockUser",
//       timestamp: new Date(),
//     });
//     console.log("Mock: Dart placed at", latlng);
//   };

//   const clearSharedDart = async () => {
//     setSharedDart(null);
//     console.log("Mock: Dart cleared");
//   };

//   // Tracking logic
//   const toggleTracking = async () => {
//     if (isTracking) {
//       stopTracking();
//     } else {
//       await startTracking();
//     }
//   };

//   const startTracking = async () => {
//     if (navigator.geolocation) {
//       watchIdRef.current = navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude, accuracy } = position.coords;
//           setUserPosition([latitude, longitude]);
//           setAccuracy(accuracy);
//           if (mapRef.current) {
//             mapRef.current.flyTo([latitude, longitude], 15);
//           }
//         },
//         (error) => {
//           console.error("Error watching position:", error);
//           setIsTracking(false);
//         },
//         { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
//       );
//       setIsTracking(true);
//     }
//   };

//   const stopTracking = () => {
//     if (watchIdRef.current) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//     setIsTracking(false);
//   };

//   const toggleDartMode = () => {
//     setIsDartMode(!isDartMode);
//   };

//   if (!userPosition) {
//     return (
//       <div className="h-screen w-full flex items-center justify-center">
//         Loading map...
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-screen w-full">
//       <MapContainer
//         center={userPosition}
//         zoom={15}
//         className="h-full w-full z-0"
//         whenCreated={(map) => {
//           mapRef.current = map;
//         }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Dart placement via click */}
//         {isDartMode && (
//           <MapClickHandler isDartMode={isDartMode} addDart={updateSharedDart} />
//         )}

//         {/* User location */}
//         {userPosition && (
//           <Marker position={userPosition}>
//             <Tooltip permanent direction="top" offset={[0, -10]}>
//               Your Location
//             </Tooltip>
//           </Marker>
//         )}

//         {/* Mock dart */}
//         {sharedDart && (
//           <Marker
//             position={[sharedDart.position.lat, sharedDart.position.lng]}
//             icon={dartIcon}
//           >
//             <Popup>
//               <div className="p-2">
//                 <p className="font-medium">Group Target</p>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     clearSharedDart();
//                   }}
//                   className="mt-2 text-sm text-red-500 hover:text-red-700"
//                 >
//                   Remove Target
//                 </button>
//               </div>
//             </Popup>
//           </Marker>
//         )}
//       </MapContainer>

//       {/* Buttons */}
//       <div className="absolute top-4 right-4 z-10 flex gap-2">
//         <button
//           onClick={toggleDartMode}
//           className={`p-2 rounded-full shadow-md ${
//             isDartMode ? "bg-red-500 text-white" : "bg-white hover:bg-gray-100"
//           }`}
//           title={isDartMode ? "Exit target mode" : "Set group target"}
//         >
//           <MapPin className="w-5 h-5" />
//         </button>

//         <button
//           onClick={toggleTracking}
//           className={`p-2 rounded-full shadow-md ${
//             isTracking ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           {isTracking ? (
//             <LocateFixed className="w-5 h-5" />
//           ) : (
//             <Locate className="w-5 h-5" />
//           )}
//         </button>

//         <button
//           onClick={() => setShowMap(false)}
//           className="bg-white px-3 py-2 rounded-full shadow-md hover:bg-gray-100 text-sm flex items-center"
//         >
//           <ChevronLeft className="w-4 h-4 mr-1" />
//           Back
//         </button>
//       </div>

//       {/* Dart hint */}
//       {isDartMode && (
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-10">
//           Click on map to set group target
//         </div>
//       )}
//     </div>
//   );
// };

// // Click handler
// const MapClickHandler = ({ isDartMode, addDart }) => {
//   useMapEvents({
//     click: (e) => {
//       if (isDartMode) {
//         addDart(e.latlng);
//       }
//     },
//   });
//   return null;
// };

// export default MapComponent;

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "./ChatContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Menu,
  X,
  ChevronLeft,
  Locate,
  LocateFixed,
  MapPin,
} from "lucide-react";

// Custom dart icon
const dartIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Click handler for placing the dart
const MapClickHandler = ({ isDartMode, addDart }) => {
  useMapEvents({
    click: (e) => {
      if (isDartMode) {
        addDart(e.latlng);
      }
    },
  });
  return null;
};

const MapComponent = () => {
  const {
    menuOpen,
    setMenuOpen,
    userPosition,
    setUserPosition,
    accuracy,
    setAccuracy,
    isTracking,
    setIsTracking,
    isDartMode,
    setIsDartMode,
    mapRef,
    watchIdRef,
    setShowMap,
  } = useChat();

  const [sharedDart, setSharedDart] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserPosition([latitude, longitude]);
        setAccuracy(accuracy);
      },
      (error) => {
        console.error("Error getting location:", error);
        setUserPosition([51.505, -0.09]); // fallback
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const addDart = (latlng) => {
    setSharedDart({
      position: [latlng.lat, latlng.lng],
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const removeDart = () => {
    setSharedDart(null);
  };

  const toggleTracking = () => {
    isTracking ? stopTracking() : startTracking();
  };

  const startTracking = () => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserPosition([latitude, longitude]);
          setAccuracy(accuracy);
          if (mapRef.current && isTracking) {
            mapRef.current.flyTo([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error("Error watching position:", error);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
      setIsTracking(true);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  const toggleDartMode = () => {
    setIsDartMode(!isDartMode);
  };

  if (!userPosition) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={userPosition}
        zoom={15}
        className="h-full w-full z-0"
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler isDartMode={isDartMode} addDart={addDart} />

        {/* User location */}
        <Marker position={userPosition}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <div className="font-medium">Your Location</div>
            <div className="text-xs text-green-500">
              {isTracking ? "Live updating" : "Last known position"}
            </div>
            {accuracy && (
              <div className="text-xs text-gray-600">
                Accuracy: {Math.round(accuracy)} meters
              </div>
            )}
          </Tooltip>
        </Marker>

        {accuracy && (
          <Circle
            center={userPosition}
            radius={accuracy}
            color="#3182ce"
            fillColor="#3182ce"
            fillOpacity={0.2}
          />
        )}

        {/* Shared dart marker */}
        {sharedDart && (
          <Marker position={sharedDart.position} icon={dartIcon}>
            <Popup>
              <div className="space-y-1">
                <div className="font-medium">Group Target</div>
                <div className="text-xs text-gray-500">
                  Placed at: {sharedDart.timestamp}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDart();
                  }}
                  className="mt-1 text-xs text-red-500 hover:text-red-700"
                >
                  Remove Dart
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Controls */}
      <div className="absolute top-4 right-10 z-10 flex items-center">
        {/* Dart mode toggle */}
        <button
          onClick={toggleDartMode}
          className={`p-2 rounded-full shadow-md mr-2 ${
            isDartMode ? "bg-red-500 text-white" : "bg-white hover:bg-gray-100"
          }`}
          title={isDartMode ? "Exit dart mode" : "Place group dart"}
        >
          <MapPin className="w-5 h-5" />
        </button>

        {/* Location tracking toggle */}
        <button
          onClick={toggleTracking}
          className={`p-2 rounded-full shadow-md mr-2 ${
            isTracking ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
          }`}
          title={isTracking ? "Stop tracking" : "Track location"}
        >
          {isTracking ? (
            <LocateFixed className="w-5 h-5" />
          ) : (
            <Locate className="w-5 h-5" />
          )}
        </button>

        {/* Menu */}
        <div className="relative mr-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 w-48 z-20">
              <button
                onClick={toggleDartMode}
                className={`block w-full text-left text-sm p-2 hover:bg-gray-100 flex items-center ${
                  isDartMode ? "text-red-500" : ""
                }`}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isDartMode ? "Exit Dart Mode" : "Dart Mode"}
              </button>

              <button
                onClick={toggleTracking}
                className="block w-full text-left text-sm p-2 hover:bg-gray-100 flex items-center"
              >
                {isTracking ? (
                  <LocateFixed className="w-4 h-4 mr-2" />
                ) : (
                  <Locate className="w-4 h-4 mr-2" />
                )}
                {isTracking ? "Stop Tracking" : "Track Location"}
              </button>

              {sharedDart && (
                <button
                  onClick={removeDart}
                  className="block w-full text-left text-sm p-2 hover:bg-gray-100 text-red-500"
                >
                  Clear Dart
                </button>
              )}
            </div>
          )}
        </div>

        {/* Back to chat */}
        <button
          onClick={() => setShowMap(false)}
          className="bg-white px-3 py-2 rounded-full shadow-md hover:bg-gray-100 text-sm flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to chat
        </button>
      </div>

      {/* Dart mode hint */}
      {isDartMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-10">
          Click on map to place a dart
        </div>
      )}
    </div>
  );
};

export default MapComponent;
