// In Landing.jsx
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import CocktailList from "../components/CocktailList";
import SearchForm from "../components/SearchForm";
import { useQuery } from "@tanstack/react-query";

const cocktailSearchUrl =
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

// Update the search function to use 'a' as default search term to get some drinks
const searchCocktailsQuery = (searchTerm) => {
  return {
    queryKey: ["search", searchTerm || "all"],
    queryFn: async () => {
      // If no search term, search for 'a' to get some default drinks
      const termToUse = searchTerm || "a";
      const response = await axios.get(`${cocktailSearchUrl}${termToUse}`);
      return response.data.drinks || [];
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    try {
      const url = new URL(request.url);
      const searchTerm = url.searchParams.get("search") || "";
      await queryClient.ensureQueryData(searchCocktailsQuery(searchTerm));
      return { searchTerm };
    } catch (error) {
      console.log(error);
      return { searchTerm: "" };
    }
  };

const Landing = () => {
  const { searchTerm } = useLoaderData();
  const { data: drinks } = useQuery(searchCocktailsQuery(searchTerm));

  return (
    <>
      <SearchForm searchTerm={searchTerm} />
      <CocktailList drinks={drinks} />
    </>
  );
};

export default Landing;
