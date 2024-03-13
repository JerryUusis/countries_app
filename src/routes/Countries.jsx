import { useEffect, useState } from "react";
import { Box, TextField, Card, CardMedia, Typography, List, ListItem, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { initializeCountries } from "../store/countriesSlice";
import { addFavourite } from "../store/favouritesSlice";

const Countries = () => {
  const dispatch = useDispatch();
  const countriesList = useSelector((state) => state.countries.countries);
  const loading = useSelector((state) => state.countries.isLoading);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(initializeCountries());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
      >
        <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%" }} />
      </Box>
    );
  }

  // Flag is in 2∶1 in aspect ratio. Use this value to adjust the scale the flag size correctly.
  const flagHeight = 130;

  const formatLanguages = (languagesObject) => {
    if (!languagesObject) {
      return []
    }

    const languages = Object.values(languagesObject);
    if (languages.length === 0) {
      return [];
    }

    const formattedLanguages = [];
    if (languages.length === 1) {
      return languages;
    }
    for (let i = 0; i < languages.length; i++) {
      if (languages.length - 1 === i) {
        formattedLanguages.push(languages[i]);
      }
      else if (languages.length - 2 === i) {
        formattedLanguages.push(languages[i] + " & ")
      }
      else {
        formattedLanguages.push(languages[i] + ", ")
      }
    }
    return formattedLanguages
  }

  const formatCurrencies = (currencyObject) => {
    if (!currencyObject) {
      return [];
    }

    const currencies = Object.values(currencyObject);

    if (currencies.length === 0) {
      return [];
    }

    if (currencies.length === 1) {
      return currencies[0].name;
    }
    else {
      const formattedCurrencies = [];
      for (let i = 0; i < currencies.length; i++) {
        if (i === currencies.length - 1) {
          formattedCurrencies.push(currencies[i].name);
        }
        else if (i === currencies.length - 2) {
          formattedCurrencies.push(currencies[i].name + " & ")
        }
        else {
          formattedCurrencies.push(currencies[i].name + ", ")
        }
      }
      return formattedCurrencies;
    }
  }

  return (
    <Box sx={{ my: "2rem" }}>
      <Box sx={{ my: "2rem", display: "flex", justifyContent: "center" }}>
        <TextField label="Countries" placeholder="Search for countries" onChange={(e) => setSearch(e.target.value)}></TextField>
      </Box>
      <Box sx={{ display: "flex", flexFlow: "wrap", gap: "1rem", justifyContent: "center" }}>
        {countriesList
          .filter((country) =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
          )
          .map((country) => (
            <Box key={country.name.common}>
              <Card sx={{ height: "350px", width: `${flagHeight * 2}px`, display: "flex", flexDirection: "column" }}>
                <Box position={"relative"}>
                  <FavoriteIcon
                    onClick={() => dispatch(addFavourite(country))}
                    sx={{position:"absolute", top: 0, right: 0, m:"0.125rem", cursor:"pointer" }}
                  />
                  <Link
                    to={`/countries/${country.name.common}`}
                    state={{ country: country }}
                  >
                    <CardMedia
                      image={country.flags.svg}
                      sx={{ height: `${flagHeight}px` }}
                    />
                  </Link>
                </Box>
                <Box sx={{ p: "1rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap:"0.25rem"}}>
                    <Typography sx={{ fontWeight: "bold", lineHeight: "1" }}>{country.name.common}</Typography>
                    <Typography sx={{ lineHeight: "1" }}>
                      {country.name.official}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-evenly" }}>
                    <Typography sx={{ fontSize: "0.9rem", lineHeight: "1", fontStyle: "italic" }}>
                      {formatLanguages(country.languages)}
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem" }} >
                      {formatCurrencies(country.currencies)}
                    </Typography>
                  </Box>
                    <Typography >
                      {country.population.toLocaleString()}
                    </Typography>
                </Box>
              </Card>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Countries;