import React, { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction, FC } from 'react'

let autoComplete: any;

interface Props {
    name: string;
    county: string;
    setCounty: any;
    error: {
        name: boolean, 
        firstName: boolean,
        email: boolean, 
        password: boolean, 
        gender: boolean, 
        cnp: boolean, 
        city: boolean, 
        county: boolean, 
        street: boolean, 
        domiciliu: boolean, 
        buletin: boolean
    }
    setError: any;
    errorMessages: {
        name: string, 
        firstName: string, 
        email: string, 
        password: string, 
        gender: string, 
        cnp: string, 
        city: string, 
        county: string, 
        street: string, 
        domiciliu: string, 
        buletin: string
    }
    setErrorMessages: any;
}

const loadScript = (url: any, callback: any) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if ((script as any).readyState) {
    (script as any).onreadystatechange = function() {
      if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
        (script as any).onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery: any, autoCompleteRef: any) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(regions)"], componentRestrictions: { country: "ro" } }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery: any) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  console.log(addressObject);
}

const SearchLocationInput: FC<Props> = ({ name, county, setCounty, error, setError, errorMessages, setErrorMessages }) => {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  console.log(autoCompleteRef); 

  return (
      <input
        ref={autoCompleteRef}
        onChange={event => setCounty(event.target.value)}
        placeholder="Enter a City"
        value={county}
      />
  );
}

export default SearchLocationInput;