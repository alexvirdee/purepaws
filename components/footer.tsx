import { APP_NAME } from "@/lib/constants";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return ( 
    <footer className="border-t border-t-gray-200 mx-h-[100px]">
        <div className="p-5 flex-center">
            {currentYear} &copy; {APP_NAME}. All rights reserved.
        </div>
    </footer> );
}
 
export default Footer;