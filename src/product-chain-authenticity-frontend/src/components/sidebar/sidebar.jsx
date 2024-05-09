import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './sidebar.scss'
import useAuth from '../../services/auth-client.context';

const SideBar = () => {
    const [result, setResult] = React.useState("");
    const { whoamiActor, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [loadingCopy, setLoadingCopy] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log('click run ', whoamiActor);
                const whoami = await whoamiActor.whoami();
                // console.log('whoami =>', whoami);
                setResult(whoami);
                setLoading(false); // Set loading menjadi false setelah selesai memuat data
            } catch (error) {
                // console.error('Error fetching data:', error);
                setLoading(false); // Jika terjadi error, atur loading menjadi false juga
            }
        };

        fetchData();
    }, [whoamiActor]);


    function truncateText(text) {
        let str = text.toString()
        return `${str.substring(0, 16)}....`;
    }

    const copyToClipboard = async () => {
        setLoadingCopy(true)
        try {
            const textToCopy = result;
            await navigator.clipboard.writeText(textToCopy);
            triggerLoadingCopy()
        } catch (error) {
            triggerLoadingCopy()
        }
    }

    function triggerLoadingCopy() {
        setTimeout(() => {
            setLoadingCopy(false)
        }, 3000)
    }

    return (
        <div className="flex flex-col w-64 text-gray-700 bg-white flex-shrink-0">
            <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
            <Link to='/'>
                <img className="h-16 w-full" src="/logo-digicert-black.svg" alt="digicert" />
                </Link>
            </div>
            <nav className="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
                <NavLink className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lghover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                    to="/" activeclassname="bg-gray-200">
                    Home
                </NavLink>
                <NavLink className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lghover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                    to="/create-certificate" activeclassname="bg-gray-200">
                    Create Certificate
                </NavLink>
                <NavLink className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg   hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                    to="/list-certificate" activeclassname="bg-gray-200">
                    List Certificate
                </NavLink>
                <a href='/' onClick={logout} className="flex justify-center items-center bottom-0 w-56 mb-4 absolute cursor-pointer px-4 py-2 mt-2 text-sm font-semibold text-white bg-black rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                    <img className="login" src="/favicon.ico" alt="DFINITY logo" />Logout
                </a>
            </nav>
        </div>
    )
}

export default SideBar;