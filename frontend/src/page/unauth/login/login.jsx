import React, { useContext } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../schemas/login';
import { loginUser } from '../../../services/mutatation/auth.mutation';
import { ROUTES } from '../../../constant/route';
import { toast } from 'react-toastify';
import AuthContext from '../../../context/auth-context';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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

      // update AuthContext state
      login(res.data, res.data.token);

      toast.success('Logged in successfully!');
      navigate(ROUTES.HOME);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center  bg-slate-50">
      <div className="w-full bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">
            Sign in to your MedConnect account
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
