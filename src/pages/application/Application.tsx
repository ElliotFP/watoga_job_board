import OPEN_POSITIONS from '../../data/open_positions.json';
import Navbar from '../../navbar/Navbar';
import { useRouter } from 'next/router';
import { Box, Button, Text, Heading, Center, Separator, VStack, useBreakpointValue } from '@chakra-ui/react';
import { BulletList } from '../../components/BulletList';
import { SectionHeader } from '../../components/SectionHeader';
import ApplyForm from './apply-form/ApplyForm';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Footer from '../../footer/Footer';
import { ApplicationDetails } from '../../types/application';

const Application = () => {
    const router = useRouter();
    const { applicationId } = router.query;

    const topPadding = useBreakpointValue({ base: 52, md: 72 });
    const curApp = OPEN_POSITIONS.find((job) => job.applicationId === applicationId) as ApplicationDetails | undefined;

    const isContractPosition = curApp?.jobType === "Contract";
    const isGeneralApplication = applicationId === "general-application";

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
        <div>
            <Navbar jsxToRight={
                <Button
                    colorScheme="black"
                    px={[4, 8]}
                    size={["2xs", "xs"]}
                    fontSize={["11px", "13px"]}
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
                >
                    {curApp.title}
                </Heading>
                <Text mb={[3, 5]} opacity={0.65} fontSize="14px">{curApp.location}</Text>

                <Text mb={[3, 4]} fontSize={["sm", "sm"]}>
                    Durin was founded under the belief that raw materials should not be a constraint on human progress. We are actively developing the technologies to make this possible, with the ultimate goal of becoming the bedrock of the global supply chain.
                </Text>

                <Separator my={[4, 6]} />

                <Box className="pl-4 md:pl-8 [&>ul]:mb-4 [&>ul>li]:mb-1.5 md:[&>ul>li]:mb-1 [&>ul>li]:leading-[1.5] md:[&>ul>li]:leading-[1.6]">
                    <SectionHeader>Who We Are</SectionHeader>
                    <Text mb={4} fontSize="sm">
                        Durin builds and operates automated drill rigs to accelerate mineral discovery.
                        <br />
                        <br />
                        Modern life, from smartphones to skyscrapers, starts as ore in the ground. But mines do not simply appear. Valuable ore is rare, so in advance, Geologists must explore, observe, test, and survey—a process that takes significant time and resources. Building a mine today is a billion dollar endeavor, so precise data is key. This is done by drilling hundreds of holes into the earth to recover cylindrical core samples in the search for valuable material.
                        <br />
                        <br />
                        Although the mining industry is worth $2.4 trillion, mineral exploration has hardly changed in over 70 years. Our mission is to change that. The first step is the development and mass-production of drilling rigs with automated controls and real-time data streams to increase safety, accuracy, and efficiency. That is just the beginning. <a href="https://learn.durin.com" target="_blank" rel="noopener noreferrer" className="underline text-[#0070f3] ml-0.5">Learn more</a>
                    </Text>

                    <Separator my={6} />

                    <SectionHeader>{curApp.descriptionHeader}</SectionHeader>
                    <Text mb={4} fontSize="sm">{curApp.description}</Text>
                    {!!curApp.note && <Text mb={5} fontSize="sm" fontStyle="italic" opacity={0.8}>Note: {curApp.note}</Text>}

                    <Separator my={6} />

                    {!isGeneralApplication ? (
                        <>
                            <SectionHeader>Responsibilities</SectionHeader>
                            <BulletList items={curApp.responsibilities} />

                            <SectionHeader>Qualifications</SectionHeader>
                            <BulletList items={curApp.competencies} />

                            <SectionHeader>In this role, you will</SectionHeader>
                            <BulletList items={curApp.inThisRoleYouWill} />

                            <SectionHeader>This might be a good fit if you</SectionHeader>
                            <BulletList items={curApp.thisMightBeAGoodFitIfYou} />

                            <Separator my={6} />

                            <SectionHeader>Compensation</SectionHeader>
                            {!isContractPosition ? (
                                <>
                                    <Text mb={4} fontSize="sm">
                                        This role will pay <b>{curApp.salary}</b>, plus <b>significant equity</b>, so you have a real stake in Durin&apos;s success. Everyone is an owner, so as the company grows, your equity grows too.
                                    </Text>
                                    <Text mb={4} fontSize="sm">Aside from base compensation, we invest heavily in our team. You&apos;ll have the freedom and resources to experiment and iterate quickly. We&apos;re a high-growth company with no middle management, which translates to fast decision making and the ability for you to own major initiatives from day one.</Text>
                                    <Text mb={6} fontSize="sm">We also offer 100% healthcare coverage (medical, dental, vision), all meals (breakfast, lunch, dinner) are paid for when you&apos;re at headquarters, and we can help you find housing nearby.</Text>
                                </>
                            ) : (
                                <Text mb={4} fontSize="sm">This role pays <b>{curApp.salary}</b> as a contractor. We value expertise and will ensure everyone on our team is compensated fairly for their critical contributions to our ambitious goals.</Text>
                            )}

                            <Separator my={6} />

                            <SectionHeader>Additional Requirements</SectionHeader>
                            <BulletList items={curApp.additionalRequirements} />

                            <Separator my={6} />
                        </>
                    ) : (
                        <>
                            <SectionHeader>What We&apos;re Looking For</SectionHeader>
                            <Text mb={4} fontSize="sm">We&apos;re always interested in meeting exceptional people across various disciplines, including:</Text>
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

                            <Separator my={6} />
                        </>
                    )}

                    <Text fontSize="md" mt={8}>Join Durin to build the future of mining. If you&apos;re passionate about making a real-world impact and solving complex challenges, we&apos;d love to hear from you.</Text>
                </Box>
            </Box>

            <Box
                ref={applicationFormRef}
                bg="#f5f5f5"
                px={[4, 8]}
                py={[6, 8]}
            >
                <ApplyForm applicationId={applicationId as string} isContract={isContractPosition} />
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