import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../schemas/register';
import { registerUser } from '../../../services/mutatation/auth.mutation';
import { Mail, Lock, MapPin, User, Upload, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../constant/route';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('address', data.address);
      formData.append('password', data.password);
      formData.append('role', 'Patient');

      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const res = await registerUser(formData);

      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Account created successfully!');
      reset();
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Register as a patient</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                placeholder="John Doe"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                placeholder="john@email.com"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                placeholder="Your address"
                {...register('address')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.address ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                {...register('password')}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              Profile Photo <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {/* Preview */}
              <div className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {previewImage ? (
                  <img src={previewImage} alt="preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Upload className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <label className="flex-1 cursor-pointer">
                <div className={`w-full py-2.5 px-4 rounded-xl border text-sm text-slate-500 text-center
                  border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition
                  ${errors.image ? 'border-red-400 bg-red-50' : ''}`}>
                  Click to upload image
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  {...register('image')}
                  onChange={(e) => {
                    register('image').onChange(e);
                    handleImageChange(e);
                  }}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm
              flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;