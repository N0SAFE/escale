import Link from "next/link";

function Navbar({ links }: { links: { label: string; link: string }[] }) {
    // create a navbar using tailwindcss
    return (
        <div className="flex flex-wrap items-center justify-between p-5 bg-gray-800">
            <div className="flex items-center flex-shrink-0 mr-6 text-white">
                <Link href="/">
                    <button className="text-xl font-semibold tracking-tight">Stripe</button>
                </Link>
            </div>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 text-white border border-white rounded hover:text-white hover:border-white">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 0h20v20H0V0zm2 2v16h16V2H2zm3 3h10v2H5V5zm0 4h10v2H5V9zm0 4h10v2H5v-2z" fillRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    {links.map((link, key) => (
                        <Link href={link.link} key={key}>
                            <button className={`block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4 `}>{link.label}</button>
                        </Link>
                    ))}
                </div>
                <div>
                    <a href="#" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white mt-4 lg:mt-0">
                        Download
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
