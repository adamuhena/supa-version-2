// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Button } from "@/components/ui/button";
// import useLogout from "@/pages/loginPage/logout";
// import axios from "axios";
// import { CheckCheckIcon, LogOut } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";

// import { API_BASE_URL } from "@/config/env";
// import Spinner from "@/components/Spinner";
// import { startCase } from "lodash";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Cross1Icon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
// import { Select } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";

// function generateUserAvatarFalback({ first_name, last_name }) {
//   return `${!first_name ? "" : `${(first_name || "").trim()[0]}`}${
//     !last_name ? "" : `${(last_name || "").trim()[0]}`
//   }`;
// }

// const Status = ({ status }) => {
//   return (
//     <>
//       <span
//         className={` py-1 px-2 rounded text-white ${
//           status === "artisan-rejected"
//             ? "bg-red-500"
//             : status === "requested"
//             ? "bg-yellow-500"
//             : status === "accepted"
//             ? "bg-blue-500"
//             : status === "artisan-completed" || status === "completed"
//             ? "bg-green-500"
//             : "bg-gray-500"
//         }`}>
//         {startCase(status)}
//       </span>
//     </>
//   );
// };

// const ArtisanDashboard = () => {
//   const logout = useLogout();

//   const userRole = localStorage.getItem("userRole");

//   const getUserRole = (userRole) => {
//     if (userRole === "artisan_user") {
//       return "ARTISAN";
//     } else if (userRole === "intending_artisan") {
//       return "INTENDING ARTISAN";
//     } else if (userRole === "superadmin") {
//       return "SUPER ADMIN";
//     }
//     return "GUEST"; // Default case
//   };

//   const role = getUserRole(userRole);

//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [pagination, setpagination] = useState({});

//   const getTransactions = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     const userId = localStorage.getItem("userId");

//     if (!userId) return null;
//     console.log("we got here 2");

//     setLoading(true);

//     try {
//       if (!accessToken || !userId) {
//         return; // If no token or userId, you can handle this with a redirect or error state
//       }

//       const response = await axios.get(
//         `${API_BASE_URL}/marketplace/artisan/request`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           params: {
//             artisan_id: userId,
//           },
//         }
//       );

//       setData(response?.data?.data?.requests || []);
//       setpagination(response?.data?.data?.pagination || {});
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [selectedItem, setselectedItem] = useState(null);

//   const handleItemClick = (item) => {
//     setselectedItem(item);
//   };

//   const handleCloseModal = () => {
//     setselectedItem(null);
//   };

//   useEffect(() => {
//     getTransactions();
//   }, []);

//   return (
//     <ProtectedRoute href="/trainee/dashboard">
//       {selectedItem && (
//         <Modal
//           selectedItem={selectedItem}
//           close={handleCloseModal}
//           refresh={getTransactions}
//         />
//       )}

//       {/* <DashboardPage title="Trainee Dashboard"> */}
//       <div className="container mx-auto p-6">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Job Requests</h1>
//           <div className="flex gap-2">
//             <Button variant="destructive" onClick={logout}>
//               <LogOut className="mr-2 h-4 w-4" /> Logout
//             </Button>
//           </div>
//         </header>

//         {loading ? (
//           <div className=" flex items-center justify-center w-full">
//             <Spinner />
//           </div>
//         ) : null}

//         <div>
//           {!data?.length && !loading ? (
//             <div className="text-center py-10">No transactions found.</div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300 text-[12px] text-left">
//                   <thead>
//                     <tr className="bg-gray-100 ">
//                       <th className="border border-gray-300 px-4 py-2">
//                         Requested On
//                       </th>

//                       <th className="border border-gray-300 px-4 py-2">
//                         Job Title
//                       </th>

//                       <th className="border border-gray-300 px-4 py-2">
//                         Job Location
//                       </th>
//                       <th className="border border-gray-300 px-4 py-2">
//                         Agreed Sum
//                       </th>

//                       <th className="border border-gray-300 px-4 py-2">
//                         Client
//                       </th>
//                       <th className="border border-gray-300 px-4 py-2">
//                         Status
//                       </th>

//                       <th className="border border-gray-300 px-4 py-2">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(data || []).map((transaction) => (
//                       <tr key={transaction?._id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 px-4 py-2">
//                           {new Date(
//                             transaction?.createdAt
//                           ).toLocaleDateString()}
//                         </td>

