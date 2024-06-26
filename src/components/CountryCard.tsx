import { Box, Card, CardMedia, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TranslateIcon from "@mui/icons-material/Translate";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";
import {
  addVisitedCountries,
  removeVisitedCountries,
} from "../store/visitedCountriesSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addVisitedCountryToFirebase,
  removeVisitedCountryFromFirebase,
  auth,
} from "../auth/firebase";
import {
  formatCurrencies,
  formatLanguages,
  handleAlert,
} from "../utils/helperFunctions";
import { VisitedCountriesStateType } from "../types/reduxStateTypes";
import { Country } from "../types/country";
import { AlertSeverity } from "../types/muiComponents";

interface CountryCardProps {
  country: Country;
}

const CountryCard = ({ country }: CountryCardProps) => {
  // Flag is in 2∶1 in aspect ratio. Use this value to adjust the scale the flag size correctly.
  const FLAG_HEIGHT = 130;
  const dispatch = useDispatch();

  const currentUser = auth.currentUser;

  const visitedCountries = useSelector(
    (state: VisitedCountriesStateType) =>
      state.visitedCountries.visitedCountries
  );

  // Shows alert on the page
  const showAlert = (message: string, severity: AlertSeverity) => {
    handleAlert(dispatch, message, severity);
  };

  const handleAddVisitedCountryClick = () => {
    try {
      if (currentUser) {
        dispatch(addVisitedCountries(country.name.common));
        addVisitedCountryToFirebase(currentUser.uid, country.name.common);
        showAlert(
          `Added ${country.name.common} to visited countries`,
          "success"
        );
      }
    } catch (error) {
      showAlert(
        `Error while adding ${country.name.common} to visited countries: ${error.message}`,
        "error"
      );
    }
  };

  const handleRemoveVisitedCountryClick = async () => {
    try {
      if (currentUser) {
        dispatch(removeVisitedCountries(country.name.common));
        await removeVisitedCountryFromFirebase(
          currentUser.uid,
          country.name.common
        );
        showAlert(
          `Removed ${country.name.common} from visited countries`,
          "success"
        );
      }
    } catch (error) {
      showAlert(
        `Error while removing ${country.name.common} from visited countries: ${error.message}`,
        "error"
      );
    }
  };

  const iconContainerProps = {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.25rem",
  };
  const smallIconProps = { fontSize: "0.9rem", opacity: "0.5" };
  const favouriteIconProps = {
    position: "absolute",
    top: 0,
    right: 0,
    m: "0.125rem",
    cursor: "pointer",
    color: "#FF69B4",
  };

  return (
    <Box key={country.name.common}>
      <Card
        sx={{
          height: "350px",
          width: `${FLAG_HEIGHT * 2}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box position={"relative"}>
          {visitedCountries.includes(country.name.common) ? (
            <FavoriteIcon
              onClick={handleRemoveVisitedCountryClick}
              sx={favouriteIconProps}
            />
          ) : (
            <FavoriteBorderIcon
              onClick={handleAddVisitedCountryClick}
              sx={favouriteIconProps}
            />
          )}
          <Link
            to={`/countries/${country.name.common}`}
            state={{ country: country }}
          >
            <CardMedia
              image={country.flags.svg}
              sx={{ height: `${FLAG_HEIGHT}px` }}
            />
          </Link>
        </Box>
        <Box
          sx={{
            p: "1rem",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <Typography sx={{ fontWeight: "bold", lineHeight: "1" }}>
              {country.name.common}
            </Typography>
            <Typography sx={{ lineHeight: "1" }}>
              {country.name.official}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <Box sx={iconContainerProps}>
              <TranslateIcon sx={smallIconProps} />
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  lineHeight: "1",
                  fontStyle: "italic",
                }}
              >
                {formatLanguages(country.languages)}
              </Typography>
            </Box>
            <Box sx={iconContainerProps}>
              <AttachMoneyIcon sx={smallIconProps} />
              <Typography sx={{ fontSize: "0.9rem", lineHeight: "1" }}>
                {formatCurrencies(country.currencies)}
              </Typography>
            </Box>
          </Box>
          <Box sx={iconContainerProps}>
            <PeopleIcon sx={smallIconProps} />
            <Typography sx={{ fontSize: "0.9rem", lineHeight: "1" }}>
              {country.population.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CountryCard;
