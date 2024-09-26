import { getAllFeeds } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { useToast } from "react-native-toast-notifications";

export const useFetchData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const toast = useToast();

  const getAllFeed = async () => {
    setIsLoading(true);
    try {
      let res = await getAllFeeds();
      setData(res);
    } catch (error) {
      toast.show("Error Fetching feeds. Try again in a while!", {
        type: "error",
        placement: "bottom",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => getAllFeed();

  useEffect(() => {
    getAllFeed();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
