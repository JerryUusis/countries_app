import { Country } from "./country";

interface CountriesStateType {
  countries: {
    countries: Country[];
    isLoading: boolean;
  };
}

interface VisitedCountriesStateType {
  visitedCountries: {
    visitedCountries: string[];
  };
}

interface AlertStateType {
  alert: {
    isVisible: boolean;
    message: string;
    severity: "success" | "warning" | "error" | "info";
  };
}

export { CountriesStateType, VisitedCountriesStateType, AlertStateType };
