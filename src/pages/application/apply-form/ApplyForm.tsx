import { useCallback, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { ApplicationFields, SelectBoolean } from '../../../types/application';
import { useDropzone } from 'react-dropzone';
import * as Yup from 'yup';
import Select from 'react-select';
import { BsPaperclip } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button, Spinner } from '@chakra-ui/react';

const supabase = createClient(
    'https://yexjyyemagfobogoeuba.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlleGp5eWVtYWdmb2JvZ29ldWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NjQyMDgsImV4cCI6MjA2MzU0MDIwOH0.FMDDo3Bv8GA3M7q6eHS17r7Idkk1FmEQLvtmU2tBul4'
);

const RequiredStar = () => (
    <span className="text-green-500 pl-0.5">*</span>
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
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 1,
        multiple: false
    });

    const file = field.value as File;

    return (
        <div
            {...getRootProps()}
            className={`p-2 text-[#515357BB] border border-[#e2e2e2] rounded-sm cursor-pointer max-w-[280px] text-base md:text-xl hover:border-[#515357aa] hover:border-dashed ${
                file ? 'bg-white border-green-600' : 'bg-[#ebecf0]'
            }`}
        >
            <input {...getInputProps()} />
            <div className="flex items-center gap-2">
                {file ? <FaCheck color='#008000' size={13} className="mx-0.5" /> : <BsPaperclip />}
                {file ? (
                    <span className="text-green-600 text-sm">
                        {file.name.length > 28 ? `${file.name.slice(0, 28)}...` : file.name}
                    </span>
                ) : (
                    <span className="text-sm text-[#515357BB]">
                        ATTACH RESUME
                        <span className="px-0.5">/</span>
                        CV
                    </span>
                )}
            </div>
        </div>
    );
};

const ErrorMessage = ({ message, isBottom }: { message: string, isBottom?: boolean }) => (
    <span
        className={`absolute text-red-500 text-[9px] md:text-[10px] font-medium ${
            isBottom ? 'top-[calc(100%-4px)]' : '-top-4'
        } left-0.5`}
    >
        {message}
    </span>
);

