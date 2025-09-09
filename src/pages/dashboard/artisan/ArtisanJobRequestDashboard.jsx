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
import { CheckCheckIcon, LogOut, X, User, Calendar, MapPin, DollarSign, Wallet, CheckCircle } from "lucide-react";
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
import UploadButton from "@/components/UploadButton"; // Make sure this import is correct

// Add this at the top of your file or import from a separate file
const defaultAgreementText = `
LEGAL AGREEMENT & TERMS OF REFERENCE

This agreement is made between the Client and the Artisan for the job titled: [Job Title].

1. Scope of Work: The Artisan agrees to perform the job as described in the job specification.
2. Payment: The agreed sum is ₦[agreedSum], payable upon satisfactory completion.
3. Timeline: The job is to be completed as agreed.
4. Confidentiality: Both parties agree to keep all job-related information confidential.
5. Dispute Resolution: Any disputes will be resolved in accordance with the platform's policies.
6. Termination: Either party may terminate this agreement under the conditions set forth in the platform's terms.
7. Acceptance: By digitally signing below, both parties agree to be legally bound by this agreement and the attached Terms of Reference.
`;

function LegalAgreementModal({ agreementText, onAccept, onCancel }) {
  const [accepted, setAccepted] = React.useState(false);
  const [signature, setSignature] = React.useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Legal Agreement & Terms of Reference</h2>
        <div className="overflow-y-auto max-h-60 border p-3 mb-4 rounded bg-gray-50 text-sm whitespace-pre-line">
          {agreementText}
        </div>
        <div className="mb-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
            id="accept"
          />
          <label htmlFor="accept" className="ml-2 text-sm">
            I have read and agree to the terms above.
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-xs mb-1">Digital Signature (Type your full name)</label>
          <input
            value={signature}
            onChange={e => setSignature(e.target.value)}
            placeholder="Your full name"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => onAccept(signature)}
            disabled={!accepted || !signature.trim()}
          >
            Accept & Sign
          </Button>
        </div>
      </div>
    </div>
  );
}

