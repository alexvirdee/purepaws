import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';


const Header = () => {
    return (
        <header className="w-full border-b">
            <div className="wrapper flex justify-between items-center py-2">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <Image height={48} width={48} priority={true} alt="" src="/images/paw-outline.svg" />
                        <span className="hidden lg:block font-bold text-2xl ml-2">
                            {APP_NAME}
                        </span>
                    </Link>
                </div>
                <Menu />
            </div>
        </header>);
}

export default Header;