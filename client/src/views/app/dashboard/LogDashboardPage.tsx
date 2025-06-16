import { useEffect, useState} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {  GalleryVerticalEnd } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LogTable } from "@/views/reusables/dashboard/LogTable";
import { UserInfoCard } from "@/views/reusables/dashboard/UserInfo";
import type { Log } from "@/types";
import { getProxyLogs, toggleLogging, toggleWhitelist } from "@/services/proxy.apis";

export const LogDashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggleLog = async ( enabled: boolean) => {
    try {
      await toggleLogging(enabled);
      toast.success(
        `Logging ${enabled ? "enabled" : "disabled"} for this user`
      );
    } catch (error) {
      toast.error("Failed to update logging setting.");
    }
  };

  const handleToggleWhitelist = async (
    originalUrl: string,
    whitelisted: boolean
  ) => {
    try {
      await toggleWhitelist(originalUrl, whitelisted);
      toast.success(
        `${originalUrl} ${whitelisted ? "added to" : "removed from"} whitelist`
      );
    } catch (error) {
      toast.error("Failed to update whitelist setting.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logsRes = await getProxyLogs();
        setLogs(logsRes.data.logs);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          "Something went wrong while fetching logs.";
        toast("Error has occurred", {
          description: errorMessage,
          action: {
            label: "Logout",
            onClick: handleLogout,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-muted flex w-full h-full p-4 ">
      <div className="flex w-full flex-col gap-6 ">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Proxy Logs Dashboard
          </a>
        </div>
        <UserInfoCard/>
        {loading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : (
          <>
            
            {/* Logs Table */}
            <LogTable
              logs={logs}
              searchTerm={searchTerm}
              currentPage={currentPage}
              setLogs={setLogs}
              handleToggleLog={handleToggleLog}
              handleToggleWhitelist={handleToggleWhitelist}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </div>
  );
};