function ItfTicketModal({ open, onClose, onSubmit, submitting, defaultComment = "" }) {
  const [comment, setComment] = React.useState(defaultComment);
  const [attachment, setAttachment] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setComment(defaultComment || "");
      setAttachment("");
    }
  }, [open, defaultComment]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Create ITF Ticket</h2>

        <div className="mb-3">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Comment</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Explain why this needs ITF intervention (required)"
            className="mt-2"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Proof / Attachment</label>
          <div className="mt-2">
            <UploadButton
              title="Attach proof (e.g. certificate or bank stmt)"
              fileUrl={attachment}
              handleFileChange={({ returnedUri }) => setAttachment(returnedUri || "")}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Attachment optional but recommended.</p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(comment, attachment)}
            disabled={submitting || !comment?.trim()}
            className="bg-indigo-600"
          >
            {submitting ? "Sending..." : "Send to ITF"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function generateUserAvatarFalback({ first_name, last_name }) {
  return `${!first_name ? "" : `${(first_name || "").trim()[0]}`}${
    !last_name ? "" : `${(last_name || "").trim()[0]}`
  }`;
}

const Status = ({ status }) => {
  return (
    <>
      <span
        className={` py-1 px-2 rounded ${
          status === "artisan-rejected"
            ? "bg-red-100 text-red-600"
            : status === "requested"
            ? "bg-yellow-100 text-yellow-600"
            : status === "amount-proposed" // NEW STATUS
            ? "bg-purple-100 text-purple-600"
            : status === "accepted"
            ? "bg-blue-100 text-blue-600"
            : status === "artisan-completed"
            ? "bg-teal-100 text-teal-600"
            : status === "completed"
            ? "bg-green-100 text-green-600"
            : status === "client-rejected"
            ? "bg-pink-100 text-pink-600"
            : status === "client-cancelled"
            ? "bg-red-100 text-red-600"
            : "bg-orange-100 text-orange-600"
        }`}
      >
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
                          {new Date(
                            transaction?.createdAt
                          ).toLocaleDateString()}
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
                          {transaction?.status === "completed" ||
                          transaction?.status === "accepted" ||
                          transaction?.status === "artisan-completed" ||
                          transaction?.status === "client-rejected"
                            ? `₦${Number(
                                transaction?.agreedSum
                              ).toLocaleString()}`
                            : transaction?.status === "amount-proposed"
                            ? `₦${Number(
                                transaction?.proposedSum
                              ).toLocaleString()} (Proposed)`
                            :  transaction?.status === "artisan-rejected" 
                            ? `₦${Number(transaction?.proposedSum).toLocaleString()} (Rejected)`
                            : "N/A"}
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
                              onClick={() => handleItemClick(transaction)}
                            >
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
  const [showAgreement, setShowAgreement] = useState(false);
  const [itfCert, setItfCert] = useState("");
  const [cacCert, setCacCert] = useState("");
  const [nsitfCert, setNsitfCert] = useState("");
  const [bppCert, setBppCert] = useState("");
  const [bankStatement, setBankStatement] = useState("");

  // ITF ticket states
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketCreating, setTicketCreating] = useState(false);
  const [itfTicket, setItfTicket] = useState(null);
  const [ticketComment, setTicketComment] = useState("");
  const [ticketAttachment, setTicketAttachment] = useState("");
  const [showItfModal, setShowItfModal] = useState(false);

  // create ITF ticket (manual - artisan submits comment + proof)
  const createItfTicket = async (payloadComment, payloadAttachment) => {
    if (!selectedItem?._id || ticketCreating) return;
    const comment = payloadComment ?? ticketComment;
    if (!comment?.trim()) return toast.error("Please provide a comment for the ITF ticket.");

    const accessToken = localStorage.getItem("accessToken");
    const currentUserId = localStorage.getItem("userId");

    try {
      setTicketCreating(true);

      const payload = {
        request_id: selectedItem._id,
        jobTitle: selectedItem.client?._id,
        client: {
          id: selectedItem.client?._id,
          name: `${selectedItem.client?.firstName || ""} ${selectedItem.client?.lastName || ""}`.trim(),
          email: selectedItem.client?.email || "",
          phone: selectedItem.client?.phoneNumber || "",
        },
        comment: ticketComment,
        attachment: ticketAttachment || null, // URL returned by UploadButton
        createdBy: currentUserId || null,
        meta: {
          status: selectedItem?.status,
          proposedSum: selectedItem?.proposedSum,
          agreedSum: selectedItem?.agreedSum,
        },
      };

      const res = await axios.post(`${API_BASE_URL}/marketplace/itf/tickets`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const ticketData = res?.data?.data || res?.data;
      setItfTicket(ticketData);
      setTicketCreated(true);
      setTicketComment("");
      setTicketAttachment("");
      setShowItfModal(false);
      toast.success("ITF ticket submitted. ITF management will follow up.");
    } catch (err) {
      console.error("Error creating ITF ticket:", err);
      toast.error(err?.response?.data?.message || "Failed to create ITF ticket");
    } finally {
      setTicketCreating(false);
    }
  };
  
  const handleCloseModal = () => {
    close?.();
    refresh?.();
  };

  // Helper to check if uploads are required
  const requiresUploads = Number(selectedItem?.proposedSum) > 5000000;

  // don't show reject button for final/cancelled statuses
  const canReject = ![
    "client-cancelled",
    "client-rejected",
    "completed",
    "artisan-completed",
  ].includes(selectedItem?.status);

  // Accept proposed amount
  const acceptAmount = async () => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    // If uploads required, validate all are present
    if (requiresUploads && (!itfCert || !cacCert || !nsitfCert || !bppCert || !bankStatement)) {
      toast.error("Please upload all required documents before accepting.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/accept-amount`,
        {
          request_id: selectedItem?._id,
          artisan_id: userId,
          // Attach document URLs if required
          ...(requiresUploads && {
            itfCert,
            cacCert,
            nsitfCert,
            bppCert,
            bankStatement,
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Amount accepted successfully");
        handleCloseModal();
      } else {
        toast.error(response.data.message || "Failed to accept amount");
      }
    } catch (error) {
      console.error("Error accepting amount:", error);
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
          artisanRejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Amount rejected successfully");
        handleCloseModal();
      } else {
        toast.error(response.data.message || "Failed to reject amount");
      }
    } catch (error) {
      console.error("Error rejecting amount:", error);
      toast.error(error?.response?.data?.message || "Failed to reject amount");
    } finally {
      setLoading(false);
      setConfirmReject(false);
      setArtisanRejectionReason("");
    }
  };

  // Generic confirm reject used by the UI (fixes missing handler)
  const handleConfirmReject = async () => {
    if (!artisanRejectionReason?.trim()) {
      return toast.error("Please provide a reason for rejection.");
    }

    // For amount proposals use the dedicated endpoint
    if (selectedItem?.status === "amount-proposed") {
      return rejectAmount();
    }

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);
      const response = await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/update-request-status`,
        {
          artisan_id: userId,
          status: "artisan-rejected",
          request_id: selectedItem?._id,
          artisanRejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data) {
        toast.success(response.data.message || "Rejected successfully.");
        handleCloseModal();
      } else {
        toast.error(response?.data?.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error(error?.response?.data?.message || "Failed to reject request");
    } finally {
      setLoading(false);
      setConfirmReject(false);
      setArtisanRejectionReason("");
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
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    
    try {
      setLoading(true);
      
      const response = await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/start-job`,
        {
          request_id: selectedItem?._id,
          artisan_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove this condition since response.data.success is true
      // if (!response?.data.success) {
      //   throw new Error(response.data.message || "Failed to start job");
      // }

      // Just check if we have a response
      if (response?.data) {
        toast.success(response.data.message || "Job started successfully!");
        handleCloseModal();
        refresh?.(); // Use refresh instead of getTransactions
      }

    } catch (error) {
      console.error("Error starting job:", error);
      toast.error(error.response?.data?.message || "Failed to start job");
    } finally {
      setLoading(false);
    }
  };

  // Show agreement modal when status is "accepted" and not yet signed
  useEffect(() => {
    if (
      (selectedItem?.status === "accepted" || selectedItem?.status === "artisan-completed") &&
      !selectedItem?.legalAgreement?.artisanAccepted // You may need to adjust this field based on your backend
    ) {
      setShowAgreement(true);
    } else {
      setShowAgreement(false);
    }
  }, [selectedItem]);

  // const handleAgreementAccept = async (signature) => {
  //   const userId = localStorage.getItem("userId");
  //   const accessToken = localStorage.getItem("accessToken");
  //   try {
  //     setLoading(true);
  //     await axios.patch(
  //       `${API_BASE_URL}/marketplace/artisan/accept-agreement`,
  //       {
  //         request_id: selectedItem._id,
  //         artisan_id: userId,
  //         signature,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     toast.success("Agreement accepted and signed.");
  //     setShowAgreement(false);
  //     handleCloseModal();
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to accept agreement");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAgreementAccept = async (signature) => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const artisanText =
      selectedItem?.legalAgreement?.text ||
      defaultAgreementText
        .replace("[Job Title]", selectedItem?.jobTitle || "")
        .replace("[agreedSum]", selectedItem?.agreedSum || "");

    try {
      setLoading(true);
      await axios.patch(
        `${API_BASE_URL}/marketplace/artisan/accept-agreement`,
        {
          request_id: selectedItem._id,
          artisan_id: userId,
          signature,
          artisanText, // <-- send the agreement text as artisanText
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Agreement accepted and signed.");
      setShowAgreement(false);
      handleCloseModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept agreement");
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Show agreement modal overlay if needed */}
      {showAgreement && (
        <LegalAgreementModal
          agreementText={
            selectedItem?.legalAgreement?.text ||
            defaultAgreementText
              .replace("[Job Title]", selectedItem?.jobTitle || "")
              .replace("[agreedSum]", selectedItem?.agreedSum || "")
          }
          onAccept={handleAgreementAccept}
          onCancel={() => setShowAgreement(false)}
        />
      )}

      {/* Main modal content */}
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
              <p className="text-sm text-gray-500">View job and client information</p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="p-6">
            <Tabs defaultValue="job" className="w-full">
              <TabsList className="flex bg-gray-50 p-1 rounded-lg mb-4">
                <TabsTrigger 
                  value="job" 
                  className="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800"
                >
                  Job Information
                </TabsTrigger>
                <TabsTrigger 
                  value="client"
                  className="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800"
                >
                  Client Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="job">
                <div className="space-y-6">
                  {/* Job Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {selectedItem?.jobTitle || "No title"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Requested {selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {selectedItem?.jobLocation?.state}, {selectedItem?.jobLocation?.lga}
                        </span>
                      </div>
                    </div>
                    <Status status={selectedItem?.status} />
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Description */}
                      <Card className="bg-white rounded-lg border border-gray-200">
                        <CardHeader className="px-4 py-3 border-b border-gray-100">
                          <CardTitle className="font-semibold text-gray-900 text-left">Job Description</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-gray-700 leading-relaxed text-left whitespace-pre-wrap">
                            {selectedItem?.jobDescription || "No description provided"}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Location Details */}
                      <Card className="bg-white rounded-lg border border-gray-200">
                        <CardHeader className="px-4 py-3 border-b border-gray-100">
                          <CardTitle className="font-semibold text-gray-900 text-left">Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4 text-left">
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">State</label>
                              <p className="mt-1 font-medium text-gray-900">{selectedItem?.jobLocation?.state || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">LGA</label>
                              <p className="mt-1 font-medium text-gray-900">{selectedItem?.jobLocation?.lga || "N/A"}</p>
                            </div>
                            <div className="col-span-2">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Address</label>
                              <p className="mt-1 text-gray-700">{selectedItem?.jobLocation?.address || "N/A"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                      {/* Training Type */}
                      {/* <Card className="bg-white rounded-lg border border-gray-200">
                        <CardContent className="p-4 text-left">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Training Type</label>
                          <p className="mt-1 font-semibold text-gray-900">{selectedItem?.trainingType || "N/A"}</p>
                        </CardContent>
                      </Card> */}

                      {/* Amount Cards */}
                      {selectedItem?.status === "amount-proposed" && (
                        <Card className="bg-white rounded-lg border border-yellow-200 bg-yellow-50">
                          <CardContent className="p-4 text-left">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Wallet size={16} className="text-yellow-700" />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-yellow-700 uppercase tracking-wide">Proposed Amount</label>
                                <p className="text-lg font-bold text-yellow-800">
                                  ₦{Number(selectedItem?.proposedSum || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-yellow-600">Awaiting your decision</p>
                          </CardContent>
                        </Card>
                      )}

                      {selectedItem?.status === "accepted" && (
                        <Card className="bg-white rounded-lg border border-green-200 bg-green-50">
                          <CardContent className="p-4 text-left">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle size={16} className="text-green-700" />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-green-700 uppercase tracking-wide">Agreed Amount</label>
                                <p className="text-lg font-bold text-green-800">
                                  ₦{Number(selectedItem?.agreedSum || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-green-600">Ready to start</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* ITF Ticket summary (visible when created or creating) */}
                      {selectedItem?.status === "client-rejected" && !ticketCreated && (
                        <Card className="bg-white rounded-lg border border-gray-200">
                          <CardHeader className="px-4 py-3 border-b border-gray-100">
                            <CardTitle className="font-semibold text-gray-900 text-left">ITF Assistance</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-700 mb-3">
                              This request was rejected by the client. If you want ITF management to review, create a ticket and attach any proof.
                            </p>
                            <div className="flex justify-end">
                              <Button onClick={() => setShowItfModal(true)} className="bg-indigo-600">
                                Create ITF Ticket
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* ITF Ticket Modal */}
                      <ItfTicketModal
                        open={showItfModal}
                        onClose={() => setShowItfModal(false)}
                        submitting={ticketCreating}
                        onSubmit={createItfTicket}
                        defaultComment={ticketComment}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <Card className="bg-white rounded-lg border border-gray-200">
                    <CardFooter className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                      <div className="flex flex-wrap gap-3 w-full items-end">
                        {/* Action buttons for each state */}
                        {selectedItem?.status === "amount-proposed" && (
                          <>
                            {/* Show upload fields if required */}
                            {requiresUploads && (
                              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <UploadButton
                                  title="Upload ITF Compliance Certificate"
                                  fileUrl={itfCert}
                                  handleFileChange={setItfCert}
                                />
                                <UploadButton
                                  title="Upload CAC Certificate"
                                  fileUrl={cacCert}
                                  handleFileChange={setCacCert}
                                />
                                <UploadButton
                                  title="Upload NSITF Certificate"
                                  fileUrl={nsitfCert}
                                  handleFileChange={setNsitfCert}
                                />
                                <UploadButton
                                  title="Upload BPP Certificate"
                                  fileUrl={bppCert}
                                  handleFileChange={setBppCert}
                                />
                                <UploadButton
                                  title="Upload Bank Statement"
                                  fileUrl={bankStatement}
                                  handleFileChange={setBankStatement}
                                />
                              </div>
                            )}
                            <Button
                              onClick={acceptAmount}
                              disabled={loading}
                              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                            >
                              {loading ? <Spinner /> : "Accept Amount"}
                            </Button>
                            {/* {!confirmReject ? (
                              <Button
                                onClick={() => setConfirmReject(true)}
                                disabled={loading}
                                className="px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white"
                              >
                                Reject Amount
                              </Button>
                            ) : (
                              <div className="flex gap-2 items-end flex-1">
                                <div className="flex-1 min-w-0">
                                  <Textarea
                                    value={artisanRejectionReason}
                                    onChange={(e) => setArtisanRejectionReason(e.target.value)}
                                    placeholder="Please provide a reason for rejecting the amount..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <Button
                                  onClick={rejectAmount}
                                  disabled={loading || !artisanRejectionReason.trim()}
                                  className="px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Confirm Reject
                                </Button>
                              </div>
                            )} */}
                          </>
                        )}

                        {selectedItem?.status === "accepted" && (
                          <Button
                            onClick={startJob}
                            disabled={loading}
                            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {loading ? <Spinner /> : "Confirm Job Start"}
                          </Button>
                        )}

                        {(selectedItem?.status === "artisan-started" || selectedItem?.status === "artisan-completed") && (
                          <Button
                            onClick={completeJob}
                            disabled={loading || selectedItem?.status === "artisan-completed"}
                            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                          >
                            {loading ? <Spinner /> : "Mark Job as Completed"}
                          </Button>
                        )}

                        {/* Always-show Reject area (only when allowed) */}
                        {canReject && (
                          <div className="ml-auto min-w-[220px]">
                            {!confirmReject ? (
                              <Button
                                onClick={() => setConfirmReject(true)}
                                disabled={loading}
                                className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                              >
                                Reject
                              </Button>
                            ) : (
                              <div className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <Textarea
                                    value={artisanRejectionReason}
                                    onChange={(e) => setArtisanRejectionReason(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    className="w-full h-20"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    onClick={handleConfirmReject}
                                    disabled={loading || !artisanRejectionReason.trim()}
                                    className="px-3 py-2 rounded-md bg-red-700 hover:bg-red-800 text-white"
                                  >
                                    {loading ? <Spinner /> : "Confirm"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setConfirmReject(false);
                                      setArtisanRejectionReason("");
                                    }}
                                    className="px-3 py-2 rounded-md"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="client">
                <Card className="bg-white rounded-lg border border-gray-200">
                  <CardHeader className="px-4 py-3 border-b border-gray-100">
                    <CardTitle className="font-semibold text-gray-900 text-left">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        {client?.profileImage ? (
                          <img
                            src={client.profileImage}
                            alt={`${client.firstName} ${client.lastName}`}
                            className="w-20 h-20 rounded-full border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg border-2 border-gray-200">
                            {generateUserAvatarFalback({
                              first_name: client?.firstName || "",
                              last_name: client?.lastName || "",
                            })}
                          </div>
                        )}
                      </div>

                      {/* Client Details */}
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {client?.firstName} {client?.lastName}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                            <p className="mt-1 text-gray-900">{client?.email || "N/A"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                            <p className="mt-1 text-gray-900">{client?.phoneNumber || "N/A"}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                            <p className="mt-1 text-gray-700">{client?.address || "No address provided"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
             
          </div>
        </div>
      </div>
    </div>
  );
};
