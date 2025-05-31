'use client';

import { Box, Text, Heading, Center, VStack } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../navbar/Navbar';
import Footer from '../../footer/Footer';
import { Suspense } from 'react';

const SubmittedContent = () => {
    const searchParams = useSearchParams();
    const name = searchParams?.get('name');

    return (
        <VStack px={8}>
            <Heading as="h1" size={["2xl", "3xl"]} opacity={0.8} textAlign="center" fontWeight='bold' mb='26px' fontSize={["24px", "34px"]}>
                Application Submitted
            </Heading>
            <Box
                mb={4}
                maxW={["400px", '500px', '600px']}
                w="full"
                borderRadius="md"
                overflow="hidden"
                aspectRatio="16/9"
                bg="white"
                border='none'
            >
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/nZTw2TgJEWs"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                        borderRadius: 'inherit',
                    }}
                />
            </Box>
            <Text opacity={0.65} textAlign="center" maxW="650px" fontSize={["14px", "16px"]} mb={4}>
                Thank you for your application{name ? `, ${name}` : ''}. We will review it and get back to you soon.
            </Text>
        </VStack>
    );
};

const Submitted = () => {
    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Center flex="1">
                <Suspense fallback={
                    <VStack px={8}>
                        <Heading as="h1" size={["2xl", "3xl"]} opacity={0.8} textAlign="center" fontWeight='bold' mb='26px' fontSize={["24px", "34px"]}>
                            Application Submitted
                        </Heading>
                        <Text opacity={0.65} textAlign="center" maxW="650px" fontSize={["14px", "16px"]} mb={4}>
                            Thank you for your application. We will review it and get back to you soon.
                        </Text>
                    </VStack>
                }>
                    <SubmittedContent />
                </Suspense>
            </Center>
            <Footer />
        </Box>
    );
};

export default Submitted;