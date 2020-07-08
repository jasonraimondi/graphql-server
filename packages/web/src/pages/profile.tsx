import React from "react";
import { NextPage } from "next";
import useSWR from "swr"
import { withLayout } from "@/app/components/layouts/layout";
import { apiSDK } from "@/app/lib/api_sdk";

const meFetcher = () => apiSDK.Me()
const useMe = () => {
  const { data, error } = useSWR([], meFetcher);
  return {
    user: data,
    isLoading: !error && !data,
    isError: error
  }
}

const Profile: NextPage = () => {
  const { user, isLoading, isError } = useMe();
  // const { user, isLoading, isError } = useUser("72db662c-6d0e-4a5a-b743-c732739db7b7");
  console.log(user, isLoading, isError);
  if (isError) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {JSON.stringify(user)}!</div>


  //
  // const { data, loading, error } = useSWR({ fetchPolicy: "network-only" });
  // // console.log({ data, loading, error });
  //
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  //
  // if (error) {
  //   return <div>Error {JSON.stringify(error)}</div>;
  // }
  //
  // if (data) {
  //   const { me } = data;
  //   return (
  //     <div>
  //       <p>{me.uuid}</p>
  //       <p>{me.email}</p>
  //       <p>{me.name}</p>
  //     </div>
  //   );
  // }
  //
  // return <div>Something went wrong!</div>;
};

export default withLayout(Profile, {
  protectedRoute: true,
  title: "User profile",
});
