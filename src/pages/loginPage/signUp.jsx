
import React, { useState } from 'react';
import {useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

export default function SignupForm() {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const initialTab = location.state?.tab || 'artisan_user';
  const [signupAs, setRole] = useState(initialTab); // Default role is 'artisan_user'
  const [formData, setFormData] = useState({
    nin: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    trainingCentreName: '', // Only for training_center
    regNum: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({
      nin: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      trainingCentreName: '',
      regNum: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      signupAs === 'training_center'
        ? `${API_BASE_URL}/training-centers/register`
        : `${API_BASE_URL}/signup`;

    const payload =
      signupAs === 'training_center'
        ? {
          trainingCentreName: formData.trainingCentreName,
          regNum: formData.regNum,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            agree: false,
            role: signupAs,
          }
        : {
            role: signupAs,
            nin: formData.nin,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            agree: false,
          };

    try {
      const response = await axios.post(endpoint, payload);
      if (response.data.success) {
        alert('Signup successful! Please login.');
        navigate('/login'); // Redirect to login page
      } else {
        alert(`Signup failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
      <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left image section */}
          <div className="hidden md:block w-3/5 relative">
            {signupAs === 'artisan_user' ? (
              <div className="flex h-full items-center justify-center bg-green-100 p-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-green-800">SignUp Today</h2>
                  <p className="text-green-600">Access your personal dashboard and track your progress.</p>
                  <img
                    src="/hairdresser copy.jpeg?height=200&width=200"
                    alt="User learning illustration"
                    className="mx-auto mt-4 h-48 w-48 object-cover"
                  />
                </div>
              </div>
            ) : signupAs === 'intending_artisan' ? (
              <div className="flex h-full items-center justify-center bg-red-100 p-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-red-800">SignUp Today</h2>
                  <p className="text-red-600">Access your personal dashboard and track your progress.</p>
                  <img
                    src="/hairdresser copy.jpeg?height=200&width=200"
                    alt="User learning illustration"
                    className="mx-auto mt-4 h-48 w-48 object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-blue-100 p-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-blue-800">SignUp Today</h2>
                  <p className="text-blue-600">Access your personal dashboard and track your progress.</p>
                  <img
                    src="/hairdresser copy.jpeg?height=200&width=200"
                    alt="User learning illustration"
                    className="mx-auto mt-4 h-48 w-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card section */}
          <Card className="w-full max-w-4xl pt-4 overflow-hidden">
            <CardHeader  className='md:hidden'>
              <CardTitle className="text-2xl font-bold text-gray-600 ">SignUp Today</CardTitle>
              <CardDescription className='text-xs'> Access your personal dashboard and track your progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={signupAs} onValueChange={handleRoleChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                   <TabsTrigger
                     value="artisan_user"
                     className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                   >
                     Artisan
                   </TabsTrigger>
                   <TabsTrigger
                     value="intending_artisan"
                     className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                   >
                     Intending Artisan
                   </TabsTrigger>
                   <TabsTrigger
                     value="training_center"
                     className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                   >
                     Training Center
                   </TabsTrigger>
                 </TabsList>


                {/* Artisan User Form */}
                <TabsContent value="artisan_user">
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <LabelInput name="nin" label="National ID" type="tel" pattern="\d{11}" value={formData.nin} onChange={handleChange}
                      placeholder="12345678953"
                      required = {true} />
                    <LabelInput name="email" label="Email" type="email" value={formData.email} onChange={handleChange} 
                      placeholder="abc@email.com"/>
                    <LabelInput name="phoneNumber" label="Phone Number" type="tel" value={formData.phoneNumber} onChange={handleChange} 
                      placeholder="2347012345643"
                      required = {true} />
                    <PasswordFields formData={formData} onChange={handleChange} />
                    <Button type="submit" className="w-full bg-emerald-800" disabled={loading}>
                      {loading ? 'Submitting...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Intending Artisan Form */}
                <TabsContent value="intending_artisan">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <LabelInput name="nin" label="National ID" type="tel" pattern="\d{11}" value={formData.nin} onChange={handleChange}
                      placeholder="12345678953"
                      required = {true} />
                    <LabelInput name="email" label="Email" type="email" value={formData.email} onChange={handleChange} 
                      placeholder="abc@email.com"/>
                    <LabelInput name="phoneNumber" label="Phone Number" type="tel" value={formData.phoneNumber} onChange={handleChange} 
                      placeholder="2347012345643"
                      required = {true} />
                    <PasswordFields formData={formData} onChange={handleChange} />
                    <Button type="submit" className="w-full bg-red-600" disabled={loading}>
                      {loading ? 'Submitting...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Training Center Form */}
                <TabsContent value="training_center">
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div className='flex flex-row  gap-8 '>
                       <div className='flex-1'>
                         <LabelInput name="trainingCentreName" label="Company Name" value={formData.trainingCentreName} onChange={handleChange} 
                         placeholder="Company Name here"
                          required = {true} />
                       </div>
                       <div className='flex-1'>
                         <LabelInput name="regNum" label="Reg Number" type="text" value={formData.regNum} onChange={handleChange} 
                         placeholder="RC-123456"
                         required = {true} 
                          />
                       </div>
                     </div>
                    <LabelInput name="email" label="Company Email" type="email" value={formData.email} onChange={handleChange} 
                          placeholder="company@email.com"
                         required = {true} 
                          />
                    <LabelInput name="phoneNumber" label="Company Phone" type="tel" value={formData.phoneNumber} onChange={handleChange} 
                      placeholder="2347012345643"
                      required = {true} 
                      />
                    <PasswordFields formData={formData} onChange={handleChange} />
                    <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
                      {loading ? 'Submitting...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              <div className="mt-4 text-center text-sm">
              Already have an account?- 
                <Link to="/login" className=" text-emerald-900 hover:underline">
                   Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Input field with label component
const LabelInput = ({ name, label, type = "text", value, onChange, placeholder }) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="block text-left text-xs text-gray-600">
      {label}
    </Label>
    <Input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required className="w-full" />
  </div>
);

// Password fields component
const PasswordFields = ({ formData, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="password" className="block text-left text-xs text-gray-600">
      Password
    </Label>
    <Input
      id="password"
      name="password"
      type="password"
      value={formData.password}
      onChange={onChange}
      placeholder='************'
      required
      className="w-full"
    />
    <Label htmlFor="confirmPassword" className="block text-left text-xs text-gray-600">
      Confirm Password
    </Label>
    <Input
      id="confirmPassword"
      name="confirmPassword"
      type="password"
      value={formData.confirmPassword}
      onChange={onChange}
      placeholder='************'
      required
      className="w-full"
    />
  </div>
);
