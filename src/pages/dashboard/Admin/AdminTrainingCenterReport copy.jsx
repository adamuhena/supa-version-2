import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/layout/spinner";
import { states } from "@/data/nigeria";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cross1Icon,
  PersonIcon,
  SewingPinFilledIcon,
} from "@radix-ui/react-icons";
import useLogout from "@/pages/loginPage/logout";
import { LogOut, Mail, PhoneCall, UserCircle } from "lucide-react";
import { API_BASE_URL } from "@/config/env";
import { fetchSectors } from "@/services/api";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const useDebounce = ({ onChange, debounce = 500 }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return { value, setValue };
};

const TrainingCenterReport = () => {
  const logout = useLogout();

  const [sectors, setSectors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetchSectors(accessToken);
        setSectors(response);
      } catch (err) {
        setError("Failed to fetch sectors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [hasLoadedFirst, sethasLoadedFirst] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading && !hasLoadedFirst) sethasLoadedFirst(true);
  }, [loading]);

  const [reports, setReports] = useState([]);
  const [pagination, setpagination] = useState({
    totalPages: 0,
    total: 0,
  });
  const totalPages = pagination.totalPages;

  const itemsPerPage = 25;

  const defaultData = {
    currentPage: 1,
    search: "",
    state: "",
    lga: "",
    sector: "",
    tradeArea: "",
    sort: "-createdAt",
  };
  const [filter, setFilter] = useState({
    ...defaultData,
  });

  const handleFilterChange = (key, value) => {
    setFilter((x) => ({ ...x, [key]: value }));
  };

  const currentPage = filter?.currentPage;

  // Add pagination state handler
  const handlePageChange = (page) => {
    setFilter((x) => ({ ...x, currentPage: page }));
  };

  const [loadingCSV, setLoadingCSV] = useState(false);
  const [csvData, setcsvData] = useState([]);
  const MAX_CSV_ROWS = 1000000;

  function replaceSymbolsWithSpace(str = "") {
    let replacedStr = str.replace(/[-/]/g, " ");
    return replacedStr.toLowerCase();
  }

  const selectedStateLGASResidence =
    states.find(
      (state) =>
        replaceSymbolsWithSpace(`${state?.value}`) ===
        replaceSymbolsWithSpace(`${filter?.state}`)
    )?.lgas || [];

  const selectedStateLGASResidenceFormatted =
    selectedStateLGASResidence && selectedStateLGASResidence?.length
      ? selectedStateLGASResidence.map((x) => ({
          label: x,
          value: x,
        }))
      : [];

  const { value: searchv, setValue } = useDebounce({
    debounce: 500,
    onChange: (debouncedValue) => {
      setFilter((x) => ({ ...x, search: debouncedValue }));
    },
  });

  function formatTCToCSV(users) {
    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }

    const headerMapping = {
      sn: "S/N",
      trainingCentreName: "Training Center",
      contactPersonName: "Contact Person Name",
      contactPersonPhone: "Contact Person Phone",
      contactPersonEmail: "Contact Person Email",
      state: "State of Origin",
      lga: "LGA of Origin",
      address: "Address",
      sectors: "Sectors",
      tradeAreas: "Trade Areas",
    };

    const headers = Object.keys(users[0]).map(
      (key) => headerMapping[key] || key
    );
    const rows = users.map((user) => Object.keys(user).map((key) => user[key]));

    return [headers, ...rows];
  }

  // const downloadCSV = async () => {
  //   setLoadingCSV(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");
  //     const response = await axios.get(
  //       `${API_BASE_URL}/trainingcenter/report`,
  //       {
  //         params: {
  //           limit: MAX_CSV_ROWS,
  //           page: 1,
  //           search: filter?.search,
  //           state: filter?.state,
  //           lga: filter?.lga,
  //           sector: filter?.sector,
  //           tradeArea: filter?.tradeArea,
  //           sort: filter?.sort,
  //         },
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     const { data } = response.data;
  //     const formatted = formatTCToCSV(
  //       (data || []).map((x, i) => {
  //         let sectors = "";
  //         let tradeAreas = "";

  //         (x?.legalInfo?.tradeAreas || []).map((area) => {
  //           (area?.sector || []).map((sector) => {
  //             sectors += sector?.name + ", ";
  //             (area?.tradeArea || []).map((ta_id) => {
  //               const found = (sector.tradeAreas || []).find(
  //                 (x) => x?._id === ta_id
  //               );
  //               if (found?.name) tradeAreas += found?.name + ", ";
  //             });
  //           });
  //         });

  //         return {
  //           sn: i + 1,
  //           trainingCentreName: x?.trainingCentreName,
  //           contactPersonName: x?.contactPerson,
  //           contactPersonPhone: x?.phoneNumber,
  //           contactPersonEmail: x?.email,
  //           state: x?.state,
  //           lga: x?.lga,
  //           address: x?.address,
  //           sectors,
  //           tradeAreas,
  //         };
  //       })
  //     );
  //     setcsvData(formatted);

  //     toast.success(
  //       "CSV data has ben generated with the filter options applied. Kindly click the 'Download CSV' button to download!"
  //     );
  //   } catch (error) {
  //     console.error("Error fetching reports:", error);
  //   } finally {
  //     setLoadingCSV(false);
  //   }
  // };


  const downloadCSV = async () => {
    setLoadingCSV(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/trainingcenter/report`,
        {
          params: {
            limit: MAX_CSV_ROWS,
            page: 1,
            search: filter?.search,
            state: filter?.state,
            lga: filter?.lga,
            sector: filter?.sector,
            tradeArea: filter?.tradeArea,
            sort: filter?.sort,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data } = response.data;
      const formatted = formatTCToCSV(
        (data || []).map((x, i) => {
          let sectors = "";
          let tradeAreas = "";

          (x?.legalInfo?.tradeAreas || []).map((area) => {
            (area?.sector || []).map((sector) => {
              sectors += sector?.name + ", ";
              (area?.tradeArea || []).map((ta_id) => {
                const found = (sector.tradeAreas || []).find(
                  (x) => x?._id === ta_id
                );
                if (found?.name) tradeAreas += found?.name + ", ";
              });
            });
          });

          return {
            sn: i + 1,
            trainingCentreName: x?.trainingCentreName,
            contactPersonName: x?.contactPerson,
            contactPersonPhone: x?.phoneNumber,
            contactPersonEmail: x?.email,
            state: x?.state,
            lga: x?.lga,
            address: x?.address,
            sectors,
            tradeAreas,
          };
        })
      );
      setcsvData(formatted);

      toast.success(
        "CSV data has ben generated with the filter options applied. Kindly click the 'Download CSV' button to download!"
      );
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoadingCSV(false);
    }
  };
  const clearFilter = () => {
    setFilter(defaultData);
    setValue("");
    setcsvData([]);
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/trainingcenter/report`,
        {
          params: {
            limit: itemsPerPage,
            page: filter?.currentPage,
            search: filter?.search,
            state: filter?.state,
            lga: filter?.lga,
            sector: filter?.sector,
            tradeArea: filter?.tradeArea,
            sort: filter?.sort,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data, pagination } = response.data;
      setReports(data);

      setpagination((x) => {
        return {
          ...x,
          total: pagination.total,
          totalPages: pagination.totalPages,
        };
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
      setcsvData([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [
    filter?.search,
    filter?.currentPage,
    filter?.state,
    filter?.lga,
    filter?.sector,
    filter?.tradeArea,
  ]);

  return (
    <ProtectedRoute>
      {loading && !hasLoadedFirst ? (
        <div className="flex justify-center items-center h-screen ">
          <Spinner />
        </div>
      ) : null}
      <DashboardPage title="Training Center Report">
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Training Center Reports</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className="flex gap-[20px] flex-wrap mb-2">
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Search</p>
              <Input
                className="text-[12px] placeholder:text-[12px]"
                placeholder="Name or email"
                // value={filter?.search}
                // onChange={(e) => handleFilterChange("search", e?.target?.value)}

                value={searchv}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State</p>
              <Select
                value={filter?.state}
                onValueChange={(value) => handleFilterChange("state", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((item) => {
                      return (
                        <SelectItem className="text-[12px]" value={item?.value}>
                          {item?.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Local Government</p>
              <Select
                value={filter.localGovernment}
                onValueChange={(value) => handleFilterChange("lga", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedStateLGASResidenceFormatted.map((item) => {
                      return (
                        <SelectItem className="text-[12px]" value={item?.value}>
                          {item?.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Sector</p>
              <Select
                value={filter?.sector}
                onValueChange={(value) => handleFilterChange("sector", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(sectors || []).map((sector) => (
                      <SelectItem
                        className="text-[12px]"
                        key={sector._id}
                        value={sector._id}>
                        {sector?.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Trade Area</p>
              <Select
                value={filter.tradeArea}
                onValueChange={(value) =>
                  handleFilterChange("tradeArea", value)
                }>
                <SelectTrigger className="text-[12px]">
                  <SelectValue
                    placeholder="Select Trade Area"
                    className="text-[12px]"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sectors
                      .find((sector) => sector._id === filter?.sector)
                      ?.tradeAreas?.map((ta) => {
                        return (
                          <SelectItem
                            className="text-[12px]"
                            key={ta?._id}
                            value={ta?._id}>
                            {ta?.name}
                          </SelectItem>
                        );
                      })}

                    {/* Add more trade areas as needed */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=" w-full items-center justify-start  flex gap-4">
            {/* <Button
                className="bg-emerald-700 mt-auto hover:bg-emerald-400"
                onClick={applyFilter}
                disabled={loading}>
                {loading ? (
                  <SewingPinFilledIcon className="animate-spin" />
                ) : (
                  "Apply Filter"
                )}
              </Button> */}
            <Button
              className="bg-slate-700 text-[white] mt-auto hover:bg-gray-300"
              onClick={clearFilter}
              disabled={loading}>
              Clear
              {loading ? (
                <SewingPinFilledIcon className="animate-spin" />
              ) : (
                <Cross1Icon />
              )}
            </Button>
          </div>

          <div className=" gap-2 flex justify-between w-full mt-4">
            <h2 className="font-medium">
              Total Reocrds Found: {pagination?.total || 0}
            </h2>
            <div className=" gap-2 flex flex-row-reverse  justify-start mb-4">
              {!csvData?.length ? (
                <button
                  onClick={downloadCSV}
                  className="border-[1px] text-[12px] p-2 font-medium">
                  Generate CSV
                  {loadingCSV ? (
                    <SewingPinFilledIcon className="animate-spin" />
                  ) : null}
                </button>
              ) : (
                <CSVLink
                  data={csvData}
                  className="border-[1px] text-[12px] p-2 font-medium"
                  disabled={loadingCSV || !reports?.length}>
                  Download CSV
                  {loadingCSV ? (
                    <SewingPinFilledIcon className="animate-spin" />
                  ) : null}
                </CSVLink>
              )}

              {/* <Button onClick={undefined} disabled={!reports.length}>
                Download PDF
              </Button> */}
            </div>
          </div>

          <Table className={`${loading ? "opacity-30" : ""} overflow-x-auto`}>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Training Center</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>State/LGA</TableHead>

                <TableHead>Address</TableHead>
                <TableHead>Sector</TableHead>

                {/*  <TableHead>Trade Area</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((center, index) => (
                <TableRow key={center._id || index}>
                  <TableCell className="text-left  text-[12px]">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell className="text-left max-w-[200px]  text-[12px]">
                    {center.trainingCentreName || ""}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-left text-[12px]">
                          {center?.contactPerson || "---"}
                        </span>
                        <div className="flex flex-row gap-1 items-center">
                          <PhoneCall className="size-[14px]" />
                          <span className="text-left text-[10px]">
                            {center?.phoneNumber || "---"}
                          </span>
                        </div>

                        <div className="flex flex-row gap-1 items-center">
                          <Mail className="size-[14px]" />
                          <span className="text-left text-[10px]">
                            {center?.email || "---"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-left text-[12px]">
                          {center?.state || "---"}
                        </span>
                        <span className="text-left text-[10px]">
                          {center?.lga || "---"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-left max-w-[200px]  text-[12px]">
                    {center?.address || ""}
                  </TableCell>

                  <TableCell className="text-left max-w-[200px]  text-[12px]">
                    <AlertDialog>
                      <div className="flex items-center gap-2">
                        <div>
                          {center?.legalInfo?.tradeAreas?.length || 0} Sector
                          {center?.legalInfo?.tradeAreas?.length > 1 ? "s" : ""}
                        </div>

                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-[11px] w-[40px] h-[30px]">
                            View
                          </Button>
                        </AlertDialogTrigger>
                      </div>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {center?.trainingCentreName} - Sectors & Trade Areas
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {(center?.legalInfo?.tradeAreas || []).map(
                              (area, index) => {
                                return (
                                  <>
                                    {(area?.sector || []).map((sector) => {
                                      return (
                                        <div className="mb-[30px]">
                                          <h1 className="text-left font-medium text-[16px] ">
                                            Sector: {sector?.name}
                                          </h1>

                                          <div className="flex gap-[15px]">
                                            {(area?.tradeArea || []).map(
                                              (ta_id) => {
                                                const found = (
                                                  sector.tradeAreas || []
                                                ).find((x) => x?._id === ta_id);

                                                console.log(
                                                  "found",
                                                  area?.sector
                                                );
                                                return (
                                                  <p className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-black rounded-full" />
                                                    <span>{found?.name}</span>
                                                  </p>
                                                );
                                              }
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </>
                                );
                              }
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>Close</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>

                  {/*   <TableCell>{center.state || ""}</TableCell>
                  <TableCell>{center.lga || ""}</TableCell>
                  <TableCell>{center.sector || ""}</TableCell>
                  <TableCell>{center.tradeArea || ""}</TableCell>
                  <TableCell>{center.phoneNumber || ""}</TableCell>
                  <TableCell>{center.email || ""}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {/* First Page */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(1)}
                    isActive={currentPage === 1}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* Ellipsis after first */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Middle Pages */}
                {Array.from({ length: 3 }, (_, i) => {
                  const pageNumber = currentPage + i - 1;
                  return pageNumber > 1 && pageNumber < totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}

                {/* Ellipsis before last */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      isActive={currentPage === totalPages}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default TrainingCenterReport;
