import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";
import PageLayout from "../../components/layout/pageLayout";
import { API_BASE_URL } from "@/config/env";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // Default to "user"
  const [inputError, setInputError] = useState("");
  const navigate = useNavigate();

  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^234\d{10}$/;
    if (emailRegex.test(input) || phoneRegex.test(input)) {
      setInputError("");
      return true;
    } else {
      setInputError("Please enter a valid email or phone number.");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInput(identifier)) {
      return;
    }
    setLoading(true);

    const endpoint =
      userType === "user"
        ? `${API_BASE_URL}/user/forgot-password`
        : `${API_BASE_URL}/training-center/forgot-password`;

    try {
      const response = await axios.post(
        endpoint,
        { identifier },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { success, message } = response.data;

      if (success) {
        toast.success("Password reset instructions sent successfully!", {
          description:
            "Please check your email or phone for further instructions.",
          position: "top-right",
        });
        navigate("/login");
      } else {
        toast.error("Failed to process request", {
          description: message,
          position: "top-right",
        });
      }
    } catch (error) {
      const description =
        error?.response?.data?.message ||
        "An error occurred. Please try again.";
      toast.error("Error!", {
        description,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
        <div className="flex min-h-screen items-center justify-center absolute top-0 left-0 right-0 bottom-0">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-600">
                Forgot Password
              </CardTitle>
              <CardDescription>
                Select your account type and enter your email or phone number to
                reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={userType} onValueChange={setUserType}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-50">
                  <TabsTrigger
                    value="user"
                    className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
                    User
                  </TabsTrigger>
                  <TabsTrigger
                    value="training_center"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
                    Training Center
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="identifier"
                        className="block text-left text-xs text-gray-600">
                        Email or Phone Number
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter email or phone number"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        onBlur={() => validateInput(identifier)}
                      />
                      {inputError && (
                        <p className="text-red-500 text-xs">{inputError}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full bg-emerald-800">
                      {loading ? <Spinner /> : "Reset Password"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="training_center">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="identifier"
                        className="block text-left text-xs text-gray-600">
                        Email or Phone Number
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter email or phone number"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        onBlur={() => validateInput(identifier)}
                      />
                      {inputError && (
                        <p className="text-red-500 text-xs">{inputError}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full bg-blue-600">
                      {loading ? <Spinner /> : "Reset Password"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:underline">
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Button } from "../../components/ui/button";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "../../components/ui/tabs";
// import { toast } from "sonner";
// import Spinner from "../../components/Spinner";
// import PageLayout from "../../components/layout/pageLayout";
// import { API_BASE_URL } from "@/config/env";

// export default function ForgotPassword() {
//   const [identifier, setIdentifier] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userType, setUserType] = useState("user"); // Default to "user"
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     const endpoint =
//       userType === "user"
//         ? `${API_BASE_URL}/user/forgot-password`
//         : `${API_BASE_URL}/training-center/forgot-password`;

//     try {
//       const response = await axios.post(
//         endpoint,
//         { identifier },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const { success, message } = response.data;

//       if (success) {
//         toast.success("Password reset instructions sent successfully!", {
//           description:
//             "Please check your email or phone for further instructions.",
//           position: "top-right",
//         });
//         navigate("/login");
//       } else {
//         toast.error("Failed to process request", {
//           description: message,
//           position: "top-right",
//         });
//       }
//     } catch (error) {
//       const description =
//         error?.response?.data?.message ||
//         "An error occurred. Please try again.";
//       toast.error("Error!", {
//         description,
//         position: "top-right",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageLayout>
//       <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
//         <div className="flex min-h-screen items-center justify-center absolute top-0 left-0 right-0 bottom-0">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-gray-600">
//                 Forgot Password
//               </CardTitle>
//               <CardDescription>
//                 Select your account type and enter your email or phone number to
//                 reset your password.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Tabs value={userType} onValueChange={setUserType}>
//                 <TabsList className="grid w-full grid-cols-2 bg-gray-50">
//                   <TabsTrigger
//                     value="user"
//                     className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
//                     User
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="training_center"
//                     className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
//                     Training Center
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="user">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="identifier"
//                         className="block text-left text-xs text-gray-600">
//                         Email or Phone Number
//                       </Label>
//                       <Input
//                         id="identifier"
//                         type="text"
//                         placeholder="Enter email or phone number"
//                         required
//                         value={identifier}
//                         onChange={(e) => setIdentifier(e.target.value)}
//                       />
//                     </div>
//                     <Button type="submit" className="w-full bg-emerald-800">
//                       {loading ? <Spinner /> : "Reset Password"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 <TabsContent value="training_center">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="identifier"
//                         className="block text-left text-xs text-gray-600">
//                         Email or Phone Number
//                       </Label>
//                       <Input
//                         id="identifier"
//                         type="text"
//                         placeholder="Enter email or phone number"
//                         required
//                         value={identifier}
//                         onChange={(e) => setIdentifier(e.target.value)}
//                       />
//                     </div>
//                     <Button type="submit" className="w-full bg-blue-600">
//                       {loading ? <Spinner /> : "Reset Password"}
//                     </Button>
//                   </form>
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//             <CardFooter className="flex justify-center">
//               <Button
//                 variant="link"
//                 onClick={() => navigate("/login")}
//                 className="text-sm text-blue-600 hover:underline">
//                 Back to Login
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </section>
//     </PageLayout>
//   );
// }
