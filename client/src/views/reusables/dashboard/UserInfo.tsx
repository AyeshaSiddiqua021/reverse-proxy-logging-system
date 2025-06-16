import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { User } from "@/types";
import { useMemo } from "react";


export const UserInfoCard = () => {
  const user = useMemo<User>(() => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    return {
      email: email || "Unknown",
      userId: userId || "Unknown",
      name: email?.split("@")[0] || "Anonymous",
    };
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Name: {user.name}</div>
        <div>Email: {user.email}</div>
      </CardContent>
    </Card>
  );
};