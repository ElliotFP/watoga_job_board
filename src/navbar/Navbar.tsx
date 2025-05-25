'use client';

import { Flex, Image, Text } from '@chakra-ui/react';
import watogaLogo from '../assets/watoga_logo.svg';
// import DurinLogo from '../assets/logo.png';
// import DurinLogoText from '../assets/logo_text.svg';
import { useRouter } from 'next/navigation';

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
            px={[4, 6, 8, 2]}
            py={[3, 4]}
            bg="black"
            boxShadow="sm"
            borderBottom="1px solid"
        >
            <Flex
                align="center"
                cursor="pointer"
                onClick={() => router.push('/')}
                zIndex={100}
                className="group"
            >
                {/* <Image
                    src={DurinLogo.src}
                    alt="Logo"watoga
                    className="h-[12px] md:h-[12px] object-contain transition-transform duration-125 ease-in-out group-hover:animate-spin"
                    style={{ animationDuration: '2s' }}
                /> */}
                <Image
                    src={watogaLogo.src}
                    alt="Logo"
                    height={12}
                    width={32}
                    className="h-8 w-auto"
                />
                <Text
                    textTransform="uppercase"
                    cursor="pointer"
                    fontFamily="Lekton"
                    onClick={() => window.open('https://watoga.com', '_blank')}
                    color="whiteAlpha.900"
                    fontSize="32px"
                    fontWeight="semibold"
                    textAlign="center"
                    px="8px"
                    py="2px"
                    borderRadius="4px"
                    transition="color 0.3s ease"
                    _hover={{ color: "gray.300" }}
                    _active={{ color: "gray.500" }}
                >
                    WATOGA TECHNOLOGIES
                </Text>
            </Flex>

            {jsxToRight || (
                <Text
                    fontFamily="Lekton"
                    fontSize="24px"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    color="whiteAlpha.900"
                    cursor="pointer"
                    onClick={() => window.open('https://durin.com', '_blank')}
                    transition="color 0.3s ease"
                    _hover={{ color: "gray.300" }}
                    _active={{ color: "gray.500" }}
                >
                    Blast baby blast!
                </Text>
            )}
        </Flex>
    );
};

export default Navbar;
