import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useCallback } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Log {
  user?: { email: string };
  method: string;
  originalUrl: string;
  statusCode: number;
  timestamp: string;
  isEnabled?: boolean;
  isWhitelisted?: boolean;
}

interface LogTableProps {
  logs: Log[];
  searchTerm: string;
  currentPage: number;
  setLogs: (logs: Log[]) => void;
  handleToggleLog: (enabled: boolean) => Promise<void>;
  handleToggleWhitelist: (originalUrl: string, whitelisted: boolean) => Promise<void>;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export const LogTable = ({
  logs,
  searchTerm,
  currentPage,
  setLogs,
  handleToggleLog,
  handleToggleWhitelist,
  setCurrentPage,
  totalPages,
}: LogTableProps) => {
  const ITEMS_PER_PAGE = 10;

  // Memoized function to filter and paginate logs
  const getPaginatedLogs = useCallback(() => {
    const filteredLogs = logs.filter((log) =>
      [
        log.user?.email || "Anonymous",
        log.method,
        log.originalUrl,
        log.statusCode.toString(),
        new Date(log.timestamp).toLocaleString(),
      ].some((field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, endIndex);
  }, [logs, searchTerm, currentPage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proxy Logs</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getPaginatedLogs().map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.user?.email || "Anonymous"}</TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell>{log.originalUrl}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.statusCode}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex "
                        size="icon"
                      >
                        <EllipsisVertical />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={log.isEnabled || false}
                            onCheckedChange={async (checked) => {
                              await handleToggleLog(log.originalUrl, !!checked);
                              setLogs((prevLogs: Log[]) =>
                                prevLogs.map((l: Log, i: number) =>
                                  i === index ? { ...l, isEnabled: !!checked } : l
                                ) as Log[]
                              );
                            }}
                          />
                          <Label className="font-normal">Enable Log</Label>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={log.isWhitelisted || false}
                            onCheckedChange={async (checked) => {
                              await handleToggleWhitelist(
                                log.originalUrl,
                                !!checked
                              );
                              setLogs((prevLogs: Log[]) =>
                                prevLogs.map((l: Log, i: number) =>
                                  i === index
                                    ? { ...l, isWhitelisted: !!checked }
                                    : l
                                ) as Log[]
                              );
                            }}
                          />
                          <Label className="font-normal">Add to Whitelist</Label>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
};