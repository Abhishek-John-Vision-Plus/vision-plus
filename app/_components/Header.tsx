'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { useProcess } from '@/context/ProcessContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, Settings, ChevronDown, Menu, LayoutDashboardIcon, User2 } from 'lucide-react';

import { toast } from 'sonner';
import { useState } from 'react';
import Modal from './Modal';
import UserProfile from './UserProfile';

import SettingComp from './Settings';


interface HeaderProps {
  serverUser?: any;
  initialExtraDetails?: any;
}

function Header({ serverUser, initialExtraDetails }: HeaderProps) {
      const [open, setOpen] = useState(false);
      const [openSetting, setOpenSetting] = useState(false);
    const { selectedProcess, setSelectedProcess } = useProcess();
    const { user: clientUser, logout } = useAuth();
    const router = useRouter();

    const user = clientUser || serverUser;
    const userData = user || {};
    
    const menu = [
        { id: 1, name: 'Home', path: 'home' },
        { id: 2, name: 'About', path: 'about' },
        { id: 3, name: 'Services', path: 'services' },
        { id: 4, name: 'Projects', path: 'projects' },
        { id: 5, name: 'Testimonials', path: 'testimonials' },
        { id: 6, name: 'Contact Us', path: '/contact' },
    ]

    const scrollToSection = (id: string, type?: string) => {
        if (type === 'link') {
            router.push(id);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push('/');
        }
    };

    return (
        <div className='flex justify-between items-center p-4 shadow-2xl bg-white/30 backdrop-blur-md sticky top-2 z-50 rounded-2xl mx-4'>
            <div className="flex items-center gap-4">
                {/* Mobile Menu */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px]">
                            <SheetHeader>
                                <SheetTitle className="text-left flex items-center gap-2">
                                    <Image
                                        src={'/logo/Vision.png'}
                                        alt='VISION PLUS'
                                        height={30}
                                        width={120}
                                        className="object-contain w-auto h-auto"
                                        priority
                                    />
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 mt-8">
                                {menu.map((item) => (
                                    <SheetClose key={item.id} asChild>
                                        <h2
                                            onClick={() => scrollToSection(item.path, (item as any).type)}
                                            className='text-lg font-bold uppercase tracking-widest cursor-pointer text-slate-700 hover:text-primary transition-colors pl-2 border-l-4 border-transparent hover:border-primary'
                                        >
                                            {item.name}
                                        </h2>
                                    </SheetClose>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <Image
                    className='cursor-pointer hover:scale-105 transition-transform hidden sm:block w-auto h-auto'
                    onClick={() => {
                        scrollToSection('home');
                    }}
                    src={'/logo/Vision.png'}
                    alt='VISION PLUS'
                    height={40}
                    width={160}
                    priority
                />
                 {/* Mobile Logo (smaller) */}
                 <Image
                    className='cursor-pointer hover:scale-105 transition-transform sm:hidden w-auto h-auto'
                    onClick={() => {
                        scrollToSection('home');
                    }}
                    src={'/logo/Vision.png'}
                    alt='VISION PLUS'
                    height={32}
                    width={120}
                    priority
                />
                
                {selectedProcess && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            {selectedProcess.name}
                        </span>
                    </div>
                )}
            </div>

            <div className='hidden lg:flex items-center gap-8'>
                {menu.map((item) => (
                    <h2
                        key={item.id}
                        onClick={() => scrollToSection(item.path, (item as any).type)}
                        className='text-sm font-bold uppercase tracking-widest cursor-pointer text-slate-700 hover:text-primary transition-colors'
                    >
                        {item.name}
                    </h2>
                ))}
            </div>

            <div className="flex items-center gap-3">
               {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
                    <Button
                        onClick={() => router.push('/admin')}
                        title="Admin Dashboard"
                    >
                    <User2 className="w-4 h-4" />{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                    </Button>
                ):<p> </p>}
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="rounded-full w-10 h-10 p-0 overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-primary font-bold">
                                    {String(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="flex items-center gap-2 p-2 border-b">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold">
                                    {String(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold truncate">{user.name || 'User'}</span>
                                    <span className="text-xs text-slate-500 truncate">{user.email}</span>
                                </div>
                            </div>
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2"
                                // onClick={() => toast.info("Profile feature coming soon!")}
                                onClick={() => setOpen(true)}
                            >
                                <UserIcon className="w-4 h-4" />
                                Profile
                            </DropdownMenuItem>
                             
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2"
                                onClick={() => setOpenSetting(true)}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2 text-destructive focus:text-destructive" 
                                onClick={() => {
                                    logout();
                                    router.push('/');
                                }}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        
                    </DropdownMenu>
                    
                ) : (
                    <Button onClick={() => router.push('/login')} className="bg-primary hover:bg-primary/90">
                        Login
                    </Button>
                )}
              
            </div>

            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <UserProfile 
                    user={user ? {
                        id: user.id || '',
                        name: user.name || '',
                        email: user.email || '',
                        empId: user.empId || '',
                        phone: user.phone || '',
                        role: user.role || '',
                        process: user.process || '',
                        createdAt: user.createdAt || '',
                    } : {
                        id: '',
                        name: '',
                        email: '',
                        empId: '',
                        phone: '',
                        role: '',
                        process: '',
                        createdAt: '',
                    }} 
                    initialExtraDetails={initialExtraDetails}
                />
            </Modal>
            <Modal isOpen={openSetting} onClose={() => setOpenSetting(false)}>
                <SettingComp />
            </Modal>
        </div>
    )
}

export default Header