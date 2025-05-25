import { Box, Flex } from "@chakra-ui/react";

interface BulletListProps {
    items: string[];
    fontSize?: string;
    paddingLeft?: number;
}
export const BulletList = ({ items, fontSize = "sm", paddingLeft = 8 }: BulletListProps) => (
    <Box as="ul" pl={paddingLeft} mb={6} fontSize={fontSize}>
        {items.map((item, idx) => (
            <Flex
                as="li"
                key={idx}
                alignItems="flex-start"
                listStyleType="none"
                position="relative"
                pl={1}
                mb={1}
                color="whiteAlpha.900"
            >
                <Box
                    position="absolute"
                    left="-14px"
                    fontSize="20px"
                    lineHeight={1}
                    mt="1px"
                >
                    •
                </Box>
                {item}
            </Flex>
        ))}
    </Box>
); 