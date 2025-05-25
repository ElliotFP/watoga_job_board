'use client';

import OPEN_POSITIONS from '../../data/open_positions.json';
import { Box, Text, Heading,Badge, Divider } from '@chakra-ui/react';
import { RxExternalLink } from "react-icons/rx";
import { useRouter } from 'next/navigation';
import Navbar from '../../navbar/Navbar';
import Footer from '../../footer/Footer';

const Positions = () => {
    const router = useRouter();
    // const iconSize = useBreakpointValue({ base: 18, md: 24, lg: 26 });

    return (
        <Box minH="100vh" display="flex" bg="black" flexDirection="column">
            <Navbar />

            <Box
                flex="1"
                px={[4, 8, 12, 24]}
                maxW="1400px"
                mx="auto"
                w="full"
                mb={[8, 10]}
                
            >
                <Heading
                    as="h1"
                    size={["2xl", "4xl"]}
                    fontWeight="bold"
                    mt={[8, 10]}
                    mb={[1, 2]}
                    fontFamily="Lekton"
                    color="whiteAlpha.900"
                    lineHeight={["1.2", "1.1"]}
                    textTransform="uppercase"
                >
                    Open Positions
                </Heading>
                <Text
                    ml='2px'
                    color="gray.400"
                    fontFamily="Lekton"
                    fontSize={["md", "lg", "xl"]}
                    mb={[8, 10]}
                    fontWeight="500"
                >
                    Showing {OPEN_POSITIONS.length} Jobs
                </Text>
                <Box as="ul" listStyleType="none" p={0}>
                    {OPEN_POSITIONS.map((position, idx) => (
                        <Box
                            key={idx}
                            as="li"
                            mb={[4, 6]}
                            fontSize={["18px", "24px", "28px"]}
                            fontWeight="medium"
                            color="whiteAlpha.900"   
                            borderBottom="1px solid"

                            _hover={{
                                borderColor: "whiteAlpha.500",
                                border: "1px solid",
                                bg: "whiteAlpha.100"
                            }}
                        >
                            <Box
                                className="flex justify-between items-center rounded-[2px] p-[10px] md:p-[16px] hover:bg-black/[0.02] active:bg-black/[0.05] cursor-pointer"
                                onClick={() => router.push(`/${position.applicationId}`)}
                            >
                                <Box>
                                    <Text
                                        mb={[0.5, 1]}
                                        color="whiteAlpha.900"
                                        fontWeight="500"
                                        fontSize={["18px", "24px"]}
                                        lineHeight={["1.3", "1.4"]}
                                        fontFamily='sans-serif'
                                    >
                                        {position.title}
                                    </Text>
                                    <Box display="flex" alignItems="center" gap={["6px", "8px"]}>
                                        <Text
                                            fontSize={["13px", "16px"]}
                                            color="gray.400"
                                            lineHeight={["1.6", "1.8"]}
                                        >
                                            {position.location}
                                        </Text>
                                        {position.jobType &&
                                            <>
                                                <Text fontSize={["xs", "sm", "md"]} color="gray.600" lineHeight={["1.6", "1.8"]}>•</Text>
                                                <Badge
                                                    py={0.5}
                                                    px={1.5}
                                                    variant='surface'
                                                    borderRadius="3px"
                                                    textTransform="capitalize"
                                                    fontSize={["9px", "11px", "13px"]}
                                                >
                                                    {position.jobType}
                                                </Badge>
                                            </>
                                        }
                                    </Box>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={2.5}
                                    _hover={{
                                        color: "whiteAlpha.500"
                                    }}
                                >
                                    <Text
                                        fontSize={["14px", "16px", "18px"]}
                                        fontWeight="500"
                                        textDecoration="underline"
                                    >
                                        Apply
                                    </Text>
                                    {/* <RxExternalLink size={iconSize} color="#141412" /> */}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Divider my={[8, 10]} />

                <Box
                    display="flex"
                    gap={[4, 6]}
                    flexDirection={["column", "row"]}
                    mt={[8, 10]}
                >
                    <Box
                        as="button"
                        flex="1"
                        p={[4, 5]}
                        bg="white"
                        border="2px solid"
                        borderColor="gray.200"
                        borderRadius="2px"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            borderColor: "gray.300",
                            bg: "gray.50"
                        }}
                        _active={{
                            transform: "translateY(0)",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
                        }}
                        cursor="pointer"
                        onClick={() => window.open('https://durin.com', '_blank', 'noopener noreferrer')}
                    >
                        <Text
                            fontSize={["md", "19px"]}
                            fontWeight="600"
                            color="gray.800"
                            display="flex"
                            fontFamily="Lekton"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                        >
                            Main Website
                            <RxExternalLink size={20} />
                        </Text>
                    </Box>
                    <Box
                        as="button"
                        flex="1"
                        p={[4, 5]}
                        bg="white"
                        border="2px solid"
                        borderColor="gray.200"

                        borderRadius="2px"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            borderColor: "gray.300",
                            bg: "gray.50"
                        }}
                        _active={{
                            transform: "translateY(0)",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
                        }}
                        cursor="pointer"
                        onClick={() => window.open('https://learn.durin.com', '_blank', 'noopener noreferrer')}
                    >
                        <Text
                            fontSize={["md", "19px"]}
                            fontWeight="600"
                            color="gray.800"
                            display="flex"
                            fontFamily="Lekton"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                        >
                            Learn About the Problem
                            <RxExternalLink size={20} />
                        </Text>
                    </Box>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
};

export default Positions;