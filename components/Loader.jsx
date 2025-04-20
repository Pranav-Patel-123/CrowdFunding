import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
            {/* Reference the loader image directly from public/assets */}
            <img
                src="/assets/loader.svg"
                alt="loader"
                className="w-[100px] h-[100px] object-contain"
            />
            <p className="mt-[20px] font-epilogue font-bold text-[20px] text-center text-white">
                Transaction is in progress<br />Please wait...
            </p>
        </div>
    );
};

export default Loader;
