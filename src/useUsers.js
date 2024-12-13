import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async (id) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id ? id : ""}`
  );
  return data;
};

const useUsers = ({ enabled, id }) => {
  console.log(id);

  return useQuery({
    queryKey: id ? ["users", id] : ["users"],
    queryFn: () => fetchUsers(id),

    enabled,
  });
};

export default useUsers;