//                         <td className="border border-gray-300 px-4 py-2">
//                           {transaction?.jobTitle || "N/A"}
//                         </td>

//                         <td className="border border-gray-300 px-4 py-2">
//                           {transaction?.jobLocation?.state
//                             ? `${transaction?.jobLocation?.lga}, ${transaction?.jobLocation?.state}`
//                             : "N/A"}
//                         </td>

//                         <td className="border border-gray-300 px-4 py-2">
//                           {transaction?.agreedSum
//                             ? `₦${Number(
//                                 transaction?.agreedSum
//                               ).toLocaleString()}`
//                             : "N/A"}
//                         </td>

//                         <td className="border border-gray-300 px-4 py-2">
//                           {transaction?.client?.firstName}{" "}
//                           {transaction?.client?.lastName}
//                         </td>

//                         <td className="border border-gray-300 px-4 py-2">
//                           <Status status={transaction?.status} />
//                         </td>

//                         <td className="border border-gray-300 px-4 py-2">
//                           <div className="flex gap-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 handleItemClick(transaction);
//                               }}>
//                               View
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ArtisanDashboard;

// const Modal = ({ handleActionClick, selectedItem, close, refresh }) => {
//   const client = selectedItem?.client;

//   const handleCloseModal = () => {
//     close?.();
//     refresh?.();
//   };

//   const [accepting, setaccepting] = useState(false);
//   const [confirmAccept, setconfirmAccept] = useState(false);

//   const acceptJob = async () => {
//     const userId = localStorage.getItem("userId");
//     if (!confirmAccept) return setconfirmAccept(true);

//     try {
//       setaccepting(true);
//       console.log("selectedItem", selectedItem);

//       const response = await axios.patch(
//         `${API_BASE_URL}/marketplace/artisan/update-request-status`,
//         {
//           artisan_id: userId,
//           status: "accepted",
//           request_id: selectedItem?._id,
//         }
//       );
//       toast.success("Accepted successfully.");
//       handleCloseModal?.();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "An error occured");
//     } finally {
//       setaccepting(false);
//     }
//   };

//   const [rejecting, setrejecting] = useState(false);
//   const [confirmReject, setconfirmReject] = useState(false);
//   const [artisanRejectionReason, setartisanRejectionReason] = useState("");

//   const rejectJob = async () => {
//     const userId = localStorage.getItem("userId");
//     if (!confirmReject) return setconfirmReject(true);

//     if (!artisanRejectionReason?.trim()?.length) {
//       return toast.error("Reason for rejection is required!");
//     }
//     try {
//       setrejecting(true);

//       const response = await axios.patch(
//         `${API_BASE_URL}/marketplace/artisan/update-request-status`,
//         {
//           artisan_id: userId,
//           status: "artisan-rejected",
//           request_id: selectedItem?._id,
//           artisanRejectionReason,
//         }
//       );

//       toast.success("Rejected successfully.");
//       handleCloseModal?.();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "An error occured");
//     } finally {
//       setrejecting(false);
//     }
//   };

//   const [completing, setcompleting] = useState(false);
//   const [agreedSum, setagreedSum] = useState("");

//   const completeJob = async () => {
//     if (!agreedSum?.trim()?.length || !Number(agreedSum)) {
//       return alert("Agreed sum is required!");
//     }
//     const userId = localStorage.getItem("userId");

//     try {
//       setcompleting(true);
//       console.log("selectedItem", selectedItem);

//       await axios.patch(
//         `${API_BASE_URL}/marketplace/artisan/update-request-status`,
//         {
//           artisan_id: userId,
//           status: "artisan-completed",
//           request_id: selectedItem?._id,
//           agreedSum,
//         }
//       );
//       toast.success("Job completed successfully. Awaiting client approval!");
//       handleCloseModal?.();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "An error occured");
//     } finally {
//       setcompleting(false);
//     }
//   };

//   const loading = completing || rejecting || completing;
//   return (
//     <>
//       <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[10]">
//         <div className="bg-white p-5 rounded-lg w-4/5 max-w-[700px] text-center shadow-md relative pt-[50px]">
//           <button
//             className="absolute top-[10px] right-[10px] text-[15px] underline text-red-800 font-bold"
//             onClick={handleCloseModal}>
//             Close
//           </button>

