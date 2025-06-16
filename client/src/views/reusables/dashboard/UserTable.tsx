import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import type { FetchedUser } from "@/types";


interface UserTableProps {
  proxyUsers: FetchedUser[];
  setSearchTerm: (term: string) => void;
}

export const UserTable = ({ proxyUsers = [], setSearchTerm }: UserTableProps) => {
  const [searchTerm, setLocalSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    setSearchTerm(term);
  };

  // Only filter if proxyUsers is an array
  const filteredProxyUsers = Array.isArray(proxyUsers)
    ? proxyUsers.filter((user) =>
        [
          user.name,
          user.username,
          user.email,
          user.address.city,
          user.company.name,
        ].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proxy Users</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="w-full mb-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-md"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProxyUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address.city}</TableCell>
                <TableCell>{user.company.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};