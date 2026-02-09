
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		// No auth logic – UI only. Keep controlled inputs.
		console.log('Login attempt', { email, password });
		// Temporary UI-only navigation to dashboard after submit
		navigate('/dashboard');
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

			{/* Mobile header (condensed) */}
			<div className="md:hidden w-full bg-slate-950 border-b border-slate-800 text-white py-8 px-6">
				<div className="max-w-md mx-auto">
					<Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition mb-4">
						<ArrowLeft className="size-4" />
						Back to Home
					</Link>
					<div className="flex items-center gap-2">
						<Bot className="text-blue-500 size-7" />
						<h1 className="text-3xl font-extrabold">IT Service Desk</h1>
					</div>
					<p className="mt-1 text-sm text-slate-400">AI-driven incident management & SLA insights</p>
				</div>
			</div>

			{/* Left panel (desktop) */}
			<aside className="hidden md:flex md:w-3/5 items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
				{/* Back to home link */}
				<Link
					to="/"
					className="absolute top-6 left-6 z-20 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition"
				>
					<ArrowLeft className="size-4" />
					Back to Home
				</Link>

				<div className="max-w-lg z-10">
					<div className="flex items-center gap-3 mb-6">
						<Bot className="text-blue-500 size-10" />
						<span className="text-2xl font-bold">IT Service Desk AI</span>
					</div>
					<h1 className="text-5xl font-extrabold leading-tight">Welcome!</h1>
					<p className="mt-4 text-lg text-slate-400">Smarter incident resolution, proactive SLA monitoring, and AI-assisted routing.</p>
					<p className="mt-6 text-sm text-slate-500">Trusted insights for modern IT teams — reduce breaches and resolve faster.</p>
				</div>

				{/* Decorative shapes matching landing page palette */}
				<div className="absolute -right-24 -top-10 w-72 h-72 bg-blue-500 rounded-full opacity-15 blur-3xl transform rotate-45" aria-hidden="true" />
				<div className="absolute -left-20 -bottom-10 w-56 h-56 bg-teal-500 rounded-full opacity-10 blur-2xl" aria-hidden="true" />
				<div className="absolute right-10 bottom-20 w-40 h-40 bg-blue-400 rounded-full opacity-5 blur-3xl" aria-hidden="true" />
			</aside>

			{/* Right panel (form) */}
			<main className="md:w-2/5 flex-1 flex items-center justify-center p-6 bg-white">
				<div className="w-full max-w-md">
					<div className="bg-white shadow-lg rounded-xl p-8">
						<h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
						<p className="mt-1 text-sm text-gray-500">Sign in to continue to IT Service Desk AI</p>

						<form onSubmit={handleSubmit} className="mt-6" noValidate>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
								<div className="mt-1">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="appearance-none block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
										placeholder="you@company.com"
										aria-label="Email address"
									/>
								</div>
							</div>

							<div className="mt-4">
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
								<div className="mt-1">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="appearance-none block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
										placeholder="••••••••"
										aria-label="Password"
									/>
								</div>
								<div className="flex items-center justify-end mt-2">
									<a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition">Forgot password?</a>
								</div>
							</div>

							<div className="mt-6">
								<button
									type="submit"
										className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
								>
									Login
								</button>
							</div>

							<div className="mt-6 relative">
								<div className="absolute inset-0 flex items-center" aria-hidden="true">
									<div className="w-full border-t border-gray-200" />
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="bg-white px-2 text-gray-500">Or continue with</span>
								</div>
							</div>

							<div className="mt-6">
								<button
									type="button"
									className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
									aria-label="Login with Google (UI only)"
								>
									<svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path fill="#4285f4" d="M533.5 278.4c0-18.4-1.6-36-4.6-53.2H272v100.7h146.9c-6.4 34.6-25.4 63.9-54.3 83.4v69.2h87.9c51.4-47.4 80-117.4 80-200.1z"/>
										<path fill="#34a853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.3l-87.9-69.2c-24.5 16.4-55.8 26-92.9 26-71.4 0-132-48.1-153.5-112.9H30.5v70.8C75.4 490.8 167 544.3 272 544.3z"/>
										<path fill="#fbbc04" d="M118.5 327.6c-10.9-32.9-10.9-68.2 0-101.1V155.7H30.5c-39.6 78.8-39.6 172.1 0 250.9l88-79z"/>
										<path fill="#ea4335" d="M272 107.7c39.9 0 75.9 13.7 104.2 40.4l78.2-78.2C405.4 24.9 343.5 0 272 0 167 0 75.4 53.5 30.5 155.7l88 70.8C140 155.8 200.6 107.7 272 107.7z"/>
									</svg>
									Login with Google
								</button>
							</div>
						</form>
					</div>

					<p className="mt-4 text-center text-sm text-gray-500">
						Don't have an account? <a href="#" className="text-blue-600 hover:text-blue-500 transition">Create a new account</a>
					</p>
				</div>
			</main>
		</div>
	);
}
