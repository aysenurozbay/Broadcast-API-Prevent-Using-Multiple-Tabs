import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data;
};

const useUsers = (enabled) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    refetchInterval: 2000, // 2 saniyede bir veri çekmeye devam et
    enabled, // `enabled` parametresi sekme durumu ile kontrol edilir
  });
};

export default useUsers;
