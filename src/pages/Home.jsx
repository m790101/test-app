import React from 'react'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { useCallback, useState, useRef, useEffect } from 'react'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import axios from 'axios'
import Details from './../components/Details'

let center = { lat: 25.03, lng: 121.554 }
const containerStyle = { width: '100vw', height: '100vh' }

const libraries = ["places"];

const Map = () => {

  useEffect(() => {
    axios.get('https://my-json-server.typicode.com/m790101/parking-data/data')
    .then(data=>{
      data.data.park.map(async(p)=>{
        const response = await getGeocode({ address: p.address })
        const { lat, lng } = await getLatLng(response[0]);
        setParkingMarkers((currents)=>{
          currents = currents.filter(current=>current.id !== p.id)
          return [...currents,{
            ...p,
            lat,
            lng
          }]
        })
    })
  })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setMarkers(() => [{
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          time: new Date() + 23
        }])
      },
      () => null
    )
  }, [])




  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries
  })
  let [parkingMarkers, setParkingMarkers] = useState([])
  const [markers, setMarkers] = useState([])
  const [searchMarkers, setSearchMarkers] = useState([])
  const mapRef = useRef()
  const onMapLoad = useCallback(map => {
    mapRef.current = map

  }, [])
  const [selected, setSelected] = useState(null)

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(17);

  }, []);



  if (!isLoaded) {
    return (
      <h1>Loading...</h1>
    )
  }
  return (
    <div>
        {selected&&<Details data={selected}
        onCloseClick={() => setSelected(null)}
        />}
      <Search panTo={panTo} setSearchMarkers={setSearchMarkers} />
      <Locate panTo={panTo} setMarkers={setMarkers} setSearchMarkers={setSearchMarkers} />
      <GoogleMap center={center}
        zoom={13}
        mapContainerStyle={containerStyle}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullScreenControl: false,
          disableDefaultUI: true,
          zoomControl: true,
        }}
        onLoad={onMapLoad}
      >
        {searchMarkers.map(marker => <Marker
          key={marker.time/*.toISOString()*/}
          position={{ lat: marker.lat, lng: marker.lng }}
        />)}
        {parkingMarkers.map(marker => <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelected(marker)
          }}
        />)}
        {markers.map(marker => <Marker
          key={marker.time/*.toISOString()*/}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={{
            url: 'https://i.imgur.com/kDPoOVw.png',
            scaledSize: new window.google.maps.Size(30, 23),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 11)
          }}
        />)}
      </GoogleMap>
    </div>
  )

}

function Locate({ panTo,setMarkers,setSearchMarkers}) {
  return (
    <button
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setMarkers(() => [{
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              time: new Date() + 23
            }])
            setSearchMarkers([])
          },
          () => null
        );

      }
      }

    >
      press me
    </button>
  );
}



function Search({ panTo, setSearchMarkers }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      //location:{lat: ()=>25.03, lng: ()=>121.554},
      //radius:200*1000
    }
  })

  const handleInput = (e) => {
    setValue(e.target.value);
  }

  const handleSelect =
    ({ description }) =>
      async () => {
        setValue(description, false);
        clearSuggestions();
        const response = await getGeocode({ address: description })
        const { lat, lng } = await getLatLng(response[0]);
        panTo({ lat, lng })
        setSearchMarkers(current => [{
          lat: lat,
          lng: lng,
          time: new Date().getTime
        }])

      };


  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    })

  return (
    <div>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  )
}
export default Map