const ApplyForm = ({ applicationId, isContract }: { applicationId: string, isContract: boolean }) => {
    const router = useRouter();
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
        setIsSubmitting(true);
        try {
            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

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

            router.push('/submitted');
            toast.success('Application submitted successfully!');
        } catch (error) {
            if (error instanceof Error && error.message.includes('resource already exists')) {
                toast.error('You have already submitted an application for this job.');
            } else {
                toast.error('Something went wrong. ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        }
        setIsSubmitting(false);
    };

    return (
        <div className="px-4 md:px-8 py-3 md:py-6 mx-auto max-w-2xl text-stone-300">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema({ isContract })}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleSubmit}
                
            >
                {({ errors, touched, setFieldError }) => (
                    <Form autoComplete="on">
                        <div className="flex flex-col gap-4 md:gap-6">
                            {/* SUBMIT YOUR APPLICATION */}
                            <span
                                className="font-bold uppercase text-[24px] text-white mb-3 md:mb-4"
                            >
                                Submit Your Application
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-3 md:gap-6">
                                {/* Resume */}
                                <div className="flex items-start md:items-center text-sm md:text-base">
                                    Resume/CV<RequiredStar />
                                </div>
                                <div className="relative">
                                    <Field name="resume">
                                        {(props: FieldProps) => (
                                            <FileUploadField {...props} />
                                        )}
                                    </Field>
                                    {touched.resume && errors.resume && (
                                        <ErrorMessage message={errors.resume as string} />
                                    )}
                                </div>

                                {/* First Name */}
                                <div className="flex items-start md:items-center text-sm md:text-base">
                                    First Name<RequiredStar />
                                </div>
                                <div className="relative">
                                    <Field name="firstName">
                                        {({ field }: FieldProps) => (
                                            <input
                                                {...field}
                                                className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                type="text"
                                                autoComplete="given-name"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('firstName', '');
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.firstName && errors.firstName && (
                                        <ErrorMessage message={errors.firstName as string} />
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="flex items-start md:items-center text-sm md:text-base">
                                    Last Name<RequiredStar />
                                </div>
                                <div className="relative">
                                    <Field name="lastName">
                                        {({ field }: FieldProps) => (
                                            <input
                                                {...field}
                                                className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                type="text"
                                                autoComplete="family-name"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('lastName', '');
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.lastName && errors.lastName && (
                                        <ErrorMessage message={errors.lastName as string} />
                                    )}
                                </div>

                                {/* Email */}
                                <div className="flex items-start md:items-center text-sm md:text-base">
                                    Email<RequiredStar />
                                </div>
                                <div className="relative">
                                    <Field name="email">
                                        {({ field }: FieldProps) => (
                                            <input
                                                {...field}
                                                className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                type="email"
                                                autoComplete="email"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('email', '');
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.email && errors.email && (
                                        <ErrorMessage message={errors.email as string} />
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="flex items-start md:items-center text-sm md:text-base">
                                    Phone<RequiredStar />
                                </div>
                                <div className="relative">
                                    <Field name="phone">
                                        {({ field }: FieldProps) => (
                                            <input
                                                {...field}
                                                className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                type='tel'
                                                autoComplete='tel'
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setFieldError('phone', '');
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {touched.phone && errors.phone && (
                                        <ErrorMessage message={errors.phone as string} />
                                    )}
                                </div>
                            </div>

                            {/* Only show these sections if not a contract position */}
                            {!isContract && (
                                <>
                                    {/* LINKS */}
                                    <span
                                        className="font-bold uppercase text-[20px]  text-white mb-2 md:mb-2 mt-6 md:mt-8"
                                    >
                                        Links
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-3 md:gap-6">
                                        <div className="flex items-start md:items-center text-sm md:text-base">
                                            LinkedIn URL
                                        </div>
                                        <div className="relative">
                                            <Field name="linkedin">
                                                {({ field }: FieldProps) => (
                                                    <input
                                                        {...field}
                                                        className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                        autoComplete='web'
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('linkedin', '');
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.linkedin && errors.linkedin && (
                                                <ErrorMessage message={errors.linkedin as string} />
                                            )}
                                        </div>

                                        <div className="flex items-start md:items-center text-sm md:text-base">
                                            Twitter URL
                                        </div>
                                        <div className="relative">
                                            <Field name="twitter">
                                                {({ field }: FieldProps) => (
                                                    <input
                                                        {...field}
                                                        className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                        autoComplete="url"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('twitter', '');
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.twitter && errors.twitter && (
                                                <ErrorMessage message={errors.twitter as string} />
                                            )}
                                        </div>

                                        <div className="flex items-start md:items-center text-sm md:text-base">
                                            GitHub URL
                                        </div>
                                        <div className="relative">
                                            <Field name="github">
                                                {({ field }: FieldProps) => (
                                                    <input
                                                        {...field}
                                                        className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                        autoComplete="url"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('github', '');
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.github && errors.github && (
                                                <ErrorMessage message={errors.github as string} />
                                            )}
                                        </div>
                                    </div>

                                    {/* AVAILABILITY */}
                                    <span
                                        className="font-bold uppercase text-[20px] text-white mb-2 md:mb-2 mt-6 md:mt-8"
                                    >
                                        Availability
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-3 md:gap-6">
                                        <div className="flex items-start md:items-center text-sm md:text-base">
                                            Currently in LA or willing to relocate immediately?<RequiredStar />
                                        </div>
                                        <div className="relative">
                                            <Field name="willingToRelocate">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        options={selectOptions}
                                                        value={selectOptions.find(option => option.value === field.value)}
                                                        onChange={(option) => {
                                                            form.setFieldValue(field.name, option?.value ?? SelectBoolean.Select);
                                                            setFieldError('willingToRelocate', '');
                                                        }}
                                                        placeholder="Select"
                                                        className="basic-select"
                                                        classNamePrefix="select"
                                                    />
                                                )}
                                            </Field>
                                            {touched.willingToRelocate && errors.willingToRelocate && (
                                                <ErrorMessage message={errors.willingToRelocate as string} />
                                            )}
                                        </div>

                                        <div className="flex items-start md:items-center text-sm md:text-base">
                                            Willing to work intense hours?<RequiredStar />
                                        </div>
                                        <div className="relative">
                                            <Field name="willingToWorkIntense">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        options={selectOptions}
                                                        value={selectOptions.find(option => option.value === field.value)}
                                                        onChange={(option) => {
                                                            form.setFieldValue(field.name, option?.value ?? SelectBoolean.Select);
                                                            setFieldError('willingToWorkIntense', '');
                                                        }}
                                                        placeholder="Select"
                                                        className="basic-select"
                                                        classNamePrefix="select"
                                                    />
                                                )}
                                            </Field>
                                            {touched.willingToWorkIntense && errors.willingToWorkIntense && (
                                                <ErrorMessage message={errors.willingToWorkIntense as string} />
                                            )}
                                        </div>
                                    </div>

                                    {/* ABOUT YOU */}
                                    <span
                                        className="font-bold uppercase text-[20px] text-white mb-2 md:mb-2 mt-6 md:mt-8"
                                    >
                                        About You
                                    </span>
                                    <div className="flex flex-col gap-3 md:gap-4">
                                        <div className="relative">
                                            <span className="text-sm md:text-base mb-2">What motivates you?<RequiredStar /></span>
                                            <Field name="motivation">
                                                {({ field }: FieldProps) => (
                                                    <textarea
                                                        {...field}
                                                        className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                        style={{ minHeight: '120px' }}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('motivation', '');
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.motivation && errors.motivation && (
                                                <ErrorMessage message={errors.motivation as string} isBottom={true} />
                                            )}
                                        </div>

                                        <div className="relative">
                                            <span className="text-sm md:text-base mb-2">What is the most impressive thing you have ever accomplished?<RequiredStar /></span>
                                            <Field name="impressiveThing">
                                                {({ field }: FieldProps) => (
                                                    <textarea
                                                        {...field}
                                                        className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                                        style={{ minHeight: '120px' }}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFieldError('impressiveThing', '');
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            {touched.impressiveThing && errors.impressiveThing && (
                                                <ErrorMessage message={errors.impressiveThing as string} isBottom={true} />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ADDITIONAL INFORMATION */}
                            <span
                                className="font-bold uppercase text-[20px] text-white mb-2 md:mb-2 mt-4 md:mt-6"
                            >
                                Additional Information
                            </span>
                            <div className="relative">
                                <Field name="additionalInformation">
                                    {({ field }: FieldProps) => (
                                        <textarea
                                            {...field}
                                            className="w-full p-2 text-[#111] text-sm md:text-base bg-white"
                                            style={{ minHeight: '120px' }}
                                            placeholder="Tell us anything else you think we should know. We read every word."
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setFieldError('additionalInformation', '');
                                            }}
                                        />
                                    )}
                                </Field>
                            </div>

                            <Button
                                className="mt-3 md:mt-4"
                                type="submit"
                                colorScheme="green"
                                size={["md", "lg"]}
                                width={["100%", "auto"]}
                                disabled={isSubmitting}
                                _loading={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                {isSubmitting ? <Spinner size="sm" /> : 'Submit Application'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ApplyForm;