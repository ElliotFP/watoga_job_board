import { useCallback, useState } from 'react';
import { Box, VStack, Grid, Button, Input, Text, Textarea, HStack, Spinner } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { ApplicationFields, SelectBoolean } from '../../../types/application';
import { useDropzone } from 'react-dropzone';
import * as Yup from 'yup';
import Select from 'react-select';
import { BsPaperclip } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';

const RequiredStar = () => (
    <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
);

const validationSchema = (props: { isContract: boolean }) => Yup.object().shape({
    resume: Yup.mixed().required('Resume is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    // Only include these validations if not a contract position
    ...(props.isContract ? {} : {
        willingToRelocate: Yup.string()
            .oneOf([SelectBoolean.Yes, SelectBoolean.No], 'Please select Yes or No')
            .required('This field is required'),
        willingToWorkIntense: Yup.string()
            .oneOf([SelectBoolean.Yes, SelectBoolean.No], 'Please select Yes or No')
            .required('This field is required'),
        motivation: Yup.string().required('This field is required'),
        impressiveThing: Yup.string().required('This field is required'),
    })
});

const selectOptions = [
    { value: SelectBoolean.Select, label: 'Select...' },
    { value: SelectBoolean.Yes, label: 'Yes' },
    { value: SelectBoolean.No, label: 'No' },
];

const FileUploadField = ({ field, form }: FieldProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            form.setFieldValue(field.name, acceptedFiles[0]);
            form.setFieldError(field.name, '');
            form.setFieldTouched(field.name, false);
        }
    }, [field.name, form]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        multiple: false,
    });

    const file = field.value as File;

    return (
        <Box
            {...getRootProps()}
            p={2}
            color="#515357BB"
            border="1px solid #e2e2e2"
            borderColor={file ? '#008000' : '#e2e2e2'}
            backgroundColor={file ? "#ffffff" : "#ebecf0"}
            borderRadius="sm"
            cursor="pointer"
            maxW={["100%", "280px"]}
            fontSize={["16px", "20px"]}
            _hover={{ borderColor: '#515357aa', borderStyle: 'dashed' }}
        >
            <input {...getInputProps()} />
            <HStack gap={2}>
                {file ? <FaCheck color='#008000' size={13} style={{ margin: '0 2px' }} /> : <BsPaperclip />}
                {file ? (
                    <Text color="#008000" fontSize="14px">
                        {file.name.length > 28 ? `${file.name.slice(0, 28)}...` : file.name}
                    </Text>
                ) : (
                    <Text fontSize="14px" color="#515357BB">
                        ATTACH RESUME
                        <span style={{ padding: '3px' }}>/</span>
                        CV
                    </Text>
                )}
            </HStack>
        </Box>
    );
};

const ErrorMessage = ({ message, isBottom }: { message: string, isBottom?: boolean }) => (
    <Text
        position="absolute"
        top={isBottom ? 'calc(100% - 4px)' : '-16px'}
        left="2px"
        color="red.500"
        fontSize={["9px", "10px"]}
        fontWeight="medium"
    >
        {message}
    </Text>
);

