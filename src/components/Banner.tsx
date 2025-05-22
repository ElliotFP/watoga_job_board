import { Box, Text, Button, Flex, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';


interface BannerProps {
    message: string;
    linkText: string;
    linkUrl: string;
}

const Banner = ({ message, linkText, linkUrl }: BannerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // First make it visible but in the hidden position
        setIsVisible(true);

        // Then trigger the slide-in animation after a brief delay
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        // First trigger the slide-out animation
        setIsOpen(false);

        // Then remove from DOM after animation completes
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    if (!isVisible) return null;


    return (
        <Box
            position="fixed"
            top={["52px", "68px"]}
            left={0}
            right={0}
            transform={`translateY(${isOpen ? '0' : '-100%'})`}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            zIndex={999}
            boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
        >
            <Box
                bg="#111111"
                color="white"
                position="relative"
                alignItems="center"
                justifyContent="center"
                display="flex"
                borderBottom="1px solid rgba(255, 255, 255, 0.1)"
            >
                <Box
                    position="absolute"
                    right={["2px", "16px", "32px"]}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="32px"
                    width="32px"
                    onClick={handleClose}
                    _hover={{ color: 'white' }}
                    zIndex={2}
                >
                    <IoMdClose fontSize="20px" />
                </Box>

                <Flex
                    justify="center"
                    align="center"
                    maxW="7xl"
                    mx="auto"
                    pl={["8px", "48px", "64px"]}
                    pr={["36px", "48px", "64px"]}
                    py={2}
                    position="relative"
                >
                    <Flex gap={[2, 3, 4]} align="center">
                        <Image
                            src="/TechCrunch-Logo.svg"
                            alt="TechCrunch"
                            height="20px"
                        />
                        <Text
                            fontSize={["12px", "14px"]}
                            fontWeight="500"
                            letterSpacing="0.3px"
                            color="gray.100"
                            pr={["4px", "0"]}
                            lineHeight={["16px", "auto"]}
                        >
                            {message}
                        </Text>
                        <Button
                            size="sm"
                            variant="solid"
                            bg="#00D301"
                            color="black"
                            px={[2.5, 4]}
                            py={[0.5, 1]}
                            ml={[0, 1]}
                            h={["23px", "26px"]}
                            fontSize={["11px", "13px"]}
                            fontWeight="600"
                            letterSpacing="0.3px"
                            borderRadius="2px"
                            onClick={() => window.open(linkUrl, '_blank', 'noopener,noreferrer')}
                            _hover={{
                                bg: '#00F001',
                            }}
                            _active={{
                                bg: '#00D301',
                            }}
                            transition="all 0.2s"
                        >
                            {linkText}
                        </Button>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
};

export default Banner;