//           <Tabs defaultValue="job" className="w-[100%]">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="job">Job</TabsTrigger>
//               <TabsTrigger value="client">Client</TabsTrigger>
//             </TabsList>
//             <TabsContent value="client">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-left">
//                     Client Information
//                   </CardTitle>
//                   <CardDescription className="text-left"></CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   {client?.profileImage ? (
//                     <img
//                       src={client?.profileImage}
//                       alt={client?.firstName}
//                       className="w-[80px] object-cover h-[80px] rounded-full border border-gray-500 text-gray-300 flex items-center justify-center mx-auto mt-[15px] "
//                     />
//                   ) : (
//                     <div className="w-[80px] h-[80px] rounded-full border border-gray-300 text-gray-500 text-[24px] flex items-center justify-center mx-auto mt-[15px] ">
//                       <span>
//                         {generateUserAvatarFalback({
//                           first_name: client?.firstName || "",
//                           last_name: client?.lastName || "",
//                         })}
//                       </span>
//                     </div>
//                   )}

//                   <h3 className="text-[16px] font-bold mt-[10px] truncate text-ellipsis">
//                     {client?.firstName} {client?.lastName}
//                   </h3>

//                   <div className="pt-[25px] mt-[15px] text-left border-t border-gray-300  grid grid-cols-2">
//                     <p className=" mb-3 flex flex-col">
//                       <strong>Email:</strong> {client?.email}
//                     </p>

//                     <p className=" mb-3 flex flex-col">
//                       <strong>Phone Number:</strong> {client?.phoneNumber}
//                     </p>

//                     <p className=" mb-3 flex flex-col">
//                       <strong>Address:</strong>
//                       {client?.address}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="job">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-left">Job Information</CardTitle>
//                   <CardDescription></CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="pt-[25px]  text-left border-t border-gray-300  grid grid-cols-2">
//                     <p className=" mb-3 flex flex-col col-span-2">
//                       <strong>Job Title:</strong> {selectedItem?.jobTitle}
//                     </p>

//                     <p className=" mb-3 flex flex-col col-span-2">
//                       <strong>Job Description:</strong>{" "}
//                       {selectedItem?.jobDescription}
//                     </p>

//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Job State:</strong>
//                       {selectedItem?.jobLocation?.state || "N/A"}
//                     </p>
//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Job LGA:</strong>
//                       {selectedItem?.jobLocation?.lga || "N/A"}
//                     </p>

//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Job Address:</strong>
//                       {selectedItem?.jobLocation?.address || "N/A"}
//                     </p>
//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Status:</strong>
//                       <div>
//                         <Status status={selectedItem?.status} />
//                       </div>
//                     </p>

//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Requested On:</strong>
//                       <div>
//                         {new Date(selectedItem.createdAt).toLocaleDateString()}
//                       </div>
//                     </p>

//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Agreed Sum:</strong>
//                       <div>
//                         {selectedItem?.agreedSum
//                           ? `₦${Number(
//                               selectedItem?.agreedSum
//                             ).toLocaleString()}`
//                           : "N/A"}
//                       </div>
//                     </p>

//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Rating Given To Artisan:</strong>
//                       <div>
//                         {!selectedItem?.ratingGivenToArtisan?.rating
//                           ? "N/A"
//                           : [1, 2, 3, 4, 5].map((star) => (
//                               <button
//                                 key={star}
//                                 className="focus:outline-none cursor-pointer">
//                                 {star <=
//                                 selectedItem?.ratingGivenToArtisan?.rating ? (
//                                   <StarFilledIcon
//                                     className={`size-[20px] ${"fill-green-400 text-green-400"}`}
//                                   />
//                                 ) : (
//                                   <StarIcon
//                                     className={`size-[20px] ${"text-gray-300"}`}
//                                   />
//                                 )}
//                               </button>
//                             ))}
//                       </div>
//                     </p>

//                     <p className=" mb-3 flex flex-col ">
//                       <strong>Additional message from client:</strong>
//                       <div>
//                         {!selectedItem?.ratingGivenToArtisan?.message
//                           ? "N/A"
//                           : selectedItem?.ratingGivenToArtisan?.message}
//                       </div>
//                     </p>

