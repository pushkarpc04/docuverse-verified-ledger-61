import React, { useState } from 'react';
import { ArrowLeft, Shield, User, Building, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'institute',
    instituteName: '',
    firstName: '',
    lastName: ''
  });
  const { toast } = useToast();
  const { signup, login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleSelect = (role: 'user' | 'institute') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const getFirebaseErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'permission-denied':
        return 'Database access denied. Please contact support.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent, mode: 'signin' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(`Starting ${mode} process`);
      
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (!formData.firstName || !formData.lastName) {
          throw new Error('Please provide your first and last name');
        }

        if (formData.role === 'institute' && !formData.instituteName) {
          throw new Error('Please provide your institution name');
        }

        console.log('Calling signup with data:', {
          email: formData.email,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          instituteName: formData.instituteName || undefined,
        });

        await signup(formData.email, formData.password, {
          email: formData.email,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          instituteName: formData.instituteName || undefined,
          verified: true
        });

        toast({
          title: "Account Created Successfully!",
          description: `Welcome ${formData.firstName}! Your account has been created.`,
        });
      } else {
        console.log('Calling login with email:', formData.email);
        await login(formData.email, formData.password);
        
        toast({
          title: "Sign In Successful!",
          description: "Welcome back! You've been signed in successfully.",
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'An error occurred during authentication';
      
      if (error.code) {
        errorMessage = getFirebaseErrorMessage(error.code);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-8 left-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-success-500 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DocVerify</h1>
          <p className="text-gray-600">Secure access to your document verification platform</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Account Access</CardTitle>
            <CardDescription className="text-center">
              Sign in or create your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-success-500 hover:from-primary-600 hover:to-success-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Card 
                        className={`cursor-pointer transition-all ${formData.role === 'user' ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:bg-gray-50'}`}
                        onClick={() => handleRoleSelect('user')}
                      >
                        <CardContent className="p-4 text-center">
                          <User className="h-6 w-6 mx-auto mb-2 text-primary-500" />
                          <p className="text-sm font-medium">Individual User</p>
                          <p className="text-xs text-gray-500">Personal documents</p>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${formData.role === 'institute' ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:bg-gray-50'}`}
                        onClick={() => handleRoleSelect('institute')}
                      >
                        <CardContent className="p-4 text-center">
                          <Building className="h-6 w-6 mx-auto mb-2 text-success-500" />
                          <p className="text-sm font-medium">Institution</p>
                          <p className="text-xs text-gray-500">Government/Organization</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {formData.role === 'institute' && (
                    <div className="space-y-2">
                      <Label htmlFor="instituteName">Institution Name</Label>
                      <Input
                        id="instituteName"
                        name="instituteName"
                        placeholder="Enter institution name"
                        value={formData.instituteName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-success-500 hover:from-primary-600 hover:to-success-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
