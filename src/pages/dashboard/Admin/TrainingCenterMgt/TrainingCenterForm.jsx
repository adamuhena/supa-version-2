// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useForm } from "react-hook-form";
// import { states } from "@/data/nigeria";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import ChangePasswordForm from "./ChangePasswordForm";

// const formSchema = z.object({
//   trainingCentreName: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
//   state: z.string().min(1, "State is required"),
//   lga: z.string().min(1, "LGA is required"),
//   address: z.string().min(5, "Address must be at least 5 characters"),
//   contactPerson: z.string().min(2, "Contact person name is required"),
//   ownership: z.enum([
//     "federalGovt", "stateGovt", "localGovt", "personal", 
//     "coOwned", "religiousOrganization", "ngo", "other"
//   ]),
//   otherOwnership: z.string().optional(),
//   trainingNature: z.enum(["institutionTraining", "workplaceTraining", "informal"]),
//   itfRegistered: z.enum(["yes", "no"]),
//   itfRegistrationNumber: z.string().optional(),
//   regNum: z.string().min(1, "Registration number is required"),
//   bankAccount: z.object({
//     accountName: z.string().min(2, "Account name is required"),
//     accountNumber: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
//     bank: z.string().min(2, "Bank name is required")
//   }),
//   amenities: z.object({
//     portableWater: z.enum(["yes", "no"]),
//     observeBreak: z.enum(["yes", "no"]),
//     breakTime: z.string().optional(),
//     otherComments: z.string().optional()
//   }),
//   password: z.string().min(6, "Password must be at least 6 characters").optional(),
//   currentPassword: z.string().optional(),
//   newPassword: z.string().min(6, "Password must be at least 6 characters").optional()
// }).refine((data) => {
//   if (data.ownership === "other" && !data.otherOwnership) {
//     return false;
//   }
//   if (data.itfRegistered === "yes" && !data.itfRegistrationNumber) {
//     return false;
//   }
//   if (data.amenities.observeBreak === "yes" && !data.amenities.breakTime) {
//     return false;
//   }
//   return true;
// }, {
//   message: "Please fill in all required fields"
// });

// export default function TrainingCenterForm({ 
//   isOpen, 
//   onClose, 
//   initialData = null,
//   onSubmit,
//   onPasswordChange
// }) {
//   const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData || {
//       trainingCentreName: "",
//       email: "",
//       phoneNumber: "",
//       state: "",
//       lga: "",
//       address: "",
//       contactPerson: "",
//       ownership: "personal",
//       trainingNature: "institutionTraining",
//       regNum: "",
//     }
//   });

//   const selectedState = form.watch("state");
//   const selectedLGAs = states.find(s => s.value === selectedState)?.lgas || [];

