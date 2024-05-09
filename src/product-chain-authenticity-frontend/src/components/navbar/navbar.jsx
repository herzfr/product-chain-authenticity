import React, { useEffect, useState } from 'react';
import './navbar.scss'
// import useAuth, { useAuthClient } from '../../../services/auth-client.context';

// import { Dialog } from '@headlessui/react'
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'WhyUs?', href: '#', color: 'text-custom-cyan' },
    { name: 'Features', href: '#', color: 'text-white' },
    { name: 'Subscription', href: '#', color: 'text-white' },
    { name: 'Contact Us', href: '#', color: 'text-white' },
]

function Navbar() {
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    // const [scrolled, setScrolled] = useState(false);

    // const { login } = useAuth();

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollTop = window.pageYOffset;
    //         if (scrollTop > 50) {
    //             setScrolled(true);
    //         }

    //         if (scrollTop === 0) {
    //             setScrolled(false);
    //         }
    //     }

    //     window.addEventListener('scroll', handleScroll);
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [])


    // return (
    //     <header className={scrolled ? 'sticky-nav inset-x-0 z-50' : 'bg-trans absolute inset-x-0 top-0 z-50'}>
    //         <nav className="flex items-center justify-between p-3 lg:px-8" aria-label="Global">
    //             <div className="flex lg:flex-1">
    //                 <a href="#" className="-m-1.5 p-1.5">
    //                     <span className="sr-only">Your Company</span>
    //                     <img
    //                         className="h-8 w-auto"
    //                         src="/logo-digicert.svg"
    //                         alt="digicert"
    //                     />
    //                 </a>
    //             </div>
    //             <div className="flex lg:hidden">
    //                 <button
    //                     type="button"
    //                     className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
    //                     onClick={() => setMobileMenuOpen(true)}
    //                 >
    //                     <span className="sr-only">Open main menu</span>
    //                     <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    //                 </button>
    //             </div>
    //             {/* <div className="hidden lg:flex lg:gap-x-12">
    //                 {navigation.map((item) => (
    //                     <a key={item.name} href={item.href} className={item.name === 'WhyUs?' ?
    //                         'text-sm font-semibold leading-6 text-custom-cyan' : 'text-sm font-semibold leading-6 text-white'}>
    //                         {item.name}
    //                     </a>
    //                 ))}
    //             </div> */}
    //             <div className="hidden lg:flex lg:flex-1 lg:justify-end">
    //                 <a onClick={login} className="cursor-pointer flex items-center text-sm font-semibold leading-6 text-white">
    //                     <img className="login" src="/favicon.ico" alt="DFINITY logo" />
    //                     Log in <span className='ml-1' aria-hidden="true">&rarr;</span>
    //                 </a>
    //             </div>
    //         </nav>
    //         <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
    //             <div className="fixed inset-0 z-50" />
    //             <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
    //                 <div className="flex items-center justify-between">
    //                     <a href="#" className="-m-1.5 p-1.5">
    //                         <span className="sr-only">Your Company</span>
    //                         <img
    //                             className="h-8 w-auto"
    //                             src="/logo-digicert-black.svg"
    //                             alt="digicert"
    //                         />
    //                     </a>
    //                     <button
    //                         type="button"
    //                         className="-m-2.5 rounded-md p-2.5 text-gray-700"
    //                         onClick={() => setMobileMenuOpen(false)}
    //                     >
    //                         <span className="sr-only">Close menu</span>
    //                         <XMarkIcon className="h-6 w-6" aria-hidden="true" />
    //                     </button>
    //                 </div>
    //                 <div className="mt-6 flow-root">
    //                     <div className="-my-6 divide-y divide-gray-500/10">
    //                         <div className="space-y-2 py-6">
    //                             {navigation.map((item) => (
    //                                 <a
    //                                     key={item.name}
    //                                     href={item.href}
    //                                     className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                                 >
    //                                     {item.name}
    //                                 </a>
    //                             ))}
    //                         </div>
    //                         <div className="py-6">
    //                             <a
    //                                 onClick={login}
    //                                 className="-mx-3 cursor-pointer flex justify-center items-center rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
    //                             ><img className="login" src="/favicon.ico" alt="DFINITY logo" />
    //                                 Log in
    //                             </a>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </Dialog.Panel>
    //         </Dialog>
    //     </header>
    // )
}

export default Navbar