//                     {selectedItem?.artisanRejectionReason ? (
//                       <p className=" mb-3 flex flex-col ">
//                         <strong>{startCase("artisanRejectionReason")}</strong>
//                         <div>{selectedItem?.artisanRejectionReason}</div>
//                       </p>
//                     ) : null}
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   {selectedItem?.status === "requested" ? (
//                     <div>
//                       {confirmReject ? (
//                         <div className="flex flex-col items-start justify-start">
//                           <Label className="text-left mb-1">
//                             Please state a reason for rejection
//                           </Label>
//                           <Textarea
//                             value={artisanRejectionReason}
//                             onChange={(e) =>
//                               setartisanRejectionReason(e?.target?.value)
//                             }
//                             className="mb-4"
//                             placeholder="Please state a reason for rejection"
//                           />
//                         </div>
//                       ) : null}
//                       <Button
//                         disabled={loading}
//                         onClick={rejectJob}
//                         className="bg-red-600">
//                         {confirmReject ? "Confirm Reject Job" : "Reject Job"}
//                         {rejecting ? <Spinner /> : <Cross1Icon />}
//                       </Button>
//                       <Button
//                         disabled={loading}
//                         onClick={acceptJob}
//                         className="ml-4 bg-green-700">
//                         {confirmAccept ? "Confirm Accept Job" : "Accept Job"}

//                         {accepting ? <Spinner /> : <CheckCheckIcon />}
//                       </Button>
//                     </div>
//                   ) : null}

//                   {selectedItem?.status === "accepted" ? (
//                     <div className="flex flex-col items-start justify-start">
//                       <Label>
//                         Please insert the agreed sum for the job in (Naira) *
//                       </Label>
//                       <Input
//                         value={agreedSum}
//                         className="mb-2"
//                         onChange={(e) => setagreedSum(e?.target?.value)}
//                       />
//                       <Button
//                         disabled={loading || !agreedSum}
//                         onClick={completeJob}
//                         className="bg-green-700">
//                         I have completed the job
//                         {completing ? <Spinner /> : <CheckCheckIcon />}
//                       </Button>
//                     </div>
//                   ) : null}
//                 </CardFooter>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </>
//   );
// };


import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import useLogout from "@/pages/loginPage/logout";
import axios from "axios";
import { CheckCheckIcon, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/config/env";
import Spinner from "@/components/Spinner";
import { startCase } from "lodash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cross1Icon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

function generateUserAvatarFalback({ first_name, last_name }) {
  return `${!first_name ? "" : `${(first_name || "").trim()[0]}`}${
    !last_name ? "" : `${(last_name || "").trim()[0]}`
  }`;
}

const Status = ({ status }) => {
  return (
    <>
      <span
        className={` py-1 px-2 rounded text-white ${
          status === "artisan-rejected"
            ? "bg-red-500"
            : status === "requested"
            ? "bg-yellow-500"
            : status === "amount-proposed"  // NEW STATUS
            ? "bg-purple-500"
            : status === "accepted"
            ? "bg-blue-500"
            : status === "artisan-completed" || status === "completed"
            ? "bg-green-500"
            : "bg-gray-500"
        }`}>
        {startCase(status)}
      </span>
    </>
  );
};

const ArtisanDashboard = () => {
  const logout = useLogout();
  const userRole = localStorage.getItem("userRole");

  const getUserRole = (userRole) => {
    if (userRole === "artisan_user") {
      return "ARTISAN";
    } else if (userRole === "intending_artisan") {
      return "INTENDING ARTISAN";
    } else if (userRole === "superadmin") {
      return "SUPER ADMIN";
    }
    return "GUEST"; // Default case
  };

  const role = getUserRole(userRole);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});

  const getTransactions = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!userId) return null;

    setLoading(true);

    try {
      if (!accessToken || !userId) {
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/marketplace/artisan/request`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            artisan_id: userId,
          },
        }
      );

      setData(response?.data?.data?.requests || []);
      setPagination(response?.data?.data?.pagination || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    getTransactions();
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <ProtectedRoute href="/trainee/dashboard">
      {selectedItem && (
        <Modal
          selectedItem={selectedItem}
          close={handleCloseModal}
          refresh={getTransactions}
        />
      )}

      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Job Requests</h1>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center w-full">
            <Spinner />
          </div>
        ) : null}

        <div>
          {!data?.length && !loading ? (
            <div className="text-center py-10">No transactions found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-[12px] text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">
                        Requested On
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Job Title
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Job Location
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Amount
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Client
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data || []).map((transaction) => (
                      <tr key={transaction?._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(transaction?.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {transaction?.jobTitle || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {transaction?.jobLocation?.state
                            ? `${transaction?.jobLocation?.lga}, ${transaction?.jobLocation?.state}`
                            : "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {transaction?.status === 'completed' || 
                           transaction?.status === 'accepted' || 
                           transaction?.status === 'artisan-completed' ||
                           transaction?.status === 'artisan-rejected'||
                            transaction?.status === 'client-rejected'
                        
                            ? `₦${Number(transaction?.agreedSum).toLocaleString()}`
                            : transaction?.status === 'amount-proposed'
                            ? `₦${Number(transaction?.proposedSum).toLocaleString()} (Proposed)`
                            : 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {transaction?.client?.firstName}{" "}
                          {transaction?.client?.lastName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Status status={transaction?.status} />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleItemClick(transaction)}>
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ArtisanDashboard;

const Modal = ({ selectedItem, close, refresh }) => {
  const client = selectedItem?.client;
  const [loading, setLoading] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [artisanRejectionReason, setArtisanRejectionReason] = useState("");
  const [agreedSum, setAgreedSum] = useState("");
  // In your Modal component


  const handleCloseModal = () => {
    close?.();
    refresh?.();
  };

// Accept proposed amount
const acceptAmount = async () => {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  
  try {
    setLoading(true);
    const response = await axios.patch(
      `${API_BASE_URL}/marketplace/artisan/accept-amount`,
      { 
        request_id: selectedItem?._id,
        artisan_id: userId 
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      toast.success("Amount accepted successfully");
      handleCloseModal();
    } else {
      toast.error(response.data.message || "Failed to accept amount");
    }
  } catch (error) {
    console.error('Error accepting amount:', error);
    toast.error(error.response?.data?.message || "Failed to accept amount");
  } finally {
    setLoading(false);
  }
};

// Reject proposed amount
const rejectAmount = async () => {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  
  try {
    setLoading(true);
    const response = await axios.patch(
      `${API_BASE_URL}/marketplace/artisan/reject-amount`,
      { 
        request_id: selectedItem?._id,
        artisan_id: userId,
        artisanRejectionReason 
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      toast.success("Amount rejected successfully");
      handleCloseModal();
    } else {
      toast.error(response.data.message || "Failed to reject amount");
    }
  } catch (error) {
    console.error('Error rejecting amount:', error);
    toast.error(error.response?.data?.message || "Failed to reject amount");
  } finally {
    setLoading(false);
  }
};

  // Complete job (after amount is accepted)
  const completeJob = async () => {
    // if (!agreedSum?.trim()?.length || !Number(agreedSum)) {
    //   return toast.error("Agreed sum is required and must be a valid number");
    // }

    const userId = localStorage.getItem("userId");
    try {
      setLoading(true);
      await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/update-request-status`,
        {
          artisan_id: userId,
          status: "artisan-completed",
          request_id: selectedItem?._id,
          agreedSum: Number(agreedSum),
        }
      );
      toast.success("Job completed successfully. Awaiting client approval!");
      handleCloseModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

const startJob = async () => {
  console.log('Attempting to start job...'); // Frontend log 1
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  try {
    setLoading(true);
    console.log('Request payload:', { 
      request_id: selectedItem?._id, 
      artisan_id: userId 
    }); // Frontend log 2
    
    const response = await axios.patch(
      `${API_BASE_URL}/marketplace/artisan/start-job`,
      {
        request_id: selectedItem?._id,
        artisan_id: userId
      },
      {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('API Response:', response); // Frontend log 3
    
    if (response.data.success) {
      toast.success("Job started successfully!");
      getTransactions();
    } else {
      console.log('API returned unsuccessful:', response.data);
      toast.error(response.data.message || "Failed to start job");
    }
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      request: error.request
    });
    toast.error(error.response?.data?.message || "Failed to start job");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[10]">
      <div className="bg-white p-5 rounded-lg w-4/5 max-w-[700px] text-center shadow-md relative pt-[50px] max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-[10px] right-[10px] text-[15px] underline text-red-800 font-bold"
          onClick={handleCloseModal}>
          Close
        </button>

        <Tabs defaultValue="job" className="w-[100%]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="job">Job</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {client?.profileImage ? (
                  <img
                    src={client?.profileImage}
                    alt={client?.firstName}
                    className="w-[80px] h-[80px] rounded-full border border-gray-500 mx-auto mt-[15px]"
                  />
                ) : (
                  <div className="w-[80px] h-[80px] rounded-full border border-gray-300 text-gray-500 text-[24px] flex items-center justify-center mx-auto mt-[15px]">
                    {generateUserAvatarFalback({
                      first_name: client?.firstName || "",
                      last_name: client?.lastName || "",
                    })}
                  </div>
                )}

                <h3 className="text-[16px] font-bold mt-[10px]">
                  {client?.firstName} {client?.lastName}
                </h3>

                <div className="pt-[25px] mt-[15px] text-left border-t border-gray-300 grid grid-cols-2">
                  <p className="mb-3 flex flex-col">
                    <strong>Email:</strong> {client?.email}
                  </p>
                  <p className="mb-3 flex flex-col">
                    <strong>Phone:</strong> {client?.phoneNumber}
                  </p>
                  <p className="mb-3 flex flex-col col-span-2">
                    <strong>Address:</strong> {client?.address || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Job Title</Label>
                    <p>{selectedItem?.jobTitle || "N/A"}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Job Description</Label>
                    <p>{selectedItem?.jobDescription || "N/A"}</p>
                  </div>
                  
                  <div>
                    <Label>Job State</Label>
                    <p>{selectedItem?.jobLocation?.state || "N/A"}</p>
                  </div>
                  
                  <div>
                    <Label>Job LGA</Label>
                    <p>{selectedItem?.jobLocation?.lga || "N/A"}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Job Address</Label>
                    <p>{selectedItem?.jobLocation?.address || "N/A"}</p>
                  </div>
                  
                  <div>
                    <Label>Status</Label>
                    <p><Status status={selectedItem?.status} /></p>
                  </div>
                  
                  <div>
                    <Label>Requested On</Label>
                    <p>{new Date(selectedItem?.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  {selectedItem?.status === 'amount-proposed' && (
                    <div className="col-span-2">
                      <Label>Proposed Amount</Label>
                      <p className="text-lg font-bold">
                        ₦{Number(selectedItem?.proposedSum).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  {selectedItem?.status === 'accepted' && (
                    <div className="col-span-2">
                      <Label>Agreed Sum</Label>
                      <p>₦{Number(selectedItem?.agreedSum).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                {/* Amount Proposal Acceptance/Rejection */}
                {selectedItem?.status === 'amount-proposed' && (
                  <div className="w-full">
                    <Label>Client Proposed Amount</Label>
                    <p className="text-lg font-bold mb-4">
                      ₦{Number(selectedItem?.proposedSum).toLocaleString()}
                    </p>
                    
                    <div className="flex gap-4">
                      <Button 
                        onClick={acceptAmount}
                        disabled={loading}
                        className="bg-green-600"
                      >
                        Accept Amount
                      </Button>
                      
                      {confirmReject ? (
                        <div className="flex-1">
                          <Textarea
                            value={artisanRejectionReason}
                            onChange={(e) => setArtisanRejectionReason(e.target.value)}
                            placeholder="Reason for rejecting amount"
                            className="mb-2"
                          />
                          <Button
                            onClick={rejectAmount}
                            disabled={loading || !artisanRejectionReason.trim()}
                            className="bg-red-600 w-full"
                          >
                            Confirm Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setConfirmReject(true)}
                          disabled={loading}
                          variant="outline"
                          className="border-red-600 text-red-600"
                        >
                          Reject Amount
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Job Completion (after amount accepted) */}
                {/* {selectedItem?.status === 'accepted' ? (
                  <div className="w-full">
                    <Label>Agreed Sum</Label>
                    <p className="text-lg font-bold mb-2">
                      ₦{Number(selectedItem?.agreedSum).toLocaleString()}
                    </p>
                    
                    <div className="w-full">
                      <Button
                        onClick={completeJob}
                        disabled={loading}
                        className="bg-green-600 w-full"
                      >
                        Mark Job as Completed
                      </Button>
                    </div>
                  </div>
                ): null} */}
                {/* // In your render logic */}
              {selectedItem?.status === 'accepted' && (
                <Button
                  onClick={startJob}
                  disabled={loading}
                  className="bg-blue-600"
                >
                  {loading ? <Spinner /> : "Confirm Job Start"}
                </Button>
              )}

              {(selectedItem?.status === 'artisan-started' || selectedItem?.status === 'artisan-completed') && (
                <Button
                  onClick={completeJob}
                  disabled={loading || selectedItem?.status === 'artisan-completed'}
                  className="bg-green-600"
                >
                  {loading ? <Spinner /> : "Mark Job as Completed"}
                </Button>
              )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};