//   const handleSubmit = async (data) => {
//     await onSubmit(data);
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             {initialData ? "Edit Training Center" : "Add New Training Center"}
//           </DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="trainingCentreName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Center Name</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="regNum"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Registration Number</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone Number</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="state"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>State</FormLabel>
//                     <Select 
//                       onValueChange={field.onChange} 
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select state" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {states.map((state) => (
//                           <SelectItem key={state.value} value={state.value}>
//                             {state.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="lga"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>LGA</FormLabel>
//                     <Select 
//                       onValueChange={field.onChange} 
//                       defaultValue={field.value}
//                       disabled={!selectedState}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select LGA" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {selectedLGAs.map((lga) => (
//                           <SelectItem key={lga} value={lga}>
//                             {lga}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="ownership"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Ownership Type</FormLabel>
//                     <Select 
//                       onValueChange={field.onChange} 
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select ownership type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="federalGovt">Federal Government</SelectItem>
//                         <SelectItem value="stateGovt">State Government</SelectItem>
//                         <SelectItem value="localGovt">Local Government</SelectItem>
//                         <SelectItem value="personal">Personal</SelectItem>
//                         <SelectItem value="coOwned">Co-owned</SelectItem>
//                         <SelectItem value="religiousOrganization">Religious Organization</SelectItem>
//                         <SelectItem value="ngo">NGO</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="trainingNature"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Training Nature</FormLabel>
//                     <Select 
//                       onValueChange={field.onChange} 
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select training nature" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="institutionTraining">Institution Training</SelectItem>
//                         <SelectItem value="workplaceTraining">Workplace Training</SelectItem>
//                         <SelectItem value="informal">Informal</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex justify-end gap-2">
//               {initialData && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsPasswordFormOpen(true)}
//                 >
//                   Change Password
//                 </Button>
//               )}
//               <Button type="button" variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit">
//                 {initialData ? "Update" : "Create"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//         {initialData && (
//           <ChangePasswordForm
//             isOpen={isPasswordFormOpen}
//             onClose={() => setIsPasswordFormOpen(false)}
//             onSubmit={onPasswordChange}
//             centerId={initialData._id}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { states } from "@/data/nigeria"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const formSchema = z
  .object({
    trainingCentreName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    state: z.string().min(1, "State is required"),
    lga: z.string().min(1, "LGA is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    contactPerson: z.string().min(2, "Contact person name is required"),
    ownership: z.enum([
      "federalGovt",
      "stateGovt",
      "localGovt",
      "personal",
      "coOwned",
      "religiousOrganization",
      "ngo",
      "other",
    ]),
    otherOwnership: z.string().optional(),
    trainingNature: z.enum(["institutionTraining", "workplaceTraining", "informal"]),
    itfRegistered: z.enum(["yes", "no"]),
    itfRegistrationNumber: z.string().optional(),
    regNum: z.string().min(1, "Registration number is required"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  })
  .refine(
    (data) => {
      if (data.ownership === "other" && !data.otherOwnership) {
        return false
      }
      return true
    },
    {
      message: "Please specify other ownership type",
      path: ["otherOwnership"],
    },
  )
  .refine(
    (data) => {
      if (data.itfRegistered === "yes" && !data.itfRegistrationNumber) {
        return false
      }
      return true
    },
    {
      message: "ITF registration number is required",
      path: ["itfRegistrationNumber"],
    },
  )

export default function TrainingCenterForm({ isOpen, onClose, initialData = null, onSubmit, onPasswordChange }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [selectedState, setSelectedState] = useState("")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingCentreName: "",
      email: "",
      phoneNumber: "",
      state: "",
      lga: "",
      address: "",
      contactPerson: "",
      ownership: "personal",
      otherOwnership: "",
      trainingNature: "institutionTraining",
      itfRegistered: "no",
      itfRegistrationNumber: "",
      regNum: "",
      password: "",
    },
  })

  // Reset form when initialData changes or when the dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Reset form with initialData when editing
        form.reset({
          trainingCentreName: initialData.trainingCentreName || "",
          email: initialData.email || "",
          phoneNumber: initialData.phoneNumber || "",
          state: initialData.state || "",
          lga: initialData.lga || "",
          address: initialData.address || "",
          contactPerson: initialData.contactPerson || "",
          ownership: initialData.ownership || "personal",
          otherOwnership: initialData.otherOwnership || "",
          trainingNature: initialData.trainingNature || "institutionTraining",
          itfRegistered: initialData.itfRegistered || "no",
          itfRegistrationNumber: initialData.itfRegistrationNumber || "",
          regNum: initialData.regNum || "",
        })

        // Set selected state to populate LGAs
        setSelectedState(initialData.state || "")
      } else {
        // Reset form with default values when adding new
        form.reset({
          trainingCentreName: "",
          email: "",
          phoneNumber: "",
          state: "",
          lga: "",
          address: "",
          contactPerson: "",
          ownership: "personal",
          otherOwnership: "",
          trainingNature: "institutionTraining",
          itfRegistered: "no",
          itfRegistrationNumber: "",
          regNum: "",
          password: "",
        })
        setSelectedState("")
      }
    }
  }, [isOpen, initialData, form])

  // Update selectedState when form values change
  useEffect(() => {
    const state = form.watch("state")
    if (state) {
      setSelectedState(state)
    }
  }, [form.watch("state")])

  // Get LGAs for the selected state
  const selectedLGAs = states.find((s) => s.value === selectedState)?.lgas || []

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to save training center")
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    try {
      // Call the onPasswordChange function with the center ID and new password
      await onPasswordChange(initialData._id, { newPassword })
      toast.success("Password updated successfully")
      setIsChangingPassword(false)
      setNewPassword("")
    } catch (error) {
      console.error("Password change failed:", error)
      toast.error("Failed to update password")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Training Center" : "Add New Training Center"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trainingCentreName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Center Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue("lga", "")
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LGA</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select LGA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedLGAs.map((lga) => (
                            <SelectItem key={lga} value={lga}>
                              {lga}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Center Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ownership"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ownership Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ownership type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="federalGovt">Federal Government</SelectItem>
                          <SelectItem value="stateGovt">State Government</SelectItem>
                          <SelectItem value="localGovt">Local Government</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="coOwned">Co-owned</SelectItem>
                          <SelectItem value="religiousOrganization">Religious Organization</SelectItem>
                          <SelectItem value="ngo">NGO</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("ownership") === "other" && (
                  <FormField
                    control={form.control}
                    name="otherOwnership"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specify Ownership</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="trainingNature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Nature</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select training nature" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="institutionTraining">Institution Training</SelectItem>
                          <SelectItem value="workplaceTraining">Workplace Training</SelectItem>
                          <SelectItem value="informal">Informal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="itfRegistered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ITF Registered</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("itfRegistered") === "yes" && (
                  <FormField
                    control={form.control}
                    name="itfRegistrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ITF Registration Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {!initialData && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {initialData && isChangingPassword && (
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    {newPassword && newPassword.length < 6 && (
                      <p className="text-sm text-red-500">Password must be at least 6 characters</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false)
                        setNewPassword("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={handlePasswordChange} disabled={newPassword.length < 6}>
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {initialData && !isChangingPassword && (
                <Button type="button" variant="outline" onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{initialData ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
