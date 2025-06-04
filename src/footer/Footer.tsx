import { Flex, Image, Text } from '@chakra-ui/react';
import watogaLogo from '../assets/watoga_logo.svg';
import { useState, useEffect } from 'react';

const Footer = () => {
    const [year, setYear] = useState('');

    useEffect(() => {
        setYear(new Date().getFullYear().toString());
    }, []);

    return (
        <Flex
            as="footer"
            className="w-full"
            align="center"
            justify="center"
            bg="black"
            px={[4, 8, 12]}
            py={[6, 8]}
            borderTop="0.5px solid"
            borderColor="whiteAlpha.500"
            direction="column"
            gap={[3, 4]}
        >
            <Image
                src={watogaLogo.src}
                alt="Logo"
                height={12}
                width={32}
                onClick={() => window.open('https://www.watoga.tech', '_blank', 'noopener,noreferrer')}
                cursor="pointer"
            />
            <Text
                fontSize={["xs", "sm"]}
                color="whiteAlpha.700"
                textAlign="center"
                px={[2, 0]}
            >
                © {year} Watoga Technologies Inc.. All rights reserved.
            </Text>
        </Flex>
    );
};

export default Footer;
