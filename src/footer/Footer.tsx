import { Flex, Image, Text } from '@chakra-ui/react';
import DurinLogo from '../assets/logo.png';

const Footer = () => {
    return (
        <Flex
            as="footer"
            className="w-full"
            align="center"
            justify="center"
            px={[4, 8, 12]}
            py={[6, 8]}
            bg="gray.50"
            borderTop="1px solid"
            borderColor="#e9e9e9"
            direction="column"
            gap={[3, 4]}
        >
            <Image
                src={DurinLogo.src}
                alt="Logo"
                className="h-[28px] md:h-[32px] transition-opacity duration-200 ease-in-out hover:opacity-80 active:opacity-70"
                onClick={() => window.open('https://www.durin.com', '_blank', 'noopener,noreferrer')}
                cursor="pointer"
            />
            <Text
                fontSize={["xs", "sm"]}
                color="gray.600"
                textAlign="center"
                px={[2, 0]}
            >
                © {new Date().getFullYear()} Durin. All rights reserved.
            </Text>
        </Flex>
    );
};

export default Footer;