const ApplyForm = ({ applicationId, isContract }: { applicationId: string, isContract: boolean }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues: ApplicationFields = {
        applicationId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        resume: null,
        linkedin: '',
        twitter: '',
        github: '',
        willingToRelocate: SelectBoolean.Select,
        willingToWorkIntense: SelectBoolean.Select,
        motivation: '',
        impressiveThing: '',
        additionalInformation: '',
    };

    const handleSubmit = async (values: ApplicationFields) => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

        setIsSubmitting(true);

        try {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('job_resumes')
                .upload(`${values.email}/${values.applicationId}/${formattedDate}_${values.resume?.name}`, values.resume as File);

            if (uploadError) {
                throw uploadError;
            }

            const applicationData = {
                application_id: values.applicationId,
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone: values.phone,
                linkedin_url: values.linkedin,
                twitter_url: values.twitter,
                github_url: values.github,
                willing_to_relocate: values.willingToRelocate === SelectBoolean.Yes,
                willing_to_work_intense: values.willingToWorkIntense === SelectBoolean.Yes,
                motivation: values.motivation,
                impressive_thing: values.impressiveThing,
                additional_info: values.additionalInformation,
                resume_url: uploadData.path,
            };

            const { error: insertError } = await supabase
                .from('job_applicants')
                .insert([applicationData]);

            if (insertError) {
                throw insertError;
            }

            navigate('/submitted', { replace: true, state: { name: values.firstName } });
            toast.success('Application submitted successfully!');
        } catch (error: any) {
            if (error?.message?.includes('resource already exists')) {
                toast.error('You have already submitted an application for this job.');
            } else {
                toast.error('Something went wrong. ' + error.message);
            }
        }

        setIsSubmitting(false);
    };

    return (
        <Box px={[4, 8]} py={[3, 6]} mx="auto" maxW="2xl" color="#515357">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema({ isContract })}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, setFieldError, setFieldTouched }) => (
                    <Form autoComplete="on">
                        <VStack gap={[4, 6]} align="stretch">
                            {/* SUBMIT YOUR APPLICATION */}
                            <Text
                                fontWeight="bold"
                                textTransform="uppercase"
                                fontSize={["15px", "17px"]}
                                color="#515357"
                                mb={[3, 4]}
                            >
                                Submit Your Application
                            </Text>

                            <Grid
                                templateColumns={["1fr", "210px 1fr"]}
                                gap={[3, 6]}
                            >
                                {/* Resume */}
                                <Box
                                    display="flex"
                                    alignItems={["flex-start", "center"]}
                                    fontSize={["14px", "16px"]}
                                >
                                    Resume/CV<RequiredStar />
                                </Box>
                                <Box position="relative">
                                    <Field name="resume">
                                        {(props: FieldProps) => (
                                            <FileUploadField {...props} />
                                        )}
                                    </Field>
                                    {touched.resume && errors.resume && (
                                        <ErrorMessage message={errors.resume as string} />
                                    )}
                                </Box>

                                {/* First Name */}
                                <Box
                                    display="flex"
                                    alignItems={["flex-start", "center"]}
                                    fontSize={["14px", "16px"]}
                                >
                                    First Name<RequiredStar />
                                </Box>
                                <Box position="relative">
                                    <Field name="firstName">
                                        {({ field }: FieldProps) => (
                                            <Input
                                                {...field}
                                                padding="8px"
                                                color="#111"
                                                fontSize={["14px", "16px"]}
                                                backgroundColor="white"
                                                type="text"
                                                autoComplete="given-name"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('firstName', '');
                                                    setFieldTouched('firstName', false);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.firstName && errors.firstName && (
                                        <ErrorMessage message={errors.firstName} />
                                    )}
                                </Box>

                                {/* Last Name */}
                                <Box
                                    display="flex"
                                    alignItems={["flex-start", "center"]}
                                    fontSize={["14px", "16px"]}
                                >
                                    Last Name<RequiredStar />
                                </Box>
                                <Box position="relative">
                                    <Field name="lastName">
                                        {({ field }: FieldProps) => (
                                            <Input
                                                {...field}
                                                padding="8px"
                                                color="#111"
                                                fontSize={["14px", "16px"]}
                                                backgroundColor="white"
                                                type="text"
                                                autoComplete="family-name"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('lastName', '');
                                                    setFieldTouched('lastName', false);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.lastName && errors.lastName && (
                                        <ErrorMessage message={errors.lastName} />
                                    )}
                                </Box>

                                {/* Email */}
                                <Box
                                    display="flex"
                                    alignItems={["flex-start", "center"]}
                                    fontSize={["14px", "16px"]}
                                >
                                    Email<RequiredStar />
                                </Box>
                                <Box position="relative">
                                    <Field name="email">
                                        {({ field }: FieldProps) => (
                                            <Input
                                                {...field}
                                                padding="8px"
                                                color="#111"
                                                fontSize={["14px", "16px"]}
                                                backgroundColor="white"
                                                type="email"
                                                autoComplete="email"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('email', '');
                                                    setFieldTouched('email', false);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.email && errors.email && (
                                        <ErrorMessage message={errors.email} />
                                    )}
                                </Box>

                                {/* Phone */}
                                <Box
                                    display="flex"
                                    alignItems={["flex-start", "center"]}
                                    fontSize={["14px", "16px"]}
                                >
                                    Phone<RequiredStar />
                                </Box>
                                <Box position="relative">
                                    <Field name="phone">
                                        {({ field }: FieldProps) => (
                                            <Input
                                                {...field}
                                                padding="8px"
                                                color="#111"
                                                fontSize={["14px", "16px"]}
                                                backgroundColor="white"
                                                type='tel'
                                                autoComplete='tel'
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('phone', '');
                                                    setFieldTouched('phone', false);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.phone && errors.phone && (
                                        <ErrorMessage message={errors.phone} />
                                    )}
                                </Box>
                            </Grid>

                            {/* Only show these sections if not a contract position */}
                            {!isContract && (
                                <>
                                    {/* LINKS */}
                                    <Text
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        fontSize={["15px", "17px"]}
                                        color="#515357"
                                        mb={[2, 2]}
                                        mt={[6, 8]}
                                    >
                                        Links
                                    </Text>
                                    <Grid
                                        templateColumns={["1fr", "210px 1fr"]}
                                        gap={[3, 6]}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems={["flex-start", "center"]}
                                            fontSize={["14px", "16px"]}
                                        >
                                            LinkedIn URL
                                        </Box>
                                        <Box position="relative">
                                            <Field name="linkedin">
                                                {({ field }: FieldProps) => (
                                                    <Input
                                                        {...field}
                                                        padding="8px"
                                                        color="#111"
                                                        fontSize={["14px", "16px"]}
                                                        backgroundColor="white"
                                                        autoComplete='web'
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('linkedin', '');
                                                            setFieldTouched('linkedin', false);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.linkedin && errors.linkedin && (
                                                <ErrorMessage message={errors.linkedin} />
                                            )}
                                        </Box>

                                        <Box
                                            display="flex"
                                            alignItems={["flex-start", "center"]}
                                            fontSize={["14px", "16px"]}
                                        >
                                            Twitter URL
                                        </Box>
                                        <Box position="relative">
                                            <Field name="twitter">
                                                {({ field }: FieldProps) => (
                                                    <Input
                                                        {...field}
                                                        padding="8px"
                                                        color="#111"
                                                        fontSize={["14px", "16px"]}
                                                        backgroundColor="white"
                                                        autoComplete="url"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('twitter', '');
                                                            setFieldTouched('twitter', false);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.twitter && errors.twitter && (
                                                <ErrorMessage message={errors.twitter} />
                                            )}
                                        </Box>

                                        <Box
                                            display="flex"
                                            alignItems={["flex-start", "center"]}
                                            fontSize={["14px", "16px"]}
                                        >
                                            GitHub URL
                                        </Box>
                                        <Box position="relative">
                                            <Field name="github">
                                                {({ field }: FieldProps) => (
                                                    <Input
                                                        {...field}
                                                        padding="8px"
                                                        color="#111"
                                                        fontSize={["14px", "16px"]}
                                                        backgroundColor="white"
                                                        autoComplete="url"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('github', '');
                                                            setFieldTouched('github', false);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.github && errors.github && (
                                                <ErrorMessage message={errors.github} />
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* AVAILABILITY */}
                                    <Text
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        fontSize={["15px", "17px"]}
                                        color="#515357"
                                        mb={[2, 2]}
                                        mt={[6, 8]}
                                    >
                                        Availability
                                    </Text>
                                    <Grid
                                        templateColumns={["1fr", "210px 1fr"]}
                                        gap={[3, 6]}
                                    >
                                        <Box
                                            display="block"
                                            fontSize={["14px", "16px"]}
                                            alignItems={["flex-start", "center"]}
                                        >
                                            Currently in LA or willing to relocate immediately?<RequiredStar />
                                        </Box>
                                        <Box position="relative">
                                            <Field name="willingToRelocate">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        options={selectOptions}
                                                        value={selectOptions.find(option => option.value === field.value)}
                                                        onChange={(option) => {
                                                            form.setFieldValue(field.name, option?.value ?? SelectBoolean.Select);
                                                            setFieldError('willingToRelocate', '');
                                                            setFieldTouched('willingToRelocate', false);
                                                        }}
                                                        placeholder="Select"
                                                        className="basic-select"
                                                        classNamePrefix="select"
                                                    />
                                                )}
                                            </Field>
                                            {touched.willingToRelocate && errors.willingToRelocate && (
                                                <ErrorMessage message={errors.willingToRelocate} />
                                            )}
                                        </Box>

                                        <Box
                                            display="block"
                                            fontSize={["14px", "16px"]}
                                            alignItems={["flex-start", "center"]}
                                        >
                                            Willing to work intense hours?<RequiredStar />
                                        </Box>
                                        <Box position="relative">
                                            <Field name="willingToWorkIntense">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        options={selectOptions}
                                                        value={selectOptions.find(option => option.value === field.value)}
                                                        onChange={(option) => {
                                                            form.setFieldValue(field.name, option?.value ?? SelectBoolean.Select);
                                                            setFieldError('willingToWorkIntense', '');
                                                            setFieldTouched('willingToWorkIntense', false);
                                                        }}
                                                        placeholder="Select"
                                                        className="basic-select"
                                                        classNamePrefix="select"
                                                    />
                                                )}
                                            </Field>
                                            {touched.willingToWorkIntense && errors.willingToWorkIntense && (
                                                <ErrorMessage message={errors.willingToWorkIntense} />
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* ABOUT YOU */}
                                    <Text
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        fontSize={["15px", "17px"]}
                                        color="#515357"
                                        mb={[2, 2]}
                                        mt={[6, 8]}
                                    >
                                        About You
                                    </Text>
                                    <VStack align="stretch" gap={[3, 4]}>
                                        <Box position="relative">
                                            <Text mb={2} fontSize={["14px", "16px"]}>What motivates you?<RequiredStar /></Text>
                                            <Field name="motivation">
                                                {({ field }: FieldProps) => (
                                                    <Textarea
                                                        {...field}
                                                        padding="10px"
                                                        paddingTop="8px"
                                                        color="#111"
                                                        fontSize={["14px", "16px"]}
                                                        backgroundColor="white"
                                                        minH="120px"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('motivation', '');
                                                            setFieldTouched('motivation', false);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.motivation && errors.motivation && (
                                                <ErrorMessage message={errors.motivation} isBottom={true} />
                                            )}
                                        </Box>

                                        <Box position="relative">
                                            <Text mb={2} fontSize={["14px", "16px"]}>What is the most impressive thing you have ever accomplished?<RequiredStar /></Text>
                                            <Field name="impressiveThing">
                                                {({ field }: FieldProps) => (
                                                    <Textarea
                                                        {...field}
                                                        padding="10px"
                                                        paddingTop="8px"
                                                        color="#111"
                                                        fontSize={["14px", "16px"]}
                                                        backgroundColor="white"
                                                        minH="120px"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('impressiveThing', '');
                                                            setFieldTouched('impressiveThing', false);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.impressiveThing && errors.impressiveThing && (
                                                <ErrorMessage message={errors.impressiveThing} isBottom={true} />
                                            )}
                                        </Box>
                                    </VStack>
                                </>
                            )}

                            {/* ADDITIONAL INFORMATION */}
                            <Text
                                fontWeight="bold"
                                textTransform="uppercase"
                                fontSize={["15px", "17px"]}
                                color="#515357"
                                mb={[2, 2]}
                                mt={[4, 6]}
                            >
                                Additional Information
                            </Text>
                            <Box position="relative">
                                <Field name="additionalInformation">
                                    {({ field }: FieldProps) => (
                                        <Textarea
                                            {...field}
                                            padding="10px"
                                            paddingTop="8px"
                                            color="#111"
                                            fontSize={["14px", "16px"]}
                                            backgroundColor="white"
                                            minH="120px"
                                            placeholder="Tell us anything else you think we should know. We read every word."
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setFieldError('additionalInformation', '');
                                                setFieldTouched('additionalInformation', false);
                                            }}
                                        />
                                    )}
                                </Field>
                            </Box>

                            <Button
                                mt={[3, 4]}
                                type="submit"
                                colorScheme="blue"
                                size={["md", "lg"]}
                                width={["100%", "auto"]}
                                disabled={isSubmitting}
                                _loading={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                {isSubmitting ? <Spinner size="sm" /> : 'Submit Application'}
                            </Button>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default ApplyForm;