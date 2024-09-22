import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Table, { Show } from "./Table";

type GenreProps = {
  genres: string[];
};

const Genres = ({ genres }: GenreProps) => {
  // Loop through the array and create a badge-like component instead of a comma-separated string
  if (!genres) return;
  return (
    <>
      {genres.map((genre, idx) => {
        return (
          <span
            key={idx}
            style={{
              backgroundColor: "green",
              marginRight: 4,
              padding: 3,
              borderRadius: 5,
            }}
          >
            {genre}
          </span>
        );
      })}
    </>
  );
};
function convertToHoursAndMinutes(runtime: number) {
  const hour = Math.floor(runtime / 60);
  const min = Math.floor(runtime % 60);
  return `${hour} hour(s) and ${min} minute(s)`;
}
function App() {
  const [data, setData] = useState<Show[]>();
  const columnHelper = createColumnHelper<Show>();

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: "tv_show",
        header: () => <span>TV Show</span>,
        columns: [
          columnHelper.accessor("show.name", {
            header: "Name",
            cell: (info) => info.getValue(),
            enableSorting: false,
            getGroupingValue: (row) => `${row.show.name} `,
            aggregationFn: "count",
            // enableColumnFilter: true,
          }),
          columnHelper.accessor("show.type", {
            header: "Type",
            cell: (info) => info.getValue(),
            aggregationFn: "count",
            // enableColumnFilter: false,
          }),
        ],
      }),
      columnHelper.group({
        id: "details",
        header: () => <span> Details</span>,
        columns: [
          columnHelper.accessor("show.language", {
            header: "Language",
            cell: (info) => info.getValue(),
            aggregationFn: "count",
            // enableColumnFilter: false,
          }),
          columnHelper.accessor("show.genres", {
            header: "Genres",
            cell: (info) => <Genres genres={info.getValue()} />,
            // enableColumnFilter: false,
          }),
          columnHelper.accessor("show.runtime", {
            header: "Runtime",
            cell: (info) => convertToHoursAndMinutes(info.getValue()),
            // enableColumnFilter: false,
          }),
          columnHelper.accessor("show.status", {
            header: "Status",
            cell: (info) => info.getValue(),
            aggregationFn: "count",
            // enableColumnFilter: false,
          }),
        ],
      }),
    ],
    []
  );
  const fetchData = async () => {
    const result = await axios("https://api.tvmaze.com/search/shows?q=snow");
    setData(result.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(data);
  return <>{data && <Table columns={columns} data={data} />}</>;
}

export default App;
