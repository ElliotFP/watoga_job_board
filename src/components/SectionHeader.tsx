import { Heading } from "@chakra-ui/react";

export const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <Heading as="h2" size="md" mb={4} textTransform="uppercase" fontWeight={800} color="whiteAlpha.900">
        {children}
    </Heading>
);