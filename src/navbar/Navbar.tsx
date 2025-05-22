import { Flex, Image, Text } from '@chakra-ui/react';
import DurinLogo from '../assets/logo.png';
import DurinLogoText from '../assets/logo_text.svg';
import { useRouter } from 'next/router';

const Navbar = ({
    jsxToRight,
}: {
    jsxToRight?: React.ReactNode;
}) => {
    const router = useRouter();

    return (
        <Flex
            as="nav"
            className="sticky top-0 z-[1000] w-full"
            align="center"
            justify="space-between"
            h={["52px", "68px"]}
            px={[4, 6, 8, 12]}
            py={[3, 4]}
            bg="white"
            boxShadow="sm"
        >
            <Flex
                align="center"
                cursor="pointer"
                onClick={() => router.push('/')}
                zIndex={100}
                className="group"
            >
                <Image
                    src={DurinLogo.src}
                    alt="Logo"
                    className="h-[28px] md:h-[36px] object-contain transition-transform duration-125 ease-in-out group-hover:animate-spin"
                    style={{ animationDuration: '2s' }}
                />
                <Image
                    src={DurinLogoText.src}
                    alt="Logo"
                    className="ml-[-35px] md:ml-[-39px] h-[27px] md:h-[35px] w-[132px] md:w-[152px] object-contain"
                />
            </Flex>

            {jsxToRight || (
                <Text
                    className="text-[12px] md:text-[16px] font-semibold uppercase bg-gradient-to-r from-black/65 to-black/35 bg-clip-text text-transparent cursor-pointer"
                    onClick={() => window.open('https://durin.com', '_blank')}
                >
                    It&apos;s Time to Mine
                </Text>
            )}
        </Flex>
    );
};

export default Navbar;
