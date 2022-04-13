import React, { useEffect, useRef } from "react";
import type { FC } from 'react'

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
        street: string, 
        domiciliu: string, 
        buletin: string
    }
    setErrorMessages: any;
    setFullExactPosition: any;
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

function handleScriptLoad(updateQuery: any, autoCompleteRef: any, setFullExactPosition: any) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(regions)"], componentRestrictions: { country: "ro" } }
  );
  autoComplete.setFields(["address_components", "formatted_address", 'name']);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, setFullExactPosition)
  );
}

async function handlePlaceSelect(updateQuery: any, setFullExactPosition: any) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.name;
  setFullExactPosition(addressObject)
  updateQuery(query);
}

const SearchLocationInput: FC<Props> = ({ name, county, setCounty, error, setError, errorMessages, setErrorMessages, setFullExactPosition }) => {
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`,
      () => handleScriptLoad(setCounty, autoCompleteRef, setFullExactPosition)
    );
  }, []);

  return (
      <input
        ref={autoCompleteRef}
        onChange={e => { setCounty(e.target.value); setError({ ...error, city: false }); setErrorMessages({ ...errorMessages, city: '' }) }}
        value={county}
        name={name}
        id={name}
        placeholder=''
      />
  );
}

export default SearchLocationInput;