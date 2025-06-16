import { useState} from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { UserInfoCard } from "@/views/reusables/dashboard/UserInfo";
import { UserTable } from "@/views/reusables/dashboard/UserTable";
import type { FetchedUser } from "@/types";
import { requestProxy } from "@/services/proxy.apis";



export const UserDashboardPage = () => {
  const [users, setUsers] = useState<FetchedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleRequestProxy = async () => {
    setLoading(true);
    try {
      const response = await requestProxy();
      setUsers(response.data.data);
      toast.success("Proxy users fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch proxy users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex w-full h-full p-4 ">
      <div className="flex w-full flex-col gap-6 ">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Users Dashboard
          </a>
          <Button variant="outline" onClick={handleRequestProxy}>
            Request Proxy
          </Button>
        </div>
        <UserInfoCard />
        {loading ? (
          <>
            {/* Skeleton for User Table Card */}
            <Skeleton className="h-64 w-full rounded-xl" />
          </>
        ) : (
          <>
            <UserTable proxyUsers={users} setSearchTerm={setSearchTerm} />
          </>
        )}
      </div>
    </div>
  );
};
