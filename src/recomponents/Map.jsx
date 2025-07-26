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
  Users,
  Share2,
} from "lucide-react";

// Custom icons
const dartIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const currentUserIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

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
    currentUser,
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
    activeChat,
    chatType,
    contacts,
    groupLocations,
    privateLocations,
    activeDart,
    placeGroupDart,
    placePrivateDart,
    shareLocationWithGroup,
    shareLocationPrivate,
  } = useChat();

  const [sharedDart, setSharedDart] = useState(null);
  const [sharedLocations, setSharedLocations] = useState({});
  const [locationError, setLocationError] = useState(null);

  // Initialize user position with better error handling
  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log("Obtained real location:", latitude, longitude);
      setUserPosition([latitude, longitude]);
      setAccuracy(accuracy);
      setLocationError(null);

      // Immediately share location if in a chat
      if (activeChat) {
        if (chatType === "group") {
          shareLocationWithGroup(activeChat.id);
        } else if (chatType === "private") {
          shareLocationPrivate(activeChat.id);
        }
      }
    };

    const handleError = (error) => {
      console.error("Geolocation error:", error);
      setLocationError(error.message);
      // Don't set London fallback - leave position as null
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
    } else {
      console.error("Geolocation not supported");
      setLocationError("Geolocation not supported by browser");
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [activeChat, chatType]);

  // Update shared locations when group/private locations change
  useEffect(() => {
    if (chatType === "group") {
      setSharedLocations(groupLocations);
    } else if (chatType === "private") {
      setSharedLocations(privateLocations);
    }
  }, [groupLocations, privateLocations, chatType]);

  // Update dart position when activeDart changes
  useEffect(() => {
    if (activeDart?.latitude && activeDart?.longitude) {
      setSharedDart({
        position: [activeDart.latitude, activeDart.longitude],
        timestamp:
          activeDart.timestamp?.toDate?.()?.toLocaleTimeString() ||
          new Date().toLocaleTimeString(),
        placedBy: activeDart.placedBy,
      });
    } else {
      setSharedDart(null);
    }
  }, [activeDart]);

  const addDart = async (latlng) => {
    if (!activeChat) return;

    const position = [latlng.lat, latlng.lng];
    let success;

    if (chatType === "group") {
      success = await placeGroupDart(activeChat.id, position);
    } else if (chatType === "private") {
      success = await placePrivateDart(activeChat.id, position);
    }

    if (success) {
      setSharedDart({
        position,
        timestamp: new Date().toLocaleTimeString(),
        placedBy: currentUser?.uid,
      });
    }
  };

  const removeDart = async () => {
    if (!activeChat) return;

    let success;
    if (chatType === "group") {
      success = await placeGroupDart(activeChat.id, null);
    } else if (chatType === "private") {
      success = await placePrivateDart(activeChat.id, null);
    }

    if (success) {
      setSharedDart(null);
    }
  };

  const handleShareLocation = async () => {
    if (!activeChat || !userPosition) {
      console.error("Cannot share location - no active chat or position");
      return;
    }

    try {
      let success;
      if (chatType === "group") {
        success = await shareLocationWithGroup(activeChat.id);
      } else if (chatType === "private") {
        success = await shareLocationPrivate(activeChat.id);
      }

      if (success) {
        console.log("Location shared successfully");
        if (!isTracking) {
          startTracking();
        }
      }
    } catch (error) {
      console.error("Error sharing location:", error);
    }
  };

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
      handleShareLocation();
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not available");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log("Position update:", latitude, longitude);
        setUserPosition([latitude, longitude]);
        setAccuracy(accuracy);

        // Share new location
        if (activeChat) {
          if (chatType === "group") {
            shareLocationWithGroup(activeChat.id);
          } else if (chatType === "private") {
            shareLocationPrivate(activeChat.id);
          }
        }

        // Center map if tracking
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 15);
        }
      },
      (error) => {
        console.error("Error watching position:", error);
        setIsTracking(false);
        setLocationError(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );
    setIsTracking(true);
    console.log("Started location tracking");
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    console.log("Stopped location tracking");
  };

  const toggleDartMode = () => {
    setIsDartMode(!isDartMode);
  };

  if (!userPosition) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          {locationError ? (
            <>
              <div className="text-red-500 font-medium mb-2">
                Location Error: {locationError}
              </div>
              <p className="text-gray-600">
                Please enable location permissions in your browser settings
              </p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4 mx-auto"></div>
              <p className="text-gray-600">Getting your location...</p>
            </>
          )}
        </div>
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

     

        {accuracy && (
          <Circle
            center={userPosition}
            radius={accuracy}
            color="#3182ce"
            fillColor="#3182ce"
            fillOpacity={0.2}
          />
        )}

        {/* Other users' locations */}
        {Object.entries(sharedLocations).map(([userId, location]) => {
          if (!location?.latitude || !location?.longitude) return null;
          if (userId === currentUser?.uid) return null;

          const contact = contacts.find((c) => c.id === userId);
          const name = contact?.username || contact?.firstName || "User";

          return (
            <Marker
              key={userId}
              position={[location.latitude, location.longitude]}
              icon={userIcon}
            >
              <Tooltip permanent direction="top">
                <div className="font-medium">{name}</div>
                <div className="text-xs text-gray-500">
                  {location.timestamp
                    ? new Date(location.timestamp.toDate()).toLocaleTimeString()
                    : "Just now"}
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {/* Shared dart marker */}
        {sharedDart && (
          <Marker position={sharedDart.position} icon={dartIcon}>
            <Popup>
              <div className="space-y-1">
                <div className="font-medium">
                  {chatType === "group" ? "Group Target" : "Shared Location"}
                </div>
                <div className="text-xs text-gray-500">
                  Placed at: {sharedDart.timestamp}
                </div>
                {sharedDart.placedBy && (
                  <div className="text-xs text-gray-500">
                    By:{""}
                    {contacts.find((c) => c.id === sharedDart.placedBy)
                      ?.username || "Someone"}
                  </div>
                )}
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
        {/* Share location button */}
        <button
          onClick={handleShareLocation}
          className={`p-2 rounded-full shadow-md mr-2 ${
            isTracking
              ? "bg-green-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Share my location"
        >
          <Share2 className="w-5 h-5" />
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
                className={` w-full text-left text-sm p-2 hover:bg-gray-100 flex items-center ${
                  isDartMode ? "text-red-500" : ""
                }`}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isDartMode ? "Exit Dart Mode" : "Dart Mode"}
              </button>

              <button
                onClick={toggleTracking}
                className=" w-full text-left text-sm p-2 hover:bg-gray-100 flex items-center"
              >
                {isTracking ? (
                  <LocateFixed className="w-4 h-4 mr-2" />
                ) : (
                  <Locate className="w-4 h-4 mr-2" />
                )}
                {isTracking ? "Stop Tracking" : "Track Location"}
              </button>

              <button
                onClick={handleShareLocation}
                className=" w-full text-left text-sm p-2 hover:bg-gray-100 flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Location
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

      {/* Location error banner */}
      {locationError && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-10">
          <div className="flex items-center justify-between">
            <span>Location Error: {locationError}</span>
            <button
              onClick={() => setLocationError(null)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
