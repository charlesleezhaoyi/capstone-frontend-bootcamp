import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function MemberControlTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dropdownLabel, setDropdownLabel] = useState<string>("Roles");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  });

  const handleDropdownClick = (field: string) => {
    if (field === "clear") {
      table.getColumn("role")?.setFilterValue("");
      setDropdownLabel("Roles");
    } else {
      table.getColumn("role")?.setFilterValue(field);
      setDropdownLabel(field);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-row">
          <Input
            id="name-search"
            placeholder="Filter by name"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-background"
          />
        </div>
        <DropdownMenu open={isDropdownOpen} onOpenChange={toggleDropdown}>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-background"
              data-state={isDropdownOpen ? "open" : "closed"}
              aria-expanded={isDropdownOpen}
            >
              {dropdownLabel}
              {isDropdownOpen ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDropdownClick("Owner")}>
              Owner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropdownClick("Admin")}>
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropdownClick("Member")}>
              Member
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary-background mx-1" />
            <DropdownMenuItem onClick={() => handleDropdownClick("clear")}>
              Clear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader className="text-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-md">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-md">
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
      {table.getRowModel().rows.length > 10 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
        </div>
      )}
    </div>
  );
}
