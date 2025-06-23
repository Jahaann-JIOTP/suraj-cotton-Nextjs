"use client";

import React, { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import config from "@/constant/apiRouteList";

// Table columns
export const columns = [
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      const status = row.getValue("Status");
      return (
        <div className="capitalize flex items-center justify-center gap-2">
          <FaCircle
            className={
              status === "High Current" || status === "High Voltage"
                ? "text-[#FF4D21]"
                : status === "Low Current" || status === "Low Voltage"
                ? "text-[#00D500]"
                : "text-yellow-500"
            }
          />
          {row.getValue("state")}
        </div>
      );
    },
  },
  {
    accessorKey: "Source",
    header: "Source",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Source")}</div>
    ),
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Status")}</div>
    ),
  },

  {
    accessorKey: "Time",
    header: "Last Occurrence",
    cell: ({ row }) => <div className="capitalize">{row.getValue("Time")}</div>,
  },
  {
    accessorKey: "alarm_count",
    header: "Occurrence",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("alarm_count")}</div>
    ),
  },
];

export function AlarmTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const removeDuplicates = (alarms) => {
    const seen = new Set();
    return alarms.filter((alarm) => {
      if (seen.has(alarm._id)) return false;
      seen.add(alarm._id);
      return true;
    });
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = () => {
      axios
        .get(`${config.BASE_URL}/alarms`) // Update to your backend API URL
        .then((response) => {
          const alarms = response.data?.alarms || [];
          const formattedAlarms = alarms.map((alarm) => ({
            _id: alarm._id, // required for uniqueness
            state: alarm.end_time ? "Inactive" : "Active", // sets state based on end_time
            Source: alarm.Source,
            Status: alarm.status1,
            Time: alarm.current_time,
            alarm_count: alarm.alarm_count,
          }));

          const uniqueData = removeDuplicates(formattedAlarms);

          setData(uniqueData);
          setLoading(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full mt-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#1F5897]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-[#1F5897]">
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  const isLast = index === headerGroup.headers.length - 1;

                  return (
                    <TableHead
                      key={header.id}
                      className={`text-white text-center border-r border-white ${
                        isFirst ? "rounded-tl-md" : ""
                      } ${
                        isLast ? "rounded-tr-md border-r-0" : ""
                      } hover:bg-[#1F5897]`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center border-r last:border-r-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
