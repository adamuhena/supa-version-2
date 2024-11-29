

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { CalendarDays, Briefcase, Star, Settings, LogOut, UserCircle, Edit, Trash2, UserPlus } from "lucide-react";
// import DashboardPage from '@/components/layout/DashboardLayout';
// import ProtectedRoute from "@/components/ProtectedRoute";
// import useLogout from '@/pages/loginPage/logout';
// import axios from 'axios';

// const UserManagement = () => {
//   const logout = useLogout();
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const [users, setUsers] = useState([]);
//   const [newUser, setNewUser] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     phoneNumber: '',
//     nin: '',
//     role: ''
//   });
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const response = await axios.get(`${API_BASE_URL}/users`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         if (response.data.success) {
//           setUsers(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleDelete = async (userId) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       await axios.delete(`${API_BASE_URL}/users/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const handleEdit = (userId) => {
//     navigate(`/edit-user/${userId}`);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewUser(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleRoleChange = (value) => {
//     setNewUser(prevState => ({
//       ...prevState,
//       role: value
//     }));
//   };

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.post(`${API_BASE_URL}/create`, newUser, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       if (response.data.success) {
//         setUsers(prevUsers => [...prevUsers, response.data.data]);
//         setNewUser({
//           firstName: '',
//           lastName: '',
//           email: '',
//           password: '',
//           phoneNumber: '',
//           nin: '',
//           role: ''
//         });
//         setIsDialogOpen(false);
//       }
//     } catch (error) {
//       console.error("Error creating user:", error);
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <DashboardPage title="Artisan Dashboard">
//         <div className="container mx-auto p-6">
//           <header className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold">USER MANAGEMENT</h1>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => navigate('/biodata')}>
//                 <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//               </Button>
//               <Button variant="destructive" onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </header>

//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">User List</h2>
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline">
//                     <UserPlus className="mr-2 h-4 w-4" /> Create New User
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[425px]">
//                   <DialogHeader>
//                     <DialogTitle>Create New User</DialogTitle>
//                     <DialogDescription>
//                       Fill in the details to create a new user. Click save when you're done.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <form onSubmit={handleCreateUser} className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="firstName">First Name</Label>
//                         <Input id="firstName" name="firstName" value={newUser.firstName} onChange={handleInputChange} required />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="lastName">Last Name</Label>
//                         <Input id="lastName" name="lastName" value={newUser.lastName} onChange={handleInputChange} required />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email</Label>
//                       <Input id="email" name="email" type="email" value={newUser.email} onChange={handleInputChange} required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="password">Password</Label>
//                       <Input id="password" name="password" type="password" value={newUser.password} onChange={handleInputChange} required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="phoneNumber">Phone Number</Label>
//                       <Input id="phoneNumber" name="phoneNumber" value={newUser.phoneNumber} onChange={handleInputChange} required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="nin">NIN</Label>
//                       <Input id="nin" name="nin" value={newUser.nin} onChange={handleInputChange} required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="role">Role</Label>
//                       <Select onValueChange={handleRoleChange} value={newUser.role}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a role" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="superadmin">Super Admin</SelectItem>
//                           <SelectItem value="admin">Admin</SelectItem>
//                           <SelectItem value="artisan_user">Artisan User</SelectItem>
//                           <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <Button type="submit" className="w-full">
//                       Create User
//                     </Button>
//                   </form>
//                 </DialogContent>
//               </Dialog>

//             </div>
            
//             <div className="overflow-y-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {users.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName +" "+ user.lastName}</td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.role}</td>                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.phoneNumber}</td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         <div className="flex space-x-2">
//                           <Button variant="outline" size="sm" onClick={() => handleEdit(user.id)}>
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   );
// };

// export default UserManagement;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Briefcase, Star, Settings, LogOut, UserCircle, Edit, Trash2, UserPlus, Key } from 'lucide-react';
import DashboardPage from '@/components/layout/DashboardLayout';
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from '@/pages/loginPage/logout';
import axios from 'axios';
import {toast} from 'sonner';
import Spinner from '@/components/layout/spinner';

const UserManagement = () => {
  const logout = useLogout();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    nin: '',
    role: ''
  });
  const [editUser, setEditUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data.success) {
          setUsers(response.data.data);
        }
        toast.success("Fetching users");
      } catch (error) {
        toast.error("Error fetching users");
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted Successfully")
    } catch (error) {
      toast.error("Error deleting user")
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e, setStateFunction) => {
    const { name, value } = e.target;
    setStateFunction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoleChange = (value, setStateFunction) => {
    setStateFunction(prevState => ({
      ...prevState,
      role: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(`${API_BASE_URL}/create`, newUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        setUsers(prevUsers => [...prevUsers, response.data.data]);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          nin: '',
          role: ''
        });
        setIsCreateDialogOpen(false);
        toast.success("User Created Successfully");
      }
    } catch (error) {
      toast.error("Error creating user")
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const updateData = { ...editUser };
  
      // Include the new password if provided
      if (newPassword) {
        updateData.password = newPassword;
      }
  
      // Send the PUT request with the updated user data
      const response = await axios.put(`${API_BASE_URL}/update/${editUser._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data.success) {
        // Update the user in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editUser._id ? response.data.data : user
          )
        );
        toast.success("User Updated Successfully");
  
        // Close the edit dialog and reset fields
        setIsEditDialogOpen(false);
        setNewPassword('');
      }
    } catch (error) {
      toast.error("Error updating user");
      console.error("Error updating user:", error);
    }
  };
  

  const handleChangePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(`${API_BASE_URL}/users/${editUser._id}/change-password`, 
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Password changed successfully.");
      setNewPassword('');
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    }
  };
  if (!users) {
    return (
    <div class="flex justify-center items-center h-screen">
      <Spinner/>
    </div>
    );
  }   
  return (
    <ProtectedRoute>
      <DashboardPage title="Artisan Dashboard">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">USER MANAGEMENT</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User List</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" /> Create New User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new user. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" value={newUser.firstName} onChange={(e) => handleInputChange(e, setNewUser)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={newUser.lastName} onChange={(e) => handleInputChange(e, setNewUser)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={newUser.email} onChange={(e) => handleInputChange(e, setNewUser)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" value={newUser.password} onChange={(e) => handleInputChange(e, setNewUser)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input id="phoneNumber" name="phoneNumber" value={newUser.phoneNumber} onChange={(e) => handleInputChange(e, setNewUser)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nin">NIN</Label>
                      <Input id="nin" name="nin" value={newUser.nin} onChange={(e) => handleInputChange(e, setNewUser)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select onValueChange={(value) => handleRoleChange(value, setNewUser)} value={newUser.role}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="artisan_user">Artisan User</SelectItem>
                          <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      Create User
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName + " " + user.lastName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.role}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.phoneNumber}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardPage>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details or change password. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input id="editFirstName" name="firstName" value={editUser.firstName} onChange={(e) => handleInputChange(e, setEditUser)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input id="editLastName" name="lastName" value={editUser.lastName} onChange={(e) => handleInputChange(e, setEditUser)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input id="editEmail" name="email" type="email" value={editUser.email} onChange={(e) => handleInputChange(e, setEditUser)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhoneNumber">Phone Number</Label>
                <Input id="editPhoneNumber" name="phoneNumber" value={editUser.phoneNumber} onChange={(e) => handleInputChange(e, setEditUser)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNin">NIN</Label>
                <Input id="editNin" name="nin" value={editUser.nin} onChange={(e) => handleInputChange(e, setEditUser)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select onValueChange={(value) => handleRoleChange(value, setEditUser)} value={editUser.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="artisan_user">Artisan User</SelectItem>
                    <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPassword">New Password</Label>
                <Input 
                  id="editPassword" 
                  name="password" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex justify-between">
                <Button type="submit" className="w-1/2 mr-2">
                  Update User
                </Button>
                <Button type="button" variant="outline" className="w-1/2 ml-2" onClick={handleChangePassword}>
                  <Key className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
};

export default UserManagement;

