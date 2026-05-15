import React, { useContext, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, HeartPulse } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../schemas/login';
import { loginUser } from '../../../services/mutatation/auth.mutation';
import { ROUTES } from '../../../constant/route';
import { toast } from 'react-toastify';
import AuthContext from '../../../context/auth-context';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);

      if (!res || !res.success) {
        return toast.error(res?.message || 'Login failed');
      }

      const user = res?.data?.user || res?.data;
      const token = res?.data?.token || res?.token;

      if (!user || !token) {
        console.error("Invalid login response structure:", res);
        return toast.error("Server error: Invalid login response");
      }

      login(user, token);

      await Swal.fire({
        title: `Welcome back, ${user?.name || "User"} 🎉`,
        text: 'Login successful',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      const role = user?.role;
      if (role === 'Admin')        navigate(ROUTES.ADMIN_DASHBOARD);
      else if (role === 'Doctor')  navigate(ROUTES.DOCTOR_DASHBOARD);
      else                         navigate(ROUTES.HOME);

    } catch (err) {
      console.error('Login error:', err);
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-12">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400" />

          <div className="p-8 sm:p-10">

            {/* Logo + Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                <HeartPulse className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to your MedConnect account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="john@email.com"
                    {...register('email')}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.email
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.password
                        ? 'border-red-400 bg-red-50'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                  text-white font-semibold text-sm flex items-center justify-center gap-2
                  transition-all shadow-lg shadow-blue-100 hover:shadow-blue-200
                  disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400">New to MedConnect?</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Register link */}
            <Link
              to={ROUTES.REGISTER}
              className="block w-full py-2.5 rounded-xl border-2 border-blue-100 text-blue-600
                font-semibold text-sm text-center hover:bg-blue-50 transition"
            >
              Create an Account
            </Link>

          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By signing in, you agree to our{' '}
          <span className="text-blue-500 cursor-pointer hover:underline">Terms</span>
          {' '}and{' '}
          <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>

      </div>
    </div>
  );
};

export default Login;