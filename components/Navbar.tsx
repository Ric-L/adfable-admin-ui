"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logOut, selectCurrentUser, selectIsAuthenticated } from "@/hooks/react-redux/features/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Handle logout
  const handleLogout = () => {
    dispatch(logOut());
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // If you want to show different content when not authenticated
  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 ml-16 lg:ml-0">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">Please log in</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Page title will be set by individual pages */}
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 ml-16 lg:ml-0">Admin Dashboard</h1>
        </div>

        {/* Right side - Actions and profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <Bell className="h-5 w-5" />
          </button> */}

          {/* Profile dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>

              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role_id === 1 ? "Admin" : user?.role_id === 2 ? "Manager" : "User"}</p>
              </div>
            </button>

            {/* Dropdown menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                {/* <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsProfileMenuOpen(false)}>
                  <User className="mr-3 h-4 w-4" />
                  Profile Settings
                </button>

                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsProfileMenuOpen(false)}>
                  <Settings className="mr-3 h-4 w-4" />
                  Account Settings
                </button> */}

                {/* <hr className="my-1" /> */}

                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { Bell, Settings, User, LogOut } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const profileMenuRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
//         setIsProfileMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//       <div className="flex items-center justify-between">
//         {/* Left side - Page title will be set by individual pages */}
//         <div className="flex items-center">
//           <h1 className="text-2xl font-semibold text-gray-900 ml-16 lg:ml-0">Admin Dashboard</h1>
//         </div>

//         {/* Right side - Actions and profile */}
//         <div className="flex items-center space-x-4">
//           {/* Notifications */}
//           {/* <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200">
//             <Bell className="h-5 w-5" />
//           </button> */}

//           {/* Profile dropdown */}
//           <div className="relative" ref={profileMenuRef}>
//             <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
//               {user?.avatar ? (
//                 <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
//               ) : (
//                 <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
//                   <User className="h-4 w-4 text-white" />
//                 </div>
//               )}
//               <div className="text-left hidden md:block">
//                 <p className="text-sm font-medium text-gray-700">{user?.name}</p>
//                 <p className="text-xs text-gray-500">{user?.role}</p>
//               </div>
//             </button>

//             {/* Dropdown menu */}
//             {isProfileMenuOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                 <div className="px-4 py-2 border-b border-gray-100">
//                   <p className="text-sm font-medium text-gray-700">{user?.name}</p>
//                   <p className="text-xs text-gray-500">{user?.email}</p>
//                 </div>

//                 {/* <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsProfileMenuOpen(false)}>
//                   <User className="mr-3 h-4 w-4" />
//                   Profile Settings
//                 </button>

//                 <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsProfileMenuOpen(false)}>
//                   <Settings className="mr-3 h-4 w-4" />
//                   Account Settings
//                 </button> */}

//                 {/* <hr className="my-1" /> */}

//                 <button
//                   onClick={() => {
//                     logout();
//                     setIsProfileMenuOpen(false);
//                   }}
//                   className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
//                 >
//                   <LogOut className="mr-3 h-4 w-4" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
