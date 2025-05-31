'use client';

import OPEN_POSITIONS from '../../data/open_positions.json';
import Navbar from '../../navbar/Navbar';
import { useRouter, useParams } from 'next/navigation';
import { Box, Button, Text, Heading, Center, Divider, VStack, useBreakpointValue } from '@chakra-ui/react';
import { BulletList } from '../../components/BulletList';
import { SectionHeader } from '../../components/SectionHeader';
import ApplyForm from './apply-form/ApplyForm';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Footer from '../../footer/Footer';
import { ApplicationDetails } from '../../types/application';

const Application = () => {
    const router = useRouter();
    const params = useParams();
    const applicationId = params?.applicationId as string;

    const topPadding = useBreakpointValue({ base: 52, md: 72 });
    const curApp = OPEN_POSITIONS.find((job) => job.applicationId === applicationId) as ApplicationDetails | undefined;

    const isContractPosition = curApp?.jobType === "Contract";
    const isGeneralApplication = applicationId === "general-application";
    const isGeneralApplicationIntern = applicationId === "general-application-intern";

    const applicationFormRef = useRef<HTMLDivElement>(null);

    const scrollToApplicationForm = () => {
        const element = applicationFormRef?.current;
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPosition - (topPadding ?? 0) });
            element.querySelectorAll('input')[1]?.focus(); // focus first name field
        }
    }

    if (!curApp) {
        return (
            <Box minH="100vh" display="flex" flexDirection="column">
                <Navbar />
                <Center flex="1">
                    <VStack gap={6} px={4}>
                        <Heading as="h1" size={["xl", "2xl"]} opacity={0.8} textAlign="center">
                            Job Not Found
                        </Heading>
                        <Text opacity={0.65} textAlign="center" maxW="md">
                            The job you&apos;re looking for does not exist. Please check the URL or go back to the main
                            page.
                        </Text>
                        <Button
                            colorScheme="black"
                            onClick={() => router.push('/')}
                            px={8}
                            size="md"
                        >
                            Go Back
                        </Button>
                    </VStack>
                </Center>
                <Footer />
            </Box>
        );
    }

    return (
        <div className="bg-black">
            <Navbar jsxToRight={
                <Button
                    colorScheme="white"
                    px={[4, 8]}
                    fontFamily="Lekton"
                    size={["2xs", "xs"]}
                    fontSize={["16px", "24px"]}
                    borderRadius={["3px", "4px"]}
                    onClick={scrollToApplicationForm}
                >
                    Apply Now
                </Button>
            } />
            <Box maxW="2xl" mx="auto" mt={[6, 8]} mb={[8, 11]} px={[4, 8]}>
                <Heading
                    as="h1"
                    size={["xl", "2xl"]}
                    mb="2px"
                    textTransform="uppercase"
                    fontWeight={700}
                    lineHeight={["1.2", "1.33"]}
                    color="whiteAlpha.900"
                >
                    {curApp.title}
                </Heading>
                <Text mb={[3, 5]} opacity={0.65} fontSize="14px" color="whiteAlpha.900">{curApp.location}</Text>

                <Text mb={[3, 4]} fontSize={["sm", "sm"]} color="whiteAlpha.900">
                    Watoga was founded under the belief that we shouldn&apos;t waste what the earth has to offer. We are developing the technologies to make mineral extraction more efficient and capture the full wealth of the subsurface by solving the information and automation challenges of mining. It is our mission to make mines fully autonomous and cherish our mineral wealth.
                </Text>

                <Divider my={[4, 6]} />

                <Box className="pl-4 md:pl-8 [&>ul]:mb-4 [&>ul>li]:mb-1.5 md:[&>ul>li]:mb-1 [&>ul>li]:leading-[1.5] md:[&>ul>li]:leading-[1.6]">
                    <SectionHeader>Who We Are</SectionHeader>
                    <Text mb={4} fontSize="sm" color="whiteAlpha.900">
                        Watoga builds software and sensors to automate and optimize the entirety of the mining operation. Our first step is the drill and blast process, which means understanding what&apos;s in the rock and how to blast it efficiently.
                        <br />
                        <br />
                        Everything around us starts as ore in the ground. Valuable ore is rare, but the time constraints of mining and the lack of information about the subsurface causes modern mines to send tons of ore to waste and leave billions of dollars on the table.
                        <br />
                        <br />
                        Although the mining industry is worth $2.4 trillion, a lot of mining operations still operate with old technology and outdated practices. It is our mission to maximize the use of existing data and enrich it with better instrumentalization to build a future in which fully autonomous mining is a reality, where the earth&apos;s resources are used to their fullest extent. This is just the beginning. <a href="https://watoga.tech" target="_blank" rel="noopener noreferrer" className="underline text-green-500 ml-0.5">Learn more</a>
                    </Text>

                    <Divider my={6} />

                    <SectionHeader>{curApp.descriptionHeader}</SectionHeader>
                    <Text mb={4} fontSize="sm" color="whiteAlpha.900">{curApp.description}</Text>
                    {!!curApp.note && <Text mb={5} fontSize="sm" fontStyle="italic" opacity={0.8} color="whiteAlpha.900">Note: {curApp.note}</Text>}

                    <Divider my={6} />

                    {!isGeneralApplication && !isGeneralApplicationIntern ? (
                        <>
                            <SectionHeader>Responsibilities</SectionHeader>
                            <BulletList items={curApp.responsibilities} />

                            <SectionHeader>Qualifications</SectionHeader>
                            <BulletList items={curApp.competencies} />

                            <SectionHeader>In this role, you will</SectionHeader>
                            <BulletList items={curApp.inThisRoleYouWill} />

                            <SectionHeader>This might be a good fit if you</SectionHeader>
                            <BulletList items={curApp.thisMightBeAGoodFitIfYou} />

                            <Divider my={6} />

                            <SectionHeader>Compensation</SectionHeader>
                            {!isContractPosition ? (
                                <>
                                    <Text mb={4} fontSize="sm" color="whiteAlpha.900">
                                        This role will pay <b>{curApp.salary}</b>, plus <b>significant equity</b>, so you have a real stake in Watoga&apos;s success. We are all in this journey together. 
                                    </Text>
                                    <Text mb={4} fontSize="sm" color="whiteAlpha.900">Aside from base compensation, we invest heavily in our team. You&apos;ll have the freedom and resources to experiment and iterate quickly. We&apos;re a high-growth company with no middle management, which translates to fast decision making and the ability for you to own major initiatives from day one.</Text>
                                    <Text mb={6} fontSize="sm" color="whiteAlpha.900">All meals (breakfast, lunch, dinner) are paid for when you&apos;re at headquarters. You&apos;ll also have a room at our headquarters in Montreal provided, if you wish to stay there - we&apos;ll be booking a penthouse for the office and having the whole team stay there. </Text>
                                </>
                            ) : (
                                <Text mb={4} fontSize="sm" color="whiteAlpha.900">This role pays <b>{curApp.salary}</b> as a contractor. We value expertise and will ensure everyone on our team is compensated fairly for their critical contributions to our ambitious goals.</Text>
                            )}

                            <Divider my={6} />

                            <SectionHeader>Additional Requirements</SectionHeader>
                            <BulletList items={curApp.additionalRequirements} />

                            <Divider my={6} />
                        </>
                    ) : isGeneralApplication ? (
                        <>
                            <SectionHeader>What We&apos;re Looking For</SectionHeader>
                            <Text mb={4} fontSize="sm" color="whiteAlpha.900">We&apos;re always interested in meeting exceptional people across various disciplines, including:</Text>
                            <BulletList items={[
                                "Software Engineers (Full-stack, Frontend, Backend, ML/AI)",
                                "Hardware Engineers (Mechanical, Electrical, Controls)",
                                "Product and Design professionals",
                                "Operations and Business Development experts",
                                "Government/Regulatory Affairs professionals",
                                "Field Operations specialists",
                            ]} />

                            <SectionHeader>What Makes a Great Durin Team Member</SectionHeader>
                            <BulletList items={[
                                "Bias towards action and rapid iteration",
                                "Strong builder mentality with a track record of shipping products",
                                "Comfortable working in a fast-paced, dynamic environment",
                                "Excited about working on hard technical problems with real-world impact",
                                "Previous startup experience or entrepreneurial mindset",
                                "Willing to work from our Los Angeles headquarters (El Segundo)",
                            ]} />

                            <SectionHeader>What We Offer</SectionHeader>
                            <BulletList items={[
                                "Opportunity to work on cutting-edge technology in mining automation",
                                "Competitive compensation with significant equity",
                                "Healthcare coverage (medical, dental, vision)",
                                "All meals (breakfast, lunch, dinner) covered",
                                "Help with housing close to the office",
                                "Field visits to mining sites all around the world",
                                "Direct impact on company direction and growth",
                                "Support for future entrepreneurial endeavors",
                            ]} />

                            <Divider my={6} />
                        </>
                    ) : (
                        <>
                            <SectionHeader>What We&apos;re Looking For</SectionHeader>
                            <Text mb={4} fontSize="sm" color="whiteAlpha.900">We&apos;re always interested in meeting exceptional people across various disciplines, including:</Text>
                            <BulletList items={[
                                "Software Engineers (Full-stack, Frontend, Backend, ML/AI)",
                                "Hardware Engineers (Mechanical, Electrical, Controls)",
                                "Product and Design professionals",
                                "Operations and Business Development experts",
                                "Government/Regulatory Affairs professionals",
                                "Field Operations specialists",
                            ]} />

                            <SectionHeader>What Makes a Great Durin Team Member</SectionHeader>
                            <BulletList items={[
                                "Bias towards action and rapid iteration",
                                "Strong builder mentality with a track record of shipping products",
                                "Comfortable working in a fast-paced, dynamic environment",
                                "Excited about working on hard technical problems with real-world impact",
                                "Previous startup experience or entrepreneurial mindset",
                                "Willing to work from our Los Angeles headquarters (El Segundo)",
                            ]} />

                            <SectionHeader>What We Offer</SectionHeader>
                            <BulletList items={[
                                "Opportunity to work on cutting-edge technology in mining automation",
                                "Competitive compensation with significant equity",
                                "Healthcare coverage (medical, dental, vision)",
                                "All meals (breakfast, lunch, dinner) covered",
                                "Help with housing close to the office",
                                "Field visits to mining sites all around the world",
                                "Direct impact on company direction and growth",
                                "Support for future entrepreneurial endeavors",
                            ]} />

                            <Divider my={6} />
                        </>
                    )}

                    <Text fontSize="md" mt={8} color="whiteAlpha.900" fontFamily="Lekton">Join Watoga to build the future of mining. If you&apos;re passionate about making a real-world impact and solving complex challenges, we&apos;d love to hear from you.</Text>
                </Box>
            </Box>

            <Box
                ref={applicationFormRef}
                bg="#141414"
                px={[4, 8]}
                py={[6, 8]}
            >
                <ApplyForm applicationId={applicationId} isContract={isContractPosition} />
            </Box>

            <Footer />
            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: {
                        maxWidth: '90vw',
                        margin: '0 auto'
                    }
                }}
            />
        </div>
    );
};

export default Application;